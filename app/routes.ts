import {
  type RouteConfig,
  route,
  index,
  layout,
} from "@react-router/dev/routes";

export default [
  layout("./routes/layout.tsx", [
    index("./routes/notes/index.tsx"),
    route("note/:noteId", "./routes/notes/note.tsx"),
    route("shared/:encodedNote", "./routes/notes/shared.tsx"),
  ]),
] satisfies RouteConfig;
