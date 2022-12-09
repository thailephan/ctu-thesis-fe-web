import { openDB, DBSchema, IDBPDatabase, deleteDB } from "idb";
import Helpers from "./helpers";
import {IMessage} from "./interface";

let db: any = null;
let isNotSupported = false;

const version = 1;
const dbName = "chat-web";

const messageStoreName = "messages";

if (!('indexedDB' in window)) {
    isNotSupported = true;
    console.warn('IndexedDB not supported')
}

interface MyDB extends DBSchema {
    [messageStoreName]: {
        key: string;
        value: IMessage;
        indexes: { 'channelId': number };
    },
}

export const isDBExisted = !Helpers.isNullOrEmpty(db);

export const saveMessage = async (message: any) => {
    try {
        const db = await getDBInstance()
        if (db) {
            const tx = db.transaction(messageStoreName, 'readwrite')
            const store = tx.objectStore(messageStoreName)

            store.add(message)
            return tx.done;
        }
        console.log(store);
        return null;
    } catch (e: any) {
        console.log(e);
        return e.message;
    }
}
export const getMesasgeByChannel = async ({ channelId }) => {
    const range = IDBKeyRange.bound(channelId, channelId);
    const messages: {[key:number]: IMessage} = {};
    try {
        const db = await getDBInstance()

        if (db) {
            const store  = await db.transaction(messageStoreName, 'readonly').store
            const index = await store.index("channelId");
            let cursor = await index.openCursor(range);

            while (cursor) {
                messages[cursor.value.id] = cursor.value;
                cursor = await cursor.continue();
            }
            return messages;
        }

        return [];
    } catch (e) {
        return e.message;
    }
}

export async function dropDB({dbName}: {dbName: string}) {
    await deleteDB(dbName)
    return true;
}

async function getDBInstance(): Promise<IDBPDatabase<MyDB> | null> {
   if (isNotSupported) {
      return null;
   } else {
      if(isDBExisted) {
         return db;
      } else {
          db = await openDB<MyDB>(dbName, version, {
              upgrade(db, oldVersion, newVersion, transaction) {
                  if (!db.objectStoreNames.contains(messageStoreName)) {
                      const messageStore = db.createObjectStore(messageStoreName, {keyPath: 'id'});
                      messageStore.createIndex('channelId', 'channelId', { unique: false });
                  }
              }
          });
          return db;
      }
   }
}

export default getDBInstance;