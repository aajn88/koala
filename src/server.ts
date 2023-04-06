import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  const q = req.query.q || 'World';
  res.send(`Hello, ${q}!`);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
