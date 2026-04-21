import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "dist")));

// Safe SPA fallback
app.use((req, res, next) => {
  if (req.method !== "GET") return next();

  const acceptHeader = req.headers.accept || "";

  if (acceptHeader.includes("text/html")) {
    return res.sendFile(path.join(__dirname, "dist", "index.html"));
  }

  next();
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});