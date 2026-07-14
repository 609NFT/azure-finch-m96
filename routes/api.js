const express = require('express');
const { stats, activitySeries, users } = require('../lib/mock-data');

const router = express.Router();

// Bitcoin price endpoint
router.get("/bitcoin", async (req, res) => {
  try {
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd");
    const data = await response.json();
    res.json({ price: data.bitcoin.usd });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Bitcoin price" });
  }
});

// Stats endpoint
router.get("/stats", (req, res) => {
  res.json({ stats: stats() });
});

// Activity endpoint
router.get("/activity", (req, res) => {
  res.json({ series: activitySeries() });
});

// Users endpoint
router.get("/users", (req, res) => {
  const { page = 1, perPage = 10, sort = 'createdAt', dir = 'desc', filter = '' } = req.query;
  res.json(users({ page: parseInt(page, 10), perPage: parseInt(perPage, 10), sort, dir, filter }));
});

module.exports = router;
