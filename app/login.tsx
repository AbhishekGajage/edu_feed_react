// app/login.tsx
import { Colors } from '@/constants/color';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useUser } from './lib/providers/UserProvider';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();
  
  const { user, login, register } = useUser();

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    if (isRegistering && !username) {
      Alert.alert('Error', 'Please enter a username');
      return;
    }

    setLoading(true);
    try {
      if (isRegistering) {
        console.log('🔄 Registering...', email);
        await register(email, password, { username, role: 'student' });
        Alert.alert('Success', 'Account created successfully!');
      } else {
        console.log('🔄 Logging in...', email);
        await login(email, password);
      }
      
      // Wait for state to update, then navigate
      setTimeout(() => {
        console.log('✅ Auth successful, navigating to tabs...');
        router.replace('/(tabs)');
      }, 100);
      
    } catch (error: any) {
      console.error('❌ Auth failed:', error);
      Alert.alert(isRegistering ? 'Registration Failed' : 'Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (role: string) => {
    setEmail(`${role}@edugram.com`);
    setPassword('password123');
    setIsRegistering(false);
  };

  const toggleAuthMode = () => {
    setIsRegistering(!isRegistering);
    setUsername('');
    setEmail('');
    setPassword('');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoContainer}>
             <Image 
              source={require('@/assets/images/logo.png')} 
              style={styles.logoImage}
            /> 
            </View>
            <Text style={styles.appName}>Edu-Feed</Text>
          </View>
          <Text style={styles.tagline}>Learn • Share • Grow</Text>
        </View>

        {/* Auth Form */}
        <View style={styles.formContainer}>
          <Text style={styles.welcomeTitle}>
            {isRegistering ? 'Create Account' : 'Welcome Back!'}
          </Text>
          <Text style={styles.welcomeSubtitle}>
            {isRegistering ? 'Join our learning community' : 'Sign in to continue your learning journey'}
          </Text>

          {/* Username Input (Register only) */}
          {isRegistering && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput
                style={styles.input}
                placeholder="Choose a username"
                placeholderTextColor="#999"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoComplete="username"
              />
            </View>
          )}

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Enter your password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoComplete="password"
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
            {isRegistering && (
              <Text style={styles.passwordHint}>
                Use &quot;password123&quot; for demo accounts
              </Text>
            )}
          </View>

          {/* Auth Button */}
          <TouchableOpacity 
            style={[styles.authButton, loading && styles.authButtonDisabled]}
            onPress={handleAuth}
            disabled={loading}
          >
            <Text style={styles.authButtonText}>
              {loading ? (
                isRegistering ? 'Creating Account...' : 'Signing In...'
              ) : (
                isRegistering ? 'Create Account' : 'Sign In'
              )}
            </Text>
          </TouchableOpacity>

          {/* Toggle Auth Mode */}
          <TouchableOpacity 
            style={styles.toggleAuthButton}
            onPress={toggleAuthMode}
          >
            <Text style={styles.toggleAuthText}>
              {isRegistering 
                ? 'Already have an account? Sign In' 
                : "Don't have an account? Sign Up"
              }
            </Text>
          </TouchableOpacity>

          {/* Quick Login Buttons (Only show on login) */}
          {!isRegistering && (
            <View style={styles.quickLoginSection}>
              <Text style={styles.quickLoginTitle}>Quick Demo Access</Text>
              
              <View style={styles.quickLoginGrid}>
                <TouchableOpacity 
                  style={[styles.quickButton, styles.teacherButton]}
                  onPress={() => handleQuickLogin('teacher')}
                  disabled={loading}
                >
                  <Text style={styles.quickButtonIcon}>👨‍🏫</Text>
                  <Text style={styles.quickButtonText}>Teacher</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.quickButton, styles.studentButton]}
                  onPress={() => handleQuickLogin('student')}
                  disabled={loading}
                >
                  <Text style={styles.quickButtonIcon}>🎓</Text>
                  <Text style={styles.quickButtonText}>Student</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.quickButton, styles.authenticatorButton]}
                  onPress={() => handleQuickLogin('authenticator')}
                  disabled={loading}
                >
                  <Text style={styles.quickButtonIcon}>🔍</Text>
                  <Text style={styles.quickButtonText}>Moderator</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Features Section - 2x2 Grid */}
          <View style={styles.featuresSection}>
            <Text style={styles.featuresTitle}>Why Choose EduGram?</Text>
            <View style={styles.featuresGrid}>
              {/* Row 1 */}
              <View style={styles.featureRow}>
                <View style={styles.featureItem}>
                  <Text style={styles.featureIcon}>📚</Text>
                  <Text style={styles.featureText}>Educational Content</Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureIcon}>👥</Text>
                  <Text style={styles.featureText}>Community Learning</Text>
                </View>
              </View>
              
              {/* Row 2 */}
              <View style={styles.featureRow}>
                <View style={styles.featureItem}>
                  <Text style={styles.featureIcon}>🛡️</Text>
                  <Text style={styles.featureText}>Safe Environment</Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureIcon}>⚡</Text>
                  <Text style={styles.featureText}>Quick Access</Text>
                </View>
              </View>

              {/* Row 3 (Additional features) */}
              <View style={styles.featureRow}>
                <View style={styles.featureItem}>
                  <Text style={styles.featureIcon}>🎯</Text>
                  <Text style={styles.featureText}>Goal Tracking</Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureIcon}>💼</Text>
                  <Text style={styles.featureText}>Opportunities</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By {isRegistering ? 'creating an account' : 'signing in'}, you agree to our{' '}
              <Text style={styles.linkText}>Terms of Service</Text> and{' '}
              <Text style={styles.linkText}>Privacy Policy</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mobileBackgroundColor,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: Colors.blueColor,
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoImage: {
    width: 140,
    height: 140,
    marginRight: 15,
    borderRadius: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  formContainer: {
    flex: 1,
    padding: 25,
    paddingTop: 40,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primaryColor,
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: Colors.secondaryColor,
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primaryColor,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    fontSize: 16,
    color: Colors.primaryColor,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  passwordHint: {
    fontSize: 12,
    color: Colors.secondaryColor,
    marginTop: 6,
    fontStyle: 'italic',
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 4,
  },
  eyeIcon: {
    fontSize: 20,
  },
  authButton: {
    backgroundColor: Colors.blueColor,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    shadowColor: Colors.blueColor,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  authButtonDisabled: {
    opacity: 0.6,
  },
  authButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  toggleAuthButton: {
    alignItems: 'center',
    padding: 16,
    marginBottom: 30,
  },
  toggleAuthText: {
    color: Colors.blueColor,
    fontSize: 16,
    fontWeight: '600',
  },
  quickLoginSection: {
    marginBottom: 40,
  },
  quickLoginTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primaryColor,
    textAlign: 'center',
    marginBottom: 20,
  },
  quickLoginGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },
  teacherButton: {
    borderColor: '#FF9500',
    backgroundColor: '#FFF4E6',
  },
  studentButton: {
    borderColor: '#34C759',
    backgroundColor: '#E6F4EA',
  },
  authenticatorButton: {
    borderColor: '#007AFF',
    backgroundColor: '#E6F2FF',
  },
  quickButtonIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primaryColor,
    textAlign: 'center',
  },
  featuresSection: {
    marginBottom: 30,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primaryColor,
    textAlign: 'center',
    marginBottom: 20,
  },
  featuresGrid: {
    // This will create proper 2x2 grid
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  featureItem: {
    width: '48%',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  featureIcon: {
    fontSize: 28,
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryColor,
    textAlign: 'center',
    lineHeight: 18,
  },
  footer: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  footerText: {
    fontSize: 12,
    color: Colors.secondaryColor,
    textAlign: 'center',
    lineHeight: 16,
  },
  linkText: {
    color: Colors.blueColor,
    fontWeight: '600',
  },
});