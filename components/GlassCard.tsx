import React from 'react';
import { StyleSheet, View } from 'react-native';

interface GlassCardProps {
  children: React.ReactNode;
  width?: number;
  height?: number;
  padding?: number;
  style?: any;
}

const GlassCard = ({ children, width, height, padding = 20, style }: GlassCardProps) => {
  return (
    <View
      style={[
        styles.container,
        {
          width,
          height,
          padding,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});

export default GlassCard;