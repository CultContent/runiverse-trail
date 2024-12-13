// server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Enable CORS for Next.js frontend
app.use(express.json());

// Ensure the data directory exists
const DATA_DIR = path.join(__dirname, 'data');
const ensureDataDir = async () => {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR);
  }
};

// Helper function to validate character data
const validateCharacterData = (data) => {
  const requiredFields = ['name', 'clients', 'modelProvider', 'bio'];
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
};

// Get all characters
app.get('/api/characters', async (req, res) => {
  try {
    await ensureDataDir();
    const files = await fs.readdir(DATA_DIR);
    const characters = await Promise.all(
      files.map(async (file) => {
        const content = await fs.readFile(path.join(DATA_DIR, file), 'utf-8');
        return JSON.parse(content);
      })
    );
    res.json(characters);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch characters' });
  }
});

// Get a specific character
app.get('/api/characters/:name', async (req, res) => {
  try {
    const filePath = path.join(DATA_DIR, `${req.params.name}.json`);
    const content = await fs.readFile(filePath, 'utf-8');
    res.json(JSON.parse(content));
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(404).json({ error: 'Character not found' });
    } else {
      res.status(500).json({ error: 'Failed to fetch character' });
    }
  }
});

// Save a character
app.post('/api/characters', async (req, res) => {
  try {
    await ensureDataDir();
    const characterData = req.body;
    
    // Validate the data
    validateCharacterData(characterData);
    
    const filePath = path.join(DATA_DIR, `${characterData.name}.json`);
    await fs.writeFile(filePath, JSON.stringify(characterData, null, 2));
    res.json({ message: 'Character saved successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a character
app.put('/api/characters/:name', async (req, res) => {
  try {
    const filePath = path.join(DATA_DIR, `${req.params.name}.json`);
    const characterData = req.body;
    
    // Validate the data
    validateCharacterData(characterData);
    
    await fs.writeFile(filePath, JSON.stringify(characterData, null, 2));
    res.json({ message: 'Character updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a character
app.delete('/api/characters/:name', async (req, res) => {
  try {
    const filePath = path.join(DATA_DIR, `${req.params.name}.json`);
    await fs.unlink(filePath);
    res.json({ message: 'Character deleted successfully' });
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(404).json({ error: 'Character not found' });
    } else {
      res.status(500).json({ error: 'Failed to delete character' });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});