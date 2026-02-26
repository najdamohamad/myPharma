import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { ImageSourcePropType } from 'react-native';

import MedicineBox from '@/src/components/MedicineBox';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.65;
const CORNER_RADIUS = 22;

type MedicineDetailsSheetProps = {
  visible: boolean;
  medicineName: string;
  medicineStrength?: string;
  imageSource?: ImageSourcePropType;
  statusDot?: 'red' | 'amber' | 'blue' | null;
  onClose: () => void;
};

function getStatusLabel(statusDot: 'red' | 'amber' | 'blue' | null): string | null {
  switch (statusDot) {
    case 'red':
      return 'Expired';
    case 'amber':
      return 'Expiring soon';
    case 'blue':
      return 'Scheduled';
    default:
      return null;
  }
}

export default function MedicineDetailsSheet({
  visible,
  medicineName,
  medicineStrength,
  imageSource,
  statusDot = null,
  onClose,
}: MedicineDetailsSheetProps) {
  const slideAnim = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const requestClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: SHEET_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  };

  useEffect(() => {
    if (visible) {
      slideAnim.setValue(SHEET_HEIGHT);
      backdropOpacity.setValue(0);
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          friction: 9,
          tension: 65,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0.5,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, backdropOpacity]);

  if (!visible) {
    return null;
  }

  const displayName = medicineStrength
    ? `${medicineName} ${medicineStrength}`
    : medicineName;
  const statusLabel = getStatusLabel(statusDot);

  return (
    <Modal
      visible
      transparent
      animationType="none"
      onRequestClose={requestClose}
    >
      <View style={styles.overlay} pointerEvents="box-none">
        <Animated.View
          style={[styles.backdrop, { opacity: backdropOpacity }]}
          pointerEvents="auto"
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={requestClose} />
        </Animated.View>
        <Animated.View
          style={[
            styles.sheet,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.handle} />
          <View style={styles.boxPreview}>
            <View style={styles.boxWrapper}>
              <MedicineBox
                imageSource={imageSource}
                statusDot={statusDot}
              />
            </View>
          </View>
          <Text style={[styles.medicineName, !statusLabel && styles.medicineNameNoStatus]}>
            {displayName}
          </Text>
          {statusLabel ? (
            <Text style={styles.statusLabel}>{statusLabel}</Text>
          ) : null}
          <View style={styles.buttons}>
            <Pressable
              style={({ pressed }) => [styles.button, styles.buttonPrimary, pressed && styles.buttonPressed]}
              onPress={() => {
                // TODO: Mark as finished - no persistence yet
                requestClose();
              }}
            >
              <Text style={styles.buttonPrimaryText}>Mark as finished</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.button, styles.buttonSecondary, pressed && styles.buttonPressed]}
              onPress={() => {
                // TODO: Remove from cabinet - no persistence yet
                requestClose();
              }}
            >
              <Text style={styles.buttonSecondaryText}>Remove from cabinet</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.button, styles.buttonClose, pressed && styles.buttonPressed]}
              onPress={requestClose}
            >
              <Text style={styles.buttonCloseText}>Close</Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  sheet: {
    height: SHEET_HEIGHT,
    backgroundColor: '#fff',
    borderTopLeftRadius: CORNER_RADIUS,
    borderTopRightRadius: CORNER_RADIUS,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
    alignItems: 'center',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    marginBottom: 20,
  },
  boxPreview: {
    width: 120,
    height: 160,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxWrapper: {
    width: 100,
  },
  medicineName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 4,
  },
  medicineNameNoStatus: {
    marginBottom: 24,
  },
  statusLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  buttons: {
    width: '100%',
    gap: 12,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonPrimary: {
    backgroundColor: '#007AFF',
  },
  buttonPrimaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSecondary: {
    backgroundColor: '#FF3B30',
  },
  buttonSecondaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonClose: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonCloseText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});
