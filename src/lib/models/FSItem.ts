// Big thanks to https://refactoring.guru/design-patterns/composite/typescript/example
// Basically, I used the code of the class they give "as is", to get me started quickly.
// Very helpful comments also.

// Also, thanks to https://github.com/saibotsivad/svelte-file-tree-explorer , file demo/delete-this-eventually.js

/**
 * The FSItem class hierarchy comes from the Composite pattern
 */
export enum FSItemType {
    DIRECTORY = 'D',
    FILE = 'F'
}

/**
 * The base FSItem class declares common operations for both simple and
 * complex objects of a composition.
 */
export abstract class FSItem {
    protected parent!: FSItem | null;

    // below are fields for the View layer
    public isVisible: boolean = true; // needed to hold the visible / not visible status
    public isExpanded: boolean = false; // needed to hold the expanded / not expanded status

    constructor(public id: number, public type: 'D' | 'F', public name: string) { }
    
    public setParent(parent: FSItem | null) {
        this.parent = parent;
    }

    public getParent(): FSItem | null {
        return this.parent;
    }

    public abstract getChildren(): FSItem[] | null;

    public abstract setChildren(children: FSItem[]): void;

    public toString(): string {
        return "tostring:" + this.stringify();
    }

    /**
     * This method, and the method removeCircularProperties it uses, are needed
     * to use the standard JSON.stringify() function
     * Indeed, we need to exclude "circular" properties, in our case it means excluding the property "parent"
     */
    public stringify(): string {
        return JSON.stringify(this, this.removeCircularProperties);
    }

    private removeCircularProperties(key: string, value: string): string | undefined {
        return (key === 'parent' ? undefined : value);
    }

    /**
     * In some cases, it would be beneficial to define the child-management
     * operations right in the base FSItem class. This way, you won't need to
     * expose any concrete component classes to the client code, even during the
     * object tree assembly. The downside is that these methods will be empty
     * for the leaf-level components.
     * 
     * Returns FSItem so that we can chain
     */
    public add(fsItem: FSItem): FSItem {
        return this;
    }

    /* TODO: add a return value of FSITem to add() method ?
     * ie return an FSItem too for remove, for coherence purpose ?
     * @param fsItem 
     */

    // change parameter ? signature becomes     public remove(id: number): void { } with id being the id of the item to remove
    public abstract remove(fsItem: FSItem): void;

    public rename(newName: string): void {
        this.name = newName;
    }

    /**
     * You can provide a method that lets the client code figure out whether a
     * component can bear children.
     */
    public isDirectory(): boolean {
        return false;
    }

    /* TODO: CODE SMELL: not a good solution ?
     *  code smell! the whole updateChild / updateProperties doesn't look right!
     * namely, if I add a new property to FSItem, I may forget to add it here ... !
     * maybe I could replace the given FSItem inside the children array (Array.splice() ..?), but then
     * how would that work when we need to replace the name property on the parent itself , instead of an FSItem inside the children array ?
     * need a more complex solution ? see this maybe ? https://stackoverflow.com/questions/8561017/can-an-instance-of-a-class-replace-itself-in-javascript
     */
    protected updateProperties(updatedChild: FSItem): void {
        console.log("FSItem#updateProperties: updating item with name " + this.name);
        this.name = updatedChild.name;
    }

    public abstract updateItem(updatedChild: FSItem): FSItem | null;

    public abstract executeOnAllChildren(fnToExecute: Function): void;

    public abstract findById(id: number): FSItem | null;

    public abstract findByName(name: string): Array<FSItem>;

    public getNextAvailableId(): number {
        const allIds: number[] = [];
        
        function collectIds(item: FSItem) {
            allIds.push(item.id);
            if (item.isDirectory() && item.getChildren()) {
                item.getChildren()!.forEach(collectIds);
            }
        }
        
        collectIds(this);
        
        const maxId = Math.max(...allIds);
        return maxId + 1;
    }
}

/**
 * The Leaf class represents the end objects of a composition. A leaf can't have
 * any children.
 *
 * Usually, it's the Leaf objects that do the actual work, whereas Composite
 * objects only delegate to their sub-components.
 */
export class FileItem extends FSItem {
    public getChildren(): FSItem[] | null {
        return null;
    }

    public setChildren(children: FSItem[]): void {}

    public updateItem(updatedChild: FSItem): FSItem | null {
        if (this.id === updatedChild.id) {
            this.updateProperties(updatedChild);
            return updatedChild;
        } else {
            return null;
        }
    }

    public executeOnAllChildren(fnToExecute: Function): void {
        fnToExecute(this);
    }

    public findById(id: number): FSItem | null {
        console.log("FileItem#findBydId implementation... id=" + this.id);
        if (this.id === id) {
            return this;
        } else {
            return null;
        }
    }

