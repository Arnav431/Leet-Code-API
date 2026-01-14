const LeetCodeAPI = require('../api.js');

const leetcode = new LeetCodeAPI();

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { username } = req.query;

  if (!username) {
    res.status(400).json({ error: 'Username parameter is required' });
    return;
  }

  try {
    const stats = await leetcode.getUserStats(username);
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}