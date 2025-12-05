import { SimpleORM, ModelFactory } from "./simpleorm";

type Env = Partial<CloudflareBindings>;

const db = (env: Env) => {
  const orm = new SimpleORM(env.DB as D1Database);
  const database = new ModelFactory(orm);
  return database;
};

export default db;
