from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class TaskSubmission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    team_name = db.Column(db.String(100), nullable=False)
    selected_task = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship with uploaded files
    files = db.relationship('UploadedFile', backref='submission', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'team_name': self.team_name,
            'selected_task': self.selected_task,
            'description': self.description,
            'created_at': self.created_at.isoformat(),
            'files': [file.to_dict() for file in self.files]
        }

class UploadedFile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    original_filename = db.Column(db.String(255), nullable=False)
    file_size = db.Column(db.Integer, nullable=False)
    file_type = db.Column(db.String(100), nullable=False)
    file_url = db.Column(db.String(1024), nullable=False)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Foreign key to TaskSubmission
    submission_id = db.Column(db.Integer, db.ForeignKey('task_submission.id'), nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'filename': self.filename,
            'original_filename': self.original_filename,
            'file_size': self.file_size,
            'file_type': self.file_type,
            'file_url': self.file_url,
            'uploaded_at': self.uploaded_at.isoformat()
        }

