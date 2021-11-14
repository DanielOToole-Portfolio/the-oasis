import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";

export default function Photos({ photos, setSelectedImg }) {
  const profilePageCont = document.getElementById("profilePageCont");

  return (
    <div className="border-t border-gray-800 mt-12 pt-4">
      <div className="grid grid-cols-3 mt-4 mb-12 photo-grid-cont">
        {!photos ? (
          <>
            <Skeleton count={12} width={320} height={400} />
          </>
        ) : photos.length > 0 ? (
          photos.map((photo) => (
            <div
              key={photo.docId}
              className="group img-cont"
              onClick={function () {
                setSelectedImg(photo, profilePageCont);
                document.body.classList.add("bodyNoScrollLG");
                profilePageCont.classList.add("mFullHeight");
              }}
              style={{ cursor: "pointer" }}
            >
              <div
                style={{
                  backgroundImage: `url("${photo.imageSrc}")`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  width: "100%",
                  height: "341px",
                }}
                aria-label={`${photo.caption}`}
              />
            </div>
          ))
        ) : null}
      </div>
      {!photos ||
        (photos.length === 0 && (
          <p className="text-center text-2xl text-white">No Posts Yet</p>
        ))}
    </div>
  );
}

Photos.propTypes = {
  photos: PropTypes.array,
};
