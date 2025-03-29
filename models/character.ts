import { minLength, object, pipe, string, type InferInput } from "valibot";

/**
 * Schema definition for a Character using Valibot.
 * Ensures that `name` and `lastName` have a minimum length of 6 characters.
 */
export const CharacterSchema = object({
  name: pipe(string(), minLength(6)),
  lastName: pipe(string(), minLength(6)),
});

/**
 * Type definition for a Character.
 * Includes the schema-defined fields and an additional `id` field.
 */
export type Character = InferInput<typeof CharacterSchema> & {
  id: number;
};

/**
 * In-memory storage for characters using a Map.
 * The key is the character's ID, and the value is the Character object.
 */
const characters: Map<number, Character> = new Map();

/**
 * Retrieves all characters from the in-memory storage.
 *
 * @returns {Character[]} - An array of all characters.
 */
export const getAllCharacters = (): Character[] => {
  return Array.from(characters.values());
};

/**
 * Retrieves a character by its ID.
 *
 * @param {number} id - The ID of the character to retrieve.
 * @returns {Character | undefined} - The character if found, otherwise `undefined`.
 */
export const getCharacterById = (id: number): Character | undefined => {
  return characters.get(id);
};

/**
 * Adds a new character to the in-memory storage.
 *
 * @param {Character} character - The character to add.
 * @returns {Character} - The newly added character with a generated ID.
 */
export const addCharacter = (character: Character): Character => {
  if (character.id && !characters.has(character.id)) {
    console.error(`Character with id ${character.id} already exists`);
    return character;    
  }

  const newCharacter = { 
    ...character,
    id: new Date().getTime()
  };
  characters.set(newCharacter.id, newCharacter);
  return newCharacter;
};

/**
 * Updates an existing character in the in-memory storage.
 *
 * @param {number} id - The ID of the character to update.
 * @param {Character} updateCharacter - The updated character data.
 * @returns {Character | null} - The updated character if successful, otherwise `null`.
 */
export const updateCharacter = (id: number, updateCharacter: Character): Character | null => {
  if (!characters.has(id)) {
    console.error(`Character with id ${id} not found`);
    return null;
  }

  characters.set(id, updateCharacter);
  return updateCharacter;
};

/**
 * Deletes a character from the in-memory storage.
 *
 * @param {number} id - The ID of the character to delete.
 * @returns {boolean} - `true` if the character was deleted, otherwise `false`.
 */
export const deleteCharacter = (id: number): boolean => {
  if (!characters.has(id)) {
    console.error(`Character with id ${id} not found`);
    return false;
  }

  characters.delete(id);
  return true;
};