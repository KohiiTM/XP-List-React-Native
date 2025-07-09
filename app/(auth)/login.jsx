import React, { useState } from 'react';
import { Keyboard, TouchableWithoutFeedback, StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors'
import { useUser } from '../../hooks/useUser'



import ThemedButton from '../../components/ThemedButton'
import ThemedView from '../../components/ThemedView'
import Spacer from '../../components/Spacer'


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();


  const { login } = useUser()


  const handleSubmit = async () => {
    setError(null)

    try {
      await login(email, password)
    } catch (error) {
      setError(error?.message || String(error) || "Unknown error");
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.container}>
        <Text style={styles.title}>Login to XP List</Text>
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

        <ThemedButton onPress={handleSubmit}>
          <Text style={{ color: Colors.buttonText }}>Login</Text>
        </ThemedButton>

        <Spacer />
        {error && <Text style={styles.error}>{error}</Text>}

        
        <Link href="/" style={styles.link}>Home</Link>
        
        <Link href="/signup" style={[styles.link, { marginTop: 100}]}>Don't have an account? Sign up</Link>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
};

export default Login;

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
  pressed: {
    opacity: 0.8
  },
  link: {
    color: '#ffd700', marginTop: 8, textDecorationLine: 'underline',
  },
  error: {
    color: '#d32f2f',
    marginBottom: 12,
    padding: 10,
    borderWidth: 1,
    borderRadius: 15,
    marginHorizontal: 10,
    backgroundColor: '#f5c1c8'
  },
});

/*
    background: "#2c2137",
    card: "#4a3f5c",
    secondary: "#3a2f4c",
    border: "#8b7b9e",
    accent: "#ffd700",
    text: "#fff",
    textSecondary: "#8b7b9e",
    easy: "#8bc34a",
    medium: "#ff9800",
    hard: "#d32f2f",
    error: "#d32f2f",
    success: "#4caf50",
    info: "#2196f3",
    sidebar: "#4a3f5c",
    spriteBg: "#3a2f4c",
    xpBar: "#ffd700",
    xpBarBg: "#3a2f4c",
    button: "#ffd700",
    buttonText: "#2c2137",
    toastBg: "#3a2f4c",
    toastText: "#fff",
  },
  */