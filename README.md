# 🗂️ AI&FILE — AI-Powered File Organizer

> An intelligent file management system powered by Python and AI. Automatically organizes uploaded files, generates documents in multiple formats (DOCX, PDF, Excel, PPT), and provides a clean web interface for seamless file management.

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Backend-Flask-000000?style=flat&logo=flask&logoColor=white)
![SQLite](https://img.shields.io/badge/Database-SQLite-003B57?style=flat&logo=sqlite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

---

## ✨ Features

- 🤖 **AI-Powered Organization** — Automatically categorizes and organizes uploaded files using an AI engine
- 📄 **Multi-Format Document Generation** — Generates DOCX, Excel, PDF, and PowerPoint files on demand
- 📁 **File Upload & Management** — Upload files via the web interface; organized output stored separately
- 🗃️ **Database Tracking** — SQLite-backed metadata storage for all managed files
- 🌐 **Web Interface** — Lightweight static frontend (HTML/CSS/JS) served directly
- ⚙️ **Configurable** — Environment-based configuration via `.env`
- 🧪 **Testable** — Includes `test_ai.py` for validating AI engine behavior

---

## 🏗️ Project Structure

```
AI&FILE/
├── ai_engine.py            # Core AI logic for file categorization & organization
├── app.py                  # Main Flask application entry point
├── config.py               # App configuration (reads from .env)
├── models.py               # Database models
├── nexusfile.db            # SQLite database (auto-generated)
├── requirements.txt        # Python dependencies
├── test_ai.py              # Unit tests for the AI engine
├── model_list.txt          # List of AI models / labels used
├── implementation_plan.md  # Project planning & architecture notes
│
├── generators/             # File generation modules
│   ├── __init__.py
│   ├── docx_generator.py   # Word document (.docx) generator
│   ├── excel_generator.py  # Excel spreadsheet (.xlsx) generator
│   ├── pdf_generator.py    # PDF document generator
│   └── ppt_generator.py    # PowerPoint (.pptx) generator
│
├── uploads/                # Incoming uploaded files (staging area)
├── organized/              # AI-organized output files
├── generated/              # Files produced by the generators
│
├── static/                 # Frontend assets
│   ├── css/
│   ├── js/
│   └── index.html          # Main web UI
│
├── .env                    # Environment variables (not committed)
└── .env.example            # Template for environment setup
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10 or higher
- `pip` package manager

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Liya-17/AI-Powered-File-Organizer.git
cd AI-Powered-File-Organizer

# 2. Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # Linux/macOS
venv\Scripts\activate           # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment variables
cp .env.example .env
# Edit .env with your settings

# 5. Run the application
python app.py
```

The app will be available at `http://localhost:5000`.

---

## ⚙️ Configuration

All settings are managed via the `.env` file. Refer to `.env.example` for the full list. Common settings:

```env
FLASK_ENV=development
UPLOAD_FOLDER=uploads/
ORGANIZED_FOLDER=organized/
GENERATED_FOLDER=generated/
DATABASE_URL=sqlite:///nexusfile.db
AI_MODEL=<your-model-name>
```

---

## 🤖 AI Engine

`ai_engine.py` is the core of the project. It:

- Analyzes uploaded files by name, extension, and content
- Classifies files into categories (Documents, Images, Code, Spreadsheets, Presentations, etc.)
- Moves files into structured subdirectories under `organized/`
- Supports model configuration via `model_list.txt`

To test the AI engine independently:

```bash
python test_ai.py
```

---

## 📄 File Generators

The `generators/` package provides modules to programmatically create files:

| Module | Output | Use Case |
|---|---|---|
| `docx_generator.py` | `.docx` | Reports, letters, summaries |
| `excel_generator.py` | `.xlsx` | Data tables, analysis sheets |
| `pdf_generator.py` | `.pdf` | Formatted documents, exports |
| `ppt_generator.py` | `.pptx` | Presentations, slide decks |

Generated files are saved to the `generated/` folder.

---

## 🌐 Web Interface

A lightweight static frontend is served from `static/`. It provides:

- File upload with drag & drop support
- View of organized file categories
- Download access to generated files
- Basic file statistics dashboard

---

## 🗃️ Database

The app uses **SQLite** (`nexusfile.db`). The `models.py` file defines the schema for:

- Uploaded file metadata (name, size, type, upload timestamp)
- Organization history (original path → organized path)
- Generated file records

---

## 🧪 Testing

```bash
# Run AI engine tests
python test_ai.py

# Run all tests with pytest (if configured)
pytest
```

---

## 📦 Key Dependencies

| Package | Purpose |
|---|---|
| Flask | Web framework & API server |
| SQLAlchemy | ORM & database management |
| python-docx | DOCX generation |
| openpyxl | Excel generation |
| reportlab / fpdf | PDF generation |
| python-pptx | PowerPoint generation |
| python-dotenv | Environment variable loading |

Install all with:
```bash
pip install -r requirements.txt
```

---

## 🤝 Contributing

```bash
git checkout -b feature/your-feature
git commit -m "feat: describe your change"
git push origin feature/your-feature
# Open a Pull Request
```

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

<p align="center">Built with ❤️ by <a href="https://github.com/Liya-17">Liya Manusree Yarlagadda</a> — KL University, B.Tech AI & Data Science</p>
