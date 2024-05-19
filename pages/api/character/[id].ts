import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';

const WIZARD_CONTRACT = "0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42";
const WARRIOR_CONTRACT = "0x9690b63eb85467be5267a3603f770589ab12dc95";
const BABY_CONTRACT = "0x4b1e130ae84c97b931ffbe91ead6b1da16993d45";
const SOUL_CONTRACT = "0x251b5f14a825c537ff788604ea1b58e49b70726f";

enum CharacterType {
  None,
  Wizard,
  Warrior,
  Baby,
  Soul
}

const getCharacterType = (contract: string): CharacterType => {
  switch (contract.toLowerCase()) {
    case WIZARD_CONTRACT.toLowerCase():
      return CharacterType.Wizard;
    case WARRIOR_CONTRACT.toLowerCase():
      return CharacterType.Warrior;
    case BABY_CONTRACT.toLowerCase():
      return CharacterType.Baby;
    case SOUL_CONTRACT.toLowerCase():
      return CharacterType.Soul;
    default:
      return CharacterType.None;
  }
};

const getCharacterFilePath = (type: CharacterType, id: string) => {
  let folder = '';
  switch (type) {
    case CharacterType.Wizard:
      folder = 'wizards';
      break;
    case CharacterType.Warrior:
      folder = 'warriors';
      break;
    case CharacterType.Baby:
      folder = 'babies';
      break;
    case CharacterType.Soul:
      folder = 'souls';
      break;
    default:
      throw new Error('Invalid character type');
  }
  return path.join(process.cwd(), 'public', 'characters', folder, `${id}.json`);
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, contract } = req.query;

  const characterType = getCharacterType(contract as string);
  if (characterType === CharacterType.None) {
    return res.status(400).json({ error: 'Invalid contract address' });
  }

  const filePath = getCharacterFilePath(characterType, id as string);
  if (fs.existsSync(filePath)) {
    const jsonData = fs.readFileSync(filePath, 'utf8');
    res.status(200).json(JSON.parse(jsonData));
  } else {
    res.status(404).json({ error: 'Character not found' });
  }
}
