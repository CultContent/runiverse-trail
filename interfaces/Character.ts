import { Skills } from "@/types/CharacterSkills";

/**
 * Character is the primary container for an in-game Character
 */
export interface Character {
    ChainID: number;
    TokenID: number;
    Name: string;
    MetadataURI: string | null;
    ImageURI: string;
    Skills: CharacterSkills[]
}

/**
 * Character skills represents the skill options for a character
 */
export interface CharacterSkills {
    Skill: Skills;
    Value: number;
}