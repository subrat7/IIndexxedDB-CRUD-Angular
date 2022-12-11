import { Injectable } from '@angular/core';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  public DB_NAME: string = 'idb-my-library';
  public TABLE_NAME: string = 'Employee-store';
  

  constructor(private dataService: DataService) {
    if (!window.indexedDB) {
      throw ("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
    }
  }

  init() {
    let open = this.openDB();
    open.onupgradeneeded = () => {
      let db = open.result;
      db.createObjectStore(this.TABLE_NAME, { keyPath: '_id', autoIncrement: true });
      this.dataService.getEmployees().subscribe((data: any[]) => {
        data.forEach((employee: any) => this.add(this.TABLE_NAME, employee));
      });
    }
  }

  private openDB() {
    return window.indexedDB.open(this.DB_NAME, 1);
  }

  private wDB() {
    return window.indexedDB
  }

  public add(objectStore: any, value: any) {
    return new Promise((resolve, reject) => {
      let open = this.openDB();
      open.onsuccess = () => {
        let db = open.result;
        let tx = db.transaction(objectStore, 'readwrite');
        let store = tx.objectStore(objectStore);
        let request = store.add(value);
        request.onsuccess = () => {
          resolve(request.result)
        };
        request.onerror = () => reject(request.error);
        tx.oncomplete = () => db.close();
      }
    });
  }

  public addSingleRecord(objectStore: any, value: any) {
    return new Promise((resolve, reject) => {
      let open = this.openDB();
      open.onsuccess = () => {
        let db = open.result;
        let tx = db.transaction([objectStore], 'readwrite');
        let store = tx.objectStore(objectStore);
        let request = store.put(value);
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error);
        tx.oncomplete = () => db.close();
      }
    });
  }

  public update(objectStore: any, value: any, key: any) {
    return new Promise((resolve, reject) => {
      let open = this.openDB();
      open.onsuccess = () => {
        let db = open.result;
        let tx = db.transaction([objectStore], 'readwrite');
        let store = tx.objectStore(objectStore);
        let request = store.put(value);
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error);
        tx.oncomplete = () => db.close();
      }
    });
  }

  public getSingleRecord(objectStore: any, key: number) {
    return new Promise((resolve, reject) => {
      let open = this.openDB();
      open.onsuccess = () => {
        let db = open.result;
        let tx = db.transaction(objectStore, 'readwrite');
        let store = tx.objectStore(objectStore);
        let request = store.get(key);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        tx.oncomplete = () => db.close();
      }
    });
  }

  public getAll(objectStore: any) {
    return new Promise((resolve, reject) => {
      let open = this.openDB();
      open.onsuccess = () => {
        let db = open.result;
        let tx = db.transaction(objectStore, 'readwrite');
        let store = tx.objectStore(objectStore);
        let request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        tx.oncomplete = () => db.close();
      }
    });
  }

  public delete(objectStore: any, key: IDBValidKey | IDBKeyRange) {
    return new Promise((resolve, reject) => {
      let open = this.openDB();
      open.onsuccess = () => {
        let db = open.result;
        let tx = db.transaction(objectStore, 'readwrite');
        let store = tx.objectStore(objectStore);
        let request = store.delete(key);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        tx.oncomplete = () => db.close();
      }
    });
  }

  public deleteDB(databaseName: string) {
    return new Promise((resolve, reject) => {
      let open = this.wDB();
      const request = open.deleteDatabase(databaseName);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      
    });
  }
}
