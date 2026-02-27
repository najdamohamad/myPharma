import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CabinetShelf from '@/src/components/CabinetShelf';
import MedicineBox from '@/src/components/MedicineBox';
import MedicineCutout from '@/src/components/MedicineCutout';
import MedicineDetailsSheet from '@/src/components/MedicineDetailsSheet';
import { mockMedicines, type MedicineBoxItem } from '@/src/data/mockMedicines';

const ROOM_BG = '#EEF1F4';
const SHELF_SIZE = 5;

const CUTOUT_PARACETAMOL = require('../../assets/images/medicines/Paracetamol.png');
const CUTOUT_IBUPROFENE = require('../../assets/images/medicines/Ibuprofene.png');
const CUTOUT_BOX6 = require('../../assets/images/medicines/box_6_cutout.png');
const CUTOUT_ANTIHISTAMINIQUE = require('../../assets/images/medicines/Antihistaminique.png');

const CUTOUT_SOURCES = [
  CUTOUT_PARACETAMOL,
  CUTOUT_IBUPROFENE,
  CUTOUT_BOX6,
  CUTOUT_ANTIHISTAMINIQUE,
] as const;

function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}
// get status dot 
function getStatusDot(item: MedicineBoxItem): 'red' | 'amber' | 'blue' | null {
  if (item.scheduledDaily) {
    return 'blue';
  }
  if (!item.expiryDate) {
    return null;
  }
  const expiry = new Date(item.expiryDate);
  const now = new Date();
  const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (daysUntilExpiry < 0) {
    return 'red';
  }
  if (daysUntilExpiry <= 30) {
    return 'amber';
  }
  return null;
}

export default function CabinetScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const [viewportH, setViewportH] = useState(0);
  const [contentH, setContentH] = useState(0);
  const didCenterRef = useRef(false);
  const [selectedMedicine, setSelectedMedicine] = useState<MedicineBoxItem | null>(null);
  const shelves = chunk(mockMedicines, SHELF_SIZE);

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
          {shelves.map((shelfItems, shelfIndex) => (
          <CabinetShelf
            key={shelfIndex}
            slots={shelfItems.map((item, slotIndex) => {
              const globalIndex = shelfIndex * SHELF_SIZE + slotIndex;
              const useCutout = globalIndex < CUTOUT_SOURCES.length;

              if (useCutout) {
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => setSelectedMedicine(item)}
                    style={({ pressed }) => [
                      { width: '100%', opacity: pressed ? 0.9 : 1 },
                    ]}
                  >
                    <MedicineCutout
                      source={CUTOUT_SOURCES[globalIndex]}
                      statusDot={getStatusDot(item)}
                    />
                  </Pressable>
                );
              }

              return (
                <MedicineBox
                  key={item.id}
                  imageSource={item.imageSource}
                  statusDot={getStatusDot(item)}
                  onPress={() => setSelectedMedicine(item)}
                />
              );
            })}
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
          <View style={styles.vignetteTopLeft} />
          <View style={styles.vignetteTopRight} />
          <View style={styles.vignetteBottomLeft} />
          <View style={styles.vignetteBottomRight} />
          <View style={styles.innerShadowLeft} />
          <View style={styles.innerShadowRight} />
        </View>
      </View>
      <Pressable
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        onPress={() => console.log('add pressed')}
      >
        <Text style={styles.fabLabel}>+</Text>
      </Pressable>
      <MedicineDetailsSheet
        visible={selectedMedicine !== null}
        medicineName={selectedMedicine?.name ?? ''}
        medicineStrength={selectedMedicine?.strength}
        imageSource={selectedMedicine?.imageSource}
        statusDot={selectedMedicine ? getStatusDot(selectedMedicine) : null}
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
  vignetteTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 80,
    height: 80,
    borderTopLeftRadius: 80,
    backgroundColor: 'rgba(0, 0, 0, 0.012)',
  },
  vignetteTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 80,
    height: 80,
    borderTopRightRadius: 80,
    backgroundColor: 'rgba(0, 0, 0, 0.012)',
  },
  vignetteBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 80,
    height: 80,
    borderBottomLeftRadius: 80,
    backgroundColor: 'rgba(0, 0, 0, 0.012)',
  },
  vignetteBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 80,
    height: 80,
    borderBottomRightRadius: 80,
    backgroundColor: 'rgba(0, 0, 0, 0.012)',
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
