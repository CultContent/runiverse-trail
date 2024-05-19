import React, { useEffect, useState } from "react";
import CharacterSelect from "../CharacterSelect";
import { useUserTokens } from "@reservoir0x/reservoir-kit-ui";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { matchTraitsToFile } from "./utils";
import axios from "axios";
import { useCharacter } from "../../context/CharacterContext";
import useCharacterData from "../../hooks/useCharacterData";

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
    '0x251b5f14a825c537ff788604ea1b58e49b70726f': 'souls'
};

const WARRIORS_CONTRACT = '0x9690b63eb85467be5267a3603f770589ab12dc95';
const BABIES_CONTRACT = '0x4b1e130ae84c97b931ffbe91ead6b1da16993d45';
const SOULS_CONTRACT = '0x251b5f14a825c537ff788604ea1b58e49b70726f';

const CharacterMenu: React.FC = () => {
    const { address: accountAddress } = useAccount();
    const { selectedCharacter, setSelectedCharacter } = useCharacter();
    const { characterData, loading } = useCharacterData(selectedCharacter?.id ?? null, selectedCharacter?.contract ?? null);
    const [equipScreen, setEquipScreen] = useState<EquipScreen>(EquipScreen.CharacterSelection);
    const [imageSuccess, setImageSuccess] = useState<boolean>(false);
    const [imageURL, setImageURL] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    useEffect(() => {
        console.log(characterData);
    }, [characterData]);

    const handleCharacterSelect = (character: { id: string; contract: string }) => {
        setSelectedCharacter(character);
    };

    useEffect(() => {
        if (selectedCharacter?.contract === WARRIORS_CONTRACT && characterData && characterData.attributes) {
            const matchedFiles = matchTraitsToFile(characterData.attributes);
        }
    }, [characterData, selectedCharacter]);

    const handleCloseSuccessMessage = () => {
        setShowSuccessMessage(false);
    };

    const collectionName = selectedCharacter?.contract
        ? CONTRACT_TO_COLLECTION_MAP[selectedCharacter.contract]
        : "unknown";
    const { data: tokens } = useUserTokens(accountAddress ?? "", {
        collectionsSetId: "bf781912648d9b6c1e0148bc991dceefc09f47fc9050ae8421414e8e33077100",
    });

    const handleGenerateArt = async () => {
        if (characterData) {
            const relevantAttributes = characterData.attributes.filter(attr =>
                ["background", "body", "familiar", "head", "prop", "rune", "weapon", "shield"].includes(attr.trait_type)
            );

            const buildObject = relevantAttributes.map(attr => ({
                name: attr.trait_type,
                item: attr.value.toLowerCase().replace(/ /g, '_').replace(/,/g, '')
            }));

            let modifiedTokenId = Number(characterData.id);

            if (selectedCharacter?.contract === BABIES_CONTRACT) {
                modifiedTokenId += 10000;
            } else if (selectedCharacter?.contract === WARRIORS_CONTRACT) {
                modifiedTokenId += 20000;
            }

            const requestModel = {
                name: characterData.name,
                tokenId: modifiedTokenId,
                collectionType: collectionName,
                buildObject
            };

            try {
                const response = await axios.post('http://localhost:5555/art/', requestModel);
                let storedImageLocation = response.data.replace(/\\/g, "/");
                const fullImageUrl = `file:///${storedImageLocation}`;
                setImageURL(fullImageUrl);
                setShowSuccessMessage(true);
            } catch (error) {
                console.error('Failed to generate art', error);
            }
        }
    };

    return (
        <div className="container mx-auto p-6">
            {equipScreen === EquipScreen.CharacterSelection && (
                <div>
                    <h2 className="text-3xl font-bold text-center mb-8">Choose your Adventurer</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {tokens?.map((token, i) => (
                            <CharacterSelect
                                id={token?.token?.tokenId ?? ""}
                                contract={token?.token?.contract ?? ""}
                                key={i}
                                onSelect={handleCharacterSelect}
                                isSelected={selectedCharacter?.id === token?.token?.tokenId}
                                className={`p-4 rounded-lg cursor-pointer transition-transform transform hover:scale-105 ${selectedCharacter?.id === token?.token?.tokenId ? 'border-4 border-green-500' : 'border-2 border-gray-300'}`}
                            />
                        ))}
                    </div>
                </div>
            )}

            {equipScreen === EquipScreen.CharacterSelection && (
                <div className="mt-8 text-center">
                    <ConnectButton.Custom>
                        {({ account, chain, openChainModal, openConnectModal, mounted }) => {
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
                                                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
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
