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
}

export interface Comments {
  id: string;
  articleId: string;
  creator: string;
  content: string;
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

declare global {
  interface Window {
    electronAPI: {
      db: {
        getnotes: () => string;
      };
    };
    api: {
      bible: ({
        chap,
        livre,
        vers1,
        vers2,
      }: filterProps) => filterResultProps | undefined;
      external: {
        setExternalData: (data: UserInput) => Promise<User | undefined>;
        getExternalData: () => Promise<User | undefined>;
      };
      db: {
        addsessionid: (data: string) => void;
        getsessionid: () => string;
        checkdatabase: () => Promise<{ result: number }>;
        getnotes: () => Promise<Notes[]>;
        getnotesid: (id: string) => Promise<Notes>;
        modifynoteid: ({
          id,
          body,
        }: {
          id: string;
          body: string;
        }) => Promise<Notes>;
        getnotesarchived: () => Promise<Notes[]>;
        setnotesarchived: ({
          id,
          archived,
        }: {
          id: string;
          archived: 0 | 1;
        }) => Promise<Notes[]>;
        getnotespinned: () => Promise<Notes[]>;
        setnotespinned: (data) => Notes[];
        setnote: (data: Notes) => Promise<Notes>;
        deletenote: (id: string) => Promise<boolean>;
        addnotetogroup: (data: {
          id: string;
          grouped: string;
        }) => Promise<Notes>;
        getuserinfos: (id: string) => Promise<User>;
        getsession: () => Promise<usersession[] | []>;
        setsession: (data: User) => Promise<{
          id: string;
          iduser: string;
          name: string;
          email: string;
        }>;
        deletesession: () => Promise<string>;
        getgroupes: () => Promise<Groups[]>;
        setgroup: (data: Groups) => Promise<Groups>;
        modifiedgroup: ({
          id,
          name,
        }: {
          id: string;
          name: string;
        }) => Promise<Groups>;
        deletegroup: (id: string) => Promise<Groups>;
        getaihistory: (id: string) => Promise<AiHistoryType[]>;
      };
      agent: (
        context: {
          iduser: string;
          content: string;
        },
        promt: string
      ) => Promise<{ text: string; history: AiHistoryType[] }>;
      aicorrectagent: (promt: string) => Promise<{ text: string }>;
    };
  }
}
