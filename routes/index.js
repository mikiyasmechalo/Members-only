import { Router } from "express";
import pool from "../db/pool.js";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

const indexRouter = new Router();

indexRouter.post("/delete-message", async (req, res) => {
  if (!req.user) {
    return res.redirect("/sign-in");
  }

  const messageId = req.body.m_id;

  if (!messageId) {
    console.log("first");
    return res.redirect("/");
  }
  if (!req.user.is_admin) {
    return res.render("index");
  }
  try {
    await pool.query("DELETE FROM message WHERE id = $1", [messageId]);
  } catch (error) {
    res.red("index", { error });
  }
  res.redirect("/");  
});

indexRouter.get("/", async (req, res) => {
  const { rows } = await pool.query(`
      SELECT
      m.id AS message_id,
      m.title,
      m.text,
      m.timestamp,
      u.username
  FROM
      message AS m
  JOIN
      users AS u ON m.user_id = u.id;`);
  if (rows.length === 0) {
    return res.render("index");
  }
  // console.log(rows)
  res.render("index", { messages: rows });
});

indexRouter.get("/create-post", (req, res) => {
  res.render("new-message");
});

indexRouter.post("/create-post", async (req, res) => {
  if (req.user) {
    await pool.query(
      "INSERT INTO message (title, text, user_id) VALUES ($1, $2, $3)",
      [req.body.title, req.body.text, req.user.id]
    );
  } else {
    console.log("req");
  }
  res.redirect("/");
});

indexRouter.get("/password", (req, res) => {
  res.render("password");
});

indexRouter.post("/password", async (req, res) => {
  if ((req.body.password = process.env.PASSWORD)) {
    await pool.query(
      "UPDATE users SET membership_status = true WHERE id = ($1);",
      [req.user.id]
    );
    req.user.membership_status = true;
    res.redirect("/");
  }
});

export default indexRouter;

/*
TODO:
- express-validator
- members - related things
- admin
*/
