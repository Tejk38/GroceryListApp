import React, { useState, useContext, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup, loading } = useContext(AuthContext);

  // Password strength check
  const getPasswordStrength = (password) => {
    if (password.length < 6) return 'Weak';
    if (/[A-Z]/.test(password) && /\d/.test(password) && /[!@#$%^&*]/.test(password)) {
      return 'Strong';
    }
    return 'Medium';
  };

  // Get strength color
  const getStrengthColor = (strength) => {
    switch (strength) {
      case 'Weak': return '#ff4040';
      case 'Medium': return '#ffaa00';
      case 'Strong': return '#00cc00';
      default: return 'gray';
    }
  };

  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // In your SignupScreen.js, modify the handleSignup function:

const handleSignup = async () => {
  if (isSubmitting) return;

  // Validate inputs
  if (!email || !username || !password) {
    Alert.alert('Error', 'Please fill all fields');
    return;
  }

  if (!isValidEmail(email)) {
    Alert.alert('Error', 'Please enter a valid email address');
    return;
  }

  if (password !== confirmPassword) {
    Alert.alert('Error', 'Passwords do not match');
    return;
  }

  if (password.length < 6) {
    Alert.alert('Error', 'Password must be at least 6 characters');
    return;
  }

  try {
    setIsSubmitting(true);

    const result = await signup(email, password, username);

   

if (result?.success) {
  const trimmedEmail = email.trim();
  console.log('✅ Signup successful. Navigating to Mailsender with email:', trimmedEmail);
  
  // Make sure email is not empty
  if (!trimmedEmail) {
    console.error('❌ Cannot navigate to Mailsender: email is empty');
    Alert.alert('Error', 'Email address is required for sending welcome message');
    return;
  }
  
  // Log the exact values being passed to navigation
  console.log('📧 Navigation params:', {
    userEmail: trimmedEmail,
    username: username
  });
  
  navigation.reset({
    index: 0,
    routes: [{
      name: 'Mailsender',  // Make sure this matches your route name exactly (case sensitive)
      params: {
        userEmail: trimmedEmail,
        username: username,
      },
    }],
  });
}
     else {
      console.error('❌ Signup failed:', result?.error);
      Alert.alert('Signup Error', result?.error || 'An error occurred during signup');
    }
  } catch (error) {
    console.error('❌ Unexpected signup error:', error);
    Alert.alert('Signup Error', 'An unexpected error occurred');
  } finally {
    setIsSubmitting(false);
  }
};
  

  // Show loading UI during auth operations
  if (loading || isSubmitting) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Creating your account...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
      />

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        autoCapitalize="none"
        autoComplete="username"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!passwordVisible}
          style={styles.passwordInput}
          autoComplete="new-password"
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <Ionicons name={passwordVisible ? 'eye-off' : 'eye'} size={24} color="gray" />
        </TouchableOpacity>
      </View>
      <Text style={[
        styles.passwordStrength, 
        {color: getStrengthColor(getPasswordStrength(password))}
      ]}>
        Strength: {getPasswordStrength(password)}
      </Text>

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!passwordVisible}
          style={styles.passwordInput}
          autoComplete="new-password"
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <Ionicons name={passwordVisible ? 'eye-off' : 'eye'} size={24} color="gray" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        onPress={handleSignup} 
        style={[
          styles.button, 
          (!email || !username || !password || password !== confirmPassword) && styles.buttonDisabled
        ]}
        disabled={!email || !username || !password || password !== confirmPassword}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.switchText}>
        <Text>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f7f7f7',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
  },
  passwordStrength: {
    fontSize: 14,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 18,
  },
  switchText: {
    alignItems: 'center',
    marginTop: 10,
  },
});

export default SignupScreen;