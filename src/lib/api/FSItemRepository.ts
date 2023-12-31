import Dexie from 'dexie';
import { type FSItem, DirectoryItem, FileItem } from '$lib/models/FSItem';

const DATABASE_NAME: string = 'FileExplorerTree';
const ID_ROOT_ITEM: string = "-1";

const MOCK_ROOT_ITEM: DirectoryItem = new DirectoryItem(ID_ROOT_ITEM, "D", "rootDirectory");

/**
 * TODO: I had a doubt about storing the whole original Typescript FSItem class. That's why I went through
 * the additional step of using a DTO class . However, Dexie provides an helper method apparently, Table.mapToClass(),
 * which was created for the purpose of working with real classes ?
 * 
 * "But you could also work with real classes so that the objects retrieved from the database will be actual instances of the class you have defined in typescript. This is simply accomplished by using Table.mapToClass()."
 * https://dexie.org/docs/Typescript
 */
class FSItemDTO {
  constructor(
    public id: string,
    public type: 'D' | 'F',
    public name: string,
    public text: string,
    public children?: FSItemDTO[] // Array of FSItemDTO to represent the children
  ) { }
}

class FileExplorerTreeDatabase extends Dexie {
  rootItems!: Dexie.Table<FSItemDTO, string>;

  constructor(databaseName: string) {
    super(databaseName);
    this.version(1).stores({
      rootItems: 'id, type, name, text, children',
    });
  }
}

export class FSItemRepository {
  private static db: FileExplorerTreeDatabase;

  public static init(): void {
    FSItemRepository.db = new FileExplorerTreeDatabase(DATABASE_NAME);
    console.log('Database Version:', FSItemRepository.db.verno);
    console.log('Database Tables:', FSItemRepository.db.tables);
  }

  private static convertToDTO(fsItem: FSItem): FSItemDTO {
    const children = fsItem.getChildren();
    let childrenDTO: FSItemDTO[] | undefined;
    if (children) {
      childrenDTO = children.map(child => FSItemRepository.convertToDTO(child));
    }
    return new FSItemDTO(fsItem.id.toString(), fsItem.type, fsItem.name, fsItem.text, childrenDTO);
  }

  private static convertFromDTO(dto: FSItemDTO): FSItem {
    const { id, type, name, text, children } = dto;
    if (type === 'F') {
      return new FileItem(Number(id), 'F', name, text);
    } else if (type === 'D') {
      const directoryItem = new DirectoryItem(Number(id), 'D', name, text);
      if (children) {
        for (const childDTO of children) {
          const childFSItem = FSItemRepository.convertFromDTO(childDTO);
          directoryItem.add(childFSItem);
        }
      }
      return directoryItem;
    } else {
      throw new Error('Invalid FSItemDTO type');
    }
  }

  public static updateRootFSItem(rootFSItem: DirectoryItem): Promise<void> {
    rootFSItem.id = ID_ROOT_ITEM; // we force the id of the root item. The id becomes the primary key in our database, therefore it is an internal responsibility
    // the id must not come from outside
    const dto = FSItemRepository.convertToDTO(rootFSItem);
    //console.log("creating dto:" + dto);
    return FSItemRepository.db.rootItems.put({ ...dto })
      .catch(error => {
        throw error;
      });
  }

  public static loadRootFSItem(): Promise<DirectoryItem | null> {
    return FSItemRepository.db.rootItems.get(ID_ROOT_ITEM)
      .then(dto => {
        let rootFSItem: DirectoryItem;
        //console.log("dto" + dto);

        if (dto) {
          rootFSItem = FSItemRepository.convertFromDTO(dto);
          console.log("FSItemRepository.loadRootFSItem : fetched root item:");
          console.log(rootFSItem);
        } else {
          console.log("FSItemRepository.loadRootFSItem : no db yet. Initializing with root item:");
          console.log(MOCK_ROOT_ITEM);
          rootFSItem = MOCK_ROOT_ITEM;
        }

        return rootFSItem;
      })
      .catch(error => {
        throw error;
      });
  }
}
