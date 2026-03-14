import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';

export default function LoginScreen({ navigation, setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Basic mock authentication matching the React web frontend
    if (email === 'admin@gmail.com' && password === 'admin@123') {
      setIsLoggedIn(true);
    } else {
      Alert.alert('Login Failed', 'Invalid credentials. Please use admin@gmail.com / admin@123');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <View style={styles.logoContainer}>
           <Text style={styles.logoIcon}>💧</Text>
           <Text style={styles.logoText}>OrbiPulse</Text>
        </View>
        
        <Text style={styles.subtitle}>Sign in to your account</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="admin@gmail.com"
            placeholderTextColor="#475569"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#475569"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.registerLink} 
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.registerText}>
            Don't have an account? <Text style={styles.registerHighlight}>Create one</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617', justifyContent: 'center' },
  formContainer: { padding: 24, paddingBottom: 60 },
  logoContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 40 },
  logoIcon: { fontSize: 32, marginRight: 8, color: '#10b981' },
  logoText: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 18, color: '#94a3b8', textAlign: 'center', marginBottom: 32 },
  inputContainer: { marginBottom: 20 },
  label: { color: '#cbd5e1', fontSize: 14, fontWeight: '500', marginBottom: 8 },
  input: { 
    backgroundColor: '#0f172a', 
    borderWidth: 1, 
    borderColor: '#334155', 
    borderRadius: 8, 
    padding: 16, 
    color: '#fff',
    fontSize: 16
  },
  button: {
    backgroundColor: '#10b981',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  registerLink: {
    marginTop: 24,
    alignItems: 'center'
  },
  registerText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  registerHighlight: {
    color: '#10b981',
    fontWeight: 'bold',
  }
});
