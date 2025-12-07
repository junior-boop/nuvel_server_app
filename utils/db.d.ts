import { AiHistoryType } from ".";
import {
  filterProps,
  filterResultProps,
} from "../../communs/ui/bible_component/livre";

export type Notes = {
  id: string;
  body: string;
  creator: string;
  pinned: 0 | 1;
  archived: 0 | 1;
  grouped: string | null;
  html: string;
  created: Date;
  modified: Date;
  clientversion: number;
  lastSyncUpdate: string | Date;
  version: number;
  publishId: string | null;
};

export type User = {
  id: string;
  name: string;
  first_name: string;
  email: string;
  church_status: "Pastor" | "Elder" | "Deacon" | "Leader" | "Member";
  domination: string;
  biography: string;
  photo: string;
  created: string;
  modified: string;
  lastlogin: string;
  lastlogout: string;
};

export type Groups = {
  id: string;
  name: string;
  userid: string;
  created: Date;
  modified: Date;
  lastSyncUpdate: string | Date;
  version: number;
};

export interface ArticlesType {
  id?: string;
  imageurl: string;
  userid: string;
  noteid: string;
  body: string;
  description: string;
  topic: string;
  title: string;
  appreciation: string;
  createdAt: string;
  updatedAt: string;
  version: number | 1;
}

export interface Comments {
  id: string;
  articleId: string;
  creator: string;
  content: string;
  notes: number;
  created: string;
  modified: string;
}

export interface Appreciations {
  id: string;
  articleId: string;
  userid: string;
}

export interface SyncEvent {
  id: string;
  userid: string;
  deviceid: string;
  noteid: string;
  action: string;
  timestamp: string;
  synced: boolean;
}

export interface Devices {
  id: string;
  userid: string;
  devicename: string;
  devicecharac: string;
  created: string;
}

/* 
CREATE TABLE IF NOT EXISTS groups (
        id TEXT PRIMARY KEY,
        name TEXT,
        created ,
        modified INTEGER
    );
*/

export type Session = {
  id: string;
  iduser: string;
  name?: string;
  email?: string;
};

export type UserInput = {
  name: string;
  email: string;
  lastlogin: string;
  lastlogout: string;
};

export type DeletedNote = {
  id: string;
};

export type ModifiedNote = {
  id: string;
  body: string;
  modified: number;
};

export type ArchivedNote = {
  id: string;
  archived: boolean;
};

export type GroupedLink = {
  id: string;
  grouped: string;
};

export type PinningNote = {
  id: string;
  pinned: boolean;
};

export type usersession = {
  id: string;
  iduser: string;
  name: string;
  email: string;
};

export interface ImagesType {
  id: string;
  userid: string;
  name: string;
  url: string;
  mineType: string;
  size: number;
  created: Date | string;
  modified: Date | string;
}
