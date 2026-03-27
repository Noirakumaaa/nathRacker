import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  // route("bus", "routes/bus.tsx"),
  // route("swdi", "routes/swdi.tsx"),
  // route("lcn", "routes/lcn.tsx"),
  // route("records", "routes/records.tsx"),
  // route("summary", "routes/summary.tsx"),
  // route("settings", "routes/settings.tsx"),
  // route("cvs", "routes/cvs.tsx"),
  // route("miscellaneous", "routes/miscellaneous.tsx"),
  route("404", "routes/notAuthorized.tsx"),

] satisfies RouteConfig;
