import type { IncomingMessage, ServerResponse } from "http";
import { sign } from "jsonwebtoken";
import { config } from "../config";
import { addRevokeToken, authSchema, createUser, findUserByEmail, HttpMethod, revokeUserToken, validatePassword } from "../models";
import { safeParse } from "valibot";
import { parseBody } from "../utils/parseBody";
import type { AuthenticatedRequest } from "../middleware/authentication";

export const  authRouter = async (req: IncomingMessage, res: ServerResponse) => {
  const { method, url } = req;

  if (url === "/auth/register" && method === HttpMethod.POST) {
    const body = await parseBody(req);
    const result = safeParse(authSchema, body);

    // console.log("result", result, result.issues);
    
    if (result.issues) {
      res.statusCode = 400;
      res.end(JSON.stringify({ message: "Bad Request" }));
      return;
    } 

    const { email, password } = body;

    try {
      const user = await createUser(email, password);

      res.statusCode = 201;
      res.end(JSON.stringify({ id: user.id, email: user.email }));
      return
      
    } catch (err) {
      if (err instanceof Error) {
        res.end(JSON.stringify({ message: err.message }));
      } else {
        res.end(JSON.stringify({ message: "Internal Server Error" }));
      }
      return; 
    }
  }

  if (url === "/auth/login" && method === HttpMethod.POST) {
    const body = await parseBody(req);
    const result = await safeParse(authSchema, body);

    if (result.issues) {
      res.statusCode = 400;
      res.end(JSON.stringify({ message: "Bad Request" }));
    } 

    const { email, password } = body;
    const user = findUserByEmail(email); 

    if(!user || !(await validatePassword(user, password))){
      res.statusCode = 401;
      res.end(JSON.stringify({ message: "Invalid email or password" }));
      return;
    }

    const accessToken = sign({ id: user.id, email: user.email, role: user.role }, config.jwSecret, { expiresIn: "1h" });

    const refreshToken = sign({ id: user.id }, config.jwSecret, { expiresIn: "1d" });

    user.refreshToken = refreshToken;

    res.end(JSON.stringify({ accessToken, refreshToken }));
    return;
  }

  if (url === "/auth/logout" && method === HttpMethod.POST) {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (token) {
      addRevokeToken(token);

      const formattedReq = req as AuthenticatedRequest;
      if (
        formattedReq.user &&
        typeof formattedReq.user === "object" &&
        "id" in formattedReq.user
      ) {
        const result = revokeUserToken(formattedReq.user.email);
        if (!result) {
          res.statusCode = 403;
          res.end(JSON.stringify({ message: "Forbidden" }));
          return;
        }
      }
      res.end(JSON.stringify({ message: "Logged out successfully" }));
      return;
    }    
  }
  res.statusCode = 404;
  res.end(JSON.stringify({ message: "Endpoint Not Found" }));
}
