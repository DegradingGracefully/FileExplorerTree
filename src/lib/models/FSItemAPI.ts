import { FSItem } from './FSItem';
import { FileItem, DirectoryItem } from './FSItem';
/**
 * TODO: deprecated ? we don't need this class after all ?
 */
export class FSItemAPI {
    protected static listOfFSItems: Array<FSItem>;

    public static load(listOfFSItems: Array<FSItem>): void {
        /*this.listOfFSItems = new Array<FSItem>(
            new FileItem("D","D")
        );*/
        this.listOfFSItems = [... listOfFSItems ]; // clone
    }

    /**
     * 
     * @returns the whole content of FSItemAPI
     */
    public static getAll(): Array<FSItem> | null {
        //return null;
        //return new Array<FSItem>();
        return this.listOfFSItems; // TODO : clone the array ? we don't want anyone outisde of FSItemAPI to actually change the FSItem that have been loaded !
    }

    /**
     * findByName(...) enables us to find a FSItem by its 'name' property
     * @param name the name of the FSItem we're looking for
     * @returns the FSItem or null if not found
     */
    public static findByName(name: string): FSItem | null {
        //return null;
                
    }
}