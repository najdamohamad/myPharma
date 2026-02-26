import React from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';

const SLOT_COUNT = 5;
const WRAPPER_MARGIN_H = 16;
const GAP_BETWEEN_SLOTS = 8;

function getSlotWidth(): number {
  const screenWidth = Dimensions.get('window').width;
  const availableWidth = screenWidth - WRAPPER_MARGIN_H * 2;
  const totalGapSpace = (SLOT_COUNT - 1) * GAP_BETWEEN_SLOTS;
  return Math.floor((availableWidth - totalGapSpace) / SLOT_COUNT);
}

type CabinetShelfProps = {
  slots: React.ReactNode[];
  style?: ViewStyle;
};

export default function CabinetShelf({ slots, style }: CabinetShelfProps) {
  const normalized = [...slots];
  while (normalized.length < SLOT_COUNT) {
    normalized.push(null);
  }
  const slotsToRender = normalized.slice(0, SLOT_COUNT);
  const slotWidth = getSlotWidth();

  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.slotsRow}>
        {slotsToRender.map((slot, index) => (
          <View
            key={index}
            style={[
              styles.slot,
              {
                width: slotWidth,
                marginRight: index === SLOT_COUNT - 1 ? 0 : GAP_BETWEEN_SLOTS,
              },
            ]}
          >
            {slot}
          </View>
        ))}
      </View>
      <View style={styles.glassWrapper}>
        <View style={styles.glassShadow} />
        <View style={styles.glassBar}>
          <View style={styles.glassShine} />
          <View style={styles.glassHighlight} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  slotsRow: {
    flexDirection: 'row',
    width: '100%',
  },
  slot: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 12,
    paddingBottom: 6,
    paddingHorizontal: 0,
    minHeight: 56,
    overflow: 'hidden',
  },
  glassWrapper: {
    width: '100%',
    position: 'relative',
  },
  glassShadow: {
    position: 'absolute',
    left: 6,
    right: 6,
    top: 14,
    height: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  glassBar: {
    width: '100%',
    height: 14,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    overflow: 'hidden',
    position: 'relative',
  },
  glassHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  glassShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '45%',
    height: '100%',
    borderTopLeftRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
});
