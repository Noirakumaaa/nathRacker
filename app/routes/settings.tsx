import SettingsPage from "../settings/settings";
import LayoutWrapper from "layout/navLayout";
import { useEffect } from "react";
import type { AppDispatch } from "redux/store";
import { fetchUser } from "redux/thunks/userThunks";
import { useNavigate } from "react-router";
import UnauthorizedPage from "~/notAuthorized/notAuthorized";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "redux/store";



export function Meta() {
  return [
    { title: "Settings" },
    { name: "description", content: "User settings page" },
  ];
}

const authorizedUser = ["ENCODER", "ADMIN"]

export default function SettingsRoute() {
  const user = useSelector((state: RootState) => state.user)
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

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

  if (!authorizedUser.includes(user.role)) {
    return (
      <LayoutWrapper>
        <UnauthorizedPage />
      </LayoutWrapper>
    )
  }
  return (
    <LayoutWrapper>
      <SettingsPage />;
    </LayoutWrapper>
  )

}