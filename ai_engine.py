"""NexusFile AI - Gemini AI Engine"""
import json
import os
import re
import fitz  # PyMuPDF
import chardet
from google import genai
from config import GEMINI_API_KEY, GEMINI_MODEL, CATEGORIES


def _get_client():
    """Lazy-init Gemini client."""
    return genai.Client(api_key=GEMINI_API_KEY)


def _extract_text(file_path: str, max_chars: int = 8000) -> str:
    """Extract text content from a file for AI analysis."""
    ext = os.path.splitext(file_path)[1].lower()

    try:
        # PDF
        if ext == ".pdf":
            doc = fitz.open(file_path)
            text = ""
            for page in doc:
                text += page.get_text()
                if len(text) > max_chars:
                    break
            doc.close()
            return text[:max_chars]

        # Plain text / code files
        text_exts = {
            ".txt", ".md", ".rst", ".csv", ".json", ".xml", ".yaml", ".yml",
            ".py", ".js", ".ts", ".html", ".css", ".java", ".cpp", ".c", ".h",
            ".go", ".rs", ".rb", ".php", ".sql", ".sh", ".bat", ".ps1",
            ".log", ".ini", ".cfg", ".env", ".toml",
        }
        if ext in text_exts:
            with open(file_path, "rb") as f:
                raw = f.read(max_chars * 2)
            detected = chardet.detect(raw)
            encoding = detected.get("encoding", "utf-8") or "utf-8"
            try:
                return raw.decode(encoding)[:max_chars]
            except (UnicodeDecodeError, LookupError):
                return raw.decode("utf-8", errors="replace")[:max_chars]

        # Images — return metadata description
        if ext in {".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp"}:
            from PIL import Image
            img = Image.open(file_path)
            return f"[Image file: {img.format}, size {img.size[0]}x{img.size[1]}, mode {img.mode}]"

        return f"[Binary file with extension {ext}, size {os.path.getsize(file_path)} bytes]"
    except Exception as e:
        return f"[Could not extract text: {str(e)}]"


def _parse_json_response(text: str) -> dict:
    """Parse JSON from AI response, handling markdown code blocks."""
    # Remove code block markers
    text = text.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*\n?", "", text)
        text = re.sub(r"\n?```\s*$", "", text)
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # Try to find JSON within the text
        match = re.search(r'\{[\s\S]*\}', text)
        if match:
            try:
                return json.loads(match.group())
            except json.JSONDecodeError:
                pass
        # Try array
        match = re.search(r'\[[\s\S]*\]', text)
        if match:
            try:
                return json.loads(match.group())
            except json.JSONDecodeError:
                pass
    return {}


# ---------- File Analysis ----------

def analyze_file(file_path: str) -> dict:
    """Analyze a file and return category, tags, and summary."""
    filename = os.path.basename(file_path)
    ext = os.path.splitext(filename)[1].lower().lstrip(".")
    text_content = _extract_text(file_path)

    # Determine default category from extension
    default_category = "Other"
    for cat, exts in CATEGORIES.items():
        if ext in exts:
            default_category = cat
            break

    # If no API key, return basic analysis
    if not GEMINI_API_KEY:
        return {
            "category": default_category,
            "tags": [ext, default_category.lower()],
            "summary": f"File: {filename} ({ext.upper()} file, {os.path.getsize(file_path)} bytes)",
        }

    prompt = f"""Analyze this file and return a JSON object with exactly these keys:
- "category": one of {list(CATEGORIES.keys())} that best fits
- "tags": a list of 3-6 descriptive tags (lowercase, single words or short phrases)
- "summary": a 1-3 sentence summary of the file's content and purpose

File name: {filename}
File type: {ext}
File size: {os.path.getsize(file_path)} bytes

Content preview:
{text_content[:4000]}

Return ONLY valid JSON, no markdown, no explanation."""

    try:
        client = _get_client()
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
        )
        result = _parse_json_response(response.text)
        if result and "category" in result:
            return {
                "category": result.get("category", default_category),
                "tags": result.get("tags", [ext]),
                "summary": result.get("summary", ""),
            }
    except Exception as e:
        print(f"AI analysis error: {e}")

    return {
        "category": default_category,
        "tags": [ext, default_category.lower()],
        "summary": f"File: {filename}",
    }


