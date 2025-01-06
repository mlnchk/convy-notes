import Dexie, { type Table } from "dexie";

export interface Note {
  id?: number;
  title: string;
  content: string;
  date: string;
  createdAt: Date;
  updatedAt: Date;
}

export class NotesDatabase extends Dexie {
  notes!: Table<Note>;

  constructor() {
    super("NotesDatabase");
    this.version(1).stores({
      notes: "++id, title, content, date, createdAt, updatedAt",
    });
  }
}

export const db = new NotesDatabase();
