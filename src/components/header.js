import { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import FirebaseContext from "../context/firebase";
import UserContext from "../context/user";
import * as ROUTES from "../constants/routes";
import { DEFAULT_IMAGE_PATH } from "../constants/paths";
import useUser from "../hooks/use-user";
import UploadImageB from "./imageUploadB/imageUploadB";
import SearchBar from "./searchBar/searchBar";
import { CogIcon, HomeIcon, LogoutIcon, XIcon } from "@heroicons/react/outline";

export default function Header() {
  const { user: loggedInUser } = useContext(UserContext);
  const { user } = useUser(loggedInUser?.uid);
  const { firebase } = useContext(FirebaseContext);
  const history = useHistory();

  return (
    <header
      className="h-16 oasis_darkB_Bg border-b border-gray-800 mb-8 notF"
      style={{ padding: "0 20px" }}
    >
      <div className="container mx-auto max-w-screen-lg h-full">
        <div className="flex justify-between h-full">
          <div className="text-gray-700 text-center flex items-center align-items cursor-pointer header-title">
            <div className="glitch-wrapper">
              <h2
                className="flex justify-center w-full glitch"
                data-text="The Oasis"
              >
                <Link
                  to={ROUTES.DASHBOARD}
                  aria-label="The Oasis"
                  className="text-white"
                >
                  The Oasis
                </Link>
              </h2>
            </div>
          </div>
          <div className="text-gray-700 text-center flex items-center align-items text-white mobile-menu-cont">
            {loggedInUser ? (
              <>
                <SearchBar className="header-icon" aria-label="Search Icon" />

                <UploadImageB
                  className="header-icon"
                  aria-label="Image Upload"
                />

                <Link to={ROUTES.DASHBOARD} aria-label="Dashboard">
                  <HomeIcon
                    className="header-icon mr-6"
                    aria-label="Home Icon"
                  />
                </Link>

                <button
                  type="button"
                  title="Logout"
                  onClick={() => {
                    firebase.auth().signOut();
                    history.push(ROUTES.LOGIN);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      firebase.auth().signOut();
                      history.push(ROUTES.LOGIN);
                    }
                  }}
                >
                  <LogoutIcon
                    className="header-icon mr-6"
                    aria-label="Logout Icon"
                  />
                </button>

                {user && (
                  <Link to={`/p/${user?.username}`}>
                    <img
                      style={{
                        width: "32px",
                        height: "32px",
                        objectFit: "cover",
                      }}
                      className="rounded-full flex"
                      src={user.avatarSrc}
                      alt={`${user?.username} profile`}
                      onError={(e) => {
                        e.target.src = DEFAULT_IMAGE_PATH;
                      }}
                    />
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link to={ROUTES.LOGIN}>
                  <button
                    type="button"
                    className="bg-blue-medium font-bold text-sm rounded text-white w-20 h-8"
                  >
                    Log In
                  </button>
                </Link>
                <Link to={ROUTES.SIGN_UP}>
                  <button
                    type="button"
                    className="font-bold text-sm rounded text-blue-medium w-20 h-8"
                  >
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
