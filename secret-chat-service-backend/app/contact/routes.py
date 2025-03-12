from flask import Blueprint, request
from .service import send_contact_request, accept_contact_request, delete_contact_request, list_contacts, get_contact_requests

contact_bp = Blueprint('contact', __name__)

@contact_bp.route('/send_contact_request', methods=['POST'])
def send_contact_request_route():
    data = request.get_json()
    token = request.headers.get('Authorization')
    return send_contact_request(data, token)

@contact_bp.route('/accept_contact_request', methods=['POST'])
def accept_contact_request_route():
    data = request.get_json()
    token = request.headers.get('Authorization')
    return accept_contact_request(data, token)

@contact_bp.route('/delete_contact_request', methods=['POST'])
def delete_contact_request_route():
    data = request.get_json()
    token = request.headers.get('Authorization')
    return delete_contact_request(data, token)

@contact_bp.route('/list_contacts', methods=['GET'])
def list_contacts_route():
    token = request.headers.get('Authorization')
    return list_contacts(token)

@contact_bp.route('/contact_requests', methods=['GET'])
def get_contact_requests_route():
    token = request.headers.get('Authorization')
    return get_contact_requests(token)
