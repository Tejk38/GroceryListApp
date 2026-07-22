import React, { Component } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import emailjs from '@emailjs/browser';

export class Mailsender extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sending: false,
      success: false,
      error: null,
      debugMessage: ''
    };
  }



componentDidMount() {
  this.setState({ debugMessage: 'Mailsender Mounted' });

  // Initialize EmailJS with your public key
  try {
    emailjs.init('XMHLLcP2eD9SVUojR');
    this.setState({ debugMessage: this.state.debugMessage + '\nEmailJS Initialized with key: XMHLLcP2eD9SVUojR' });
  } catch (initError) {
    const errorMessage = `EmailJS Initialization Error: ${initError.message || initError}`;
    console.error(errorMessage);
    this.setState({
      error: errorMessage,
      sending: false,
      debugMessage: this.state.debugMessage + `\n${errorMessage}`
    }, () => Alert.alert("EmailJS Init Error", this.state.error));
    return;
  }

  const { route } = this.props;
  const userEmail = route?.params?.userEmail || '';
  const username = route?.params?.username || '';

  // Add debug logs to see what's being received
  console.log('📧 Received route params:', route?.params);
  console.log('📧 Extracted email:', userEmail);
  console.log('📧 Extracted username:', username);

  this.setState({ userEmail, username, debugMessage: this.state.debugMessage + `\nReceived email: ${userEmail}, username: ${username}` });

  if (userEmail && username) {
    this.sendEmail(userEmail, username);
  } else {
    const noParamsMessage = `No email or username found in params. Email: "${userEmail}", Username: "${username}"`;
    console.error(noParamsMessage);
    this.setState({
      error: noParamsMessage,
      sending: false,
      debugMessage: this.state.debugMessage + `\n${noParamsMessage}`
    }, () => Alert.alert("Missing Data", this.state.error));
  }
}

sendEmail = (userEmail, username) => {
  console.log('📧 STARTING EMAIL SEND PROCESS');
  console.log(`📧 Recipient: ${userEmail}, Username: ${username}`);
  
  // Check if email is valid before proceeding
  if (!userEmail || userEmail.trim() === '') {
    const errorMessage = "Cannot send email: recipient email address is empty";
    console.error(errorMessage);
    this.setState({
      sending: false,
      error: errorMessage,
      debugMessage: this.state.debugMessage + `\n${errorMessage}`
    }, () => {
      Alert.alert("Email Error", errorMessage);
      setTimeout(this.continueToApp, 1500);
    });
    return;
  }
  
  this.setState({ sending: true, debugMessage: this.state.debugMessage + '\nStarting sendEmail' });

  const templateParams = {
    to_email: userEmail.trim(),  // Ensure email is trimmed
    to_name: username || userEmail.split('@')[0],
    message: "Welcome!"
  };

  console.log(`📧 Template params: ${JSON.stringify(templateParams, null, 2)}`);

  const serviceId = 'service_9z920c9'; 
  const templateId = 'template_9gxymla'; 

  this.setState({ 
    debugMessage: this.state.debugMessage + 
    `\nEmailJS send call: Service ID: ${serviceId}, Template ID: ${templateId}, Params: ${JSON.stringify(templateParams)}` 
  });

  
  
    emailjs.send(serviceId, templateId, templateParams)
      .then(
        (response) => {
          const successMessage = `Email sent successfully! Status: ${response.status}, Text: ${response.text}`;
          console.log('✅ EMAIL SENT SUCCESSFULLY');
          console.log(`✅ Status: ${response.status}, Response: ${JSON.stringify(response)}`);
          this.setState({
            sending: false,
            success: true,
            debugMessage: this.state.debugMessage + `\n${successMessage}`
          }, () => {
            Alert.alert("Email Sent", "Your welcome email has been sent!");
            setTimeout(this.continueToApp, 1000);
          });
        },
        (err) => {
          const errorMessage = `Email sending failed: ${err.message || err.text || err}`;
          console.error('❌ EMAIL SENDING FAILED');
          console.error('❌ Error details:', err);
          console.error(`❌ Message: ${err.message || 'No message'}`);
          console.error(`❌ Text: ${err.text || 'No text'}`);
          this.setState({
            sending: false,
            error: errorMessage,
            debugMessage: this.state.debugMessage + `\n${errorMessage}`
          }, () => {
            Alert.alert("Email Send Failed", this.state.error);
            setTimeout(this.continueToApp, 1500);
          });
        }
      );
  };

  continueToApp = () => {
    this.props.navigation.reset({
      index: 0,
      routes: [{ name: 'ProductList' }]
    });
  };

  render() {
    const { sending, success, error, debugMessage, userEmail, username } = this.state;

    return (
      <View style={styles.container}>
        {sending ? (
          <View style={styles.container}>
            <ActivityIndicator size="large" color="#007bff" />
            <Text style={styles.text}>Sending welcome email...</Text>
            <Text style={styles.debugText}>{debugMessage}</Text>
          </View>
        ) : (
          <View style={styles.container}>
            {success ? (
              <Text style={styles.successText}>Welcome email sent successfully!</Text>
            ) : (
              <Text style={styles.errorText}>{error || "Something went wrong with the email"}</Text>
            )}
            <Text style={styles.redirectText}>Redirecting to products...</Text>
            <Text style={styles.debugText}>{debugMessage}</Text>
             {userEmail && <Text style={styles.debugText}>Email: {userEmail}</Text>}
            {username && <Text style={styles.debugText}>Username: {username}</Text>}
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    padding: 20
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: '#333'
  },
  successText: {
    fontSize: 18,
    color: 'green',
    marginBottom: 10
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginBottom: 10
  },
  redirectText: {
    fontSize: 14,
    color: '#666',
    marginTop: 10
  },
  debugText: {
    fontSize: 12,
    color: '#888',
    marginTop: 10,
    fontFamily: 'monospace',
  },
});

export default Mailsender;
