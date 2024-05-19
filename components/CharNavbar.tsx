// CharNavBar.tsx
import React from 'react';
import { useCharacter } from '../context/CharacterContext';
import Link from 'next/link';
import CustomConnectButton from './CustomConnectButton'

const CharNavBar: React.FC = () => {
  const { selectedCharacter } = useCharacter();
  const characterUrl = `https://www.forgottenrunes.com/api/art/wizards/${selectedCharacter?.id}`;

  return (
    <nav className="bg-gray-900 p-4 text-white flex justify-between items-center shadow-lg">
      <div className="text-2xl font-bold">Runiverse Trail</div>
      <ul className="flex space-x-8">
        <li>
          <Link href="/" legacyBehavior>
            <a className="hover:text-gray-400 transition-colors duration-200">Home</a>
          </Link>
        </li>
        <li>
          <Link href="/profile" legacyBehavior>
            <a className="hover:text-gray-400 transition-colors duration-200">Profile</a>
          </Link>
        </li>
        <li>
          <Link href="/store" legacyBehavior>
            <a className="hover:text-gray-400 transition-colors duration-200">Store</a>
          </Link>
        </li>
        <li>
        <Link href="/game" legacyBehavior>
            <a className="hover:text-gray-400 transition-colors duration-200">Game</a>
          </Link>
        </li>
      </ul>

      <CustomConnectButton />

    </nav>
  );
};

export default CharNavBar;
