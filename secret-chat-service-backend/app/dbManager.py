import json
from config import Config

def read_db():
    with open(Config.DB_FILE, 'r') as f:
        return json.load(f)

def write_db(data):
    with open(Config.DB_FILE, 'w') as f:
        json.dump(data, f, indent=4)

def clear_db():
    empty_db = {
        "users": [],
        "messages": [],
        "contacts": {},
        "contact_requests": {}
    }
    write_db(empty_db)
