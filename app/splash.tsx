import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
  const router = useRouter();
  
  // Animation values for each piece
  const piece1 = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const piece2 = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const piece3 = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const piece4 = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const scaleAnim = useRef(new Animated.Value(1)).current; // Scale animation
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // End positions for each corner - make them go further
    const endPositions = [
      { x: -width/1.5, y: -height/1.5 }, // top-left - go further
      { x: width/1.5, y: -height/1.5 },  // top-right - go further
      { x: -width/1.5, y: height/1.5 },  // bottom-left - go further
      { x: width/1.5, y: height/1.5 }    // bottom-right - go further
    ];

    Animated.parallel([
      Animated.timing(piece1, {
        toValue: endPositions[0],
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(piece2, {
        toValue: endPositions[1],
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(piece3, {
        toValue: endPositions[2],
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(piece4, {
        toValue: endPositions[3],
        duration: 1200,
        useNativeDriver: true,
      }),
      // Scale up while splitting
      Animated.timing(scaleAnim, {
        toValue: 1.8, // Scale up to 1.8x size
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        delay: 1000,
        useNativeDriver: true,
      })
    ]).start();

    setTimeout(() => {
      router.replace('/login');
    }, 1800);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.fullScreen, { opacity }]}>
        {/* Piece 1 - Top Left Quarter */}
        <Animated.View style={[
          styles.piece,
          styles.topLeft,
          { 
            transform: [
              ...piece1.getTranslateTransform(),
              { scale: scaleAnim }
            ] 
          }
        ]}>
          <Image 
            source={require('../assets/images/logo.png')}
            style={[styles.logoImage, styles.topLeftClip]}
          />
        </Animated.View>

        {/* Piece 2 - Top Right Quarter */}
        <Animated.View style={[
          styles.piece,
          styles.topRight,
          { 
            transform: [
              ...piece2.getTranslateTransform(),
              { scale: scaleAnim }
            ] 
          }
        ]}>
          <Image 
            source={require('../assets/images/logo.png')}
            style={[styles.logoImage, styles.topRightClip]}
          />
        </Animated.View>

        {/* Piece 3 - Bottom Left Quarter */}
        <Animated.View style={[
          styles.piece,
          styles.bottomLeft,
          { 
            transform: [
              ...piece3.getTranslateTransform(),
              { scale: scaleAnim }
            ] 
          }
        ]}>
          <Image 
            source={require('../assets/images/logo.png')}
            style={[styles.logoImage, styles.bottomLeftClip]}
          />
        </Animated.View>

        {/* Piece 4 - Bottom Right Quarter */}
        <Animated.View style={[
          styles.piece,
          styles.bottomRight,
          { 
            transform: [
              ...piece4.getTranslateTransform(),
              { scale: scaleAnim }
            ] 
          }
        ]}>
          <Image 
            source={require('../assets/images/logo.png')}
            style={[styles.logoImage, styles.bottomRightClip]}
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  fullScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  piece: {
    position: 'absolute',
    width: 120, // Increased from 80 to 120
    height: 120, // Increased from 80 to 120
    overflow: 'hidden',
  },
  topLeft: {
    top: '50%',
    left: '50%',
    marginTop: -120, // Adjusted for new size
    marginLeft: -120, // Adjusted for new size
  },
  topRight: {
    top: '50%',
    left: '50%',
    marginTop: -120, // Adjusted for new size
    marginLeft: 0,
  },
  bottomLeft: {
    top: '50%',
    left: '50%',
    marginTop: 0,
    marginLeft: -120, // Adjusted for new size
  },
  bottomRight: {
    top: '50%',
    left: '50%',
    marginTop: 0,
    marginLeft: 0,
  },
  logoImage: {
    width: 240, // Double the piece size (120 * 2)
    height: 240,
    position: 'absolute',
  },
  topLeftClip: {
    top: 0,
    left: 0,
  },
  topRightClip: {
    top: 0,
    left: -120, // Shift left to show right half
  },
  bottomLeftClip: {
    top: -120, // Shift up to show bottom half
    left: 0,
  },
  bottomRightClip: {
    top: -120,
    left: -120,
  },
});

export default SplashScreen;