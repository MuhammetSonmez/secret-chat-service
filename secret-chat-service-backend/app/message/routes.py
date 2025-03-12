from flask import Blueprint, request, jsonify
from flask_socketio import emit, join_room, leave_room
from config import Config
import jwt
from .service import send_message_service, get_messages_service
from app.wss import socketio

message_bp = Blueprint('message_bp', __name__)

@message_bp.route('/send_message', methods=['POST'])
def send_message_route():
    data = request.get_json()
    token = request.headers.get('Authorization')
    
    if not token:
        return jsonify({'error': 'Token sağlanmamış.'}), 401
    
    try:
        token = token.split(' ')[1]
        payload = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=[Config.JWT_ALGORITHM])
        sender = payload['sub']
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token süresi dolmuş.'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Geçersiz token.'}), 401
    
    data['sender'] = sender
    
    response, status_code = send_message_service(data, token)
    
    if status_code == 200:
        recipient = data['recipient']
        socketio.emit('new_message', data, room=recipient)
        socketio.emit('new_message', data, room=sender)

    return response

@message_bp.route('/messages', methods=['GET'])
def get_messages_route():
    token = request.headers.get('Authorization')
    return get_messages_service(token, request.args)

@socketio.on('connect')
def handle_connect():
    token = request.args.get('token')
    if token:
        try:
            payload = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=[Config.JWT_ALGORITHM])
            username = payload['sub']
            join_room(username)
        except jwt.ExpiredSignatureError:
            emit('error', {'error': 'Token süresi dolmuş.'})
        except jwt.InvalidTokenError:
            emit('error', {'error': 'Geçersiz token.'})
    else:
        emit('error', {'error': 'Token sağlanmamış.'})

@socketio.on('disconnect')
def handle_disconnect():
    token = request.args.get('token')
    if token:
        try:
            payload = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=[Config.JWT_ALGORITHM])
            username = payload['sub']
            leave_room(username)
        except:
            pass
