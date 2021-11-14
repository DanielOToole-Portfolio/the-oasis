import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import useUser from "../../hooks/use-user";
import { Link } from "react-router-dom";
import { isUserFollowingProfile, toggleFollow } from "../../services/firebase";
import UserContext from "../../context/user";
import { DEFAULT_IMAGE_PATH } from "../../constants/paths";
import { PencilIcon } from "@heroicons/react/outline";
import { db, storage } from "../../lib/firebase";
import { doesUsernameExist } from "../../services/firebase";

export default function Header({
  photosCount,
  followerCount,
  setFollowerCount,
  profile: {
    docId: profileDocId,
    userId: profileUserId,
    fullName: profileFullName,
    avatarSrc,
    followers,
    following,
    username: profileUsername,
  },
}) {
  const [file, setFile] = useState("");
  const [imgError, setImgError] = useState(null);
  const [url, setUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [bioError, setBioError] = useState(null);

  const FollowerOpt = document.getElementById("follower-modal-opt");
  const FollowingOpt = document.getElementById("following-modal-opt");

  const types = ["image/png", "image/jpeg"];

  const { user: loggedInUser } = useContext(UserContext);
  const { user } = useUser(loggedInUser?.uid);
  const [isFollowingProfile, setIsFollowingProfile] = useState(null);
  const activeBtnFollow = user?.username && user?.username !== profileUsername;

  const handleToggleFollow = async () => {
    setIsFollowingProfile((isFollowingProfile) => !isFollowingProfile);
    setFollowerCount({
      followerCount: isFollowingProfile ? followerCount - 1 : followerCount + 1,
    });
    await toggleFollow(isFollowingProfile, user.docId, profileDocId, profile);
  };

  const handleEditBioModal = () => {
    setShowModal(true);

    if (username === "") {
      setUsername(profileUsername);
    }
    if (fullname === "") {
      setFullname(profileFullName);
    }
  };
  const handleCancelEditPost = () => {
    setShowModal(false);
    setUsername("");
    setFullname("");
    setBioError(null);
  };

  const handleEditPost = async (e) => {
    e.preventDefault();

    const usernameExists = await doesUsernameExist(username);

    if (username === profileUsername && fullname === profileFullName) {
      setBioError("Please update at least 1 field");
    } else if (usernameExists && fullname === profileFullName) {
      setBioError("username already exists!");
    } else {
      db.collection("users").doc(profileDocId).update({
        username: username,
        fullName: fullname,
      });

      setShowModal(false);
      setBioError(null);

      setTimeout(function () {
        window.location.replace("/dashboard");
      }, 1000);
    }
  };

  const handleImageChange = (e) => {
    let selected = e.target.files[0];

    if (selected && types.includes(selected.type)) {
      setFile(selected);
      setImgError("");

      const storageRef = storage.ref(
        Math.floor(Date.now() * Math.random()) + "_" + selected.name
      );

      storageRef.put(selected).on(
        "state_changed",
        (snap) => {
          let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
        },
        (err) => {
          setImgError(err);
        },
        async () => {
          const url = await storageRef.getDownloadURL();
          setUrl(url);
          db.collection("users").doc(profileDocId).update({
            avatarSrc: url,
          });
        }
      );
    } else {
      setFile(null);
      setImgError("Please select an image file (png or jpg)");
    }
  };

  const handleEditPicture = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput.click();
  };

  useEffect(() => {
    const isLoggedInUserFollowingProfile = async () => {
      const isFollowing = await isUserFollowingProfile(
        user.username,
        profileUserId
      );
      setIsFollowingProfile(!!isFollowing);
    };

    if (user?.username && profileUserId) {
      isLoggedInUserFollowingProfile();
    }
  }, [user?.username, profileUserId]);

  return (
    <div className="grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg p-cont">
      <div className="container" style={{ alignItems: "end" }}>
        {profileUsername ? (
          <>
            <div className="flex justify-center items-end">
              <div
                className="rounded-full h-40 w-40 flex"
                style={{
                  backgroundImage: `url("${avatarSrc}")`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
                aria-label={`${profileFullName} profile picture`}
              />
              {loggedInUser.uid === profileUserId ? (
                <>
                  <input
                    type="file"
                    id="imageInput"
                    hidden="hidden"
                    onChange={handleImageChange}
                  />
                  <PencilIcon
                    className="profile-icon"
                    onClick={handleEditPicture}
                  />
                </>
              ) : (
                <></>
              )}
            </div>

            {imgError ? (
              <div className="output img-error">
                <div className="error">{imgError}</div>
              </div>
            ) : null}
          </>
        ) : (
          <Skeleton circle height={150} width={150} count={1} />
        )}
      </div>
      <div className="flex items-center justify-start flex-col col-span-2">
        <div className="container flex items-center bio-cont-out">
          <div className="bio-cont">
            <div className="bio-info">
              <p className="text-2xl mr-4 text-white">{profileUsername}</p>
              <p className="font-medium mr-4 text-white">
                {!profileFullName ? (
                  <Skeleton count={1} height={24} />
                ) : (
                  profileFullName
                )}
              </p>
            </div>

            {loggedInUser.uid === profileUserId ? (
              <div>
                <PencilIcon
                  className="profile-icon"
                  onClick={handleEditBioModal}
                />
                {showModal ? (
                  <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                      <div className="relative w-auto my-6 mx-auto">
                        <div
                          className="border-0 rounded-lg shadow-lg relative flex flex-col w-full oasis_lightB_Bg outline-none focus:outline-none"
                          style={{ padding: "2.5rem 3.5rem 2.5rem" }}
                        >
                          <h3
                            className="font-bold text-white"
                            style={{ paddingBottom: "1rem" }}
                          >
                            Are you sure you want to update bio?
                          </h3>
                          <div
                            className="flex items-center justify-center rounded-b bio-form-cont"
                            style={{ paddingTop: "1rem" }}
                          >
                            <form onSubmit={handleEditPost} method="POST">
                              <div className="bio-form-fields">
                                <input
                                  aria-label="Update Your Username"
                                  type="text"
                                  placeholder={profileUsername}
                                  className=""
                                  onChange={({ target }) =>
                                    setUsername(target.value)
                                  }
                                  value={username}
                                />
                                <input
                                  aria-label="Update Your FullName"
                                  type="text"
                                  placeholder={profileFullName}
                                  className=""
                                  onChange={({ target }) =>
                                    setFullname(target.value)
                                  }
                                  value={fullname}
                                />
                              </div>
                              {bioError ? (
                                <div className="output bio-error">
                                  <div className="error">{bioError}</div>
                                </div>
                              ) : null}
                              <div
                                className=""
                                style={{
                                  paddingTop: "1rem",
                                  justifyContent: "center",
                                  display: "flex",
                                }}
                              >
                                <button
                                  className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                  type="button"
                                  onClick={handleCancelEditPost}
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  className="bg-emerald-500 crt-b text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                >
                                  Update
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="fixed inset-0 z-40"
                      style={{ backgroundColor: "rgba(32, 34, 37, 0.95)" }}
                    ></div>
                  </>
                ) : null}
              </div>
            ) : (
              <></>
            )}
          </div>

          {activeBtnFollow && isFollowingProfile === null ? (
            <Skeleton count={1} width={80} height={32} />
          ) : (
            activeBtnFollow && (
              <button
                className="oasis_midB1_Bg font-bold text-sm rounded text-white w-20 h-8"
                type="button"
                onClick={handleToggleFollow}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleToggleFollow();
                  }
                }}
              >
                {isFollowingProfile ? "Unfollow" : "Follow"}
              </button>
            )
          )}
        </div>
        <div className="container flex mt-4 f-cont">
          {!followers || !following ? (
            <Skeleton count={1} width={677} height={24} />
          ) : (
            <>
              <p className="mr-10">
                <span className="font-bold text-white">
                  {photosCount} photos
                </span>
              </p>
              <p className="mr-10 fol-link">
                <span className="font-bold text-white">
                  {followerCount}
                  {` `}
                  {followerCount === 1 ? `follower` : `followers`}
                </span>
              </p>
              <p className="mr-10 fol-link">
                <span className="font-bold text-white">
                  {following?.length} following
                </span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

Header.propTypes = {
  photosCount: PropTypes.number.isRequired,
  followerCount: PropTypes.number.isRequired,
  setFollowerCount: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    docId: PropTypes.string,
    userId: PropTypes.string,
    fullName: PropTypes.string,
    username: PropTypes.string,
    followers: PropTypes.array,
    following: PropTypes.array,
  }).isRequired,
};
