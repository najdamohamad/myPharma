/**
 * Fetches candidate box images for a medicine.
 * Calls the boxscanner backend which runs fetch_medicine_images + process_cutouts.
 * Set API_BASE_URL in your environment or use the default for dev.
 */

const DEFAULT_API_BASE = __DEV__
  ? 'http://localhost:3912'
  : 'https://your-api-host.com'; // Replace with your deployed API

function getApiBase(): string {
  return process.env.EXPO_PUBLIC_BOXSCANNER_API ?? DEFAULT_API_BASE;
}

export type CandidateImage = {
  id: string;
  url: string;
  name: string;
};

export type FetchCandidatesResult =
  | { success: true; candidates: CandidateImage[] }
  | { success: false; error: string };

/**
 * Request candidate images for a medicine name.
 * The backend runs Python scripts (fetch_medicine_images, process_cutouts).
 */
export async function fetchCandidates(
  medicineName: string
): Promise<FetchCandidatesResult> {
  const base = getApiBase();
  if (!medicineName.trim()) {
    return { success: false, error: 'Medicine name is required' };
  }

  try {
    const res = await fetch(`${base}/api/fetch-candidates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ medicineName: medicineName.trim() }),
    });

    const data = await res.json();

    if (!res.ok) {
      const msg = data?.error ?? `HTTP ${res.status}`;
      return { success: false, error: String(msg) };
    }

    const candidates = data?.candidates ?? [];
    if (!Array.isArray(candidates) || candidates.length === 0) {
      return { success: false, error: 'No candidate images found' };
    }

    return {
      success: true,
      candidates: candidates.map((c: { id?: string; url: string; name?: string }, i: number) => ({
        id: c.id ?? `candidate-${i}`,
        url: c.url,
        name: c.name ?? `Candidate ${i + 1}`,
      })),
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Network error';
    return {
      success: false,
      error: `${msg}. Make sure the boxscanner API is running (npm run api).`,
    };
  }
}
