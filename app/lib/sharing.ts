import LZString from "lz-string";

export interface ShareableNote {
  title: string;
  content: string;
}

export function encodeNote(note: ShareableNote): string {
  const jsonString = JSON.stringify([note.title, note.content]);

  return LZString.compressToEncodedURIComponent(jsonString);
}

export function decodeNote(encodedNote: string): ShareableNote {
  const jsonString = LZString.decompressFromEncodedURIComponent(encodedNote);
  const [title, content] = JSON.parse(jsonString);

  return { title, content };
}

export function createShareUrl(encodedNote: string): string {
  return `${window.location.origin}/shared/${encodedNote}`;
}
