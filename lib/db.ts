// lib/db.ts - Database helper
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database', 'ict_nexus.db');

export interface Ticket {
  id: number;
  ticket_id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  department: string;
  staff_id: string;
  staff_name: string;
  email: string;
  created_at: string;
  updated_at?: string;
  resolved_at?: string;
}

export interface Asset {
  id: number;
  asset_id: string;
  asset_type: string;
  asset_tag: string;
  serial_number?: string;
  assigned_to: string;
  staff_id: string;
  department: string;
  status: string;
  created_at: string;
  updated_at?: string;
}

export interface Article {
  id: number;
  article_id: string;
  title: string;
  category: string;
  content: string;
  keywords: string;
  views: number;
  helpful_count: number;
  created_at: string;
  updated_at?: string;
}

interface RunResult {
  lastInsertRowid: number;
  changes: number;
}

interface Statement {
  run(...params: any[]): RunResult;
  get(...params: any[]): any;
  all(...params: any[]): any[];
  iterate(...params: any[]): IterableIterator<any>;
}

// Create a single database instance
const sqlite = new Database(dbPath, { verbose: console.log });

// Enable WAL mode for better concurrency
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');

class DatabaseClient {
  async query<T>(sql: string, params: any[] = []): Promise<T[]> {
    try {
      const stmt = sqlite.prepare(sql);
      return stmt.all(...params) as T[];
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  async run(sql: string, params: any[] = []): Promise<{ lastID: number; changes: number }> {
    try {
      const stmt = sqlite.prepare(sql);
      const result = stmt.run(...params);
      return {
        lastID: Number(result.lastInsertRowid),
        changes: result.changes
      };
    } catch (error) {
      console.error('Database run error:', error);
      throw error;
    }
  }

  async get<T>(sql: string, params: any[] = []): Promise<T | undefined> {
    try {
      const stmt = sqlite.prepare(sql);
      return stmt.get(...params) as T;
    } catch (error) {
      console.error('Database get error:', error);
      throw error;
    }
  }

  async exec(sql: string): Promise<void> {
    try {
      sqlite.exec(sql);
    } catch (error) {
      console.error('Database exec error:', error);
      throw error;
    }
  }
}

// Create and export a single database client instance
const dbClient = new DatabaseClient();

// Export the client as 'db' for backward compatibility
export const db = dbClient;

// Helper functions for ticket categorization
export function categorizeTicket(description: string): { category: string; priority: string } {
  const keywords = {
    software: ['kwatos', 'login', 'password', 'software', 'system', 'error', 'crash', 'application'],
    hardware: ['printer', 'scanner', 'computer', 'laptop', 'mouse', 'keyboard', 'screen', 'monitor'],
    network: ['internet', 'wifi', 'connection', 'network', 'lan', 'ethernet'],
    access: ['gate', 'card', 'badge', 'access', 'entry', 'permission']
  };

  let category = 'general';
  let priority = 'medium';

  const lowerDesc = description.toLowerCase();

  // Determine category
  for (const [cat, words] of Object.entries(keywords)) {
    if (words.some(word => lowerDesc.includes(word))) {
      category = cat;
      break;
    }
  }

  // Determine priority
  if (lowerDesc.includes('urgent') || lowerDesc.includes('critical') || lowerDesc.includes('down')) {
    priority = 'high';
  } else if (lowerDesc.includes('minor') || lowerDesc.includes('low')) {
    priority = 'low';
  }

  return { category, priority };
}

// Export the raw sqlite instance if needed for direct access
export const getRawDb = () => sqlite;