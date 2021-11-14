import PropTypes from "prop-types";

export default function Image({ src, caption }) {
  return (
    <img
      src={src}
      alt={caption}
      style={{
        objectFit: "cover",
        width: "100%",
        maxHeight: "600px",
      }}
    />
  );
}

Image.propTypes = {
  src: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired,
};
