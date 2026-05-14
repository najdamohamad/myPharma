import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import BarcodeScannerModal from '@/src/components/BarcodeScannerModal';
import CandidateSelectionModal from '@/src/components/CandidateSelectionModal';
import MedicineCutout from '@/src/components/MedicineCutout';
import type { CabinetItem, CatalogItem } from '@/src/data/catalog';
import { fetchCandidates, type CandidateImage } from '@/src/services/fetchCandidates';
import { lookupBarcode } from '@/src/services/barcodeLookup';

type AddMedicineModalProps = {
  visible: boolean;
  catalogItems: CatalogItem[];
  onSelect: (item: CabinetItem) => void;
  onClose: () => void;
};

function CatalogRow({
  item,
  onPress,
}: {
  item: CatalogItem;
  onPress: () => void;
}) {
  const displayName = item.subtitle
    ? `${item.name} ${item.subtitle}`.trim()
    : item.name;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <View style={styles.thumbnailBox}>
        <MedicineCutout source={item.imageSource} />
      </View>
      <Text style={styles.rowName}>{displayName}</Text>
    </Pressable>
  );
}

export default function AddMedicineModal({
  visible,
  catalogItems,
  onSelect,
  onClose,
}: AddMedicineModalProps) {
  const [scannerVisible, setScannerVisible] = useState(false);
  const [candidateModalVisible, setCandidateModalVisible] = useState(false);
  const [medicineName, setMedicineName] = useState('');
  const [candidates, setCandidates] = useState<CandidateImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBarcodeScanned = useCallback(
    async (barcode: string) => {
      setScannerVisible(false);
      setLoading(true);
      setError(null);
      setCandidateModalVisible(true);
      setMedicineName('');

      try {
        const lookup = await lookupBarcode(barcode);
        if (!lookup.success) {
          setError(lookup.error);
          setLoading(false);
          return;
        }

        setMedicineName(lookup.name);

        const fetchResult = await fetchCandidates(lookup.name);
        setLoading(false);
        if (!fetchResult.success) {
          setError(fetchResult.error);
          return;
        }
        setCandidates(fetchResult.candidates);
      } catch (e) {
        setLoading(false);
        setError(e instanceof Error ? e.message : 'Something went wrong');
      }
    },
    []
  );

  const handleCandidateSelect = useCallback(
    (candidate: CandidateImage) => {
      const newItem: CabinetItem = {
        id: `scanned-${Date.now()}`,
        name: medicineName,
        subtitle: undefined,
        statusDot: null,
        imageSource: { uri: candidate.url },
      };
      onSelect(newItem);
      setCandidateModalVisible(false);
      onClose();
    },
    [medicineName, onSelect, onClose]
  );

  const handleCatalogSelect = useCallback(
    (item: CatalogItem) => {
      const newItem: CabinetItem = {
        id: Date.now().toString(),
        name: item.name,
        subtitle: item.subtitle,
        statusDot: item.statusDot ?? null,
        imageSource: item.imageSource,
      };
      onSelect(newItem);
      onClose();
    },
    [onSelect, onClose]
  );

  if (!visible) {
    return null;
  }

  return (
    <>
      <Modal
        visible={visible && !scannerVisible && !candidateModalVisible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
          <View style={styles.sheet}>
            <View style={styles.handle} />
            <Text style={styles.title}>Add a medicine</Text>

            <Pressable
              style={({ pressed }) => [
                styles.scanRow,
                pressed && styles.rowPressed,
              ]}
              onPress={() => setScannerVisible(true)}
            >
              <View style={styles.scanIconBox}>
                <Text style={styles.scanIcon}>📷</Text>
              </View>
              <View style={styles.scanTextContainer}>
                <Text style={styles.scanRowTitle}>Scan barcode</Text>
                <Text style={styles.scanRowSubtitle}>
                  Point camera at medicine box barcode
                </Text>
              </View>
            </Pressable>

            <Text style={styles.sectionTitle}>Or choose from catalog</Text>
            <FlatList
              data={catalogItems}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <CatalogRow
                  item={item}
                  onPress={() => handleCatalogSelect(item)}
                />
              )}
              style={styles.list}
              contentContainerStyle={styles.listContent}
            />
          </View>
        </View>
      </Modal>

      <BarcodeScannerModal
        visible={scannerVisible}
        onScanned={handleBarcodeScanned}
        onClose={() => setScannerVisible(false)}
      />

      <CandidateSelectionModal
        visible={candidateModalVisible}
        medicineName={medicineName}
        candidates={candidates}
        loading={loading}
        error={error}
        onSelect={handleCandidateSelect}
        onClose={() => setCandidateModalVisible(false)}
      />
    </>
  );
}

const THUMBNAIL_WIDTH = 48;
const THUMBNAIL_HEIGHT = 64;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    marginBottom: 20,
    alignSelf: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  scanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    marginBottom: 8,
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.2)',
  },
  scanIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 122, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanIcon: {
    fontSize: 24,
  },
  scanTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  scanRowTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#007AFF',
  },
  scanRowSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#666',
    marginBottom: 12,
  },
  list: {
    flexGrow: 0,
  },
  listContent: {
    paddingBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  rowPressed: {
    opacity: 0.7,
  },
  thumbnailBox: {
    width: THUMBNAIL_WIDTH,
    height: THUMBNAIL_HEIGHT,
    overflow: 'hidden',
  },
  rowName: {
    fontSize: 17,
    fontWeight: '500',
    color: '#333',
    marginLeft: 16,
  },
});
