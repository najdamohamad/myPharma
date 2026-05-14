#!/usr/bin/env node
/**
 * Boxscanner API server.
 * Runs the Python fetch + process scripts and serves the generated cutout images.
 *
 * Usage: node api/server.js
 * Requires: Python, npm run fetch-images and npm run process-cutouts to work.
 *
 * Endpoints:
 *   POST /api/fetch-candidates { medicineName } -> { candidates: [{ id, url, name }] }
 *   GET  /api/candidates/:filename -> image file
 */

const { execSync } = require('child_process');
const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3912;
const PROJECT_ROOT = path.resolve(__dirname, '..');
const RAW_DIR = path.join(PROJECT_ROOT, 'boxscanner', 'raw');
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'assets', 'images', 'medicines');

const app = express();
app.use(express.json());

// Serve candidate cutouts
app.use('/api/candidates', express.static(OUTPUT_DIR));

app.post('/api/fetch-candidates', async (req, res) => {
  const { medicineName } = req.body || {};
  if (!medicineName || typeof medicineName !== 'string') {
    return res.status(400).json({ error: 'medicineName is required' });
  }

  const name = String(medicineName).trim();
  if (!name) {
    return res.status(400).json({ error: 'medicineName cannot be empty' });
  }

  const safeName = name.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_').trim() || 'medicine';

  try {
    // 1. Fetch images from web
    execSync(`npm run fetch-images -- "${name}"`, {
      cwd: PROJECT_ROOT,
      stdio: 'pipe',
    });

    // 2. Process cutouts
    execSync(
      `npm run process-cutouts`,
      { cwd: PROJECT_ROOT, stdio: 'pipe' }
    );

    // 3. Find generated cutouts for this medicine
    const files = fs.readdirSync(OUTPUT_DIR).filter((f) => {
      const stem = path.basename(f, '.png');
      return stem.startsWith(safeName) && stem.endsWith('_cutout');
    });

    const host = process.env.API_PUBLIC_HOST || 'localhost';
    const baseUrl = `http://${host}:${PORT}/api/candidates`;
    const candidates = files.map((f, i) => ({
      id: `candidate-${i}`,
      url: `${baseUrl}/${f}`,
      name: `Candidate ${i + 1}`,
    }));

    res.json({ candidates });
  } catch (err) {
    console.error('fetch-candidates error:', err.message);
    const stderr = err.stderr?.toString?.() || '';
    return res.status(500).json({
      error: 'Failed to fetch or process images',
      details: stderr.slice(0, 200),
    });
  }
});

const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Boxscanner API running at http://localhost:${PORT}`);
  console.log('  POST /api/fetch-candidates { medicineName }');
  console.log('  GET  /api/candidates/:filename');
});
