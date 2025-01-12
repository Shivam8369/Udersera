import React from "react";

function Spinner({text = "Loading..."}) {
  return (
    <div className={`${ text === "loading" ? "w-screen" : ""} text-center flex justify-center align-middle  gap-4 text-3xl text-white`}>
      <div className="spinner"></div> {text}
    </div>
  );
}

export default Spinner;
