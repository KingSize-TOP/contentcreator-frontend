import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("videos", "routes/videos.tsx"),
  route("scenarios", "routes/scenarios.tsx"),
  route("avatar", "routes/avatar.tsx")
] satisfies RouteConfig;
