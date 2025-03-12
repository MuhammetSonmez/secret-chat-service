import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TextInput, Button, ScrollView, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import styles from './styles/chatStyles';


const BASE_URL: string = "http://192.168.1.34:5000";

interface Message {
    sender: string;
    message: string;
}

export default function Chat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageText, setMessageText] = useState('');
    const [token, setToken] = useState<string | null>(null);
    const [contact, setContact] = useState<string | null>(null);
    const [encryptionKey, setEncryptionKey] = useState<string | null>(null);
    const [loading, setLoading] = useState(true); 

    const messageAreaRef = useRef<ScrollView | null>(null);

    useEffect(() => {
        const fetchToken = async () => {
            const storedToken = await AsyncStorage.getItem('token');
            if (storedToken) {
                setToken(storedToken);
            } else {
                Alert.alert('Error', 'No token found. Please log in.');
            }
        };

        const fetchContactAndKey = async () => {
            const storedContact = await AsyncStorage.getItem('contact');
            const storedKey = await AsyncStorage.getItem('encryptionKey');
            if (storedContact && storedKey) {
                setContact(storedContact);
                setEncryptionKey(storedKey);
            } else {
                Alert.alert('Error', 'No contact or encryption key found.');
            }
        };

        const loadData = async () => {
            await fetchToken();
            await fetchContactAndKey();
            setLoading(false);  
        };

        loadData();
    }, []);

    useEffect(() => {
        if (token && contact && encryptionKey && !loading) {
            const socket = io(BASE_URL, {
                query: {
                    token: encodeURIComponent(token),
                },
            });

            socket.on('connect', () => {
                console.log('WebSocket bağlantısı başarıyla kuruldu');
            });

            socket.on('new_message', (data) => {
                console.log('Yeni mesaj alındı:', data);
                fetchMessages();
            });

            socket.on('error', (error) => {
                console.error('WebSocket hatası:', error);
            });

            socket.on('disconnect', () => {
                console.log('WebSocket bağlantısı kesildi');
            });

            return () => {
                socket.disconnect();
            };
        }
    }, [token, contact, encryptionKey, loading]);  
    async function fetchMessages() {
        if (!contact || !encryptionKey) {
            console.error('Contact veya encryptionKey eksik.');
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/message/messages?user=${contact}&key=${encryptionKey}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log("data: ", data);
                if (Array.isArray(data)) {
                    setMessages(data);
                } else {
                    console.error('Mesajlar beklenen formatta değil:', data);
                }
            } else {
                console.error('Mesajlar alınırken bir hata oluştu:', response.statusText);
            }
        } catch (error) {
            console.error('Mesajlar alınırken bir hata oluştu:', error);
        }
    }

    function sendMessage() {
        if (!messageText) {
            alert('Lütfen bir mesaj yazın!');
            return;
        }

        if (!contact || !encryptionKey) {
            console.error('Contact veya encryptionKey eksik.');
            return;
        }

        fetch(`${BASE_URL}/message/send_message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                recipient: contact,
                message: messageText,
                key: encryptionKey
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                setMessageText('');
                fetchMessages();
            } else {
                alert(data.error);
            }
        })
        .catch(error => console.error('Mesaj gönderilirken bir hata oluştu:', error));
    }

    function scrollToBottom() {
        if (messageAreaRef.current) {
            messageAreaRef.current.scrollToEnd({ animated: true });
        }
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
             <TouchableOpacity onPress={() => router.replace('/home')}>
                    <Text style={styles.backButton}>Back</Text>
                </TouchableOpacity>
            <Text style={styles.header}>{contact || 'Chat'}</Text>

            <ScrollView
                style={styles.messageContainer}
                contentContainerStyle={styles.messageList}
                ref={messageAreaRef}
            >
                {messages.map((msg, index) => (
                    <View key={index} style={styles.messageBubble}>
                        <Text style={styles.messageText}>{`${msg.sender}: ${msg.message}`}</Text>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={messageText}
                    onChangeText={setMessageText}
                    placeholder="Type a message..."
                />

            <TouchableOpacity
            style={{ backgroundColor: '#c2a55c', padding: 12, borderRadius: 8, alignItems: 'center' }}
            onPress={sendMessage}
            >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Send</Text>
            </TouchableOpacity>

            </View>
        </View>
    );
}

