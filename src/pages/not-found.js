import { useEffect } from "react";
import Header from "../components/header";
import { Link } from "react-router-dom";
import * as ROUTES from "../constants/routes";

export default function NotFound() {
  useEffect(() => {
    document.title = "Not Found - The Oasis";
  }, []);

  return (
    <div
      className="oasis_black_Bg"
      style={{
        height: "100vh",
        overflowY: "hidden",
      }}
    >
      <Header />
      <div className="oasis_black_Bg not-found-page">
        <div className="not-found-cont">
          <h1 className="neon-orange">404</h1>
          <h2 className="neon-blue">Page Not Found!</h2>

          <Link
            to={ROUTES.DASHBOARD}
            className="not-but"
            data-text="Back To Home"
          >
            Back To Home
          </Link>
        </div>
      </div>
    </div>
  );
}
