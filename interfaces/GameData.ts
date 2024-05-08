
/**
 * GameData interface is the primary interface for communication of game data and game state 
 */
export interface GameData {
    primaryImageUri: string
    primaryPromptText: string
    choices: GameChoices[]
}

/**
 * GameChoices is a sub-interface that contains a choice for the user to take
 */
export interface GameChoices {
    Title: string
    Flavor: string
    Type: string
}
