import PouchDB from 'pouchdb-browser';
import type { FSItem } from '$lib/models/FSItem'

const DATABASE_NAME: string = 'FileExplorerTree';
const _ID_ROOT_ITEM: string = '_ID_ROOT_ITEM';

export class FSItemRepository {
  private static db: PouchDB.Database;

  public static init(): void {
    FSItemRepository.db = new PouchDB(DATABASE_NAME);
    console.log('Finished opening the database "' + DATABASE_NAME);
    console.log('Database info:');
    console.log(FSItemRepository.db.info());
  }

  public static updateRootFSItem(rootFSItem: FSItem): Promise<void> {
    return FSItemRepository.db.get(_ID_ROOT_ITEM)
      .then((existingRootItem: PouchDB.Core.Document<any>) => {
        const updatedRootItem = { ...existingRootItem, ...rootFSItem };
        return FSItemRepository.db.put(updatedRootItem);
      })
      .catch((error) => {
        if (error.status === 404) {
          // Root item not found, create a new one.
          return FSItemRepository.db.put({
            _id: _ID_ROOT_ITEM,
            rootFSItem,
          });
        } else {
          throw error;
        }
      });
  }

  public static loadRootFSItem(): Promise<FSItem | null> {
    return FSItemRepository.db.get(_ID_ROOT_ITEM)
      .then((rootItemDoc: PouchDB.Core.Document<any>) => {
        return rootItemDoc.rootFSItem;
      })
      .catch((error) => {
        if (error.status === 404) {
          // Root item not found, return null.
          return null;
        } else {
          throw error;
        }
      });
  }
}