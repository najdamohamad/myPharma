import React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

const STATUS_DOT_COLORS = {
  red: '#E53935',
  amber: '#FFB300',
  blue: '#2196F3',
} as const;

type MedicineBoxProps = {
  onPress?: () => void;
  statusDot?: 'red' | 'amber' | 'blue';
};

export default function MedicineBox({ onPress, statusDot }: MedicineBoxProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.touchable, pressed && styles.touchablePressed]}
      onPress={onPress}
    >
      <View style={styles.shadowWrap}>
        <View style={styles.box}>
          <View style={styles.gradientBase} />
          <View style={styles.gradientShine} />
          <View style={styles.highlightStrip} />
          {statusDot ? (
            <View
              style={[
                styles.statusDot,
                { backgroundColor: STATUS_DOT_COLORS[statusDot] },
              ]}
            />
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  touchable: {
    width: '90%',
    aspectRatio: 0.58,
    alignSelf: 'center',
    maxWidth: 56,
  },
  touchablePressed: {
    opacity: 0.92,
  },
  shadowWrap: {
    flex: 1,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 5,
  },
  box: {
    flex: 1,
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  gradientBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(240, 245, 252, 0.98)',
  },
  gradientShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '55%',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  highlightStrip: {
    position: 'absolute',
    top: 6,
    left: 0,
    bottom: 6,
    width: 2,
    borderTopRightRadius: 1,
    borderBottomRightRadius: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  statusDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
