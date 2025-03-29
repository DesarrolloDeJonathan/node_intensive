import { IncomingMessage, ServerResponse } from "http"
import { authenticateToken, type AuthenticatedRequest } from "../middleware/authentication";
import { addCharacter, CharacterSchema, deleteCharacter, getAllCharacters, getCharacterById, HttpMethod, Role, updateCharacter, type Character } from "../models";
import { authorizeRoles } from "../middleware/authorization";
import { parseBody } from "../utils/parseBody";
import { safeParse } from "valibot";

/**
 * Handles routing for character-related endpoints.
 * 
 * @param {IncomingMessage} req - The incoming HTTP request.
 * @param {ServerResponse} res - The outgoing HTTP response.
 * @returns {Promise<void>} - Resolves when the response is sent.
 */
export const characterRouter = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
  const { method, url } = req;

  // Authenticate the token
  if (!await authenticateToken(req as AuthenticatedRequest, res)) {
    res.statusCode = 401;
    res.end(JSON.stringify({ message: "Unauthorized" }));
    return;    
  }

  // Handle GET request to fetch all characters
  if (url === "/characters" && method === HttpMethod.GET) {
    const characters = getAllCharacters();

    res.statusCode = 200;
    res.end(JSON.stringify({ characters }));
    return;
  }

  // Handle GET request to fetch a character by ID
  if (url === "/characters" && method === HttpMethod.GET) {
    const id = parseInt(url.split("/").pop() as string, 10);
    const character = getCharacterById(id);

    if (!character) {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: "Character not found" }));
      return;
    }

    res.statusCode = 200;
    res.end(JSON.stringify({ character }));
    return;
  }

  // Handle POST request to add a new character
  if (url === "/characters" && method === HttpMethod.POST) {
    if (!(await authorizeRoles(Role.ADMIN, Role.USER)(req as AuthenticatedRequest, res))) {
      res.statusCode = 403;
      res.end(JSON.stringify({ message: "Forbidden" }));
      return;        
    }
    
    const body = await parseBody(req);
    const result = safeParse(CharacterSchema, body);
    if (result.issues) {
      res.statusCode = 400;
      res.end(JSON.stringify({ message: result.issues }));
      return;
    }

    const character: Character = body;
    addCharacter(character);

    res.statusCode = 201;
    res.end(JSON.stringify(character));
    return;
  }

  // Handle PATCH request to update a character
  if (url?.startsWith("/characters/") && method === HttpMethod.PATCH) {
    if (!(await authorizeRoles(Role.ADMIN)(req as AuthenticatedRequest, res))) {
      res.statusCode = 403;
      res.end(JSON.stringify({ message: "Forbidden" }));
      return;        
    }

    const id = parseInt(url.split("/").pop() as string, 10);
    const body = await parseBody(req);
    const character: Character = body;
    const updatedCharacter = updateCharacter(id, character);

    if (!updatedCharacter) {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: "Character not found" }));
      return;
    } else {
      res.statusCode = 200;
      res.end(JSON.stringify(updatedCharacter));
      return;        
    }
  }

  // Handle DELETE request to remove a character
  if (url?.startsWith("/characters/") && method === HttpMethod.DELETE) {
    if (!(await authorizeRoles(Role.ADMIN)(req as AuthenticatedRequest, res))) {
      res.statusCode = 403;
      res.end(JSON.stringify({ message: "Forbidden" }));
      return;        
    }

    const id = parseInt(url.split("/").pop() as string, 10);
    const success = deleteCharacter(id);

    if (!success) {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: "Character not found" }));
    } else {
      res.statusCode = 204;
      res.end(JSON.stringify({ message: "Character deleted successfully" }));
    }
    return;    
  }

  // Handle unknown endpoints
  res.statusCode = 404;
  res.end(JSON.stringify({ message: "Endpoint Not Found" }));
}

