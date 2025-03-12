import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import styles from './styles/loginStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [encryptionKey, setEncryptionKey] = useState('');
  const base: string = "http://192.168.1.34:5000";

  const validatePassword = (password: string) => {
    const minLength = 8;
    const maxLength = 45;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength || password.length > maxLength) {
      return 'Password must be between 8 and 45 characters long.';
    }
    if (!hasUppercase || !hasLowercase || !hasDigit || !hasSpecialChar) {
      return 'Password must include uppercase letters, lowercase letters, numbers, and special characters.';
    }
    return null;
  };

  const handleSwitch = () => {
    setIsLogin(!isLogin);
  };

  const handleLogin = async () => {
    if (username.trim() === '') {
      Alert.alert('Error', 'Username is required.');
      return;
    }

    if (password.trim() === '') {
      Alert.alert('Error', 'Password is required.');
      return;
    }
    
    try {
      const response = await fetch(base + '/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (data.token) {
        Alert.alert(data.token.toString());
        await AsyncStorage.setItem('token', data.token);

        if (encryptionKey.trim() !== '') {
          await AsyncStorage.setItem('encryptionKey', encryptionKey);
        }

        router.replace('/home');
      } else {
        Alert.alert('Error', data.error);
      }
    } catch (error: any) {
      Alert.alert('Error', `An error occurred: ${error.message}`);
    }
  };

  const handleRegister = async () => {
    const passwordError = validatePassword(password);
    if (passwordError) {
      Alert.alert('Error', passwordError);
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      const response = await fetch(base + '/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (data.error) {
        Alert.alert('Error', data.error);
      } else {
        Alert.alert('Success', data.message);
      }
    } catch (error: any) {
      Alert.alert('Error', `An error occurred: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ssshhh!</Text>
      <View style={styles.switchSection}>
        <Text style={styles.switchText}>{isLogin ? 'Login' : 'Register'}</Text>
        <TouchableOpacity onPress={handleSwitch} style={styles.switchButton}>
          <View style={[styles.switchCircle, isLogin && styles.switchCircleActive]} />
        </TouchableOpacity>
      </View>

      <View style={styles.formWrapper}>
        {isLogin ? (
          <View style={styles.formContainer}>
            <Text style={styles.formHeader}>Login</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Key (optional)"
              value={encryptionKey}
              onChangeText={setEncryptionKey}
            />

            <TouchableOpacity
            style={{ backgroundColor: '#c2a55c', padding: 12, borderRadius: 8, alignItems: 'center' }}
            onPress={handleLogin}
            >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Login</Text>
            </TouchableOpacity>

          </View>
        ) : (
          <View style={styles.formContainer}>
            <Text style={styles.formHeader}>Register</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />


            <TouchableOpacity
            style={{ backgroundColor: '#c2a55c', padding: 12, borderRadius: 8, alignItems: 'center' }}
            onPress={handleRegister}
            >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Register</Text>
            </TouchableOpacity>

          </View>
        )}
      </View>
    </View>
  );
};

export default Login;
