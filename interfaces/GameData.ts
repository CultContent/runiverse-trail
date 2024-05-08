export interface GameData {
    primaryImageUri: string
    primaryPromptText: string
    choices: GameChoices[]
}

export interface GameChoices {
    Title: string
    Flavor: string
    Type: string
}
