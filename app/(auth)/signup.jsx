import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import ThemedButton from '../../components/ThemedButton'
import { Colors } from '../../constants/Colors'



const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    console.log('Sign up pressed')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up for XP List</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#8b7b9e"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#8b7b9e"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#8b7b9e"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#8b7b9e"
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
      />
      <ThemedButton onPress={handleSubmit}>
        <Text style={{ color: Colors.buttonText }}>Signup</Text>
      </ThemedButton>

      

      <Link href="/login" style={[styles.link, { marginTop: 100}]}>Already have an account? Login</Link>
      <Link href="/" style={styles.link}>Home</Link>
      
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#2c2137', padding: 24,
  },
  title: {
    color: '#ffd700', fontSize: 22, fontWeight: 'bold', marginBottom: 24,
  },
  input: {
    width: '100%', maxWidth: 320, backgroundColor: '#3a2f4c', color: '#fff',
    borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16,
  },
  btn: {
    backgroundColor: '#ffd700', borderRadius: 8, padding: 12, width: '100%', maxWidth: 320, alignItems: 'center', marginBottom: 16,
  },
  btnText: {
    color: '#2c2137', fontWeight: 'bold', fontSize: 16,
  },
  link: {
    color: '#ffd700', marginTop: 8, textDecorationLine: 'underline',
  },
  error: {
    color: '#d32f2f', marginBottom: 12,
  },
});