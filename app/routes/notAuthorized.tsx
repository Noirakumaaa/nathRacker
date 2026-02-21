
import UnauthorizedPage from "~/notAuthorized/notAuthorized";

export function meta() {
  return [
    { title: "404" },
    { name: "description", content: "View your dashboard" },
  ];
}

export default function NotAuthorizedRoute() {
  



  return (
    <UnauthorizedPage />
  );
}
