import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { IncomingForm } from 'formidable';
import { getCharacterType } from '@/utils/contractTypes';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        throw err;
      }

      const { characterType, characterId } = fields;
      const image = files.image;

      // Validate characterType
      if (!characterType || !Array.isArray(characterType) || characterType.length === 0) {
        return res.status(400).json({ message: 'No character type provided' });
      }

      // Convert contract to character type - use first element of array
      const folderName = getCharacterType(characterType[0]);

      // Create directory if it doesn't exist
      const dirPath = path.join(process.cwd(), 'public', 'characters', folderName);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      // Save the file
      if (!image || !Array.isArray(image) || image.length === 0) {
        return res.status(400).json({ message: 'No image file provided' });
      }

      if (!characterId || !Array.isArray(characterId) || characterId.length === 0) {
        return res.status(400).json({ message: 'No character ID provided' });
      }

      const filePath = path.join(dirPath, `${characterId[0]}.png`);
      fs.copyFileSync(image[0].filepath, filePath);

      res.status(200).json({ message: 'Image saved successfully' });
    });
  } catch (error) {
    console.error('Error saving character image:', error);
    res.status(500).json({ message: 'Error saving character image' });
  }
} 