import { db } from "./db";

export async function getNotes() {
  return db.notes.orderBy("createdAt").reverse().toArray();
}

interface CreateNoteData {
  title?: string;
  content?: string;
}

export async function createNote(data?: CreateNoteData) {
  const today = new Date().toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const newNote = {
    title: data?.title ?? "",
    content: data?.content ?? "",
    date: today,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return db.notes.add(newNote);
}
