import jwt
from flask import jsonify
from config import Config
from cryptography.fernet import Fernet
from ..dbManager import read_db, write_db


def send_message_service(data, token):
    if not token:
        return jsonify({'error': 'Token sağlanmamış.'}), 401

    try:
        payload = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=[Config.JWT_ALGORITHM])
        sender = payload['sub']
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token süresi dolmuş.'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Geçersiz token.'}), 401

    recipient = data.get('recipient')
    message = data.get('message')
    key = data.get('key')

    if not recipient or not message or not key:
        return jsonify({'error': 'Alıcı, mesaj ve anahtar gereklidir.'}), 400

    try:
        fernet = Fernet(key.encode())
        encrypted_message = fernet.encrypt(message.encode()).decode()
    except Exception:
        return jsonify({'error': 'Anahtar geçersiz.'}), 400

    db = read_db()
    messages = db.get('messages', [])
    contacts = db.get('contacts', {})
    if recipient not in contacts.get(sender, []):
        return jsonify({'error': 'Bu kullanıcı ile bağlantınız yok.'}), 403
    
    messages.append({'sender': sender, 'recipient': recipient, 'message': encrypted_message})
    db['messages'] = messages
    write_db(db)

    return jsonify({'message': 'Mesaj başarıyla gönderildi!'}), 200

def get_messages_service(token, args):
    if not token:
        return jsonify({'error': 'Token sağlanmamış.'}), 401

    try:
        token = token.split(' ')[1]
        payload = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=[Config.JWT_ALGORITHM])
        username = payload['sub']
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token süresi dolmuş.'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Geçersiz token.'}), 401

    key = args.get('key')
    if not key:
        return jsonify({'error': 'Anahtar sağlanmamış.'}), 400

    try:
        fernet = Fernet(key.encode())
    except Exception:
        return jsonify({'error': 'Anahtar geçersiz.'}), 400

    db = read_db()
    messages = db.get('messages', [])

    target_user = args.get('user')
    if not target_user:
        return jsonify({'error': 'Hedef kullanıcı adı belirtilmemiş.'}), 400

    filtered_messages = []
    messages_to_delete = []
    for message in messages:
        if (message['sender'] == username and message['recipient'] == target_user) or \
           (message['recipient'] == username and message['sender'] == target_user):
            try:
                decrypted_message = fernet.decrypt(message['message'].encode()).decode()
                filtered_messages.append({
                    'sender': message['sender'],
                    'recipient': message['recipient'],
                    'message': decrypted_message,
                    'with': message['recipient'] if message['sender'] == username else message['sender']
                })
            except Exception:
                messages_to_delete.append(message)
    if messages_to_delete:
        db['messages'] = [msg for msg in messages if msg not in messages_to_delete]
        write_db(db)

    return jsonify(filtered_messages)
