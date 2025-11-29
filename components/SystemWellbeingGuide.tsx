// components/SystemWellbeingGuide.tsx
import React from 'react';
import {
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Colors } from '../constants/color';

const SystemWellbeingGuide = () => {
  const openSystemSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('App-Prefs:SCREEN_TIME');
    } else {
      Linking.openSettings();
    }
  };

  const getPlatformTips = () => {
    if (Platform.OS === 'ios') {
      return [
        'Go to Settings → Screen Time → App Limits',
        'Set daily time limits for app categories',
        'Use Downtime to schedule screen-free time'
      ];
    } else {
      return [
        'Go to Settings → Digital Wellbeing → Dashboard',
        'Set app timers for specific applications',
        'Use Focus mode to minimize distractions'
      ];
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>System-Level Screen Time Management</Text>
      <Text style={styles.description}>
        For comprehensive control over all your apps, use your device&apos;s built-in digital wellbeing features:
      </Text>

      {getPlatformTips().map((tip, index) => (
        <View key={index} style={styles.tip}>
          <Text style={styles.tipNumber}>{index + 1}.</Text>
          <Text style={styles.tipText}>{tip}</Text>
        </View>
      ))}

      <TouchableOpacity style={styles.button} onPress={openSystemSettings}>
        <Text style={styles.buttonText}>
          Open {Platform.OS === 'ios' ? 'Screen Time' : 'Digital Wellbeing'} Settings
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors.mobileBackgroundColor,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primaryColor,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: Colors.secondaryColor,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  tip: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  tipNumber: {
    fontWeight: 'bold',
    color: Colors.blueColor,
    marginRight: 8,
    fontSize: 14,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: Colors.primaryColor,
    lineHeight: 20,
  },
  button: {
    backgroundColor: Colors.blueColor,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SystemWellbeingGuide;