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
      <View style={styles.shelfShadow} />
      <View style={styles.boxRow}>
        <View style={styles.frontFace}>
          <View style={styles.topHighlight} />
          {imageSource ? (
            <Image
              source={imageSource}
              style={styles.boxImage}
              contentFit="contain"
            />
          ) : (
            <View style={styles.placeholderContainer}>
              <View style={styles.placeholderLeftEdge} />
              <View style={styles.placeholderMain}>
                <View style={styles.placeholderTopEdge} />
                <View style={styles.placeholderGradientRow}>
                  <View style={styles.placeholderGradient1} />
                  <View style={styles.placeholderGradient2} />
                </View>
              </View>
            </View>
          )}
          {statusDot && (
            <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[statusDot] }]} />
          )}
        </View>
        <View style={styles.rightSideFace} />
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.slotChild, pressed && styles.pressed]}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={styles.slotChild}>{content}</View>;
}

const ASPECT_RATIO = 3 / 4;

const styles = StyleSheet.create({
  boxContainer: {
    width: '100%',
    aspectRatio: ASPECT_RATIO,
    position: 'relative',
  },
  shelfShadow: {
    position: 'absolute',
    left: -4,
    right: -4,
    bottom: -4,
    height: 6,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
  },
  boxRow: {
    flex: 1,
    flexDirection: 'row',
    minHeight: 0,
  },
  frontFace: {
    flex: 1,
    borderRadius: 4,
    backgroundColor: '#fdfdfd',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    overflow: 'hidden',
    position: 'relative',
  },
  topHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 1,
  },
  rightSideFace: {
    width: 7,
    marginLeft: -1,
    backgroundColor: '#e6e6e6',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  boxImage: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 4,
  },
  placeholderContainer: {
    width: '100%',
    flex: 1,
    minHeight: 0,
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
  },
  placeholderLeftEdge: {
    width: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  placeholderMain: {
    flex: 1,
    minHeight: 0,
  },
  placeholderTopEdge: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  placeholderGradientRow: {
    flex: 1,
    minHeight: 0,
    flexDirection: 'row',
  },
  placeholderGradient1: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  placeholderGradient2: {
    flex: 0.67,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
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
  slotChild: {
    width: '100%',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
