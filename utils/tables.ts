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
  ImagesType,
  Country,
  TokenBlacklist as TokenBlacklistType,
  SyncEvent,
  HistoryType,
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
    association: "TEXT NULL",
    biography: "TEXT NULL",
    photo: "TEXT NULL",
    lastlogin: "TEXT NULL",
    lastlogout: "TEXT NULL",
    created: "DATETIME DEFAULT CURRENT_TIMESTAMP",
    modified: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    country: "TEXT NULL",
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
    publishId: "TEXT NULL", // le texte qui entre dans cet element c'est l'Id de la publication, la date de la dernier mise a jour et le la version de la publication.
    // @ts-ignore
    clientversion: "INTEGER NOT NULL DEFAULT 0",
    lastSyncedAt: "TEXT", // NOUVEAU
    deviceId: "TEXT",     // NOUVEAU
    version: "INTEGER NOT NULL DEFAULT 1", // NOUVEAU
  });

  (async () => await userNotes.createTable())();

  return userNotes;
};
export const Publish = (env: ENV) => {
  const userNotes = db(env).createModel<ArticlesType>(`publish`, {
    id: "TEXT PRIMARY KEY",
    userid: "TEXT",
    body: "TEXT",
    createdAt: "DATETIME DEFAULT CURRENT_TIMESTAMP",
    updatedAt: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    title: "TEXT NULL",
    appreciation: "TEXT NULL",
    imageurl: "TEXT NULL",
    noteid: "TEXT NULL",
    topic: "TEXT NULL",
    description: "TEXT NULL",
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
    // @ts-ignore
    version: "INT NOT NULL DEFAULT 1",
  });

  (async () => await articles.createTable())();
  return articles;
};

export const Comments = (env: ENV) => {
  const comments = db(env).createModel<CommentType>("comments", {
    id: "TEXT PRIMARY KEY NOT NULL",
    articleId: "TEXT NOT NULL",
    content: "TEXT NOT NULL",
    // @ts-ignore
    notes: "INTEGER NOT NULL DEFAULT 0",
    creator: "TEXT NOT NULL",
    // @ts-ignore
    upvotes: "TEXT NOT NULL DEFAULT '[]'", // JSON array of userids who upvoted
    // @ts-ignore
    signals: "TEXT NOT NULL DEFAULT '[]'", // JSON array of userids who reported
    created: "DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP",
    modified: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
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
    lastSyncedAt: "TEXT", // NOUVEAU
    deviceId: "TEXT",     // NOUVEAU
    // @ts-ignore
    version: "INT NOT NULL DEFAULT 1",
    created: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    modified: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
  });

  (async () => await grouped.createTable())();
  return grouped;
};
export const ImagesTable = (env: ENV) => {
  const Images = db(env).createModel<ImagesType>("images", {
    id: "TEXT PRIMARY KEY NOT NULL",
    userid: "TEXT NOT NULL",
    name: "TEXT NOT NULL",
    mineType: "TEXT NOT NULL",
    url: "TEXT NOT NULL",
    size: "INTEGER NOT NULL",
    created: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    modified: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
  });

  (async () => await Images.createTable())();
  return Images;
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

export const SyncEventsTable = (env: ENV) => {
  const syncEvents = db(env).createModel<SyncEvent>("sync_events", {
    id: "TEXT PRIMARY KEY NOT NULL",
    userId: "TEXT NOT NULL",
    deviceId: "TEXT NOT NULL",
    entityType: "TEXT NOT NULL",
    entityId: "TEXT NOT NULL",
    action: "TEXT NOT NULL",
    data: "TEXT NOT NULL",
    timestamp: "TEXT NOT NULL",
    synced: "INTEGER NOT NULL DEFAULT 0",
    created: "TEXT NOT NULL",
  });
  (async () => await syncEvents.createTable())();
  return syncEvents;
};

export const CountryTable = (env: ENV) => {
  const countryTable = db(env).createModel<Country>("countries", {
    id: "TEXT PRIMARY KEY NOT NULL",
    name: "TEXT NOT NULL",
    code_2: "TEXT NOT NULL",
    code_3: "TEXT NOT NULL",
    phoneCode: "TEXT NOT NULL",
  });

  (async () => await countryTable.createTable())();
  return countryTable;
};

export const TokenBlacklistTable = (env: ENV) => {
  const tokenBlacklist = db(env).createModel<TokenBlacklistType>("token_blacklist", {
    id: "TEXT PRIMARY KEY NOT NULL",
    token: "TEXT NOT NULL UNIQUE",
    userId: "TEXT NOT NULL",
    revokedAt: "TEXT NOT NULL",
    expiresAt: "TEXT NOT NULL",
  });

  (async () => await tokenBlacklist.createTable())();
  return tokenBlacklist;
};

export const HistoryTable = (env: ENV) => {
  const historyTable = db(env).createModel<HistoryType>("history", {
    id: "TEXT PRIMARY KEY NOT NULL",
    articleid: "TEXT NOT NULL",
    articleImage: "TEXT NOT NULL",
    articleTitle: "TEXT NOT NULL",
    articleCreatedAt: "TEXT NOT NULL",
    userid: "TEXT NOT NULL",
    lastReading: "TEXT NOT NULL",
  });

  (async () => await historyTable.createTable())();
  return historyTable;
};