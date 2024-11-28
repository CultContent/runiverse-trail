import type { NextApiRequest, NextApiResponse } from 'next';
import { createCanvas, loadImage } from 'canvas';
import { getCharacterType } from '@/utils/contractTypes';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { characterId, contract, attributes } = req.body;
    const characterType = getCharacterType(contract);

    // Create canvas
    const canvas = createCanvas(400, 400); // Adjust size as needed
    const ctx = canvas.getContext('2d');

    // Load and draw base character
    const baseImagePath = path.join(process.cwd(), 'public', 'characters', characterType, `${characterId}_base.png`);
    const baseImage = await loadImage(baseImagePath);
    ctx.drawImage(baseImage, 0, 0);

    // Load and draw each equipment piece
    for (const attr of attributes) {
      if (attr.value && attr.value !== '') {
        const equipImagePath = path.join(process.cwd(), 'public', 'equipment', attr.trait_type, `${attr.value}.png`);
        const equipImage = await loadImage(equipImagePath);
        ctx.drawImage(equipImage, 0, 0);
      }
    }

    // Convert to buffer
    const buffer = canvas.toBuffer('image/png');
    
    res.setHeader('Content-Type', 'image/png');
    res.send(buffer);
  } catch (error) {
    console.error('Error generating character image:', error);
    res.status(500).json({ message: 'Error generating character image' });
  }
} 