const express = require('express');
const router = express.Router();

// Example GET route
router.get('/example', (req, res) => {
  res.json({ message: 'This is a GET response!' });
});

module.exports = router;
