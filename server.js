import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { processText } from './textProcessor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.use(express.static(__dirname));
app.use(express.json());

app.post('/process', async (req, res) => {
    const { text } = req.body;

    try {
        const processedText = await processText(text);
        res.send(processedText);
    } catch (error) {
        console.error('Error processing text:', {
            message: error.message,
            stack: error.stack,
            code: error.code,
            path: error.path,
        });
        res.status(500).send('Failed to process text');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});