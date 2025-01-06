import { db } from "./db";

export async function getNotes() {
  return db.notes.orderBy("createdAt").reverse().toArray();
}

export async function createNote() {
  const today = new Date().toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const newNote = {
    title: "",
    content: "",
    date: today,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return db.notes.add(newNote);
}
