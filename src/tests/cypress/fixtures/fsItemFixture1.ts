import type { FSItem } from '../../../lib/models/FSItem';
import { FileItem, DirectoryItem } from '../../../lib/models/FSItem';
import { FSItemAPI } from '../../../lib/models/FSItemAPI';

const idOfDirectoryLevel1 = 99;
const idOfFileLevel1 = 100;
const idOfDirectoryLevel2 = 101;
const idOfFileLevel2 = 102;
const idOfDirectoryLevel3 = 103;
const idOfFileLevel3 = 104;

const mockRootItem: DirectoryItem = new DirectoryItem(-1, "D", "rootDirectory");

const mockDirectoryItem2: DirectoryItem = new DirectoryItem(idOfDirectoryLevel1, "D", "Directory1Level1");
mockDirectoryItem2
    .add(new FileItem(idOfFileLevel2, "F", "File1Level2"))
    .add(new DirectoryItem(idOfDirectoryLevel2, "D", "Directory2Level2")
        .add(new FileItem(3, "F", "File2Level2")) // !! warning: this item is used in cypress tests
        .add((new DirectoryItem(4, "D", "Directory3Level2"))
            .add(new DirectoryItem(idOfDirectoryLevel3, "D", "Directory4Level3")) // !! warning: this item is used in cypress tests
            .add(new FileItem(idOfFileLevel3, "F", "File3Level3"))));
console.log("mockDirectoryItem2=" + mockDirectoryItem2);
const mockFileItem1 = new FileItem(idOfFileLevel1, "F", "File4Level1");

// finally, we add the two child nodes we've built
mockRootItem.add(mockDirectoryItem2);
mockRootItem.add(mockFileItem1);

export { mockRootItem };