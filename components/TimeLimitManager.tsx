// components/TimeLimitManager.tsx
import { usePathname, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, BackHandler } from 'react-native';
import { useUser } from '../app/lib/providers/UserProvider';

const TimeLimitManager = () => {
  const { user, updateUserProfile } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [consecutiveShortSessions, setConsecutiveShortSessions] = useState(0);

  useEffect(() => {
    // Check if time limit is reached and user is not already on break screen
    if (user.timeLimit <= 0 && pathname !== '/break-screen') {
      console.log('Time limit reached, navigating to break screen');
      router.replace('../break-screen');
    }
  }, [user.timeLimit, pathname, router]);

  // Prevent going back from break screen
  useEffect(() => {
    if (pathname === '../break-screen') {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        Alert.alert(
          'Break Time',
          'Your daily time limit has been reached. Take a break and come back tomorrow!',
          [{ text: 'OK' }]
        );
        return true;
      });

      return () => backHandler.remove();
    }
  }, [pathname]);

  // Check for system limits
  useEffect(() => {
    const checkForSystemLimits = () => {
      if (user.timeLimit < 5 && consecutiveShortSessions > 3) {
        Alert.alert(
          'System Time Limit Detected',
          'It looks like you might have system-level time limits enabled for EduGram. ' +
          'We recommend adjusting your internal EduGram limits to match your system settings.',
          [
            {
              text: 'Adjust Limits',
              onPress: () => router.push('../time-settings')
            },
            {
              text: 'Dismiss'
            }
          ]
        );
      }
    };

    checkForSystemLimits();
  }, [consecutiveShortSessions, user.timeLimit, router]);

  return null;
};

export default TimeLimitManager;