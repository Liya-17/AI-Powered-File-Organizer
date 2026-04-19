"""NexusFile AI - Configuration"""
import os
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# --- Folders ---
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
GENERATED_FOLDER = os.path.join(BASE_DIR, "generated")
ORGANIZED_FOLDER = os.path.join(BASE_DIR, "organized")
STATIC_FOLDER = os.path.join(BASE_DIR, "static")

# Ensure folders exist
for folder in [UPLOAD_FOLDER, GENERATED_FOLDER, ORGANIZED_FOLDER]:
    os.makedirs(folder, exist_ok=True)

# --- Database ---
DATABASE_URI = f"sqlite:///{os.path.join(BASE_DIR, 'nexusfile.db')}"

# --- AI ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = "gemini-2.0-flash"

# --- Upload ---
MAX_CONTENT_LENGTH = 50 * 1024 * 1024  # 50 MB
ALLOWED_EXTENSIONS = {
    "txt", "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx",
    "csv", "json", "xml", "yaml", "yml", "md", "rst",
    "py", "js", "ts", "html", "css", "java", "cpp", "c", "h",
    "go", "rs", "rb", "php", "sql", "sh", "bat", "ps1",
    "png", "jpg", "jpeg", "gif", "bmp", "svg", "webp", "ico",
    "mp3", "wav", "ogg", "mp4", "avi", "mov", "mkv", "webm",
    "zip", "rar", "7z", "tar", "gz",
    "log", "ini", "cfg", "env", "toml",
}

# --- Categories ---
CATEGORIES = {
    "Documents": ["pdf", "doc", "docx", "txt", "md", "rst", "odt", "rtf"],
    "Spreadsheets": ["xls", "xlsx", "csv", "ods"],
    "Presentations": ["ppt", "pptx", "odp"],
    "Images": ["png", "jpg", "jpeg", "gif", "bmp", "svg", "webp", "ico"],
    "Code": ["py", "js", "ts", "html", "css", "java", "cpp", "c", "h", "go", "rs", "rb", "php", "sql", "sh", "bat", "ps1"],
    "Data": ["json", "xml", "yaml", "yml", "toml", "ini", "cfg", "env", "log"],
    "Audio": ["mp3", "wav", "ogg", "flac", "aac"],
    "Video": ["mp4", "avi", "mov", "mkv", "webm"],
    "Archives": ["zip", "rar", "7z", "tar", "gz"],
}

# --- Templates ---
TEMPLATES = {
    "resume": {
        "name": "Professional Resume",
        "icon": "📄",
        "description": "Create a polished resume with your details",
        "fields": ["full_name", "email", "phone", "summary", "experience", "education", "skills"],
    },
    "invoice": {
        "name": "Business Invoice",
        "icon": "💰",
        "description": "Generate a professional invoice",
        "fields": ["company_name", "client_name", "items", "due_date", "notes"],
    },
    "report": {
        "name": "Business Report",
        "icon": "📊",
        "description": "Create a comprehensive business report",
        "fields": ["title", "author", "department", "topic", "key_points"],
    },
    "proposal": {
        "name": "Project Proposal",
        "icon": "🚀",
        "description": "Draft a compelling project proposal",
        "fields": ["project_name", "objective", "scope", "timeline", "budget"],
    },
    "meeting_minutes": {
        "name": "Meeting Minutes",
        "icon": "📝",
        "description": "Document meeting outcomes and action items",
        "fields": ["meeting_title", "date", "attendees", "agenda", "decisions", "action_items"],
    },
    "budget": {
        "name": "Budget Tracker",
        "icon": "💳",
        "description": "Create a budget tracking spreadsheet",
        "fields": ["title", "period", "categories", "income_sources", "notes"],
    },
}
