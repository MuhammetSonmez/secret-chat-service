import unittest
from app.dbManager import clear_db
from app import create_app

def log(data):
    with open('log.log', 'w', encoding="utf-8") as f:
        f.write(data)

clear_db()


class UserTestCase(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.app = create_app()
        cls.client = cls.app.test_client()
        cls.app.testing = True

    @classmethod
    def tearDownClass(cls):
        clear_db()

    def test_user_registration_and_login(self):
        response = self.client.post('/user/register', json={
            "username": "username1",
            "password": "password1"
        })
        self.assertEqual(response.status_code, 201)
        
        response = self.client.post('/user/register', json={
            "username": "username2",
            "password": "password2"
        })
        self.assertEqual(response.status_code, 201)
        
        response = self.client.post('/user/login', json={
            "username": "username1",
            "password": "password1"
        })
        self.assertEqual(response.status_code, 200)
        token1 = response.json['token']
        
        response = self.client.post('/user/login', json={
            "username": "username2",
            "password": "password2"
        })
        self.assertEqual(response.status_code, 200)
        token2 = response.json['token']
        
        response = self.client.get('/user/current_user', headers={
            "Authorization": f"Bearer {token1}"
        })

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json['username'], 'username1')
        
        response = self.client.get('/user/current_user', headers={
            "Authorization": f"Bearer {token2}"
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json['username'], 'username2')
        
        response = self.client.post('/user/logout', json={
            "username": "username1"
        }, headers={
            "Authorization": f"Bearer {token1}"
        })
        self.assertEqual(response.status_code, 200)
        
        response = self.client.get('/user/current_user', headers={
            "Authorization": f"Bearer {token1}"
        })
        self.assertEqual(response.status_code, 401)


class ContactTestCase(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.app = create_app()
        cls.client = cls.app.test_client()
        cls.app.testing = True

    @classmethod
    def tearDownClass(cls):
        clear_db()

    def test_contact_request_flow(self):
        response = self.client.post('/user/register', json={
            "username": "user1",
            "password": "password1"
        })
        self.assertEqual(response.status_code, 201)
        
        response = self.client.post('/user/register', json={
            "username": "user2",
            "password": "password2"
        })
        self.assertEqual(response.status_code, 201)
        
        response = self.client.post('/user/login', json={
            "username": "user1",
            "password": "password1"
        })
        self.assertEqual(response.status_code, 200)
        token1 = response.json['token']
        
        response = self.client.post('/user/login', json={
            "username": "user2",
            "password": "password2"
        })
        self.assertEqual(response.status_code, 200)
        token2 = response.json['token']
        
        response = self.client.post('/contact/send_contact_request', json={
            "contact": "user2"
        }, headers={
            "Authorization": f"Bearer {token1}"
        })
        self.assertEqual(response.status_code, 200)

        response = self.client.post('/contact/delete_contact_request', json={
            "sender": "user1"
        }, headers={
            "Authorization": f"Bearer {token2}"
        })
        self.assertEqual(response.status_code, 200)
        
        response = self.client.post('/contact/send_contact_request', json={
            "contact": "user2"
        }, headers={
            "Authorization": f"Bearer {token1}"
        })
        self.assertEqual(response.status_code, 200)

        response = self.client.post('/contact/accept_contact_request', json={
            "sender": "user1"
        }, headers={
            "Authorization": f"Bearer {token2}"
        })
        self.assertEqual(response.status_code, 200)
        
        response = self.client.get('/contact/list_contacts', headers={
            "Authorization": f"Bearer {token2}"
        })
        self.assertEqual(response.status_code, 200)
        contacts = response.json['contacts']
        self.assertIn('user1', contacts)
        


class SecretTestCase(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.app = create_app()
        cls.client = cls.app.test_client()
        cls.app.testing = True

    @classmethod
    def tearDownClass(cls):
        clear_db()

    def setUp(self):
        self.client.post('/user/register', json={
            "username": "admin",
            "password": "adminpassword"
        })

        response = self.client.post('/user/login', json={
            "username": "admin",
            "password": "adminpassword"
        })
        self.assertEqual(response.status_code, 200)
        self.token = response.json['token']

    def test_generate_secret_key(self):
        response = self.client.post('/secret/generate_key', json={}, headers={
            "Authorization": f"Bearer {self.token}"
        })
        
        self.assertEqual(response.status_code, 200)
        self.assertIn('key', response.json)
        self.assertTrue(response.json['key'])

class MessageTestCase(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.app = create_app()
        cls.client = cls.app.test_client()
        cls.app.testing = True
        
        response = cls.client.post('/user/register', json={
            "username": "user1",
            "password": "password1"
        })
        response = cls.client.post('/user/login', json={
            "username": "user1",
            "password": "password1"
        })
        cls.token1 = response.json['token']
        
        response = cls.client.post('/user/register', json={
            "username": "user2",
            "password": "password2"
        })
        response = cls.client.post('/user/login', json={
            "username": "user2",
            "password": "password2"
        })
        cls.token2 = response.json['token']
        
        response = cls.client.post('/secret/generate_key', json={}, headers={
            "Authorization": f"Bearer {cls.token1}"
        })
        cls.key = response.json['key']
        

    @classmethod
    def tearDownClass(cls):
        clear_db()

    def test_message_flow(self):
        response = self.client.post('/contact/send_contact_request', json={
            "contact": "user2"
        }, headers={
            "Authorization": f"Bearer {self.token1}"
        })
        self.assertEqual(response.status_code, 200)

        response = self.client.post('/contact/accept_contact_request', json={
            "sender": "user1"
        }, headers={
            "Authorization": f"Bearer {self.token2}"
        })
        self.assertEqual(response.status_code, 200)

        response = self.client.post('/message/send_message', json={
            "recipient": "user2",
            "message": "Hello from user1",
            "key": self.key
        }, headers={
            "Authorization": f"Bearer {self.token1}"
        })
        self.assertEqual(response.status_code, 200)
        
        response = self.client.post('/message/send_message', json={
            "recipient": "user1",
            "message": "Hello from user2",
            "key": self.key
        }, headers={
            "Authorization": f"Bearer {self.token2}"
        })
        self.assertEqual(response.status_code, 200)
        
        response = self.client.get('/message/messages', query_string={
            "user": "user2",
            "key": self.key
        }, headers={
            "Authorization": f"Bearer {self.token1}"
        })
        self.assertEqual(response.status_code, 200)
        messages_user1 = response.json
        self.assertGreater(len(messages_user1), 0)
        
        response = self.client.get('/message/messages', query_string={
            "user": "user1",
            "key": self.key
        }, headers={
            "Authorization": f"Bearer {self.token2}"
        })
        self.assertEqual(response.status_code, 200)
        messages_user2 = response.json
        self.assertGreater(len(messages_user2), 0)

        self.assertIn("Hello from user2", [msg['message'] for msg in messages_user1])
        self.assertIn("Hello from user1", [msg['message'] for msg in messages_user2])


if __name__ == '__main__':
    unittest.main()

