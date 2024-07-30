import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Define a single route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, this is your basic REST API!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
