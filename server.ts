import express from 'express';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
// The environment provides the port. If not provided, fallback to 3000
const port = 3000;

app.use(express.static(resolve(__dirname, 'client')));

// Fallback for React Router
app.get('*', (req, res) => {
  res.sendFile(resolve(__dirname, 'client', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
