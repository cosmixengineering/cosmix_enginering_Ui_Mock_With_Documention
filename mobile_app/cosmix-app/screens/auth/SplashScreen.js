import React, { useEffect } from 'react';
import { View, StyleSheet, Image, StatusBar, SafeAreaView, Animated } from 'react-native';

export default function SplashScreen({ navigation }) {
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#242b5f" />
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
        <Image source={require('../../assets/cosmix-logo.png')} style={styles.logo} resizeMode="contain" />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#242b5f', alignItems: 'center', justifyContent: 'center' },
  logoContainer: { width: 200, height: 200, backgroundColor: '#ffffff', borderRadius: 100, alignItems: 'center', justifyContent: 'center', padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 8 },
  logo: { width: '80%', height: '80%' }
});
