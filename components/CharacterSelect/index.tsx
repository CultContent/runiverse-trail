import React, { FC, useState } from 'react';

const WIZARD_CONTRACT = '0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42';
const WARRIOR_CONTRACT = '0x9690b63eb85467be5267a3603f770589ab12dc95';
const BABY_CONTRACT = '0x4b1e130ae84c97b931ffbe91ead6b1da16993d45';
const SOUL_CONTRACT = '0x251b5f14a825c537ff788604ea1b58e49b70726f';

interface CharacterSelectProps {
  id: string;
  contract: string;
  onSelect: (character: { id: string; contract: string }) => void;
  isSelected: boolean;
  className?: string;
}

const CharacterSelect: FC<CharacterSelectProps> = ({ id, contract, onSelect, className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleClick = () => setIsSelected(!isSelected);

  const backgroundImage = isSelected || isHovered ? 'url("/img/frame_on.png")' : 'url("/img/frame_off.png")';

  let backgroundImageUrl = '';

  switch (contract) {
    case WIZARD_CONTRACT:
      backgroundImageUrl = `https://www.forgottenrunes.com/api/art/wizards/${id}.png`;
      break;
    case WARRIOR_CONTRACT:
      backgroundImageUrl = `https://portal.forgottenrunes.com/api/warriors/img/${id}.png`;
      break;
    case BABY_CONTRACT:
      backgroundImageUrl = `https://www.forgottenrunes.com/api/art/wizards/${id}.png`;
      break;
    case SOUL_CONTRACT:
      backgroundImageUrl = `https://portal.forgottenrunes.com/api/souls/img/${id}`;
      break;
    default:
    // Handle unknown contract, if needed
  }

  return (
    <div
      onClick={() => onSelect({ id, contract })}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden ${className} p-1`}
      style={{ width: '200px', height: '200px' }}
    >
      <div className="relative overflow-hidden rounded-none shadow-lg w-full h-full">
        <div
          style={{
            backgroundImage: backgroundImage,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            height: '100%',
            width: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 10,
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        ></div>
        <div
          style={{
            zIndex: 1,
            width: '90%', // Ensures the image fits within the frame
            height: '90%',
            backgroundImage: `url("${backgroundImageUrl}")`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            marginTop: '8px', // Adds top padding to adjust the character image position
          }}
          className="flex items-center justify-center mx-auto"
        />
      </div>
    </div>
  );
};

export default CharacterSelect;
