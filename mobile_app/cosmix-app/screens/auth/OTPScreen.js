import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function OTPScreen({ navigation }) {
  const [code, setCode] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardView}
      >
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#242b5f" />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Verification</Text>
            <Text style={styles.subtitle}>Enter the 4-digit code sent to your phone</Text>
          </View>

          <View style={styles.form}>
            <TextInput 
              style={styles.input}
              placeholder="0 0 0 0"
              keyboardType="number-pad"
              value={code}
              onChangeText={setCode}
              maxLength={4}
              textAlign="center"
            />
            
            <TouchableOpacity 
              style={[styles.button, code.length < 4 && styles.buttonDisabled]}
              disabled={code.length < 4}
              onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Selector' }] })}
            >
              <Text style={styles.buttonText}>Verify & Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  keyboardView: { flex: 1 },
  headerBar: { padding: 20 },
  content: { flex: 1, padding: 24, paddingTop: 40 },
  header: { marginBottom: 40, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '800', color: '#242b5f', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#6b7280', textAlign: 'center' },
  form: { width: '100%' },
  input: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 16, fontSize: 32, fontWeight: '700', color: '#1f2937', marginBottom: 24, letterSpacing: 10 },
  button: { backgroundColor: '#242b5f', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#9ca3af' },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' }
});
