from flask import Blueprint, request
from .service import generate_key

secret_bp = Blueprint('secret', __name__)

@secret_bp.route('/generate_key', methods=['POST'])
def generate_key_route():
    token = request.headers.get('Authorization')
    return generate_key(token)
