import { useContext } from "react";
import User from "./user";
import Suggestions from "./suggestions";
import LoggedInUserContext from "../../context/logged-in-user";

export default function Sidebar() {
  const {
    user: { docId = "", fullName, username, userId, following, avatarSrc } = {},
  } = useContext(LoggedInUserContext);

  return (
    <div className="p-4 dashboard-sidebar">
      <User username={username} fullName={fullName} avatarSrc={avatarSrc} />
      <Suggestions
        userId={userId}
        following={following}
        loggedInUserDocId={docId}
      />
    </div>
  );
}
