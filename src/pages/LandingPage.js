import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import * as ROUTES from "../constants/routes";

export default function LandingPage() {
  useEffect(() => {
    document.title = "Enter The Oasis";
  }, []);

  return (
    <div>
      <div className="fullscreen-bg">
        <video className="videoTag" autoPlay loop muted>
          <source src="../videos/landing-video.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="landing-head-cont">
        <div className="glitch-wrapper">
          <h1 className="glitch" data-text="The Oasis">
            The Oasis
          </h1>
          <div className="landing-head-aft"></div>
        </div>
        <Link to={ROUTES.LOGIN} className="land-button">
          ENTER
        </Link>
      </div>
    </div>
  );
}
