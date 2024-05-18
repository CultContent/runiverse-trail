import React from "react";
import { useCharacter } from "../context/CharacterContext";

const CharNavBar: React.FC = () => {
    const { selectedCharacter } = useCharacter();
    const characterUrl = `https://www.forgottenrunes.com/api/art/wizards/${selectedCharacter?.id}`
    console.log('Selected Character:', selectedCharacter); // Debugging log

    return (
        <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
            <div className="text-xl font-bold">Runiverse Trail</div>
            <div>
                {selectedCharacter ? (
                    <div className="flex items-center space-x-2">
                        
                        {characterUrl && <img src={characterUrl} alt="Character" style={{ width: '50px', height: '50px' }} />}
                        
                    </div>
                ) : (
                    <span>No character selected</span>
                )}
            </div>
        </nav>
    );
};

export default CharNavBar;
