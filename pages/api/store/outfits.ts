import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default (req: NextApiRequest, res: NextApiResponse) => {
  const { contract, head } = req.query;

  if (!contract) {
    res.status(400).json({ error: 'Contract address is required' });
    return;
  }

  const collectionsMap: { [key: string]: string } = {
    '0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42': 'wizards_outfits',
    '0x4b1e130ae84c97b931ffbe91ead6b1da16993d45': 'babies_outfits',
    '0x9690b63eb85467be5267a3603f770589ab12dc95': 'warriors_outfits',
    '0x251b5f14a825c537ff788604ea1b58e49b70726f': 'souls_outfits',
  };

  const collectionFolder = collectionsMap[contract as string];
  if (!collectionFolder) {
    res.status(400).json({ error: 'Invalid contract address' });
    return;
  }

  const outfitsPath = path.join(process.cwd(), 'public', 'assets', collectionFolder);

  const categories = ['head', 'body', 'prop', 'hats', 'tops', 'bottoms', 'eye_accessory'];
  const outfits: { [key: string]: { name: string; path: string }[] } = {};

  categories.forEach(category => {
    const categoryPath = path.join(outfitsPath, category);
    if (fs.existsSync(categoryPath)) {
      let files = fs.readdirSync(categoryPath).map(file => ({
        name: file.replace(/_/g, ' ').replace(/\..+$/, ''), // remove file extension and replace underscores
        path: `/assets/${collectionFolder}/${category}/${file}`
      }));

      if (category === 'head' && typeof head === 'string') {
        // Only include heads that match the head attribute exactly, without any suffix
        const headName = head.toLowerCase().replace(/ /g, '_');
        files = files.filter(file => file.name === headName);
        console.log(`Filtered files in ${category}:`, files);
      } else {
        console.log(`Found files in ${category}:`, files);
      }

      outfits[category] = files;
    } else {
      outfits[category] = [];
    }
  });

  res.status(200).json(outfits);
};
