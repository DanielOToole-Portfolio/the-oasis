import { useState, useContext } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  updateLoggedInUserFollowing,
  updateFollowedUserFollowers,
  getUserByUserId,
} from "../../services/firebase";
import LoggedInUserContext from "../../context/logged-in-user";

export default function SuggestedProfile({
  profileDocId,
  username,
  profileId,
  userId,
  avatarSrc,
  fullName,
  loggedInUserDocId,
}) {
  const [followed, setFollowed] = useState(false);
  const { setActiveUser } = useContext(LoggedInUserContext);

  async function handleFollowUser() {
    setFollowed(true);
    await updateLoggedInUserFollowing(loggedInUserDocId, profileId, false);
    await updateFollowedUserFollowers(profileDocId, userId, false);
    const [user] = await getUserByUserId(userId);
    setActiveUser(user);
  }

  return !followed ? (
    <div className="flex flex-row items-center align-items justify-between">
      <div className="flex items-center justify-between">
        <div
          className="rounded-full w-8 h-8 flex mr-3"
          style={{
            backgroundImage: `url("${avatarSrc}")`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
          aria-label={`${fullName} profile picture`}
        />
        <Link to={`/p/${username}`}>
          <p className="font-bold text-sm text-white">{username}</p>
        </Link>
      </div>
      <button
        className="oasis_midB1_Bg font-bold text-xs rounded text-white"
        type="button"
        onClick={handleFollowUser}
        style={{ padding: "0.5rem" }}
      >
        Follow
      </button>
    </div>
  ) : null;
}

SuggestedProfile.propTypes = {
  profileDocId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  profileId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  loggedInUserDocId: PropTypes.string.isRequired,
};
