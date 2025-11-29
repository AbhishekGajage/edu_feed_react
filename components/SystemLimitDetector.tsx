// components/SystemLimitDetector.tsx
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { useUser } from '../app/lib/providers/UserProvider';

const SystemLimitDetector = () => {
  const { user } = useUser();
  const [lastSessionEnd, setLastSessionEnd] = useState<number | null>(null);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'background') {
        setLastSessionEnd(Date.now());
      } else if (nextAppState === 'active') {
        if (lastSessionEnd) {
          const timeInBackground = Date.now() - lastSessionEnd;
          
          if (timeInBackground < 5000 && (user.timeLimit || 120) < 10) {
            console.log('Possible system time limit detected');
          }
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [lastSessionEnd, user.timeLimit]);

  return null;
};

export default SystemLimitDetector;