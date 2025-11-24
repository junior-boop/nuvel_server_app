import db from "./function";
import {
  User as UserType,
  Notes as NotesType,
  ArticlesType,
  Comments as CommentType,
  Appreciations as AppreciationType,
  Devices as DeviceType,
  SyncEvent as SyncEventType,
  Groups as GroupTable,
} from "./db";

export type ENV = Partial<CloudflareBindings>;

export const UsersAccount = (env: ENV) => {
  const users = db(env).createModel<UserType>("users", {
    id: "TEXT PRIMARY KEY NOT NULL",
    name: "TEXT NOT NULL",
    email: "TEXT NOT NULL UNIQUE",
    first_name: "TEXT NOT NULL",
    // @ts-ignore
    church_status: "TEXT NOT NULL DEFAULT Member",
    domination: "TEXT NULL",
    biography: "TEXT NULL",
    photo: "TEXT NULL",
    lastlogin: "TEXT NULL",
    lastlogout: "TEXT NULL",
    created: "DATETIME DEFAULT CURRENT_TIMESTAMP",
    modified: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
  });

  (async () => await users.createTable())();
  return users;
};

export const Notes = (env: ENV) => {
  const userNotes = db(env).createModel<NotesType>(`notes`, {
    id: "TEXT PRIMARY KEY",
    body: "TEXT",
    creator: "TEXT",
    pinned: "INTEGER",
    archived: "INTEGER",
    grouped: "TEXT NULL",
    created: "DATETIME DEFAULT CURRENT_TIMESTAMP",
    modified: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    lastSyncUpdate: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    html: "TEXT NULL",
    // @ts-ignore
    clientversion: "INTEGER NOT NULL DEFAULT 0",
    // @ts-ignore
    version: "INT NOT NULL DEFAULT 1",
  });

  (async () => await userNotes.createTable())();

  return userNotes;
};

export const Articles = (env: ENV) => {
  const articles = db(env).createModel<ArticlesType>("articles", {
    id: "TEXT PRIMARY KEY NOT NULL",
    userid: "TEXT NOT NULL",
    imageurl: "TEXT",
    noteid: "TEXT NOT NULL",
    body: "TEXT NOT NULL",
    description: "TEXT NOT NULL",
    title: "TEXT NOT NULL",
    topic: "TEXT",
    appreciation: "TEXT NOT NULL UNIQUE",
    createdAt: "DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP",
    updatedAt: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
  });

  (async () => await articles.createTable())();
  return articles;
};

export const Comments = (env: ENV) => {
  const comments = db(env).createModel<CommentType>("comments", {
    id: "TEXT PRIMARY KEY NOT NULL",
    articleId: "TEXT NOT NULL UNIQUE",
    content: "TEXT NOT NULL",
    creator: "TEXT NOT NULL",
    created: "DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP",
    modified: "TIME DEFAULT CURRENT_TIMESTAMP",
  });

  (async () => await comments.createTable())();
  return comments;
};

export const GroupsTable = (env: ENV) => {
  const grouped = db(env).createModel<GroupTable>("groupes", {
    id: "TEXT PRIMARY KEY NOT NULL",
    userid: "TEXT NOT NULL",
    name: "TEXT NOT NULL",
    lastSyncUpdate: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    version: "INT NOT NULL DEFAULT 1",
    created: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    modified: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
  });

  (async () => await grouped.createTable())();
  return grouped;
};

export const Appreciations = (env: ENV) => {
  const appreciations = db(env).createModel<AppreciationType>("appreciations", {
    id: "TEXT PRIMARY KEY NOT NULL",
    articleId: "TEXT NOT NULL",
    userid: "TEXT NOT NULL",
  });

  (async () => await appreciations.createTable())();
  return appreciations;
};

export const UserDevice = (env: ENV) => {
  const device = db(env).createModel<DeviceType>("devices", {
    id: "TEXT PRIMARY KEY NOT NULL",
    userid: "TEXT NOT NULL",
    devicename: "TEXT NOT NULL",
    devicecharac: "TEXT NOT NULL",
    created: "TEXT",
  });

  (async () => await device.createTable())();
  return device;
};

export const SyncTable = (env: ENV) => {
  const syncTable = db(env).createModel<SyncEventType>("sync_event", {
    id: "TEXT PRIMARY KEY NOT NULL",
    deviceid: "TEXT NULL",
    noteid: "TEXT NOT NULL",
    userid: "TEXT NOT NULL",
    action: "TEXT NOT NULL",
    synced: "BOOLEAN NOT NULL DEFAULT 0",
    timestamp: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
  });

  (async () => await syncTable.createTable())();
  return syncTable;
};

// export const SyncLog = (env:ENV) => {
//   const syncLog = db(env).createModel("sync_log", {
//     id : "TEXT PRIMARY KEY NOT NULL",
//     userid
//   })
// }
