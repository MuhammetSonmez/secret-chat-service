from flask import Flask
from .user.routes import user_bp
from .message.routes import message_bp
from .contact.routes import contact_bp
from .secret.routes import secret_bp
from .routes import main_bp
from config import Config
from .wss import init_socketio
from flask_apscheduler import APScheduler
from datetime import datetime, timezone
from .dbManager import read_db, write_db

scheduler = APScheduler()

def create_app():
    app = Flask(__name__, template_folder='templates')
    app.config.from_object(Config)
    app.register_blueprint(main_bp)
    app.register_blueprint(user_bp, url_prefix='/user')
    app.register_blueprint(message_bp, url_prefix='/message')
    app.register_blueprint(contact_bp, url_prefix='/contact')
    app.register_blueprint(secret_bp, url_prefix='/secret')
    
    init_socketio(app)
    
    if not scheduler.running:
        scheduler.init_app(app)
        scheduler.start()
        
    return app

def clean_expired_tokens():
    db = read_db()
    tokens_data = db.get('tokens', [])
    current_time = datetime.now(timezone.utc)

    valid_tokens = []
    expired_count = 0

    for token_data in tokens_data:
        token = token_data.get('token')
        exp_str = token_data.get('exp')

        try:
            if token and exp_str:
                exp_time = datetime.fromisoformat(exp_str)
                
                if exp_time > current_time:
                    valid_tokens.append(token_data)
                else:
                    expired_count += 1
        except ValueError as e:
            print(f"Invalid date format: {e}")
        except Exception as e:
            print(f"Error processing token: {e}")

    if expired_count > 0:
        db['tokens'] = valid_tokens
        write_db(db)
        print(f"{expired_count} süresi dolmuş token silindi.")

scheduler.add_job(id='Clean Tokens', func=clean_expired_tokens, trigger='interval', hours=24)
