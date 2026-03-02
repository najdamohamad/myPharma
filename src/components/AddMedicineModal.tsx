import React from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import MedicineCutout from '@/src/components/MedicineCutout';
import type { CatalogItem } from '@/src/data/catalog';

type AddMedicineModalProps = {
  visible: boolean;
  catalogItems: CatalogItem[];
  onSelect: (item: CatalogItem) => void;
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
  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Add a medicine</Text>
          <FlatList
            data={catalogItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CatalogRow
                item={item}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              />
            )}
            style={styles.list}
            contentContainerStyle={styles.listContent}
          />
        </View>
      </View>
    </Modal>
  );
}

const THUMBNAIL_WIDTH = 48;
const THUMBNAIL_HEIGHT = 64; // 3:4 aspect ratio

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
