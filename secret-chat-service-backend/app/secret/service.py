import jwt
from cryptography.fernet import Fernet
from flask import jsonify
from config import Config

def generate_key(token):
    try:
        token = token.split(' ')[1]
        jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=[Config.JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token süresi dolmuş.'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Geçersiz token.'}), 401

    key = Fernet.generate_key().decode()
    return jsonify({'key': key}), 200
