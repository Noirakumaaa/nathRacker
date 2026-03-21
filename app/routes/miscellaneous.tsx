import { useEffect } from "react"
import MiscMain from "~/miscellaneous/miscMain"
import { useNavigate } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "redux/store"
import { fetchUser } from "redux/thunks/userThunks"
import LayoutWrapper from "layout/navLayout"
import UnauthorizedPage from "~/notAuthorized/notAuthorized"
import { AuthorizedUser } from "~/types/authorizedUser"



export function meta() {
  return [
    { title: "Miscellaneous" },
    { name: "description", content: "View your dashboard" },
  ]
}


export default function MiscellaneousRoute() {
  const user = useSelector((state: RootState) => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
     //console.log("User : ", user)
    const tryFetch = async () => {
      if (user.id !== '') return; // Skip if user data is already available

      try {
        await dispatch(fetchUser()).unwrap();
      } catch {
        try {
          await dispatch(fetchUser()).unwrap();
        } catch {
          if (!user.role) {
            navigate("/login");

          }

        }
      }
    };

    tryFetch();
  }, [user.role]);


  if (!user.role) {
    return null // still loading user, render nothing
  }

  if (!AuthorizedUser.includes(user.role)) {
    return (
      <LayoutWrapper>
        <UnauthorizedPage />
      </LayoutWrapper>
    )
  }

  return (
    <LayoutWrapper>
      <MiscMain />
    </LayoutWrapper>
  )
}
