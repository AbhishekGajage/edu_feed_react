// components/BreakReminder.tsx
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useUser } from '../app/lib/providers/UserProvider';

const BreakReminder = () => {
  const { user } = useUser();
  const [lastBreakTime, setLastBreakTime] = useState(Date.now());

  useEffect(() => {
    const breakInterval = setInterval(() => {
      const timeSinceBreak = Date.now() - lastBreakTime;
      const hoursSinceBreak = timeSinceBreak / (1000 * 60 * 60);

      if (hoursSinceBreak >= 1) { // Remind every hour
        Alert.alert(
          'Time for a Break!',
          'You have been using the app for a while. Consider taking a 5-minute break.',
          [
            { text: 'Take Break', onPress: () => setLastBreakTime(Date.now()) },
            { text: 'Later' }
          ]
        );
      }
    }, 60 * 60 * 1000); // Check every hour

    return () => clearInterval(breakInterval);
  }, [lastBreakTime]);

  return null;
};