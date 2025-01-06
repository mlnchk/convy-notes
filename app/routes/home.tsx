import type { Route } from "./+types/home";
import NoteApp from "~/components/note-app";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <NoteApp />;
}
