import os
import uuid
from flask import Blueprint, request, jsonify, current_app, send_from_directory
from werkzeug.utils import secure_filename
from src.models.submission import db, TaskSubmission, UploadedFile

upload_bp = Blueprint('upload', __name__)

# 允許的文件類型
ALLOWED_EXTENSIONS = {
    'txt', 'pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg', 'gif', 'webp',
    'mp4', 'mov', 'avi', 'mkv', 'mp3', 'wav', 'ppt', 'pptx'
}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_upload_folder():
    upload_folder = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads')
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)
    return upload_folder

@upload_bp.route('/submit', methods=['POST'])
def submit_task():
    try:
        # 獲取表單數據
        team_name = request.form.get('team_name')
        selected_task = request.form.get('selected_task')
        description = request.form.get('description')
        
        # 驗證必填字段
        if not all([team_name, selected_task, description]):
            return jsonify({
                'success': False,
                'message': 'Missing required fields'
            }), 400
        
        # 創建任務提交記錄
        submission = TaskSubmission(
            team_name=team_name,
            selected_task=selected_task,
            description=description
        )
        
        db.session.add(submission)
        db.session.flush()  # 獲取submission.id
        
        # 處理文件上傳
        uploaded_files = request.files.getlist('files')
        upload_folder = get_upload_folder()
        
        for file in uploaded_files:
            if file and file.filename and allowed_file(file.filename):
                # 生成安全的文件名
                original_filename = secure_filename(file.filename)
                file_extension = original_filename.rsplit('.', 1)[1].lower()
                unique_filename = f"{uuid.uuid4().hex}.{file_extension}"
                
                # 保存文件
                file_path = os.path.join(upload_folder, unique_filename)
                file.save(file_path)
                
                # 創建文件記錄
                uploaded_file = UploadedFile(
                    filename=unique_filename,
                    original_filename=original_filename,
                    file_size=os.path.getsize(file_path),
                    file_type=file.content_type or 'application/octet-stream',
                    file_path=file_path,
                    submission_id=submission.id
                )
                
                db.session.add(uploaded_file)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Task submitted successfully',
            'submission_id': submission.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error submitting task: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500

@upload_bp.route('/submissions', methods=['GET'])
def get_submissions():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        submissions = TaskSubmission.query.order_by(TaskSubmission.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'success': True,
            'submissions': [submission.to_dict() for submission in submissions.items],
            'total': submissions.total,
            'pages': submissions.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error getting submissions: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500

@upload_bp.route('/submissions/<int:submission_id>', methods=['GET'])
def get_submission(submission_id):
    try:
        submission = TaskSubmission.query.get_or_404(submission_id)
        return jsonify({
            'success': True,
            'submission': submission.to_dict()
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error getting submission: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500

@upload_bp.route('/files/<int:file_id>/download', methods=['GET'])
def download_file(file_id):
    try:
        uploaded_file = UploadedFile.query.get_or_404(file_id)
        upload_folder = get_upload_folder()
        
        return send_from_directory(
            upload_folder,
            uploaded_file.filename,
            as_attachment=True,
            download_name=uploaded_file.original_filename
        )
        
    except Exception as e:
        current_app.logger.error(f"Error downloading file: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'File not found'
        }), 404

@upload_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'success': True,
        'message': 'Upload service is running'
    }), 200

