import { Avatar } from "~/avatar/avatar";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Content Creator" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function AvatarRouter() {
  return <Avatar />;
}
