import { useEffect } from "react";
import RecordsComponent from "~/records/records";
import { useNavigate } from "react-router";
import type { AppDispatch, RootState } from "redux/store";
import { fetchUser } from "redux/thunks/userThunks";
import LayoutWrapper from "layout/navLayout";
import UnauthorizedPage from "~/notAuthorized/notAuthorized";
import { useDispatch, useSelector } from "react-redux";



export function meta() {
  return [
    { title: "Records" },
    { name: "description", content: "View your dashboard" },
  ];
}

const authorizedUser = ["ENCODER", "ADMIN"]

export default function RecordsRoute() {
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
      <RecordsComponent />
    </LayoutWrapper>
  );
}
