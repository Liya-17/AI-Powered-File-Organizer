"""NexusFile AI - Database Models"""
import json
from datetime import datetime, timezone
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Float
from sqlalchemy.orm import declarative_base, sessionmaker
from config import DATABASE_URI

Base = declarative_base()
engine = create_engine(DATABASE_URI, echo=False)
Session = sessionmaker(bind=engine)


class FileRecord(Base):
    __tablename__ = "files"

    id = Column(Integer, primary_key=True, autoincrement=True)
    filename = Column(String(500), nullable=False)         # stored filename (uuid)
    original_name = Column(String(500), nullable=False)    # user-facing name
    category = Column(String(100), default="Uncategorized")
    tags = Column(Text, default="[]")                       # JSON list
    summary = Column(Text, default="")
    file_type = Column(String(20), default="")
    file_size = Column(Float, default=0)                    # bytes
    file_path = Column(String(1000), nullable=False)
    upload_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    def get_tags(self):
        try:
            return json.loads(self.tags) if self.tags else []
        except json.JSONDecodeError:
            return []

    def set_tags(self, tag_list):
        self.tags = json.dumps(tag_list)

    def to_dict(self):
        return {
            "id": self.id,
            "filename": self.filename,
            "original_name": self.original_name,
            "category": self.category,
            "tags": self.get_tags(),
            "summary": self.summary,
            "file_type": self.file_type,
            "file_size": self.file_size,
            "file_path": self.file_path,
            "upload_date": self.upload_date.isoformat() if self.upload_date else None,
        }


class GeneratedDocument(Base):
    __tablename__ = "generated_documents"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(500), nullable=False)
    doc_type = Column(String(20), nullable=False)          # pptx, pdf, xlsx, docx
    prompt = Column(Text, default="")
    file_path = Column(String(1000), nullable=False)
    filename = Column(String(500), nullable=False)
    created_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "doc_type": self.doc_type,
            "prompt": self.prompt,
            "filename": self.filename,
            "file_path": self.file_path,
            "created_date": self.created_date.isoformat() if self.created_date else None,
        }


class ActivityLog(Base):
    __tablename__ = "activity_log"

    id = Column(Integer, primary_key=True, autoincrement=True)
    action = Column(String(100), nullable=False)           # upload, generate, analyze, organize, delete
    details = Column(Text, default="")
    icon = Column(String(10), default="📁")
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "action": self.action,
            "details": self.details,
            "icon": self.icon,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
        }


def init_db():
    """Create all tables."""
    Base.metadata.create_all(engine)


def get_session():
    """Return a new database session."""
    return Session()


if __name__ == "__main__":
    init_db()
    print("Database initialized successfully!")
