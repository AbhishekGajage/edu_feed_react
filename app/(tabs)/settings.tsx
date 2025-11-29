import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../../constants/color';
import { useUser } from '../lib/providers/UserProvider';

const SettingsScreen = () => {
  const { user, updateUserProfile, logout } = useUser();
  const router = useRouter();

  // Settings states
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoPlayVideos, setAutoPlayVideos] = useState(true);
  const [dataSaver, setDataSaver] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [studyReminders, setStudyReminders] = useState(true);
  const [breakReminders, setBreakReminders] = useState(true);

  const handleNotificationToggle = async (value: boolean) => {
    setNotifications(value);
    await updateUserProfile?.({ notifications: value });
  };

  const handleEmailNotificationToggle = async (value: boolean) => {
    setEmailNotifications(value);
    await updateUserProfile?.({ emailNotifications: value });
  };

  const handlePushNotificationToggle = async (value: boolean) => {
    setPushNotifications(value);
    await updateUserProfile?.({ notifications: value });
  };

  const handleDarkModeToggle = async (value: boolean) => {
    setDarkMode(value);
    // Implement dark mode logic
    Alert.alert('Dark Mode', 'Dark mode settings would be saved');
  };

  const handleFocusModeToggle = async (value: boolean) => {
    setFocusMode(value);
    await updateUserProfile?.({ focusMode: value });
  };

  const handleStudyRemindersToggle = async (value: boolean) => {
    setStudyReminders(value);
    await updateUserProfile?.({ studyReminders: value });
  };

  const handleBreakRemindersToggle = async (value: boolean) => {
    setBreakReminders(value);
    await updateUserProfile?.({ breakReminders: value });
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logout?.();
            router.replace('/login');
          }
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Deleted', 'Your account has been deleted successfully');
            // Clear user data
            router.replace('/login');
          }
        },
      ]
    );
  };

  const SettingItem = ({ 
    title, 
    subtitle, 
    type = 'navigation',
    onPress,
    value,
    onValueChange 
  }: {
    title: string;
    subtitle?: string;
    type?: 'navigation' | 'switch' | 'button';
    onPress?: () => void;
    value?: boolean;
    onValueChange?: (value: boolean) => void;
  }) => (
    <TouchableOpacity 
      style={styles.settingItem}
      onPress={onPress}
      disabled={type === 'switch'}
    >
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      
      {type === 'switch' && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#767577', true: Colors.blueColor }}
          thumbColor={value ? '#f4f3f4' : '#f4f3f4'}
        />
      )}
      
      {type === 'navigation' && (
        <Text style={styles.chevron}>›</Text>
      )}
    </TouchableOpacity>
  );

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Section */}
      <Section title="Profile">
        <SettingItem
          title="Edit Profile"
          subtitle="Update your personal information"
          type="navigation"
          onPress={() => Alert.alert('Edit Profile', 'Profile editing screen would open here')}
        />
        <SettingItem
          title="Change Password"
          subtitle="Update your password"
          type="navigation"
          onPress={() => Alert.alert('Change Password', 'Password change screen would open here')}
        />
        <SettingItem
          title="Privacy Settings"
          subtitle="Control who sees your information"
          type="navigation"
          onPress={() => Alert.alert('Privacy', 'Privacy settings screen would open here')}
        />
      </Section>

      {/* Learning & Progress Section */}
      <Section title="Learning & Progress">
        <SettingItem
          title="Learning Progress"
          subtitle="Track your educational journey"
          type="navigation"
          onPress={() => router.push('../(tabs)/learning-progress')}
        />
        <SettingItem
          title="Screen Time Analytics"
          subtitle="View your app usage patterns"
          type="navigation"
          onPress={() => router.push('../(tabs)/screen-time')}
        />
        <SettingItem
          title="Study Goals"
          subtitle="Set and track your learning goals"
          type="navigation"
          onPress={() => router.push('../app/goals')}
        />
        <SettingItem
          title="Gamified Journey"
          subtitle="Earn badges and level up"
          type="navigation"
          onPress={() => router.push('../components/GamifiedJourney')}
        />
      </Section>

      {/* Advanced Learning Features */}
      <Section title="Advanced Learning">
        <SettingItem
          title="AI Study Companion"
          subtitle="Get personalized learning assistance"
          type="navigation"
          onPress={() => router.push('../components/AiCompanion')}
        />
        <SettingItem
          title="AR Learning"
          subtitle="Interactive augmented reality lessons"
          type="navigation"
          onPress={() => router.push('../components/ArLearning')}
        />
        <SettingItem
          title="Immersive Environments"
          subtitle="Study in virtual environments"
          type="navigation"
          onPress={() => router.push('../components/ImmersiveEnvironments')}
        />
        <SettingItem
          title="Learning Environments"
          subtitle="Customize your study spaces"
          type="navigation"
          onPress={() => router.push('../(tabs)/LearningEnvironments')}
        />
      </Section>

      {/* Wellbeing & Focus Section */}
      <Section title="Wellbeing & Focus">
        <SettingItem
          title="Digital Wellbeing"
          subtitle="Balance your screen time habits"
          type="navigation"
          onPress={() => router.push('../(tabs)/digital-wellbeing')}
        />
        <SettingItem
          title="Break Screen"
          subtitle="Take mindful breaks"
          type="navigation"
          onPress={() => router.push('../(tabs)/break-screen')}
        />
        <SettingItem
          title="Focus Mode"
          subtitle="Minimize distractions during study time"
          type="switch"
          value={focusMode}
          onValueChange={handleFocusModeToggle}
        />
        <SettingItem
          title="Study Reminders"
          subtitle="Get reminders to study"
          type="switch"
          value={studyReminders}
          onValueChange={handleStudyRemindersToggle}
        />
        <SettingItem
          title="Break Reminders"
          subtitle="Get reminders to take breaks"
          type="switch"
          value={breakReminders}
          onValueChange={handleBreakRemindersToggle}
        />
      </Section>

      {/* Notifications Section */}
      <Section title="Notifications">
        <SettingItem
          title="Push Notifications"
          subtitle="Receive push notifications"
          type="switch"
          value={pushNotifications}
          onValueChange={handlePushNotificationToggle}
        />
        <SettingItem
          title="Email Notifications"
          subtitle="Receive email updates"
          type="switch"
          value={emailNotifications}
          onValueChange={handleEmailNotificationToggle}
        />
        <SettingItem
          title="Opportunity Alerts"
          subtitle="Get notified about new opportunities"
          type="switch"
          value={notifications}
          onValueChange={handleNotificationToggle}
        />
      </Section>

      {/* App Preferences Section */}
      <Section title="App Preferences">
        <SettingItem
          title="Dark Mode"
          subtitle="Switch to dark theme"
          type="switch"
          value={darkMode}
          onValueChange={handleDarkModeToggle}
        />
        <SettingItem
          title="Auto-play Videos"
          subtitle="Videos play automatically"
          type="switch"
          value={autoPlayVideos}
          onValueChange={setAutoPlayVideos}
        />
        <SettingItem
          title="Data Saver"
          subtitle="Reduce data usage"
          type="switch"
          value={dataSaver}
          onValueChange={setDataSaver}
        />
        <SettingItem
          title="Language"
          subtitle="English (US)"
          type="navigation"
          onPress={() => Alert.alert('Language', 'Language selection screen would open here')}
        />
      </Section>

      {/* Support Section */}
      <Section title="Support">
        <SettingItem
          title="Help & Support"
          subtitle="Get help with the app"
          type="navigation"
          onPress={() => Alert.alert('Help', 'Help center would open here')}
        />
        <SettingItem
          title="Report a Problem"
          subtitle="Tell us about any issues"
          type="navigation"
          onPress={() => Alert.alert('Report', 'Problem reporting screen would open here')}
        />
        <SettingItem
          title="Terms & Policies"
          subtitle="Terms of service and privacy policy"
          type="navigation"
          onPress={() => Alert.alert('Terms', 'Terms and policies screen would open here')}
        />
      </Section>

      {/* About Section */}
      <Section title="About">
        <SettingItem
          title="App Version"
          subtitle="Version 1.0.0"
          type="navigation"
          onPress={() => Alert.alert('Version', 'EduGram v1.0.0')}
        />
        <SettingItem
          title="Rate App"
          subtitle="Share your feedback"
          type="navigation"
          onPress={() => Alert.alert('Rate App', 'Thank you for your feedback!')}
        />
        <SettingItem
          title="Share App"
          subtitle="Tell your friends about EduGram"
          type="navigation"
          onPress={() => Alert.alert('Share', 'Share functionality would open here')}
        />
      </Section>

      {/* Account Actions Section */}
      <Section title="Account">
        <SettingItem
          title="Linked Accounts"
          subtitle="Manage connected accounts"
          type="navigation"
          onPress={() => Alert.alert('Linked Accounts', 'Account management screen would open here')}
        />
        <SettingItem
          title="Download Your Data"
          subtitle="Export your personal data"
          type="navigation"
          onPress={() => Alert.alert('Download Data', 'Data export started')}
        />
      </Section>

      {/* Danger Zone */}
      <Section title="Danger Zone">
        <SettingItem
          title="Logout"
          subtitle="Sign out of your account"
          type="button"
          onPress={handleLogout}
        />
        <SettingItem
          title="Delete Account"
          subtitle="Permanently delete your account"
          type="button"
          onPress={handleDeleteAccount}
        />
      </Section>

      <View style={styles.footer}>
        <Text style={styles.footerText}>EduGram - Your Educational Social Network</Text>
        <Text style={styles.footerSubtext}>© 2024 EduGram. All rights reserved.</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mobileBackgroundColor,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primaryColor,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.mobileSearchColor,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: Colors.primaryColor,
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: Colors.secondaryColor,
  },
  chevron: {
    fontSize: 20,
    color: Colors.secondaryColor,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    padding: 24,
    marginTop: 16,
  },
  footerText: {
    fontSize: 14,
    color: Colors.secondaryColor,
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: Colors.secondaryColor,
    opacity: 0.7,
  },
});

export default SettingsScreen;