import { Image } from 'expo-image';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type ImageSourcePropType,
} from 'react-native';

type MedicineBoxProps = {
  imageSource?: ImageSourcePropType;
  statusDot?: 'red' | 'amber' | 'blue' | null;
  onPress?: () => void;
};

const STATUS_COLORS = {
  red: '#FF3B30',
  amber: '#FF9500',
  blue: '#007AFF',
} as const;

export default function MedicineBox({
  imageSource,
  statusDot,
  onPress,
}: MedicineBoxProps) {
  const content = (
    <View style={styles.boxContainer}>
      <View style={styles.boxShadow} />
      <View style={styles.box}>
        {imageSource ? (
          <Image
            source={imageSource}
            style={styles.boxImage}
            contentFit="contain"
          />
        ) : (
          <View style={styles.placeholderContainer}>
            <View style={styles.placeholderBase} />
            <View style={styles.placeholderGradient1} />
            <View style={styles.placeholderGradient2} />
            <View style={styles.placeholderLeftEdge} />
            <View style={styles.placeholderTopEdge} />
          </View>
        )}
        {statusDot && (
          <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[statusDot] }]} />
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [pressed && styles.pressed]}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

const BOX_WIDTH = 64;
const BOX_HEIGHT = 80;
const ASPECT_RATIO = BOX_HEIGHT / BOX_WIDTH;

const styles = StyleSheet.create({
  boxContainer: {
    width: BOX_WIDTH,
    height: BOX_HEIGHT,
    aspectRatio: ASPECT_RATIO,
    position: 'relative',
  },
  boxShadow: {
    position: 'absolute',
    left: 2,
    right: -2,
    top: 2,
    bottom: -2,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  box: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
    position: 'relative',
  },
  boxImage: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    backgroundColor: '#F8F8F8',
  },
  placeholderBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F0F0F0',
  },
  placeholderGradient1: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  placeholderGradient2: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '60%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  placeholderLeftEdge: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  placeholderTopEdge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  statusDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
