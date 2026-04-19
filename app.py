"""NexusFile AI - Flask Application"""
import os
import uuid
import shutil
from datetime import datetime, timezone
from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
from config import (
    UPLOAD_FOLDER, GENERATED_FOLDER, ORGANIZED_FOLDER, STATIC_FOLDER,
    MAX_CONTENT_LENGTH, ALLOWED_EXTENSIONS, CATEGORIES, TEMPLATES, DATABASE_URI,
)
from models import init_db, get_session, FileRecord, GeneratedDocument, ActivityLog
from ai_engine import (
    analyze_file, smart_search,
    generate_ppt_content, generate_pdf_content,
    generate_excel_content, generate_docx_content,
    generate_template_content,
)
from generators.ppt_generator import generate_ppt
from generators.pdf_generator import generate_pdf
from generators.excel_generator import generate_excel
from generators.docx_generator import generate_docx


# --- App Setup ---
app = Flask(__name__, static_folder=STATIC_FOLDER, static_url_path="")
CORS(app)
app.config["MAX_CONTENT_LENGTH"] = MAX_CONTENT_LENGTH

# Initialize database
init_db()


def _allowed(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def _log_activity(action, details, icon="📁"):
    session = get_session()
    try:
        log = ActivityLog(action=action, details=details, icon=icon)
        session.add(log)
        session.commit()
    finally:
        session.close()


# ===================== STATIC FILES =====================

@app.route("/")
def index():
    return send_from_directory(STATIC_FOLDER, "index.html")


# ===================== FILE UPLOAD =====================

@app.route("/api/upload", methods=["POST"])
def upload_files():
    if "files" not in request.files:
        return jsonify({"error": "No files provided"}), 400

    files = request.files.getlist("files")
    uploaded = []

    session = get_session()
    try:
        for file in files:
            if file.filename == "":
                continue
            if not _allowed(file.filename):
                continue

            original_name = secure_filename(file.filename)
            ext = original_name.rsplit(".", 1)[1].lower() if "." in original_name else ""
            stored_name = f"{uuid.uuid4().hex}.{ext}"
            file_path = os.path.join(UPLOAD_FOLDER, stored_name)
            file.save(file_path)

            file_size = os.path.getsize(file_path)

            # AI Analysis
            analysis = analyze_file(file_path)

            record = FileRecord(
                filename=stored_name,
                original_name=original_name,
                category=analysis.get("category", "Other"),
                file_type=ext,
                file_size=file_size,
                file_path=file_path,
                summary=analysis.get("summary", ""),
            )
            record.set_tags(analysis.get("tags", [ext]))
            session.add(record)
            session.commit()

            uploaded.append(record.to_dict())
            _log_activity("upload", f"Uploaded {original_name}", "📤")

    finally:
        session.close()

    return jsonify({"files": uploaded, "count": len(uploaded)})


# ===================== FILE MANAGEMENT =====================

@app.route("/api/files", methods=["GET"])
def list_files():
    session = get_session()
    try:
        category = request.args.get("category")
        query = session.query(FileRecord).order_by(FileRecord.upload_date.desc())
        if category and category != "All":
            query = query.filter(FileRecord.category == category)
        files = [f.to_dict() for f in query.all()]
        return jsonify({"files": files})
    finally:
        session.close()


@app.route("/api/files/<int:file_id>", methods=["GET"])
def get_file(file_id):
    session = get_session()
    try:
        f = session.query(FileRecord).get(file_id)
        if not f:
            return jsonify({"error": "File not found"}), 404
        return jsonify(f.to_dict())
    finally:
        session.close()


@app.route("/api/files/<int:file_id>", methods=["DELETE"])
def delete_file(file_id):
    session = get_session()
    try:
        f = session.query(FileRecord).get(file_id)
        if not f:
            return jsonify({"error": "File not found"}), 404

        # Delete physical file
        if os.path.exists(f.file_path):
            os.remove(f.file_path)

        name = f.original_name
        session.delete(f)
        session.commit()
        _log_activity("delete", f"Deleted {name}", "🗑️")
        return jsonify({"success": True})
    finally:
        session.close()


@app.route("/api/analyze/<int:file_id>", methods=["POST"])
def reanalyze_file(file_id):
    session = get_session()
    try:
        f = session.query(FileRecord).get(file_id)
        if not f:
            return jsonify({"error": "File not found"}), 404

        analysis = analyze_file(f.file_path)
        f.category = analysis.get("category", f.category)
        f.summary = analysis.get("summary", f.summary)
        f.set_tags(analysis.get("tags", f.get_tags()))
        session.commit()

        _log_activity("analyze", f"Re-analyzed {f.original_name}", "🔍")
        return jsonify(f.to_dict())
    finally:
        session.close()


# ===================== SEARCH =====================

@app.route("/api/search", methods=["POST"])
def search_files():
    data = request.get_json() or {}
    query = data.get("query", "").strip()
    if not query:
        return jsonify({"files": []})

    session = get_session()
    try:
        all_files = [f.to_dict() for f in session.query(FileRecord).all()]
        results = smart_search(query, all_files)
        return jsonify({"files": results, "count": len(results)})
    finally:
        session.close()


# ===================== AUTO-ORGANIZE =====================

@app.route("/api/organize", methods=["POST"])
def organize_files():
    session = get_session()
    try:
        files = session.query(FileRecord).all()
        organized_count = 0

        for f in files:
            cat_folder = os.path.join(ORGANIZED_FOLDER, f.category or "Other")
            os.makedirs(cat_folder, exist_ok=True)
            dest = os.path.join(cat_folder, f.original_name)

            # Avoid overwriting
            if os.path.exists(dest):
                base, ext = os.path.splitext(f.original_name)
                dest = os.path.join(cat_folder, f"{base}_{f.id}{ext}")

            if os.path.exists(f.file_path):
                shutil.copy2(f.file_path, dest)
                organized_count += 1

        _log_activity("organize", f"Organized {organized_count} files into folders", "📂")
        return jsonify({"success": True, "organized": organized_count})
    finally:
        session.close()


# ===================== DOCUMENT GENERATION =====================

@app.route("/api/generate/ppt", methods=["POST"])
def gen_ppt():
    data = request.get_json() or {}
    prompt = data.get("prompt", "").strip()
    title = data.get("title", "Presentation")
    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

    content = generate_ppt_content(prompt)
    filename = title or content.get("title", "Presentation")
    file_path = generate_ppt(content, filename)
    stored_filename = os.path.basename(file_path)

    session = get_session()
    try:
        doc = GeneratedDocument(
            title=filename, doc_type="pptx", prompt=prompt,
            file_path=file_path, filename=stored_filename
        )
        session.add(doc)
        session.commit()
        _log_activity("generate", f"Generated PPT: {filename}", "📊")
        return jsonify(doc.to_dict())
    finally:
        session.close()


@app.route("/api/generate/pdf", methods=["POST"])
def gen_pdf():
    data = request.get_json() or {}
    prompt = data.get("prompt", "").strip()
    title = data.get("title", "Report")
    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

    content = generate_pdf_content(prompt)
    filename = title or content.get("title", "Report")
    file_path = generate_pdf(content, filename)
    stored_filename = os.path.basename(file_path)

    session = get_session()
    try:
        doc = GeneratedDocument(
            title=filename, doc_type="pdf", prompt=prompt,
            file_path=file_path, filename=stored_filename
        )
        session.add(doc)
        session.commit()
        _log_activity("generate", f"Generated PDF: {filename}", "📄")
        return jsonify(doc.to_dict())
    finally:
        session.close()


@app.route("/api/generate/excel", methods=["POST"])
def gen_excel():
    data = request.get_json() or {}
    prompt = data.get("prompt", "").strip()
    title = data.get("title", "Spreadsheet")
    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

    content = generate_excel_content(prompt)
    filename = title or content.get("title", "Spreadsheet")
    file_path = generate_excel(content, filename)
    stored_filename = os.path.basename(file_path)

    session = get_session()
    try:
        doc = GeneratedDocument(
            title=filename, doc_type="xlsx", prompt=prompt,
            file_path=file_path, filename=stored_filename
        )
        session.add(doc)
        session.commit()
        _log_activity("generate", f"Generated Excel: {filename}", "📈")
        return jsonify(doc.to_dict())
    finally:
        session.close()


@app.route("/api/generate/docx", methods=["POST"])
def gen_docx():
    data = request.get_json() or {}
    prompt = data.get("prompt", "").strip()
    title = data.get("title", "Document")
    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

    content = generate_docx_content(prompt)
    filename = title or content.get("title", "Document")
    file_path = generate_docx(content, filename)
    stored_filename = os.path.basename(file_path)

    session = get_session()
    try:
        doc = GeneratedDocument(
            title=filename, doc_type="docx", prompt=prompt,
            file_path=file_path, filename=stored_filename
        )
        session.add(doc)
        session.commit()
        _log_activity("generate", f"Generated Word: {filename}", "📝")
        return jsonify(doc.to_dict())
    finally:
        session.close()


# ===================== TEMPLATES =====================

@app.route("/api/templates", methods=["GET"])
def list_templates():
    return jsonify({"templates": TEMPLATES})


@app.route("/api/templates/generate", methods=["POST"])
def gen_from_template():
    data = request.get_json() or {}
    template_type = data.get("template_type", "")
    user_data = data.get("data", {})
    output_format = data.get("format", "docx")  # docx, xlsx, pdf, pptx

    if template_type not in TEMPLATES:
        return jsonify({"error": "Unknown template"}), 400

    content = generate_template_content(template_type, user_data)
    title = user_data.get("title") or user_data.get("full_name") or user_data.get("project_name") or TEMPLATES[template_type]["name"]

    generators = {
        "pptx": generate_ppt,
        "pdf": generate_pdf,
        "xlsx": generate_excel,
        "docx": generate_docx,
    }

    gen_func = generators.get(output_format, generate_docx)
    file_path = gen_func(content, title)
    stored_filename = os.path.basename(file_path)
    ext = output_format

    session = get_session()
    try:
        doc = GeneratedDocument(
            title=title, doc_type=ext,
            prompt=f"Template: {template_type}",
            file_path=file_path, filename=stored_filename
        )
        session.add(doc)
        session.commit()
        _log_activity("generate", f"Generated {template_type}: {title}", "📋")
        return jsonify(doc.to_dict())
    finally:
        session.close()


# ===================== STATS & ACTIVITY =====================

@app.route("/api/stats", methods=["GET"])
def get_stats():
    session = get_session()
    try:
        files = session.query(FileRecord).all()
        gen_docs = session.query(GeneratedDocument).all()

        total_size = sum(f.file_size for f in files)
        category_counts = {}
        type_counts = {}
        for f in files:
            category_counts[f.category] = category_counts.get(f.category, 0) + 1
            type_counts[f.file_type] = type_counts.get(f.file_type, 0) + 1

        return jsonify({
            "total_files": len(files),
            "total_size": total_size,
            "total_generated": len(gen_docs),
            "categories": category_counts,
            "file_types": type_counts,
        })
    finally:
        session.close()


@app.route("/api/activity", methods=["GET"])
def get_activity():
    session = get_session()
    try:
        logs = session.query(ActivityLog).order_by(ActivityLog.timestamp.desc()).limit(50).all()
        return jsonify({"activity": [l.to_dict() for l in logs]})
    finally:
        session.close()


# ===================== DOWNLOADS =====================

@app.route("/api/download/file/<int:file_id>", methods=["GET"])
def download_file(file_id):
    session = get_session()
    try:
        f = session.query(FileRecord).get(file_id)
        if not f:
            return jsonify({"error": "File not found"}), 404
        return send_file(f.file_path, as_attachment=True, download_name=f.original_name)
    finally:
        session.close()


@app.route("/api/download/generated/<int:doc_id>", methods=["GET"])
def download_generated(doc_id):
    session = get_session()
    try:
        doc = session.query(GeneratedDocument).get(doc_id)
        if not doc:
            return jsonify({"error": "Document not found"}), 404
        return send_file(doc.file_path, as_attachment=True, download_name=doc.filename)
    finally:
        session.close()


@app.route("/api/generated", methods=["GET"])
def list_generated():
    session = get_session()
    try:
        docs = session.query(GeneratedDocument).order_by(GeneratedDocument.created_date.desc()).all()
        return jsonify({"documents": [d.to_dict() for d in docs]})
    finally:
        session.close()


@app.route("/api/generated/<int:doc_id>", methods=["DELETE"])
def delete_generated(doc_id):
    session = get_session()
    try:
        doc = session.query(GeneratedDocument).get(doc_id)
        if not doc:
            return jsonify({"error": "Document not found"}), 404

        if os.path.exists(doc.file_path):
            os.remove(doc.file_path)

        title = doc.title
        session.delete(doc)
        session.commit()
        _log_activity("delete", f"Deleted generated doc: {title}", "🗑️")
        return jsonify({"success": True})
    finally:
        session.close()


# ===================== CATEGORIES =====================

@app.route("/api/categories", methods=["GET"])
def list_categories():
    return jsonify({"categories": list(CATEGORIES.keys())})


# ===================== RUN =====================

if __name__ == "__main__":
    print("\n  ✨ NexusFile AI is running at http://localhost:5000\n")
    app.run(debug=True, host="0.0.0.0", port=5000)
