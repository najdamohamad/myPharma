import { Image } from 'expo-image';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { CandidateImage } from '@/src/services/fetchCandidates';

type CandidateSelectionModalProps = {
  visible: boolean;
  medicineName: string;
  candidates: CandidateImage[];
  loading: boolean;
  error: string | null;
  onSelect: (candidate: CandidateImage) => void;
  onClose: () => void;
};

function CandidateCard({
  candidate,
  onPress,
}: {
  candidate: CandidateImage;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: candidate.url }}
          style={styles.image}
          contentFit="contain"
        />
      </View>
      <Text style={styles.cardName} numberOfLines={1}>
        {candidate.name}
      </Text>
    </Pressable>
  );
}

export default function CandidateSelectionModal({
  visible,
  medicineName,
  candidates,
  loading,
  error,
  onSelect,
  onClose,
}: CandidateSelectionModalProps) {
  if (!visible) return null;

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
          <Text style={styles.title}>Select the matching box</Text>
          <Text style={styles.subtitle}>{medicineName}</Text>

          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>
                Searching for box images...
              </Text>
            </View>
          ) : error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
              <Text style={styles.errorHint}>
                Make sure the API is running: npm run api
              </Text>
            </View>
          ) : candidates.length === 0 ? (
            <Text style={styles.emptyText}>No candidates found</Text>
          ) : (
            <FlatList
              data={candidates}
              keyExtractor={(item) => item.id}
              numColumns={3}
              columnWrapperStyle={styles.row}
              renderItem={({ item }) => (
                <CandidateCard
                  candidate={item}
                  onPress={() => {
                    onSelect(item);
                    onClose();
                  }}
                />
              )}
              style={styles.list}
              contentContainerStyle={styles.listContent}
            />
          )}

          <Pressable
            style={({ pressed }) => [styles.cancelButton, pressed && styles.buttonPressed]}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const CARD_SIZE = 100;

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
    maxHeight: '75%',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    marginBottom: 16,
    alignSelf: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 20,
  },
  loadingBox: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#666',
  },
  errorBox: {
    padding: 24,
    backgroundColor: 'rgba(255,59,48,0.08)',
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 15,
    color: '#C00',
    textAlign: 'center',
  },
  errorHint: {
    fontSize: 13,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 32,
  },
  list: {
    maxHeight: 280,
  },
  listContent: {
    paddingBottom: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    width: CARD_SIZE,
    alignItems: 'center',
  },
  cardPressed: {
    opacity: 0.8,
  },
  imageContainer: {
    width: CARD_SIZE,
    height: CARD_SIZE * (4 / 3),
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  cardName: {
    fontSize: 12,
    color: '#666',
    marginTop: 6,
  },
  cancelButton: {
    paddingVertical: 14,
    marginTop: 8,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
});
