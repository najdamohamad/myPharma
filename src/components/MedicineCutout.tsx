import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, View, type ImageSourcePropType } from 'react-native';

const STATUS_COLORS = {
  red: '#FF3B30',
  amber: '#FF9500',
  blue: '#007AFF',
} as const;

type MedicineCutoutProps = {
  source: ImageSourcePropType;
  statusDot?: 'blue' | 'red' | 'amber' | null;
};

export default function MedicineCutout({
  source,
  statusDot = null,
}: MedicineCutoutProps) {
  return (
    <View style={styles.outer}>
      <View style={styles.container}>
        <View style={styles.imageWrapper}>
        <Image
          source={source}
          style={styles.image}
          contentFit="contain"
        />
        </View>
        <View style={styles.shadow} />
      {statusDot && (
        <View
          style={[styles.statusDot, { backgroundColor: STATUS_COLORS[statusDot] }]}
        />
      )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    aspectRatio: 3 / 4,
  },
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    overflow: 'hidden',
    paddingBottom: 5,
    position: 'relative',
  },
  shadow: {
    height: 6,
    width: '60%',
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    marginBottom: 2,
  },
  imageWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    minHeight: 0,
    width: '85%',
    maxHeight: '90%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  statusDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 9,
    height: 9,
    borderRadius: 5,
  },
});