# ---------- Smart Search ----------

def smart_search(query: str, file_records: list) -> list:
    """Use AI to perform natural language search across file metadata."""
    if not GEMINI_API_KEY or not file_records:
        # Fallback: simple keyword matching
        q = query.lower()
        return [f for f in file_records if
                q in f.get("original_name", "").lower() or
                q in f.get("summary", "").lower() or
                q in f.get("category", "").lower() or
                any(q in tag.lower() for tag in f.get("tags", []))]

    files_context = json.dumps([{
        "id": f["id"],
        "name": f["original_name"],
        "category": f["category"],
        "tags": f["tags"],
        "summary": f["summary"],
        "type": f["file_type"],
    } for f in file_records[:100]], indent=2)  # Cap at 100 files for context

    prompt = f"""Given these files:
{files_context}

User's search query: "{query}"

Return a JSON array of file IDs that match the user's intent, ordered by relevance (most relevant first).
Consider the file name, category, tags, summary, and type. Be generous in matching — include anything reasonably relevant.

Return ONLY a JSON array of integers, e.g. [3, 1, 7]. If nothing matches, return []."""

    try:
        client = _get_client()
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
        )
        result = _parse_json_response(response.text)
        if isinstance(result, list):
            matched_ids = set(result)
            return [f for f in file_records if f["id"] in matched_ids]
    except Exception as e:
        print(f"Smart search error: {e}")

    # Fallback
    q = query.lower()
    return [f for f in file_records if
            q in f.get("original_name", "").lower() or
            q in f.get("summary", "").lower()]


# ---------- Document Generation ----------

def generate_ppt_content(prompt: str) -> dict:
    """Generate structured slide data for a presentation."""
    ai_prompt = f"""Create a professional PowerPoint presentation based on this request:
"{prompt}"

Return a JSON object with:
- "title": presentation title
- "subtitle": a subtitle
- "slides": an array of slide objects, each with:
  - "title": slide title
  - "content": array of bullet point strings (3-5 per slide)
  - "notes": optional speaker notes string

Generate 6-10 slides. Include a title slide (first) and a thank you/summary slide (last).
Return ONLY valid JSON."""

    try:
        client = _get_client()
        response = client.models.generate_content(model=GEMINI_MODEL, contents=ai_prompt)
        result = _parse_json_response(response.text)
        if result and "slides" in result:
            return result
    except Exception as e:
        print(f"PPT generation error: {e}")

    return {
        "title": "Presentation",
        "subtitle": prompt[:100],
        "slides": [
            {"title": "Introduction", "content": ["Topic overview", "Key points to cover"], "notes": ""},
            {"title": "Main Content", "content": ["Point 1", "Point 2", "Point 3"], "notes": ""},
            {"title": "Summary", "content": ["Key takeaways", "Next steps"], "notes": ""},
        ],
    }


def generate_pdf_content(prompt: str) -> dict:
    """Generate structured report data for a PDF."""
    ai_prompt = f"""Create a professional report based on this request:
"{prompt}"

Return a JSON object with:
- "title": report title
- "author": "NexusFile AI"
- "date": today's date as a string
- "sections": an array of section objects, each with:
  - "heading": section heading
  - "paragraphs": array of paragraph strings (1-3 paragraphs per section)
  - "table": optional object with "headers" (array of strings) and "rows" (array of arrays) — include tables where data presentation makes sense

Generate 4-7 sections with meaningful content.
Return ONLY valid JSON."""

    try:
        client = _get_client()
        response = client.models.generate_content(model=GEMINI_MODEL, contents=ai_prompt)
        result = _parse_json_response(response.text)
        if result and "sections" in result:
            return result
    except Exception as e:
        print(f"PDF generation error: {e}")

    return {
        "title": "Report",
        "author": "NexusFile AI",
        "date": "2026",
        "sections": [
            {"heading": "Introduction", "paragraphs": [prompt], "table": None},
            {"heading": "Conclusion", "paragraphs": ["Further analysis recommended."], "table": None},
        ],
    }


