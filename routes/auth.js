import { Router } from "express";
import passport from "passport";
import LocalStrategy from "passport-local";
import pool from "../db/pool.js";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";

const authRouter = new Router();
passport.use(
  new LocalStrategy(async function verify(username, password, cb) {
    try {
      const result = await pool.query(
        "SELECT * FROM users WHERE username = ($1)",
        [username]
      );

      if (result.rows.length === 0) {
        return cb(null, false, { message: "Incorrect username or password." });
      }

      const user = result.rows[0];
      const isPasswordMatch = await bcrypt.compare(
        password,
        user.hashed_password
      );

      if (!isPasswordMatch) {
        return cb(null, false, { message: "Incorrect username or password." });
      }

      return cb(null, user);
    } catch (error) {
      return cb(error);
    }
  })
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, {
      id: user.id,
      username: user.username,
      membership_status: user.membership_status,
    });
  });
});

passport.deserializeUser(async function (user, cb) {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [
      user.id,
    ]);
    const fullUser = result.rows[0];
    cb(null, fullUser);
  } catch (err) {
    cb(err);
  }
});

export const signUpValidator = [
  body("first_name").trim().notEmpty().withMessage("Firstname is required"),
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required.")
    .custom(async (username) => {
      const { rows } = await pool.query(
        "SELECT id FROM users WHERE username = $1",
        [username]
      );
      if (rows.length > 0) {
        throw new Error("Username already taken.");
      }
    }),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("please enter a password")
    .isLength({ min: 4 })
    .withMessage("password must be atleast 4 charachters."),
  body("password_confirm")
    .trim()
    .notEmpty()
    .withMessage("please enter a password")
    .custom((pass, { req }) => pass === req.body.password)
    .withMessage("the two passwords must match."),
];

authRouter.get("/sign-up", (req, res) => {
  res.render("sign-up");
});

authRouter.post("/sign-up", signUpValidator, async (req, res, next) => {
  const errors = validationResult(req);
  console.log(req.body);
  if (!errors.isEmpty()) {
    return res.render("sign-up", {
      errors: errors.array(),
      formData: req.body,
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const result = await pool.query(
      "INSERT INTO users (first_name, last_name, username, hashed_password) VALUES ($1, $2, $3, $4) RETURNING id",
      [
        req.body.first_name,
        req.body.last_name,
        req.body.username,
        hashedPassword,
      ]
    );

    const user = {
      id: result.rows[0].id,
      username: req.body.username,
      membership_status: false,
    };

    req.login(user, function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

authRouter.get("/sign-in", (req, res) => {
  res.render("sign-in");
});
authRouter.post(
  "/sign-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/sign-in",
  })
);

authRouter.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

authRouter.get("/sign-up-admin", (req, res) => {
  res.render("sign-up-admin");
});

const adminSignUpValidator = [
  body("admin_key")
    .trim()
    .notEmpty()
    .withMessage("Admin key is required to sign up as an admin.")
    .custom((adminKey) => {
      if (adminKey !== process.env.ADMIN_PASS) {
        throw new Error("Incorrect Admin Key.");
      }
      return true;
    }),
];

authRouter.post(
  "/sign-up-admin",
  signUpValidator,
  adminSignUpValidator,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("sign-up-admin", {
        errors: errors.array(),
        formData: req.body,
      });
    }

    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const result = await pool.query(
        "INSERT INTO users (first_name, last_name, username, hashed_password, is_admin, membership_status) VALUES ($1, $2, $3, $4, TRUE, TRUE) RETURNING id",
        [
          req.body.first_name,
          req.body.last_name,
          req.body.username,
          hashedPassword,
        ]
      );

      const user = {
        id: result.rows[0].id,
        username: req.body.username,
        is_admin: true,
      };

      req.login(user, function (err) {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

export default authRouter;
