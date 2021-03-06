/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConnectionStatus } from "../ConnectionStatus";
import { StorageAdapter, StorageAdapterOptions } from "../StorageAdapter";

class TestStorageAdapter implements StorageAdapter {
  options: StorageAdapterOptions;
  testInterface: any;
  isConnected: boolean;
  internalStorage: any;

  constructor(testInstance: any, isConnected = true) {
    this.testInterface = testInstance;
    this.testInterface.internalStorage = {};
    this.isConnected = isConnected;
  }

  checkConnection(): void {
    if (!this.isConnected) {
      throw new Error("No connection");
    }
  }

  getConnectionStatus(): ConnectionStatus {
    return this.isConnected ? ConnectionStatus.CONNECTED : ConnectionStatus.DISCONNECTED;
  }

  onConnect(): ConnectionStatus {
    return this.getConnectionStatus();
  }

  async set(key: string, value: string): Promise<boolean> {
    this.checkConnection();
    this.testInterface.internalStorage[key] = value;

    return true;
  }

  async get(key: string): Promise<string> {
    this.checkConnection();

    return this.testInterface.internalStorage[key];
  }

  async del(key: string): Promise<boolean> {
    this.checkConnection();

    if (this.testInterface.internalStorage[key]) {
      delete this.testInterface.internalStorage[key];

      return true;
    }

    return false;
  }

  async acquireLock(key: string): Promise<boolean> {
    this.checkConnection();

    return this.set(`${key}_lock`, "");
  }

  async releaseLock(key: string): Promise<boolean> {
    this.checkConnection();

    return this.del(`${key}_lock`);
  }

  async isLockExists(key: string): Promise<boolean> {
    this.checkConnection();

    return !!this.testInterface.internalStorage[`${key}_lock`];
  }

  async mset(values: Map<string, any>): Promise<void> {
    this.checkConnection();
    values.forEach((value, key) => {
      this.testInterface.internalStorage[key] = value;
    });
  }

  async mget(keys: string[]): Promise<(string | null)[]> {
    this.checkConnection();

    return keys.map(key => this.testInterface.internalStorage[key] || null);
  }
}

export default TestStorageAdapter;
