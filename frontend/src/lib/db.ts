import fs from 'fs/promises';
import path from 'path';
import { Application } from './types';

const DATA_DIR = path.join(process.cwd(), '../data');
const PORTFOLIO_FILE = path.join(DATA_DIR, 'portfolio-from-inventory.json');

export class Database {
  private static async ensureDataDir() {
    try {
      await fs.access(DATA_DIR);
    } catch {
      await fs.mkdir(DATA_DIR, { recursive: true });
    }
  }

  static async getAllApplications(): Promise<Application[]> {
    try {
      const data = await fs.readFile(PORTFOLIO_FILE, 'utf-8');
      const apps = JSON.parse(data);
      
      // Ensure all apps have IDs
      return apps.map((app: Application) => ({
        ...app,
        id: app.id || crypto.randomUUID()
      }));
    } catch (error) {
      return [];
    }
  }

  static async getApplication(id: string): Promise<Application | null> {
    const apps = await this.getAllApplications();
    return apps.find(app => app.id === id) || null;
  }

  static async createApplication(app: Application): Promise<Application> {
    await this.ensureDataDir();
    const apps = await this.getAllApplications();
    
    const newApp = {
      ...app,
      id: crypto.randomUUID(),
    };
    
    apps.push(newApp);
    await fs.writeFile(PORTFOLIO_FILE, JSON.stringify(apps, null, 2));
    
    return newApp;
  }

  static async updateApplication(id: string, updates: Partial<Application>): Promise<Application> {
    const apps = await this.getAllApplications();
    const index = apps.findIndex(app => app.id === id);
    
    if (index === -1) {
      throw new Error('Application not found');
    }
    
    const updated = { ...apps[index], ...updates, id };
    apps[index] = updated;
    
    await fs.writeFile(PORTFOLIO_FILE, JSON.stringify(apps, null, 2));
    return updated;
  }

  static async deleteApplication(id: string): Promise<void> {
    const apps = await this.getAllApplications();
    const filtered = apps.filter(app => app.id !== id);
    
    if (filtered.length === apps.length) {
      throw new Error('Application not found');
    }
    
    await fs.writeFile(PORTFOLIO_FILE, JSON.stringify(filtered, null, 2));
  }
}
