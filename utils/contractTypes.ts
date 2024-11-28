export const WIZARD_CONTRACT = '0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42';
export const WARRIOR_CONTRACT = '0x9690b63eb85467be5267a3603f770589ab12dc95';
export const BABY_CONTRACT = '0x4b1e130ae84c97b931ffbe91ead6b1da16993d45';
export const SOUL_CONTRACT = '0x251b5f14a825c537ff788604ea1b58e49b70726f';

export const getCharacterType = (contract: string): string => {
  const contractMap: { [key: string]: string } = {
    [WIZARD_CONTRACT]: 'wizards',
    [WARRIOR_CONTRACT]: 'warriors',
    [BABY_CONTRACT]: 'babies',
    [SOUL_CONTRACT]: 'souls'
  };

  return contractMap[contract.toLowerCase()] || 'unknown';
}; 