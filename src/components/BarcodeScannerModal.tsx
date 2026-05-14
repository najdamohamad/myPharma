import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type BarcodeScannerModalProps = {
  visible: boolean;
  onScanned: (barcode: string) => void;
  onClose: () => void;
};

export default function BarcodeScannerModal({
  visible,
  onScanned,
  onClose,
}: BarcodeScannerModalProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [error, setError] = useState<string | null>(null);
  const scannedRef = useRef(false);

  const handleBarcodeScanned = useCallback(
    ({ data }: { data?: string }) => {
      if (scannedRef.current) return;
      const value = data ?? '';
      if (!value.trim()) return;
      scannedRef.current = true;
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      onScanned(value);
    },
    [onScanned]
  );

  if (!visible) return null;

  if (!permission) {
    return (
      <View style={styles.overlay}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.message}>Checking camera...</Text>
        </View>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Camera access needed</Text>
          <Text style={styles.message}>
            MyPharma needs camera access to scan medicine barcodes.
          </Text>
          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onPress={requestPermission}
          >
            <Text style={styles.buttonText}>Allow camera</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.buttonSecondary,
              pressed && styles.buttonPressed,
            ]}
            onPress={onClose}
          >
            <Text style={styles.buttonSecondaryText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.overlay}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        onBarcodeScanned={handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: [
            'ean13',
            'ean8',
            'upc_a',
            'upc_e',
            'code128',
            'code39',
          ],
        }}
      />
      <View style={styles.finder} pointerEvents="none" />
      {error ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
      <View style={styles.footer}>
        <Text style={styles.hint}>Point your camera at the barcode</Text>
        <Pressable
          style={({ pressed }) => [styles.closeButton, pressed && styles.buttonPressed]}
          onPress={onClose}
        >
          <Text style={styles.closeButtonText}>Cancel</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  sheet: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    marginBottom: 12,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSecondaryText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    fontWeight: '600',
  },
  finder: {
    position: 'absolute',
    top: '25%',
    left: '10%',
    right: '10%',
    height: 200,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: 12,
  },
  errorBanner: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255,59,48,0.9)',
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 48,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  hint: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 15,
    marginBottom: 20,
  },
  closeButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});
