import React, { useEffect, useState } from 'react';
import CharacterSelect from '../CharacterSelect';
import { useUserTokens } from '@reservoir0x/reservoir-kit-ui';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useCharacter } from '../../context/CharacterContext';
import styles from "@/app/pixelbutton.module.css"

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

  const { data: tokens } = useUserTokens(accountAddress ?? '', {
    collectionsSetId: 'bf781912648d9b6c1e0148bc991dceefc09f47fc9050ae8421414e8e33077100',
  });

  const handleCharacterSelect = (character: { id: string; contract: string }) => {
    console.log('Character selected:', character);
    setSelectedCharacter(character);
  };

  return (
    <div className="container mx-auto p-6">
      {equipScreen === EquipScreen.CharacterSelection && (
        <div className="">
          <h2 className="text-8xl font-bold text-gray-900 text-center mb-8 font-upheav tracking-wide mt-10">Choose your Adventurer</h2>
          {/* <div className="border grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"> */}
          <div className="pixel_container py-6 flex justify-center flex-row flex-wrap gap-3">
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

      {equipScreen === EquipScreen.CharacterSelection && (
        <div className="mt-8 text-center">
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
                      <button
                        onClick={() => setEquipScreen(EquipScreen.Equip)}
                        className={styles.pixel_button}
                      >
                        Proceed
                      </button>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
      )}
    </div>
  );
};

export default CharacterMenu;
