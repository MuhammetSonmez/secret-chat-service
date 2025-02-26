# Secret Chat Service

## Project Description
Secret Chat Service allows users to communicate securely using a custom encryption key. If the encryption key is changed, all previous messages are deleted to ensure maximum privacy.

In an era where data privacy is frequently compromised, this project provides a secure and decentralized way for individuals to communicate without relying on third-party services. By allowing users to control their own encryption keys, Secret Chat Service ensures that conversations remain private and inaccessible to unauthorized parties. The automatic deletion of messages when the encryption key changes further enhances security by preventing unauthorized access to old conversations.

## Features
- End-to-end encryption: Users can securely chat using a custom encryption key.
- Dynamic encryption key: If the key is changed, previous conversations are automatically erased.
- Minimal backend: A lightweight backend built with Flask.
- Responsive web interface: Developed with React Native for a flexible UI.

## Missing Features and Future Improvements
- Mock database usage: Currently, a JSON file is used as a mock database. A transition to a real database is planned.
- Backend validation issues: More robust input validation mechanisms need to be implemented.
- Undefined encryption algorithm: The encryption method is currently configurable, but a standard implementation will be defined.

## Contributing
To contribute to this project, please fork the repository and submit your changes via a pull request.

