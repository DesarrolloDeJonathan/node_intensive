import cors from "cors";
import config from "./config";
import { createServer } from "http";
import { authRouter, characterRouter } from "./routes/";


const corsMiddleware = cors();

const server = createServer(async (req, res) => {
  corsMiddleware(req, res, async () => {
    // Your server logic here
    res.setHeader("Content-Type", "application/json");
    
    try {
      if (req.url?.startsWith("/auth")) {
        await authRouter(req, res);
      } else if (req.url?.startsWith("/characters")) {
        await characterRouter(req, res);
      } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ message: "Not Found" }));
      }

    } catch (_err) {
      res.statusCode = 500;
      res.end(JSON.stringify({ message: "Internal Server Error" }));
      
    }
  });
});

server.listen(config.port, () => {
  console.log("Server is running on port", config.port);
});