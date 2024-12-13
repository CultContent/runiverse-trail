const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const characterApi = {
  async getAllCharacters() {
    const response = await fetch(`${API_BASE_URL}/characters`);
    if (!response.ok) throw new Error('Failed to fetch characters');
    return response.json();
  },

  async getCharacter(name: string) {
    const response = await fetch(`${API_BASE_URL}/characters/${name}`);
    if (!response.ok) throw new Error('Failed to fetch character');
    return response.json();
  },

  async saveCharacter(characterData: any) {
    const response = await fetch(`${API_BASE_URL}/characters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(characterData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to save character');
    }
    return response.json();
  },

  async updateCharacter(name: string, characterData: any) {
    const response = await fetch(`${API_BASE_URL}/characters/${name}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(characterData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update character');
    }
    return response.json();
  },

  async deleteCharacter(name: string) {
    const response = await fetch(`${API_BASE_URL}/characters/${name}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete character');
    }
    return response.json();
  },
};