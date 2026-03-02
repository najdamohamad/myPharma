import React, { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AddMedicineModal from '@/src/components/AddMedicineModal';
import CabinetShelf from '@/src/components/CabinetShelf';
import MedicineCutout from '@/src/components/MedicineCutout';
import MedicineDetailsSheet from '@/src/components/MedicineDetailsSheet';
import { catalogItems, type CabinetItem } from '@/src/data/catalog';

const ROOM_BG = '#EEF1F4';
const SHELF_COUNT = 8;
const SLOTS_PER_SHELF = 5;
const TOTAL_SLOTS = SHELF_COUNT * SLOTS_PER_SHELF;

function buildShelvesSlots(
  cabinetItems: CabinetItem[],
  onItemPress: (item: CabinetItem) => void
): ReactNode[][] {
  const slots: ReactNode[] = [];
  for (let i = 0; i < TOTAL_SLOTS; i++) {
    const item = cabinetItems[i] ?? null;
    if (item) {
      slots.push(
        <Pressable
          key={item.id}
          onPress={() => onItemPress(item)}
          style={({ pressed }) => [
            { width: '100%', opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <MedicineCutout
            source={item.imageSource}
            statusDot={item.statusDot ?? null}
          />
        </Pressable>
      );
    } else {
      slots.push(null);
    }
  }
  const shelvesSlots: ReactNode[][] = [];
  for (let s = 0; s < SHELF_COUNT; s++) {
    shelvesSlots.push(
      slots.slice(s * SLOTS_PER_SHELF, (s + 1) * SLOTS_PER_SHELF)
    );
  }
  return shelvesSlots;
}

export default function CabinetScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const [viewportH, setViewportH] = useState(0);
  const [contentH, setContentH] = useState(0);
  const didCenterRef = useRef(false);
  const [cabinetItems, setCabinetItems] = useState<CabinetItem[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<CabinetItem | null>(null);
  const [addModalVisible, setAddModalVisible] = useState(false);

  const openDetails = useCallback((item: CabinetItem) => {
    setSelectedMedicine(item);
  }, []);

  const shelvesSlots = buildShelvesSlots(cabinetItems, openDetails);

  const handleAddMedicine = useCallback((catalogItem: typeof catalogItems[0]) => {
    const newItem: CabinetItem = {
      id: Date.now().toString(),
      name: catalogItem.name,
      subtitle: catalogItem.subtitle,
      statusDot: catalogItem.statusDot ?? null,
      imageSource: catalogItem.imageSource,
    };
    setCabinetItems((prev) => [...prev, newItem]);
  }, []);

  const tryCenter = useCallback(() => {
    if (didCenterRef.current) return;
    if (!scrollRef.current) return;
    if (viewportH <= 0 || contentH <= 0) return;

    const y = Math.max(0, Math.floor((contentH - viewportH) / 2));
    scrollRef.current.scrollTo({ y, animated: false });
    didCenterRef.current = true;
  }, [viewportH, contentH]);

  useEffect(() => {
    tryCenter();
  }, [tryCenter]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.contentWrapper}>
        <ScrollView
          ref={scrollRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          contentInsetAdjustmentBehavior="never"
          automaticallyAdjustContentInsets={false}
          bounces={false}
          alwaysBounceVertical={false}
          showsVerticalScrollIndicator={false}
          onLayout={(e) => {
            setViewportH(e.nativeEvent.layout.height);
          }}
          onContentSizeChange={(_, h) => {
            setContentH(h);
          }}
        >
          <View style={styles.topGlow} pointerEvents="none">
            <View style={styles.topGlowLayer1} />
            <View style={styles.topGlowLayer2} />
          </View>
          {shelvesSlots.map((slotNodes, shelfIndex) => (
            <CabinetShelf
              key={shelfIndex}
              slots={slotNodes}
            />
          ))}
        </ScrollView>
        <View style={styles.cabinetOverlays} pointerEvents="none">
          <View style={styles.leftSideWall} />
          <View style={styles.rightSideWall} />
          <View style={styles.leftGradientEdge}>
            <View style={styles.gradientStrip1} />
            <View style={styles.gradientStrip2} />
            <View style={styles.gradientStrip3} />
          </View>
          <View style={styles.rightGradientEdge}>
            <View style={styles.gradientStrip1} />
            <View style={styles.gradientStrip2} />
            <View style={styles.gradientStrip3} />
          </View>
          <View style={styles.innerShadowLeft} />
          <View style={styles.innerShadowRight} />
        </View>
      </View>
      <Pressable
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        onPress={() => setAddModalVisible(true)}
      >
        <Text style={styles.fabLabel}>+</Text>
      </Pressable>
      <AddMedicineModal
        visible={addModalVisible}
        catalogItems={catalogItems}
        onSelect={handleAddMedicine}
        onClose={() => setAddModalVisible(false)}
      />
      <MedicineDetailsSheet
        visible={selectedMedicine !== null}
        medicineName={selectedMedicine?.name ?? ''}
        medicineStrength={selectedMedicine?.subtitle}
        imageSource={selectedMedicine?.imageSource}
        statusDot={selectedMedicine?.statusDot ?? null}
        onClose={() => setSelectedMedicine(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ROOM_BG,
  },
  contentWrapper: {
    flex: 1,
    position: 'relative',
    backgroundColor: ROOM_BG,
  },
  scrollView: {
    flex: 1,
    backgroundColor: ROOM_BG,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: ROOM_BG,
    paddingTop: 16,
    paddingBottom: 40,
  },
  topGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 90,
  },
  topGlowLayer1: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
  },
  topGlowLayer2: {
    position: 'absolute',
    top: 45,
    left: 0,
    right: 0,
    height: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  cabinetOverlays: {
    ...StyleSheet.absoluteFillObject,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  leftSideWall: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.035)',
  },
  rightSideWall: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.035)',
  },
  leftGradientEdge: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 24,
    flexDirection: 'row',
  },
  rightGradientEdge: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 24,
    flexDirection: 'row-reverse',
  },
  gradientStrip1: {
    width: 8,
    flex: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.025)',
  },
  gradientStrip2: {
    width: 8,
    flex: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.012)',
  },
  gradientStrip3: {
    width: 8,
    flex: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.004)',
  },
  innerShadowLeft: {
    position: 'absolute',
    left: 10,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  innerShadowRight: {
    position: 'absolute',
    right: 10,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabPressed: {
    opacity: 0.9,
  },
  fabLabel: {
    fontSize: 28,
    fontWeight: '300',
    color: '#fff',
    marginTop: -2,
  },
});
