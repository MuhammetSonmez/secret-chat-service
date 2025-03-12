import jwt
from flask import jsonify
from config import Config
from ..dbManager import read_db, write_db

def send_contact_request(data, token):
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

    contact = data.get('contact')

    if not contact:
        return jsonify({'error': 'İletişim bilgisi gereklidir.'}), 400

    db = read_db()
    users = db['users']
    contacts = db.get('contacts', {})
    contact_requests = db.get('contact_requests', {})

    if username not in contact_requests:
        contact_requests[username] = []

    if len(contact_requests[username]) >= 100:
        return jsonify({'error': 'En fazla 100 bekleyen iletişim isteğiniz olabilir.'}), 400

    if contact not in [user['username'] for user in users] or contact == username:
        return jsonify({'error': 'Geçersiz iletişim bilgisi.'}), 400

    if contact in contacts.get(username, []):
        return jsonify({'error': 'Bu kullanıcı zaten kontaklarınızda.'}), 400

    if contact in contact_requests and username in contact_requests[contact]:
        return jsonify({'error': 'Bu kullanıcıya zaten bir iletişim isteği göndermişsiniz.'}), 400

    if contact not in contact_requests:
        contact_requests[contact] = []
    
    contact_requests[contact].append(username)
    db['contact_requests'] = {key: value for key, value in contact_requests.items() if value}
    write_db(db)

    return jsonify({'message': 'Contact request sent.'})

def accept_contact_request(data, token):
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

    sender = data.get('sender')

    if not sender:
        return jsonify({'error': 'Gönderen bilgisi gereklidir.'}), 400

    db = read_db()
    contacts = db.get('contacts', {})
    contact_requests = db.get('contact_requests', {})

    if username not in contact_requests or sender not in contact_requests[username]:
        return jsonify({'error': 'Bu kullanıcıdan bir iletişim isteği almadınız.'}), 400

    if username not in contacts:
        contacts[username] = []
    if sender not in contacts:
        contacts[sender] = []

    contacts[username].append(sender)
    contacts[sender].append(username)

    contact_requests[username].remove(sender)
    if not contact_requests[username]:
        del contact_requests[username]

    db['contacts'] = contacts
    db['contact_requests'] = contact_requests
    write_db(db)

    return jsonify({'message': 'Contact request accepted.'})

def delete_contact_request(data, token):
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

    sender = data.get('sender')

    if not sender:
        return jsonify({'error': 'Gönderen bilgisi gereklidir.'}), 400

    db = read_db()
    contact_requests = db.get('contact_requests', {})

    if username not in contact_requests or sender not in contact_requests[username]:
        return jsonify({'error': 'Bu kullanıcıdan bir iletişim isteği almadınız.'}), 400

    contact_requests[username].remove(sender)
    if not contact_requests[username]:
        del contact_requests[username]

    db['contact_requests'] = contact_requests
    write_db(db)

    return jsonify({'message': 'Contact request deleted.'})

def list_contacts(token):
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

    db = read_db()
    contacts = db.get('contacts', {})

    user_contacts = contacts.get(username, [])

    return jsonify({'contacts': user_contacts})

def get_contact_requests(token):
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

    db = read_db()
    contact_requests = db.get('contact_requests', {})

    requests = contact_requests.get(username, [])

    return jsonify({'requests': requests})
