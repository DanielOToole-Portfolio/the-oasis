import React, { useState, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import FirebaseContext from "../../context/firebase";
import UserContext from "../../context/user";
import { formatDistance } from "date-fns";
import useUser from "../../hooks/use-user";
import { db } from "../../lib/firebase";

import { XIcon, DotsHorizontalIcon, TrashIcon } from "@heroicons/react/outline";

const Modal = ({ selectedImg, setSelectedImg }) => {
  const profilePageCont = document.getElementById("profilePageCont");

  const {
    user: loggedInUser,
    user: { uid: userId, displayName },
  } = useContext(UserContext);
  const { user } = useUser(loggedInUser?.uid);
  const opt = document.getElementById("modal-opt");
  const commentInput = useRef(null);
  const handleFocus = () => commentInput.current.focus();
  const { firebase, FieldValue } = useContext(FirebaseContext);

  const [toggleLiked, setToggleLiked] = useState(selectedImg.userLikedPhoto);
  const [likes, setLikes] = useState(selectedImg.likes.length);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(selectedImg.comments);
  const [commentsSlice, setCommentsSlice] = useState(3);
  const [showModal, setShowModal] = useState(false);

  const handleClick = (e) => {
    if (e.target.classList.contains("backdrop")) {
      setSelectedImg(null);
      profilePageCont.classList.remove("mFullHeight");
    }
  };
  const closeModal = () => {
    setSelectedImg(null);
    profilePageCont.classList.remove("mFullHeight");
  };

  const handleOpt = () => {
    opt.classList.toggle("active");
  };

  const handleDeleteModal = () => {
    setShowModal(true);
  };

  const handleDeletePost = () => {
    setSelectedImg(null);
    setShowModal(false);
    opt.classList.remove("active");

    db.collection("photos").doc(selectedImg.docId).delete();

    location.reload();
  };

  const handleCancelDeletePost = () => {
    setShowModal(false);
    opt.classList.remove("active");
  };

  const handleToggleLiked = async () => {
    setToggleLiked((toggleLiked) => !toggleLiked);

    await firebase
      .firestore()
      .collection("photos")
      .doc(selectedImg.docId)
      .update({
        likes: toggleLiked
          ? FieldValue.arrayRemove(userId)
          : FieldValue.arrayUnion(userId),
      });

    setLikes((likes) => (toggleLiked ? likes - 1 : likes + 1));
  };

  const handleSubmitComment = (event) => {
    event.preventDefault();

    setComments([...comments, { displayName, comment }]);
    setComment("");

    return firebase
      .firestore()
      .collection("photos")
      .doc(selectedImg.docId)
      .update({
        comments: FieldValue.arrayUnion({
          avatarSrc: user.avatarSrc,
          displayName: displayName,
          comment: comment,
        }),
      });
  };

  const showNextComments = () => {
    setCommentsSlice(commentsSlice + 3);
  };

  return (
    <div className="backdrop" onClick={handleClick}>
      <div className="icon-out">
        <XIcon className="icon x" onClick={closeModal} />
      </div>
      <div className="modal-inner">
        <div
          className="modal-img"
          style={{
            backgroundImage: `url("${selectedImg.imageSrc}")`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
          aria-label="enlarged image"
        />
        <div className="modal-info pt-4">
          <div className="modal-inner-top">
            <div className="modal-header px-4 pb-4">
              <Link
                to={`/p/${selectedImg.displayName}`}
                className="flex items-center"
                style={{ width: "max-content" }}
              >
                <div
                  className="rounded-full h-8 w-8 flex mr-3"
                  style={{
                    backgroundImage: `url("${selectedImg.avatarSrc}")`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                  }}
                  aria-label={`${selectedImg.displayName} profile picture`}
                />
                <p className="font-bold hover-underline">
                  {selectedImg.displayName}
                </p>
              </Link>

              {loggedInUser.uid === selectedImg.userId ? (
                <div>
                  <DotsHorizontalIcon
                    className="w-8 select-none cursor-pointer"
                    onClick={handleOpt}
                  />

                  <div className="modal-opt" id="modal-opt">
                    <div className="modal-opt-item" onClick={handleDeleteModal}>
                      <TrashIcon className="trash-icon" />
                      <p>Delete post</p>
                    </div>
                  </div>
                  {showModal ? (
                    <>
                      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto">
                          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full oasis_lightB_Bg outline-none focus:outline-none p-6">
                            <h3 className="font-bold text-white">
                              Are you sure you want to delete this post?
                            </h3>
                            <div
                              className="flex items-center justify-center rounded-b"
                              style={{ paddingTop: "1.5rem" }}
                            >
                              <button
                                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={handleCancelDeletePost}
                              >
                                Cancel
                              </button>
                              <button
                                className="bg-emerald-500 crt-b text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                onClick={handleDeletePost}
                              >
                                Delete Post
                              </button>
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
            <div className="modal-cap-com">
              <div>
                <div className="modal-caption p-4">
                  <div
                    className="flex items-center"
                    style={{ alignItems: "flex-start", marginBottom: "20px" }}
                  >
                    <Link
                      to={`/p/${selectedImg.displayName}`}
                      className="flex"
                      style={{ marginRight: "5px" }}
                    >
                      <div
                        className="rounded-full h-8 w-8 flex mr-3"
                        style={{
                          backgroundImage: `url("${selectedImg.avatarSrc}")`,
                          backgroundSize: "cover",
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "center",
                        }}
                        aria-label={`${selectedImg.displayName} profile picture`}
                      />
                      <p className="font-bold hover-underline">
                        {selectedImg.displayName}
                      </p>
                    </Link>
                    <span className="italic">{selectedImg.caption}</span>
                  </div>
                </div>

                <div className="modal-comments p-4 pt-1 pb-4">
                  {comments.slice(0, commentsSlice).map((selectedImg) => (
                    <div
                      className="flex items-center"
                      style={{ alignItems: "flex-start", marginBottom: "10px" }}
                      key={`${selectedImg.comment}-${selectedImg.displayName}`}
                    >
                      <Link
                        to={`/p/${selectedImg.displayName}`}
                        className="flex"
                        style={{ marginRight: "5px" }}
                      >
                        <div
                          className="rounded-full h-8 w-8 flex mr-3"
                          style={{
                            backgroundImage: `url("${selectedImg.avatarSrc}")`,
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                          }}
                          aria-label={`${selectedImg.displayName} profile picture`}
                        />
                        <p className="font-bold hover-underline">
                          {selectedImg.displayName}
                        </p>
                      </Link>
                      <span>{selectedImg.comment}</span>
                    </div>
                  ))}
                  {selectedImg.comments.length >= 3 &&
                    commentsSlice < selectedImg.comments.length && (
                      <button
                        className="text-sm text-gray-base mb-1 cursor-pointer focus:outline-none hover-underline"
                        type="button"
                        onClick={showNextComments}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            showNextComments();
                          }
                        }}
                      >
                        View more comments
                      </button>
                    )}
                </div>
              </div>
            </div>
          </div>
          <div className="modal-inner-bottom">
            <div className="modal-actions">
              <>
                <div className="flex justify-between px-4 pt-4 pb-1.5">
                  <div className="flex">
                    {loggedInUser.uid === selectedImg.userId ? (
                      <></>
                    ) : (
                      <svg
                        onClick={handleToggleLiked}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            handleToggleLiked();
                          }
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        tabIndex={0}
                        className={`w-8 mr-4 select-none cursor-pointer focus:outline-none ${
                          toggleLiked
                            ? "fill-red text-red-primary"
                            : "text-black-light"
                        }`}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    )}

                    <svg
                      onClick={handleFocus}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          handleFocus();
                        }
                      }}
                      className="w-8 text-black-light select-none cursor-pointer focus:outline-none"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      tabIndex={0}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="p-4 py-0">
                  <p className="font-bold">
                    {selectedImg.likes.length === 1
                      ? `${selectedImg.likes.length} like`
                      : `${selectedImg.likes.length} likes`}
                  </p>
                </div>
              </>
            </div>
            <div className="modal-footer">
              <>
                <div className="px-4 pb-4">
                  <p className="text-gray-base uppercase text-xs mt-2">
                    Posted {formatDistance(selectedImg.dateCreated, new Date())}{" "}
                    ago
                  </p>
                </div>
              </>
            </div>
            <div className="modal-add-comment">
              <div className="border-t border-gray-primary">
                <form
                  className="flex justify-between pl-0 pr-5"
                  method="POST"
                  onSubmit={(event) =>
                    comment.length >= 1
                      ? handleSubmitComment(event)
                      : event.preventDefault()
                  }
                >
                  <input
                    aria-label="Add a comment"
                    autoComplete="off"
                    className="text-sm text-gray-base w-full mr-3 py-5 px-4"
                    type="text"
                    name="add-comment"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={({ target }) => setComment(target.value)}
                    ref={commentInput}
                  />
                  <button
                    className={`text-sm font-bold text-black ${
                      !comment && "opacity-25"
                    }`}
                    type="button"
                    disabled={comment.length < 1}
                    onClick={handleSubmitComment}
                  >
                    Post
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
