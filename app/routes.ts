import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  route("404", "routes/notAuthorized.tsx"),

  layout("routes/appLayout.tsx", [
    route("dashboard",                      "routes/Encoder/dashboard.tsx"),
    route("bus/:id?",                        "routes/Encoder/bus.tsx"),
    route("swdi/:id?",                       "routes/Encoder/swdi.tsx"),
    route("lcn/:id?",                        "routes/Encoder/lcn.tsx"),
    route("cvs/:id?",                        "routes/Encoder/cvs.tsx"),
    route("miscellaneous/:id?",              "routes/Encoder/miscellaneous.tsx"),
    route("records",                         "routes/records.tsx"),
    route("summary",                         "routes/summary.tsx"),
    route("settings",                        "routes/settings.tsx"),
    route("admin/register",                  "routes/admin/register.tsx"),
    route("admin/employees",                 "routes/admin/employees.tsx"),
    route("admin/office",                    "routes/admin/office.tsx"),
    route("admin/lgu",                       "routes/admin/lgu.tsx"),
    route("admin/barangay",                  "routes/admin/barangay.tsx"),
    route("operations/dashboard",            "routes/operations/dashboard.tsx"),
    route("operations/my-office",            "routes/operations/my-office.tsx"),
    route("operations/staff",                "routes/operations/staff.tsx"),
    route("operations/staff/:username",      "routes/operations/staff-member.tsx"),
    route("verification/bus",                "routes/verification/bus.tsx"),
    route("verification/bus/:cl",            "routes/verification/bus-detail.tsx"),
  ]),
] satisfies RouteConfig;
