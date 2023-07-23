import type { DirectoryItem, FSItem } from '../models/FSItem';
import { get, writable } from 'svelte/store';
import { FSItemRepository } from './FSItemRepository';

export const fsItemStore = writable<DirectoryItem | null>(undefined);

export function setRootItem(rootItem: DirectoryItem): void {
  fsItemStore.set(rootItem);
}

fsItemStore.subscribe((newRootFSItem: DirectoryItem | null) => {
  console.log("fsItemStore.subscribe: new root item:");
  console.log(newRootFSItem);
  if (newRootFSItem) { // ie not null
    FSItemRepository.updateRootFSItem(newRootFSItem);
  }
});

/**
 * The FSItemAPI class has the responsibility of managing the database. And it also holds the Svelte store
 */
export class FSItemAPI {
  private static rootItem: FSItem | null = null;

  public static setRootItem(rootItem: FSItem): void {
    fsItemStore.set(rootItem);
  }

  public static getRootItem(): FSItem | null {
    return FSItemAPI.rootItem;
  }

  public static forceRefreshStore(): void {
    fsItemStore.update((oldRootItem) => {
      return oldRootItem;
    });
  }

  public static printRootItem(): void { 
    console.log((get(fsItemStore) as FSItem).toString()); // q: why this line gives me an error?  
  }
}