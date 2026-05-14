/**
 * Barcode lookup service using UPCItemDB trial API.
 * Converts UPC/EAN barcode to product name for medicine identification.
 * Free tier: 100 requests/day, 6/minute - no API key required.
 */

const UPCITEMDB_TRIAL_URL = 'https://api.upcitemdb.com/prod/trial/lookup';

export type BarcodeLookupResult = {
  success: true;
  name: string;
  brand?: string;
  rawTitle?: string;
} | {
  success: false;
  error: string;
};

/**
 * Extract medicine-like product name from API response.
 * Prefer brand + title for medicines; fallback to title.
 */
function extractMedicineName(item: { title?: string; brand?: string }): string {
  const title = (item.title ?? '').trim();
  const brand = (item.brand ?? '').trim();
  if (brand && title && !title.toLowerCase().includes(brand.toLowerCase())) {
    return `${brand} ${title}`.trim();
  }
  return title || brand || 'Unknown product';
}

/**
 * Look up a barcode (UPC-A, EAN-13, etc.) and return product name.
 */
export async function lookupBarcode(barcode: string): Promise<BarcodeLookupResult> {
  const trimmed = barcode.trim().replace(/\D/g, '');
  if (!trimmed || trimmed.length < 8) {
    return { success: false, error: 'Invalid barcode' };
  }

  try {
    const res = await fetch(UPCITEMDB_TRIAL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ upc: trimmed }),
    });

    const data = await res.json();

    if (!res.ok) {
      const msg = data?.message ?? data?.error ?? `HTTP ${res.status}`;
      return { success: false, error: String(msg) };
    }

    const items = data?.items;
    if (!Array.isArray(items) || items.length === 0) {
      return { success: false, error: 'Product not found in database' };
    }

    const item = items[0];
    const name = extractMedicineName(item);
    return {
      success: true,
      name,
      brand: item.brand,
      rawTitle: item.title,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Network error';
    return { success: false, error: msg };
  }
}
