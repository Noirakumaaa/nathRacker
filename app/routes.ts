import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("bus/:id?", "routes/bus.tsx"),
  route("swdi/:id?", "routes/swdi.tsx"),
  route("lcn/:id?", "routes/lcn.tsx"),
  route("records", "routes/records.tsx"),
  route("summary", "routes/summary.tsx"),
  route("settings", "routes/settings.tsx"),
  route("cvs/:id?", "routes/cvs.tsx"),
  route("miscellaneous/:id?", "routes/miscellaneous.tsx"),
  route("404", "routes/notAuthorized.tsx"),

] satisfies RouteConfig;
