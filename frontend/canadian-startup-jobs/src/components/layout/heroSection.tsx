import React from "react";
import { COLOURS, FONTS } from "../../utils/constants";

const HeroSection: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: COLOURS.background,
        padding: "24px",
        textAlign: "center",
        fontFamily: FONTS.founders,
        color: COLOURS.black,
      }}
    >
      <h2 style={{ fontSize: "2rem" }}>Find Your Dream Startup Job in Canada</h2>
      <p>Browse thousands of Canadian startup jobs and apply today!</p>
    </div>
  );
};

export default HeroSection;
