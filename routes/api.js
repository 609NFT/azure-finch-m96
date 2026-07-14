const express = require('express');
const router = express.Router();
const { stats, activitySeries, users } = require('../lib/mock-data.js');

// Bitcoin price endpoint using DexScreener
router.get('/bitcoin', async (req, res) => {
  try {
    const response = await fetch('https://api.dexscreener.com/latest/dex/tokens/TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9');
    const data = await response.json();
    const btcPair = data.pairs ? data.pairs.find(p => p.baseToken.symbol === 'BTC') : null;
    const price = btcPair ? btcPair.priceUsd : '0';
    res.json({ price: Number(price) });
  } catch (error) {
    console.error('DexScreener API error:', error);
    res.status(502).json({ error: 'DexScreener API error' });
  }
});

// Keep existing stats/activity/users endpoints unchanged
router.get('/stats', (req, res) => {
  res.json({ stats: stats() });
});
router.get('/activity', (req, res) => {
  res.json({ series: activitySeries() });
});
router.get('/users', (req, res) => {
  const { page = 1, perPage = 10 } = req.query;
  return res.json(users({ page, perPage }));
});

module.exports = router;