def generate_excel_content(prompt: str) -> dict:
    """Generate structured spreadsheet data."""
    ai_prompt = f"""Create a professional Excel spreadsheet based on this request:
"{prompt}"

Return a JSON object with:
- "title": spreadsheet title
- "sheets": an array of sheet objects, each with:
  - "name": sheet tab name (max 31 chars)
  - "headers": array of column header strings
  - "rows": array of arrays (each inner array is a row of cell values — use numbers for numeric data, strings for text)
  - "formulas": optional array of objects with "cell" (e.g. "E12"), "formula" (e.g. "=SUM(E2:E11)"), "label" (e.g. "Total")

Generate realistic sample data with 8-15 rows per sheet. Include 1-2 sheets.
Return ONLY valid JSON."""

    try:
        client = _get_client()
        response = client.models.generate_content(model=GEMINI_MODEL, contents=ai_prompt)
        result = _parse_json_response(response.text)
        if result and "sheets" in result:
            return result
    except Exception as e:
        print(f"Excel generation error: {e}")

    return {
        "title": "Spreadsheet",
        "sheets": [{
            "name": "Sheet1",
            "headers": ["Item", "Value"],
            "rows": [["Sample", 100]],
            "formulas": [],
        }],
    }


def generate_docx_content(prompt: str) -> dict:
    """Generate structured document data for a Word file."""
    ai_prompt = f"""Create a professional Word document based on this request:
"{prompt}"

Return a JSON object with:
- "title": document title
- "subtitle": optional subtitle
- "sections": an array of section objects, each with:
  - "heading": section heading
  - "level": heading level (1, 2, or 3)
  - "content": array of content objects, each with:
    - "type": "paragraph", "bullet_list", "numbered_list", or "table"
    - "text": string (for paragraph) or array of strings (for lists)
    - "headers": array of strings (for table, column headers)
    - "rows": array of arrays (for table, data rows)

Generate 5-8 sections with varied content types.
Return ONLY valid JSON."""

    try:
        client = _get_client()
        response = client.models.generate_content(model=GEMINI_MODEL, contents=ai_prompt)
        result = _parse_json_response(response.text)
        if result and "sections" in result:
            return result
    except Exception as e:
        print(f"DOCX generation error: {e}")

    return {
        "title": "Document",
        "subtitle": "",
        "sections": [
            {
                "heading": "Introduction",
                "level": 1,
                "content": [{"type": "paragraph", "text": prompt}],
            },
        ],
    }


def generate_template_content(template_type: str, user_data: dict) -> dict:
    """Generate document content from a template type and user input data."""
    ai_prompt = f"""Generate professional content for a {template_type} document.

User provided data:
{json.dumps(user_data, indent=2)}

Based on the template type, return a structured JSON document:

For "resume" → return a DOCX structure with sections for Summary, Experience, Education, Skills
For "invoice" → return an XLSX structure with line items, quantities, prices, total
For "report" → return a PDF structure with executive summary, analysis, recommendations
For "proposal" → return a DOCX structure with objective, scope, timeline, budget, team
For "meeting_minutes" → return a DOCX structure with agenda items, discussion points, action items
For "budget" → return an XLSX structure with income, expenses by category, monthly breakdown

Use the user data to fill in real content. Expand and enhance the data professionally.
Return ONLY valid JSON matching the appropriate document format."""

    try:
        client = _get_client()
        response = client.models.generate_content(model=GEMINI_MODEL, contents=ai_prompt)
        result = _parse_json_response(response.text)
        if result:
            return result
    except Exception as e:
        print(f"Template generation error: {e}")

    return {"title": template_type.title(), "error": "Generation failed"}
