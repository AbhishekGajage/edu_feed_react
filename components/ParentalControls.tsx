// components/ParentalControls.tsx
import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useUser } from '../app/lib/providers/UserProvider';
import { Colors } from '../constants/color';

const ParentalControls = () => {
  const { user, updateUserProfile } = useUser();
  const [parentalCode, setParentalCode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);

  const setTimeLimit = async (minutes: number) => {
    if (parentalCode === '1234') { // Simple demo code
      await updateUserProfile({ timeLimit: minutes });
      Alert.alert('Success', `Time limit set to ${minutes} minutes`);
      setParentalCode('');
    } else {
      Alert.alert('Error', 'Invalid parental code');
    }
  };

  const handleUnlock = () => {
    if (parentalCode === '1234') {
      setIsUnlocked(true);
      setParentalCode('');
    } else {
      Alert.alert('Error', 'Invalid parental code');
    }
  };

  if (!isUnlocked && user?.userType !== 'parent') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Parental Controls</Text>
        <Text style={styles.subtitle}>
          Enter parental code to access controls
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter parental code (1234)"
          placeholderTextColor={Colors.secondaryColor}
          secureTextEntry
          value={parentalCode}
          onChangeText={setParentalCode}
        />
        <TouchableOpacity 
          style={styles.button}
          onPress={handleUnlock}
        >
          <Text style={styles.buttonText}>Unlock Controls</Text>
        </TouchableOpacity>
        <Text style={styles.demoText}>
          Demo Code: 1234
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Time Limits</Text>
      <Text style={styles.subtitle}>
        Set daily screen time limits for better digital wellbeing
      </Text>
      
      <View style={styles.limitsContainer}>
        <TouchableOpacity 
          style={styles.limitButton} 
          onPress={() => setTimeLimit(30)}
        >
          <Text style={styles.limitEmoji}>⏱️</Text>
          <Text style={styles.limitDuration}>30 minutes</Text>
          <Text style={styles.limitDescription}>Quick study session</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.limitButton} 
          onPress={() => setTimeLimit(60)}
        >
          <Text style={styles.limitEmoji}>📚</Text>
          <Text style={styles.limitDuration}>1 hour</Text>
          <Text style={styles.limitDescription}>Standard learning time</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.limitButton} 
          onPress={() => setTimeLimit(120)}
        >
          <Text style={styles.limitEmoji}>🎯</Text>
          <Text style={styles.limitDuration}>2 hours</Text>
          <Text style={styles.limitDescription}>Extended study period</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.lockButton}
        onPress={() => setIsUnlocked(false)}
      >
        <Text style={styles.lockButtonText}>Lock Controls</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mobileBackgroundColor,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primaryColor,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.secondaryColor,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.secondaryColor,
    borderRadius: 12,
    padding: 16,
    color: Colors.primaryColor,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: Colors.blueColor,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  demoText: {
    color: Colors.secondaryColor,
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  limitsContainer: {
    gap: 16,
    marginBottom: 30,
  },
  limitButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  limitEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  limitDuration: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryColor,
    marginBottom: 4,
  },
  limitDescription: {
    fontSize: 14,
    color: Colors.secondaryColor,
    textAlign: 'center',
  },
  lockButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  lockButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ParentalControls;