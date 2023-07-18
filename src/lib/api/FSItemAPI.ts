import type { FSItem } from '../models/FSItem';
import { get, writable } from 'svelte/store';

export const fsItemStore = writable<FSItem | null>(undefined);

export function setRootItem(rootItem: FSItem): void {
  fsItemStore.set(rootItem);
}

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