import { useEffect } from "react"
import BusForm from "../bus/busMain"
import { useNavigate } from "react-router"
import LayoutWrapper from "layout/navLayout"
import UnauthorizedPage from "~/notAuthorized/notAuthorized"
import { AuthorizedUser } from "~/types/authorizedUser"



export function meta() {
  return [
    { title: "BUS" },
    { name: "description", content: "View your dashboard" },
  ]
}


export default function DashboardRoute() {

  // if (!AuthorizedUser.includes(user.role)) {
  //   return (
  //     <LayoutWrapper>
  //       <UnauthorizedPage />
  //     </LayoutWrapper>
  //   )
  // }

  return (
    <LayoutWrapper>
      <BusForm />
    </LayoutWrapper>
  )
}
