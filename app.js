import express, { urlencoded } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import authRouter from "./routes/auth.js";
import session from "express-session";
import passport from "passport";
import indexRouter from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.authenticate("session"));

app.use((req, res, next) => {
  // console.log(req.user);
  res.locals.user = req.user;
  next();
});

app.use("/", authRouter);
app.use("/", indexRouter);

app.listen(3000, () => {
  console.log("server is lisniing on port 3000!");
});
