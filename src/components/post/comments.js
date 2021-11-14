import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import AddComment from "./add-comment";

export default function Comments({
  docId,
  comments: allComments,
  commentInput,
}) {
  const [comments, setComments] = useState(allComments);
  const [commentsSlice, setCommentsSlice] = useState(3);

  const showNextComments = () => {
    setCommentsSlice(commentsSlice + 3);
  };

  return (
    <>
      <div className="p-4 pt-1 pb-4">
        {comments.slice(0, commentsSlice).map((item) => (
          <div
            key={`${item.comment}-${item.displayName}`}
            className="mb-1 flex items-center"
            style={{ alignItems: "flex-start", marginBottom: "10px" }}
          >
            <Link
              className="flex mr-2"
              style={{ marginRight: "5px" }}
              to={`/p/${item.displayName}`}
            >
              <div
                className="rounded-full h-8 w-8 flex mr-3"
                style={{
                  backgroundImage: `url("${item.avatarSrc}")`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
                aria-label={`${item.displayName} profile picture`}
              />
              <span className="mr-1 font-bold">{item.displayName}</span>
            </Link>
            <span>{item.comment}</span>
          </div>
        ))}
        {comments.length >= 3 && commentsSlice < comments.length && (
          <button
            className="text-sm text-gray-base mb-1 cursor-pointer hover-underline focus:outline-none"
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
      <AddComment
        docId={docId}
        comments={comments}
        setComments={setComments}
        commentInput={commentInput}
      />
    </>
  );
}

Comments.propTypes = {
  docId: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
  commentInput: PropTypes.object.isRequired,
};
