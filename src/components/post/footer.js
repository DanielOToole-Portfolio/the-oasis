import PropTypes from "prop-types";
import { formatDistance } from "date-fns";

export default function Footer({ caption, username, posted }) {
  return (
    <>
      <div className="p-4 pt-2 pb-1">
        <span className="mr-1 font-bold">{username}</span>
        <span className="italic">{caption}</span>
        <p className="text-gray-base uppercase text-xs mt-2">
          Posted {formatDistance(posted, new Date())} ago
        </p>
      </div>
    </>
  );
}

Footer.propTypes = {
  caption: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  posted: PropTypes.number.isRequired,
};
