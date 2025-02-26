from flask import Blueprint, request
from .service import register_user, login_user, current_user, logout_user

user_bp = Blueprint('user', __name__)

@user_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    return register_user(data)

@user_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    return login_user(data)

@user_bp.route('/logout', methods=['POST'])
def logout():
    token = request.headers.get('Authorization')
    return logout_user(token)

@user_bp.route('/current_user', methods=['GET'])
def current_user_route():
    token = request.headers.get('Authorization')
    return current_user(token)
