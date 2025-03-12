import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles/homeStyles';
import { router } from 'expo-router';

const BASE_URL: string = "http://192.168.1.34:5000";

const Home = () => {
  const [isContactModalVisible, setContactModalVisible] = useState(false);
  const [isKeyModalVisible, setKeyModalVisible] = useState(false);
  const [contactUsername, setContactUsername] = useState('');
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [contacts, setContacts] = useState<string[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<string[]>([]);
  const [keyMessage, setKeyMessage] = useState('');
  const [generatedKey, setGeneratedKey] = useState('');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      const token = await AsyncStorage.getItem('token');
      setToken(token); 
    };
    loadToken();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (token) {
        fetchContactRequests(); // Fetch incoming contact requests
        loadContacts(); // Load contacts
      }
    }, 3000); // 3000 milliseconds = 3 seconds
  
    // Clean up the interval when the component is unmounted or token changes
    return () => clearInterval(intervalId);
  }, [token]);

  const fetchContactRequests = async () => {
    if (!token) return; 
    renderIncomingRequests();
    try {
      const response = await fetch(`${BASE_URL}/contact/contact_requests`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setIncomingRequests(data.requests || []);
    } catch (error) {
      console.error('Error fetching contact requests:', error);
    }
  };

  const loadContacts = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${BASE_URL}/contact/list_contacts`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.contacts) {
        setContacts(data.contacts);
        setFilteredContacts(data.contacts);
      } else {
        console.error('Failed to load contacts');
      }
    } catch (error) {
      console.error('Failed to load contacts:', error);
    }
  };

  const acceptRequest = async (sender: string) => {
    if (!token) return;
    try {
      const response = await fetch(`${BASE_URL}/contact/accept_contact_request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ sender }),
      });
      const data = await response.json();
      if (data.success) {
        fetchContactRequests();
        
      }
    } catch (error: any) {
      setKeyMessage('Failed to accept request: ' + error.message);
    }
  };


  const deleteRequest = async (sender: string) => {
    if (!token) return;
    try {
      const response = await fetch(`${BASE_URL}/contact/delete_contact_request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ sender }),
      });
      const data = await response.json();
      if (data.success) {
        fetchContactRequests();
    }
    } catch (error: any) {
      setKeyMessage('Failed to delete request: ' + error.message);
    }
  };

  const sendRequest = async () => {
    if (!contactUsername) {
      setKeyMessage('Username cannot be empty.');
      return;
    }
    if (!token) return;
    try {
      const response = await fetch(`${BASE_URL}/contact/send_contact_request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ contact: contactUsername }),
      });
      const data = await response.json();
      setKeyMessage(data.message || data.error || 'An error occurred.');
    } catch (error: any) {
      setKeyMessage('An error occurred: ' + error.message);
    }
  };

  const generateKey = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${BASE_URL}/secret/generate_key`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.key) {
        setGeneratedKey(data.key);
        setKeyMessage('New key generated. You can copy or use it.');
      } else {
        setKeyMessage(data.error || 'An error occurred.');
      }
    } catch (error: any) {
      setKeyMessage('An error occurred: ' + error.message);
    }
  };

  const copyKey = () => {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey)
        .then(() => setKeyMessage('Key copied to clipboard!'))
        .catch(err => setKeyMessage('Failed to copy key: ' + err));
    } else {
      setKeyMessage('No key to copy.');
    }
  };

  const useKey = () => {
    if (generatedKey) {
      AsyncStorage.setItem('encryptionKey', generatedKey);
      setKeyMessage('Key saved successfully!');
    } else {
      setKeyMessage('No key to use.');
    }
  };

  const logout = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${BASE_URL}/user/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        AsyncStorage.removeItem('token');
        AsyncStorage.removeItem('contact');
        router.replace('/login');
      }
    } catch (error: any) {
      alert(`An error occurred: ${error.message}`);
    }
  };
  const handleItemPress = async (item:string) => {
    try {
      await AsyncStorage.setItem('contact', item);
      router.replace('/chat')
    } catch (error) {
      console.error('Error saving data to AsyncStorage');
    }
  };
  const renderIncomingRequests = () => {
    return incomingRequests.map((request: any, index: any) => (
      <View key={index} style={styles.contactItem}>
        <Text>{request}</Text>
        <View style={styles.requestButtons}>
          <TouchableOpacity onPress={() => acceptRequest(request)}>
            <Text style={styles.acceptButton}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteRequest(request)}>
            <Text style={styles.deleteButton}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.navbar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          onChangeText={(text) => setFilteredContacts(contacts.filter(contact => contact.includes(text)))}
        />
        <TouchableOpacity style={styles.keyButton}>
          <FontAwesome name="key" size={20} color="gray" onPress={() => setKeyModalVisible(true)}  />
          <FontAwesome name="plus" size={20} color="gray" style={styles.keyPlusIcon} onPress={() => setContactModalVisible(true)} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Contacts */}
      <FlatList
        data={filteredContacts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <View style={styles.contactItem}><Text onPress={() => handleItemPress(item)}>{item}</Text></View>}
      />

      {/* Key Modal */}
      <Modal visible={isKeyModalVisible} transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text>{keyMessage}</Text>
            <TouchableOpacity onPress={generateKey}>
              <Text>Generate Key</Text>
            </TouchableOpacity>
            <TextInput
              value={generatedKey}
              style={styles.keyInput}
            />
            <TouchableOpacity onPress={copyKey}><Text>Copy Key</Text></TouchableOpacity>
            <TouchableOpacity onPress={useKey}><Text>Use Key</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setKeyModalVisible(false)}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

     {/* Contact Modal */}
     <Modal visible={isContactModalVisible} transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {incomingRequests.length === 0 ? (
              <>
                <TextInput
                  value={contactUsername}
                  onChangeText={setContactUsername}
                  placeholder="Enter username"
                  style={styles.contactInput}
                />
                <TouchableOpacity onPress={sendRequest}><Text>Send Request</Text></TouchableOpacity>
                <Text>{keyMessage}</Text>
              </>
            ) : (
              <>
                <Text>Incoming Requests:</Text>
                {renderIncomingRequests()}
              </>
            )}
            <TouchableOpacity onPress={() => setContactModalVisible(false)}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Home;