    public findByName(name: string): Array<FSItem> {
        return [];
    }
}

/**
 * The Composite class represents the complex components that may have children.
 * Usually, the Composite objects delegate the actual work to their children and
 * then "sum-up" the result.
 */
export class DirectoryItem extends FSItem {
    protected children: FSItem[] = [];

    /**
     * Just a getter
     */
    public getChildren(): FSItem[] | null {
        return this.children;
    }

    /**
     * Just a setter
     */
    public setChildren(children: FSItem[]): void {
        this.children = children;
    }

    /**
     * A composite object can add or remove other components (both simple or
     * complex) to or from its child list.
     */
    public add(fsItem: FSItem): FSItem {
        this.children.push(fsItem);
        fsItem.setParent(this);
        return this;
    }

    public remove(fsItem: FSItem): void {
        let fsItemIndex: number = 0;
        let i: number = 0;

        fsItemIndex = this.children.findIndex(item => item.id === fsItem.id);  

        if (fsItemIndex !== -1) {            
            this.children.splice(fsItemIndex, 1);
        } else {
            for (const child of this.children) {
                child.remove(fsItem);
            }
        }
    }

    public isDirectory(): boolean {
        return true;
    }

    /** TODO: chatgpt recommands no recursion, use different approach ?
     * Recursion: The current implementation of execute() uses recursion to traverse the tree structure and execute the function on each child element. While recursion can work for smaller file system structures, it may lead to performance issues and stack overflow errors for larger and deeper structures. Consider alternative traversal strategies, such as iterative approaches using stacks or queues, for better performance and memory usage
     * 
     */
    public executeOnAllChildren(fnToExecute: Function): void {
        fnToExecute(this);

        this.children.forEach((fSItem) => fSItem.executeOnAllChildren(fnToExecute));
    }

    /**
     * TODO: chatgpt recommends returning FSItem | undefined ? instead of null ?
     * Lack of error handling: The code does not include robust error handling mechanisms. For example, when finding items by ID or name, if an item is not found, the methods currently return null. It might be better to use more descriptive error handling, such as throwing an exception or returning an optional type (FSItem | undefined) to indicate a not-found condition.
     */
    public findById(id: number): FSItem | null {
        console.log("DirectoryItem#findBydId implementation... id=" + this.id);
        if (this.id === id) {
            return this;
        } else {
            let foundChild: FSItem | null = null;
            let i: number = 0;

            //TODO: below, we use a whole while() loop with an index instead of this.children.forEach(..) which
            // would read easier, because we want to stop iterating on the children as soon as we have found the
            // good child
            // CHECK: possible to have an "exit" condition in the forEach() method ? to exit the loop with anticipation?
            while (foundChild === null && i < this.children.length) {
                foundChild = this.children[i].findById(id);
                i++;
            }

            return foundChild;
        }
    }

    public findByName(name: string): Array<FSItem> {
        const accumulatorArray: Array<FSItem> = DirectoryItem.collectFindByName(name, this, []);

        console.log("FSItem.findByName => found items:");
        accumulatorArray.forEach((item) => console.log(item.name));

        return accumulatorArray;
    }

    private static collectFindByName(name: string, item: FSItem, accumulatorArray: Array<FSItem>): Array<FSItem> {
        if (item.name.toLocaleLowerCase().includes(name.toLowerCase())) {
            accumulatorArray.push(item);
        }

        if (item.type === 'D') {
            /* 
            
            /*
            item.getChildren()?.forEach((childItem) => {
                DirectoryItem.collectFindByName(name, childItem, accumulatorArray);
            });
            
            TODO: I have no idea why the forEach above led to a crash with following error from cypress:

            "
            Error: Webpack Compilation Error
            ./src/lib/models/FSItem.ts 304:31
            Module parse failed: Unexpected token (304:31)
            File was processed with these loaders:
            * ../../../../../../../.cache/Cypress/12.7.0/Cypress/resources/app/node_modules/@packages/server/node_modules/ts-loader/index.js
            You may need an additional loader to handle the result of these loaders.
            ...
            "
            
            ? I had to replace with a classic javascript for loop
            */

            for (const childItem of item.getChildren()) {
                DirectoryItem.collectFindByName(name, childItem, accumulatorArray);
            }
        }

        return accumulatorArray;
    }

    public updateItem(updatedChild: FSItem): FSItem | null {
        if (this.id === updatedChild.id) {
            this.updateProperties(updatedChild);
            return updatedChild;
        } else {
            let foundChild: FSItem | null = null;
            let i: number = 0;

            while (foundChild === null && i < this.children.length) {
                foundChild = this.children[i].updateItem(updatedChild);
                i++;
            }

            return foundChild;
        }
    }
}