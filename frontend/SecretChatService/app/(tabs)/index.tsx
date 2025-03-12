import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { BackHandler } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);


  useEffect(() => {
    const backAction = () => {
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (isMounted) {
      router.replace('/login');
    }
  }, [isMounted]);

  return null;
}
