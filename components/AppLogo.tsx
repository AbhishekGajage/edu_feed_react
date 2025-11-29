import React from 'react';
import { Image, View } from 'react-native';
import { Images } from '../constants/images';

interface AppLogoProps {
  size?: number;
  withText?: boolean;
}

const AppLogo = ({ size = 50, withText = false }: AppLogoProps) => {
  return (
    <View style={{ alignItems: 'center' }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: 16,
          backgroundColor: '#667EEA',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5,
          overflow: 'hidden',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image
          source={Images.appIcon}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      </View>
      {withText && (
        <>
          <View style={{ height: 8 }} />
          <Image
            source={Images.logo}
            style={{ width: size * 2, height: size * 0.6 }}
            resizeMode="contain"
          />
        </>
      )}
    </View>
  );
};

export default AppLogo;