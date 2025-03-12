import jwt
from datetime import datetime, timedelta, timezone
from flask import jsonify
from config import Config
from ..dbManager import read_db, write_db

def register_user(data):
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        response = jsonify({'error': 'Kullanıcı adı ve şifre gereklidir.'})
        response.headers['Content-Type'] = 'application/json; charset=utf-8'
        return response, 400

    db = read_db()
    users = db['users']

    if any(user['username'] == username for user in users):
        response = jsonify({'error': 'Bu kullanıcı adı zaten mevcut.'})
        response.headers['Content-Type'] = 'application/json; charset=utf-8'
        return response, 400

    users.append({'username': username, 'password': password})
    db['users'] = users
    write_db(db)

    response = jsonify({'message': 'Kullanıcı başarıyla kaydedildi!'})
    response.headers['Content-Type'] = 'application/json; charset=utf-8'
    return response, 201

def login_user(data):
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        response = jsonify({'error': 'Kullanıcı adı ve şifre gereklidir.'})
        response.headers['Content-Type'] = 'application/json; charset=utf-8'
        return response, 400

    db = read_db()
    users = db['users']

    for user in users:
        if user['username'] == username and user['password'] == password:
            token = jwt.encode({
                'sub': username,
                'exp': datetime.now(timezone.utc) + timedelta(hours=24)
            }, Config.JWT_SECRET_KEY, algorithm=Config.JWT_ALGORITHM)

            tokens = db.get('tokens', [])
            tokens.append({'token': token, 'exp': str(datetime.now(timezone.utc) + timedelta(seconds=24))})
            db['tokens'] = tokens
            write_db(db)

            response = jsonify({'message': 'Kullanıcı girişi başarılı!', 'token': token})
            response.headers['Content-Type'] = 'application/json; charset=utf-8'
            return response
     
    response = jsonify({'error': 'Kullanıcı adı veya şifre hatalı.'})
    response.headers['Content-Type'] = 'application/json; charset=utf-8'
    return response, 401


def logout_user(token):
    token = token.split(' ')[1]

    db = read_db()
    tokens = db.get('tokens', [])

    if any(t['token'] == token for t in tokens):
        tokens = [t for t in tokens if t['token'] != token]
        db['tokens'] = tokens
        write_db(db)

    response = jsonify({'message': 'Çıkış başarılı!'})
    response.headers['Content-Type'] = 'application/json; charset=utf-8'
    return response


def current_user(token):
    if token:
        token = token.split(' ')[1]
        db = read_db()
        tokens = db.get('tokens', [])

        if not any(t['token'] == token for t in tokens):
            return jsonify({'error': 'Token geçersiz.'}), 401

        try:
            payload = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=[Config.JWT_ALGORITHM])
            username = payload['sub']
            response = jsonify({'username': username})
            response.headers['Content-Type'] = 'application/json; charset=utf-8'
            return response
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token süresi dolmuş.'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Geçersiz token.'}), 401
    else:
        response = jsonify({'error': 'Token sağlanmamış.'})
        response.headers['Content-Type'] = 'application/json; charset=utf-8'
        return response, 401
