import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { AuthContext } from '../../context/AuthContext';

WebBrowser.maybeCompleteAuthSession();

// Adding email sending function using fetch
const sendConfirmationEmail = async (userEmail) => {
  try {
    console.log('📧 Sending confirmation email to:', userEmail);
    
    const response = await fetch('https://api.yourdomain.com/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: userEmail,
        subject: 'Successful Google Sign-in',
        body: 'You have successfully signed in to our app using Google authentication.',
      }),
    });
    
    if (response.ok) {
      console.log('Confirmation email sent successfully');
      return true;
    } else {
      console.error(' Failed to send confirmation email:', await response.text());
      return false;
    }
  } catch (error) {
    console.error(' Error sending confirmation email:', error);
    return false;
  }
};

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { loading } = useContext(AuthContext);

  // Modified Google auth configuration - removing PKCE
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '736576607984-13j08eotg5p8a8tk07l540kupbs5ho5v.apps.googleusercontent.com',
    webClientId: '736576607984-1is725qa6tu0hbkq7f0n9knk78acmnrb.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
    responseType: 'token',
    usePKCE: false
  });

  // Function to handle successful authentication
  const handleSuccessfulLogin = (userEmail, isGoogleAuth = false) => {
    console.log(' Navigation to Welcome/Mail screen with email:', userEmail);
    
    // Send confirmation email only for Google sign-in
    if (isGoogleAuth) {
      sendConfirmationEmail(userEmail).then(success => {
        if (!success) {
          console.warn('Email notification was not sent, but continuing with login');
        }
      });
    }
    
    // Navigate to Mailsender (styled as Welcome screen) instead of ProductList
    navigation.reset({
      index: 0,
      routes: [{ 
        name: 'mailsender',
        params: { userEmail: userEmail }
      }],
    });
  };

  useEffect(() => {
    const handleGoogleSignIn = async () => {
      if (response?.type === 'success') {
        try {
          setIsGoogleLoading(true);
          console.log('Google Response:', response);
          
          const accessToken = response.authentication?.accessToken || response.params?.access_token;
          
          if (!accessToken) {
            console.error('No access token in response:', response);
            throw new Error('Access token not found in response');
          }
          
          console.log('Access Token:', accessToken);
          
          // Get user info from Google
          const userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          
          if (!userInfoResponse.ok) {
            throw new Error(`Google API error: ${userInfoResponse.status}`);
          }
          
          const userInfo = await userInfoResponse.json();
          console.log(' Google User Info:', userInfo);
          
          let userEmail = userInfo.email; // Extracting email from Google response
          
          try {
            // Creating a credential with Google user ID and access token
            const credential = GoogleAuthProvider.credential(null, accessToken);
            
            const userCredential = await signInWithCredential(auth, credential);
            console.log('Firebase Google Auth Success:', userCredential.user.uid);
            // Use Firebase user email if available
            if (userCredential.user.email) {
              userEmail = userCredential.user.email;
            }
          } catch (firebaseError) {
            console.error('Firebase Authentication Error:', firebaseError);
            // Continuing with navigation even if Firebase auth fails
          }
          
          // Navigate using the common function with the email, passing true to indicate Google auth
          handleSuccessfulLogin(userEmail, true);
          
        } catch (error) {
          console.error('❌ Google Sign-in Error:', error);
          setErrorMessage(error.message);
          Alert.alert('Google Login Failed', error.message);
        } finally {
          setIsGoogleLoading(false);
        }
      } else if (response?.type === 'error') {
        console.error('❌ Auth Response Error:', response.error);
        setErrorMessage(response.error?.message || 'Authentication failed');
        Alert.alert('Google Login Failed', response.error?.message || 'Authentication failed');
      }
    };

    if (response) {
      handleGoogleSignIn();
    }
  }, [response]);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userEmail = userCredential.user.email || email;
      // Use the same navigation function for consistency, passing the email
      // Pass false as second parameter to indicate this is NOT Google auth
      handleSuccessfulLogin(userEmail, false);
    } catch (error) {
      let message = 'An error occurred.';
      if (error.code === 'auth/invalid-email') message = 'Invalid email address.';
      else if (error.code === 'auth/user-not-found') message = 'User not found.';
      else if (error.code === 'auth/wrong-password') message = 'Wrong password.';
      else if (error.code === 'auth/network-request-failed') message = 'Network error.';
      else message = error.message;

      setErrorMessage(message);
      Alert.alert('Login Error', message);
    }
  };

  const handleGoogleSignIn = () => {
    setIsGoogleLoading(true);
    promptAsync({ showInRecents: true, useProxy: false })
      .catch(error => {
        console.error('❌ Error starting Google Auth:', error);
        setIsGoogleLoading(false);
        setErrorMessage('Failed to start Google sign-in');
        Alert.alert('Error', 'Failed to start Google sign-in');
      });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={handleGoogleSignIn} 
        style={styles.googleButton}
        disabled={!request || isGoogleLoading}
      >
        {isGoogleLoading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.googleText}>Sign in with Google</Text>
        )}
      </TouchableOpacity>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.switchText}>
        <Text>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#f7f7f7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 18,
  },
  googleButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
  },
  googleText: {
    fontSize: 16,
    color: '#333',
  },
  switchText: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default LoginScreen;