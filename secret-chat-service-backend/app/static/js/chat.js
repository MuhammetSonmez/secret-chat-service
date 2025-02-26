document.addEventListener('DOMContentLoaded', function() {
    const keyButton = document.querySelector('.fa-key');
    const keyModal = document.getElementById('key-modal');
    const closeKeyModal = document.querySelector('#key-modal .modal-header .close');
    const generateKeyButton = document.getElementById('generate-key');
    const keyInput = document.getElementById('key-input');
    const copyKeyButton = document.getElementById('copy-key');
    const useKeyButton = document.getElementById('use-key');
    const keyMessage = document.getElementById('key-message');

    const contactButton = document.querySelector('.fa-plus');
    const contactModal = document.getElementById('contact-modal');
    const closeContactModal = document.querySelector('#contact-modal .modal-header .close');
    const sendRequestButton = document.getElementById('send-request');
    const contactUsernameInput = document.getElementById('contact-username');
    const requestMessage = document.getElementById('request-message');

    const contactList = document.getElementById('contact-list');
    const searchInput = document.querySelector('.search-input');

    let contacts = []; 
    let filteredContacts = []; 

    keyButton.addEventListener('click', function() {
        keyModal.style.display = 'flex';
    });

    contactButton.addEventListener('click', function() {
        contactModal.style.display = 'flex';
    });

    closeKeyModal.addEventListener('click', function() {
        keyModal.style.display = 'none';
    });

    closeContactModal.addEventListener('click', function() {
        contactModal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === keyModal) {
            keyModal.style.display = 'none';
        }
        if (event.target === contactModal) {
            contactModal.style.display = 'none';
        }
    });

    generateKeyButton.addEventListener('click', function() {
        const token = localStorage.getItem('token');
        fetch('/secret/generate_key', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.key) {
                generatedKey = data.key;
                keyInput.value = generatedKey;
                keyMessage.textContent = 'New key generated. You can copy or use it.';
                keyMessage.className = 'message-success';
            } else {
                keyMessage.textContent = data.error || 'An error occurred.';
                keyMessage.className = 'message-error';
            }
        })
        .catch(error => {
            keyMessage.textContent = 'An error occurred: ' + error.message;
            keyMessage.className = 'message-error';
        });
    });

    copyKeyButton.addEventListener('click', function() {
        if (generatedKey) {
            navigator.clipboard.writeText(generatedKey).then(() => {
                keyMessage.textContent = 'Key copied to clipboard!';
                keyMessage.className = 'message-success';
            }).catch(err => {
                keyMessage.textContent = 'Failed to copy key: ' + err;
                keyMessage.className = 'message-error';
            });
        } else {
            keyMessage.textContent = 'No key to copy.';
            keyMessage.className = 'message-error';
        }
    });

    useKeyButton.addEventListener('click', function() {
        if (generatedKey) {
            localStorage.setItem('encryptionKey', generatedKey);
            keyMessage.textContent = 'Key saved successfully!';
            keyMessage.className = 'message-success';
        } else {
            keyMessage.textContent = 'No key to use.';
            keyMessage.className = 'message-error';
        }
    });

    sendRequestButton.addEventListener('click', function() {
        const username = contactUsernameInput.value.trim();
        if (!username) {
            requestMessage.textContent = 'Username cannot be empty.';
            requestMessage.className = 'message-error';
            return;
        }

        const token = localStorage.getItem('token');
        fetch('/contact/send_contact_request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ contact: username })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Contact request sent.') {
                requestMessage.textContent = 'Contact request sent successfully!';
                requestMessage.className = 'message-success';
            } else {
                requestMessage.textContent = data.error || 'An error occurred.';
                requestMessage.className = 'message-error';
            }
        })
        .catch(error => {
            requestMessage.textContent = 'An error occurred: ' + error.message;
            requestMessage.className = 'message-error';
        });
    });

    function loadContacts() {
        const token = localStorage.getItem('token');
        fetch('/contact/list_contacts', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.contacts) {
                contacts = data.contacts; 
                filteredContacts = contacts; 
                renderContacts(filteredContacts);
            } else {
                contactList.innerHTML = '<div class="contact-item">No contacts found.</div>';
            }
        })
        .catch(error => {
            contactList.innerHTML = '<div class="contact-item">Failed to load contacts.</div>';
            console.error('Failed to load contacts:', error);
        });
    }

    function renderContacts(contactArray) {
        contactList.innerHTML = ''; 
        contactArray.forEach(contact => {
            const contactItem = document.createElement('div');
            contactItem.className = 'contact-item';
            contactItem.textContent = contact; 
            contactList.appendChild(contactItem);
        });
    }

    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.toLowerCase();
        filteredContacts = contacts.filter(contact => contact.toLowerCase().includes(searchTerm));
        renderContacts(filteredContacts);
    });

    function fetchContactRequests() {
        const token = localStorage.getItem('token');
        fetch('http://127.0.0.1:5000/contact/contact_requests', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            displayContactRequests(data.requests);
        })
        .catch(error => {
            console.error('Error fetching contact requests:', error);
        });
    }
    
    function displayContactRequests(requests) {
        const requestsList = document.getElementById('contact-requests-list');
        requestsList.innerHTML = '';
    
        if (requests.length === 0) {
            requestsList.innerHTML = '<p>No contact requests.</p>';
            return;
        }
    
        requests.forEach(request => {
            const requestItem = document.createElement('div');
            requestItem.className = 'contact-request-item';
            requestItem.textContent = `Username: ${request}`;
            requestsList.appendChild(requestItem);
        });
    }

    fetchContactRequests();
    loadContacts();
});
