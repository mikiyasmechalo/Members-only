// #! /usr/bin/env node

import { Client } from "pg";

const SQL = `
create table users (
  id serial primary key,
  first_name varchar(50) not null,
  last_name varchar(50),
  username varchar(50),
  hashed_password text,
  membership_status bool
);

create table message (
  id serial primary key,
  text text not null,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  foreign key user_id references users(id)
);
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: "postgresql://postgres:zloap@localhost:5432/members_only",
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
