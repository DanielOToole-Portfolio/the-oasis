import React, { useState, useContext } from "react";
import { PlusCircleIcon, UploadIcon } from "@heroicons/react/outline";
import { db, storage } from "../../lib/firebase";
import UserContext from "../../context/user";
import useUser from "../../hooks/use-user";

export default function UploadForm() {
  const [file, setFile] = useState("");
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState(null);

  const types = ["image/png", "image/jpeg"];

  const { user: loggedInUser } = useContext(UserContext);
  const { user } = useUser(loggedInUser?.uid);

  const openModal = () => {
    document.body.classList.add("bodyNoScroll");
    setShowModal(true);
  };

  const handleChange = (e) => {
    let selected = e.target.files[0];

    if (selected && types.includes(selected.type)) {
      setFile(selected);
      setError("");

      const storageRef = storage.ref(
        Math.floor(Date.now() * Math.random()) + "_" + selected.name
      );

      storageRef.put(selected).on(
        "state_changed",
        (snap) => {
          let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
          setProgress(percentage);
        },
        (err) => {
          setError(err);
        },
        async () => {
          const url = await storageRef.getDownloadURL();
          setUrl(url);
        }
      );
    } else {
      setFile(null);
      setError("Please select an image file (png or jpg)");
    }
  };

  const handleUpload = () => {
    let postCaption = document.getElementById("postCaption").value;

    if (postCaption === "") {
      setError("Please enter a Post Caption");
    } else {
      db.collection("photos").add({
        photoId: Math.floor(Date.now() * Math.random()),
        userId: loggedInUser?.uid,
        imageSrc: url,
        displayName: user.username,
        caption: postCaption,
        likes: [],
        comments: [],
        dateCreated: Date.now(),
        avatarSrc: user.avatarSrc,
      });
      document.body.classList.remove("bodyNoScroll");
      setShowModal(false);
      setFile("");
      setError(null);
      setProgress(0);
      setUrl(null);

      setTimeout(function () {
        location.reload();
      }, 1000);
    }
  };

  const cancelUpload = () => {
    document.body.classList.remove("bodyNoScroll");

    setShowModal(false);
    setFile("");
    setError(null);
    setShowModal(false);
    setProgress(0);
    setUrl(null);
  };

  return (
    <>
      <button type="button" onClick={openModal}>
        <PlusCircleIcon className="icon mr-6 w-8" />
      </button>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto">
              {/*content*/}
              <div className="img-up-cont border-0 rounded-lg shadow-lg relative flex flex-col w-full oasis_lightB_Bg outline-none focus:outline-none">
                {/*header*/}
                {url ? (
                  <>
                    <div
                      style={{
                        backgroundImage: `url("${url}")`,
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        width: "100%",
                        height: "341px",
                        borderRadius: "5px 5px 0 0",
                      }}
                    />
                  </>
                ) : (
                  <>
                    <div className="flex items-start justify-between p-5 rounded-t">
                      <div className="img-up-wrapper group">
                        <label className="file-upload">
                          <input type="file" onChange={handleChange} />
                          <UploadIcon
                            className="icon"
                            style={{
                              width: "50px",
                              display: "block",
                              margin: "auto",
                            }}
                          />
                        </label>
                      </div>
                    </div>
                    <div className="image-only font-bold text-sm">
                      <p>Select JPEG or PNG</p>
                    </div>
                    {file && <div>{file.name}</div>}
                    <progress value={progress} max="100" />
                  </>
                )}

                <div className="caption">
                  <textarea
                    id="postCaption"
                    placeholder="Write a caption"
                    aria-label="Write a caption"
                  />
                </div>
                {error ? (
                  <div className="output">
                    <div className="error">{error}</div>
                  </div>
                ) : null}

                {/*footer*/}
                <div className="flex items-center justify-center p-6 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={cancelUpload}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-emerald-500 crt-b text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    onClick={handleUpload}
                    disabled={!url}
                  >
                    Create Post
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
    </>
  );
}
