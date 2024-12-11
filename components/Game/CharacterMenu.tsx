import React, { useEffect, useState } from 'react';
import CharacterSelect from '../CharacterSelect';
import { useUserTokens } from '@reservoir0x/reservoir-kit-ui';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useCharacter } from '../../context/CharacterContext';
import styles from "@/app/pixelbutton.module.css"
import Link from 'next/link'

enum EquipScreen {
  CharacterSelection,
  Equip,
  Confirmation,
  Portal,
}

const CONTRACT_TO_COLLECTION_MAP: Record<string, string> = {
  '0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42': 'wizards',
  '0x4b1e130ae84c97b931ffbe91ead6b1da16993d45': 'babies',
  '0x9690b63eb85467be5267a3603f770589ab12dc95': 'warriors',
  '0x251b5f14a825c537ff788604ea1b58e49b70726f': 'souls',
};

const CharacterMenu: React.FC = () => {
  const { address: accountAddress } = useAccount();
  const { selectedCharacter, setSelectedCharacter } = useCharacter();
  const [equipScreen, setEquipScreen] = useState<EquipScreen>(EquipScreen.CharacterSelection);
  const [showNewButton, setShowNewButton] = useState(false);

  const { data: tokens } = useUserTokens(accountAddress ?? '', {
    collectionsSetId: 'bf781912648d9b6c1e0148bc991dceefc09f47fc9050ae8421414e8e33077100',
  });

  const handleCharacterSelect = (character: { id: string; contract: string }) => {
    console.log('Character selected:', character);
    setSelectedCharacter(character);
  };

  const handleProceed = () => {
    setShowNewButton(true);
    setEquipScreen(EquipScreen.Equip);
  };

  const handleNewButtonClick = () => {
    console.log('New button clicked!');
    // Add your new button functionality here
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center mx-auto p-6">
      {equipScreen === EquipScreen.CharacterSelection && (
        <div className="">
          <h2 className="text-5xl font-bold text-white text-center mb-8 font-atirose uppercase tracking-wide mt-10">Choose your<br/> Adventurer</h2>
          <div className="py-6 flex justify-center flex-row flex-wrap gap-3">
            {tokens?.map((token, i) => (
              <CharacterSelect
                id={token?.token?.tokenId ?? ''}
                contract={token?.token?.contract ?? ''}
                key={i}
                onSelect={handleCharacterSelect}
                isSelected={selectedCharacter?.id === token?.token?.tokenId}
                className={`cursor-pointer transition-transform transform hover:scale-105`}
              />
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 text-center space-y-4">
        <ConnectButton.Custom>
          {({ account, chain, openChainModal, openConnectModal, mounted }) => {
            const ready = mounted && 'loading';
            const connected = ready && account && chain && 'authenticated';

            return (
              <div
                {...(!ready && {
                  'aria-hidden': true,
                  style: {
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <button
                        onClick={openConnectModal}
                        type="button"
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Connect Wallet
                      </button>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <button
                        onClick={openChainModal}
                        type="button"
                        className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors"
                      >
                        Switch Networks
                      </button>
                    );
                  }

                  return (
                    !showNewButton && (
                      <button
                        onClick={handleProceed}
                        className="text-md text-black font-ocra uppercase py-2 px-4 rounded-xl bg-yellow"
                      >
                        Proceed
                      </button>
                    )
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>

        {showNewButton && (
          <div className="flex gap-3">
            <Link href="/trainer">
            <button
              onClick={handleNewButtonClick}
              className="text-md text-black font-ocra uppercase py-2 px-4 rounded-xl bg-yellow hover:bg-blue-600 transition-colors"
            >
              Agent Trainer
            </button>
          </Link>
          <Link href="/char_creation">
            <button
              onClick={handleNewButtonClick}
              className="text-md text-black font-ocra uppercase py-2 px-4 rounded-xl bg-yellow hover:bg-blue-600 transition-colors"
            >
             Character Editor
            </button>
          </Link>
           <Link href="/game">
            <button
              onClick={handleNewButtonClick}
              className="text-md text-black font-ocra uppercase py-2 px-4 rounded-xl bg-yellow hover:bg-blue-600 transition-colors"
            >
              Play The Game
            </button>
          </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterMenu;