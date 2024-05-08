import { NextApiRequest, NextApiResponse } from 'next';
import { GameData } from '../../interfaces/GameData';

// Placeholder game content example body
export async function getGameData(): Promise<GameData> {
    const gameData: GameData = {
        "primaryImageUri": "https://zork.nyc3.cdn.digitaloceanspaces.com/wizards/twoWizards.png",
        "primaryPromptText": "As you stroll through the guarded forest you spot what appears to be two wizards aimlessly crossing a bridge. One is armed with a short sword, and the other shows no weapons. In your experience you've known wizards to be somewhat unpredictable. What do you do?",
        "choices": [
            { Title: "Attack", Flavor: "Most outlaws prefer to strike when there are no witnesses.", Type: "Combat" },
            { Title: "Flee", Flavor: "There is no harm in avoiding conflict, only ego.", Type: "Escape" },
            { Title: "Commune", Flavor: "Use your golden tongue in an attempt to engage.", Type: "Dialogue" },
            { Title: "Conjure", Flavor: "Look deeply into your back of tricks.", Type: "Sorcery" }
        ]
    }
    return gameData;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "POST") {
        // Collect information on incoming GameData
        const choice = req.body['choice']
        console.log("Choice", choice)

        res.status(200).json({ "choice": choice })
    }

    if (req.method == "GET") {
        // Get outgoign information about the GameState
        const gameData = await getGameData();

        res.status(200).json(gameData)
    }
}