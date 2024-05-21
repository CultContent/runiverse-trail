import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const assetFolder = path.join(process.cwd(), 'public/assets/villagers');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { part } = req.query;
  if (!part) {
    res.status(400).json({ error: 'No part specified' });
    return;
  }

  const partFolder = path.join(assetFolder, part as string);
  fs.readdir(partFolder, (err, files) => {
    if (err) {
      res.status(500).json({ error: 'Failed to read assets' });
      return;
    }

    res.status(200).json(files);
  });
}
