// CustomConnectButton.tsx
import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useCharacter } from '../context/CharacterContext';
import { useRouter } from 'next/router';

const CustomConnectButton: React.FC = () => {
  const { selectedCharacter } = useCharacter();
  const router = useRouter();
  const characterUrl = selectedCharacter
    ? `https://www.forgottenrunes.com/api/art/wizards/${selectedCharacter.id}`
    : null;

  return (
    <ConnectButton.Custom>
      {({ account, chain, openChainModal, openConnectModal, openAccountModal, mounted }) => {
        const ready = mounted && "loading";
        const connected = ready && account && chain && "authenticated";

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="bg-white text-black font-ocra uppercase text-sm py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
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
                <div className="flex items-center space-x-4 cursor-pointer">
                  <div className="flex items-center space-x-3" onClick={openAccountModal}>
                  <span className="text-white text-md font-ocra">{account.displayName}</span>
                    {characterUrl && (
                      <img
                        src={characterUrl}
                        alt="Character"
                        className="w-[44px] h-[44px] clip_img"
                      />
                    )}
                 
                  </div>

                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default CustomConnectButton;
