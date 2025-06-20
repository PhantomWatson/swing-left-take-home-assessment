import React from "react";

export default function ErrorMsg({errorMsg}) {
  return (
    <div className="alert alert-danger">
      <p>
        Unfortunately, an error is preventing us from loading the data you requested.
        Please try again later,
        or <a href="/contact" onClick={(e) => {e.preventDefault(); alert('This is a fake link.');}}>contact us</a> if
        you would like assistance.
      </p>
      <p>
        <strong>Details:</strong> {errorMsg}
      </p>
    </div>
  );
};
