const express = require('express');
const fetch = require('isomorphic-unfetch');
const cors = require('cors');

const app = express();

app.use(cors());

app.get('/api/get', async (req, res) => {
  const response = await fetch('https://deepwoken.co/api/get?type=talent&name=all');
  const data = await response.json();
  res.json(data);
});

app.listen(3001, () => {
  console.log('Express server is running on port 3001');
});