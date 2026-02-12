import AsyncStorage from '@react-native-async-storage/async-storage';
import type { MedicineItem } from '../models/medicine';
import {
  createMedicineItem,
  parseMedicineItemsJson,
  updateMedicineItem,
  type MedicineItemInput,
} from '../models/medicine';

const MEDICINE_STORAGE_KEY = '@mypharma/medicine_items';

export class MedicineStorageError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'MedicineStorageError';
  }
}

async function getStoredJson(): Promise<string> {
  try {
    const value = await AsyncStorage.getItem(MEDICINE_STORAGE_KEY);
    return value ?? '[]';
  } catch (e) {
    throw new MedicineStorageError('Failed to read medicine storage', e);
  }
}

async function setStoredJson(json: string): Promise<void> {
  try {
    await AsyncStorage.setItem(MEDICINE_STORAGE_KEY, json);
  } catch (e) {
    throw new MedicineStorageError('Failed to write medicine storage', e);
  }
}

async function readItems(): Promise<MedicineItem[]> {
  const raw = await getStoredJson();
  return parseMedicineItemsJson(raw);
}

/**
 * Get all medicine items. Returns [] on empty or invalid data.
 */
export async function getAllMedicineItems(): Promise<MedicineItem[]> {
  try {
    return await readItems();
  } catch (e) {
    if (e instanceof MedicineStorageError) throw e;
    throw new MedicineStorageError('Failed to get medicine items', e);
  }
}

/**
 * Get a single medicine item by id, or undefined if not found.
 */
export async function getMedicineItemById(id: string): Promise<MedicineItem | undefined> {
  try {
    const items = await readItems();
    return items.find((item) => item.id === id);
  } catch (e) {
    if (e instanceof MedicineStorageError) throw e;
    throw new MedicineStorageError(`Failed to get medicine item: ${id}`, e);
  }
}

/**
 * Create a new medicine item and persist it. Returns the created item.
 */
export async function createMedicineItemInStorage(
  input: MedicineItemInput
): Promise<MedicineItem> {
  try {
    const items = await readItems();
    const newItem = createMedicineItem(input);
    if (items.some((item) => item.id === newItem.id)) {
      newItem.id = `${newItem.id}-${Date.now()}`;
    }
    items.push(newItem);
    await setStoredJson(JSON.stringify(items));
    return newItem;
  } catch (e) {
    if (e instanceof MedicineStorageError) throw e;
    throw new MedicineStorageError('Failed to create medicine item', e);
  }
}

/**
 * Update an existing medicine item by id. Returns the updated item or undefined if not found.
 */
export async function updateMedicineItemInStorage(
  id: string,
  updates: Partial<MedicineItemInput>
): Promise<MedicineItem | undefined> {
  try {
    const items = await readItems();
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return undefined;
    items[index] = updateMedicineItem(items[index], updates);
    await setStoredJson(JSON.stringify(items));
    return items[index];
  } catch (e) {
    if (e instanceof MedicineStorageError) throw e;
    throw new MedicineStorageError(`Failed to update medicine item: ${id}`, e);
  }
}

/**
 * Delete a medicine item by id. Returns true if an item was removed, false if not found.
 */
export async function deleteMedicineItemInStorage(id: string): Promise<boolean> {
  try {
    const items = await readItems();
    const filtered = items.filter((item) => item.id !== id);
    if (filtered.length === items.length) return false;
    await setStoredJson(JSON.stringify(filtered));
    return true;
  } catch (e) {
    if (e instanceof MedicineStorageError) throw e;
    throw new MedicineStorageError(`Failed to delete medicine item: ${id}`, e);
  }
}
