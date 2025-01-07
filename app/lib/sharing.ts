export interface ShareableNote {
  title: string;
  content: string;
}

export function encodeNote(note: ShareableNote): string {
  const jsonString = JSON.stringify(note);
  const bytes = new TextEncoder().encode(jsonString);
  const base64 = btoa(
    Array.from(bytes)
      .map((byte) => String.fromCharCode(byte))
      .join(""),
  );
  return encodeURIComponent(base64);
}

export function decodeNote(encodedNote: string): ShareableNote {
  const base64 = decodeURIComponent(encodedNote);
  const binaryString = atob(base64);
  const bytes = Uint8Array.from(binaryString, (char) => char.charCodeAt(0));
  const jsonString = new TextDecoder().decode(bytes);
  return JSON.parse(jsonString);
}

export function createShareUrl(encodedNote: string): string {
  return `${window.location.origin}/shared/${encodedNote}`;
}
