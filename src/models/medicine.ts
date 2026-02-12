/**
 * Medicine item model and helpers.
 */

export type MedicineItem = {
  id: string;
  name: string;
  dosage?: string;
  expiryDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type MedicineItemInput = Omit<MedicineItem, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: string;
};

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}/;

/**
 * Creates a new MedicineItem with generated id and timestamps.
 */
export function createMedicineItem(input: MedicineItemInput): MedicineItem {
  const now = new Date().toISOString();
  return {
    id: input.id ?? generateId(),
    name: input.name.trim(),
    dosage: input.dosage?.trim(),
    expiryDate: input.expiryDate?.trim(),
    notes: input.notes?.trim(),
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Updates an existing item, setting updatedAt.
 */
export function updateMedicineItem(
  existing: MedicineItem,
  updates: Partial<MedicineItemInput>
): MedicineItem {
  const updatedAt = new Date().toISOString();
  const { id: _ignoredId, ...safeUpdates } = updates;
  return {
    ...existing,
    ...safeUpdates,
    id: existing.id,
    name: (updates.name ?? existing.name).trim(),
    dosage: updates.dosage !== undefined ? updates.dosage?.trim() : existing.dosage,
    expiryDate: updates.expiryDate !== undefined ? updates.expiryDate?.trim() : existing.expiryDate,
    notes: updates.notes !== undefined ? updates.notes?.trim() : existing.notes,
    updatedAt,
  };
}

/**
 * Validates that a value is a valid MedicineItem (shape and types).
 */
export function isMedicineItem(value: unknown): value is MedicineItem {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const o = value as Record<string, unknown>;
  return (
    typeof o.id === 'string' &&
    o.id.length > 0 &&
    typeof o.name === 'string' &&
    o.name.length > 0 &&
    (o.dosage === undefined || typeof o.dosage === 'string') &&
    (o.expiryDate === undefined || (typeof o.expiryDate === 'string' && ISO_DATE_REGEX.test(o.expiryDate))) &&
    (o.notes === undefined || typeof o.notes === 'string') &&
    typeof o.createdAt === 'string' &&
    typeof o.updatedAt === 'string'
  );
}

/**
 * Parses JSON and returns an array of MedicineItem, or empty array on failure.
 */
export function parseMedicineItemsJson(json: string): MedicineItem[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) {
    return [];
  }
  return parsed.filter(isMedicineItem);
}

/**
 * Generates a simple unique id (time-based + random).
 */
function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
}
