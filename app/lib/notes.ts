import { db } from "./db";

export async function getNotes() {
  return db.notes.orderBy("createdAt").reverse().toArray();
}
