import { useEffect } from "react";
import PCNForm from '../pcn/pcn'
import { useNavigate } from "react-router";
import type { AppDispatch } from "redux/store";
import { fetchUser } from "redux/thunks/userThunks";
import LayoutWrapper from "layout/navLayout";
import UnauthorizedPage from "~/notAuthorized/notAuthorized";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "redux/store";
import {AuthorizedUser} from "~/types/authorizedUser";

export function meta() {
  return [
    { title: "PCN" },
    { name: "description", content: "View your dashboard" },
  ];
}



export default function PCNRoute() {
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

  if (!AuthorizedUser.includes(user.role)) {
    return (
      <LayoutWrapper>
        <UnauthorizedPage />
      </LayoutWrapper>
    )
  }


  return (
    <LayoutWrapper>
      <PCNForm />
    </LayoutWrapper>
  );
}
