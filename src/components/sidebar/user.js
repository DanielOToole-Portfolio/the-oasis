import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { DEFAULT_IMAGE_PATH } from "../../constants/paths";

export default function User({ username, fullName, avatarSrc }) {
  return !username || !fullName ? (
    <Skeleton count={1} height={61} />
  ) : (
    <>
      <Link
        to={`/p/${username}`}
        className="grid grid-cols-4 gap-4 mb-6 items-center"
      >
        <div className="flex items-center justify-between col-span-1">
          <img
            style={{
              width: "50px",
              height: "50px",
              objectFit: "cover",
            }}
            className="rounded-full flex"
            src={avatarSrc}
            alt={`${fullName} profile picture`}
            onError={(e) => {
              e.target.src = DEFAULT_IMAGE_PATH;
            }}
          />
        </div>
        <div className="col-span-3">
          <p className="font-bold text-sm text-white">{username}</p>
          <p className="text-sm text-white">{fullName}</p>
        </div>
      </Link>
      <div
        className="border-b border-gray-800"
        style={{ marginBottom: "1.5rem" }}
      />
    </>
  );
}

User.propTypes = {
  username: PropTypes.string,
  fullName: PropTypes.string,
};
