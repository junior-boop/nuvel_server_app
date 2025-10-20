import { SimpleORM, ModelFactory } from "./simpleorm";

type Env = Partial<CloudflareBindings>;

const db = (env: Env) => {
  const orm = new SimpleORM(env.DB as D1Database);
  const database = new ModelFactory(orm);

  orm.exec("ALTER TABLE users ADD COLUMN first_name TEXT NOT NULL");
  orm.exec(
    "ALTER TABLE users ADD COLUMN church_status TEXT NOT NULL DEFAULT Member"
  );
  orm.exec("ALTER TABLE users ADD COLUMN domination TEXT NOT NULL");
  orm.exec("ALTER TABLE users ADD COLUMN biography TEXT NOT NULL");

  return database;
};

export default db;
