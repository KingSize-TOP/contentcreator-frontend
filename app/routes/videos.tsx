import { Videos } from "~/videos/videos";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Content Creator" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function VideosRouter() {
  return <Videos />;
}
