import React from "react";
import MiniLoader from "../Loader/MiniLoader";

import "./remove-button.scss";

export default ({ loading, onClick }) => (
  <div className="remove__button" onClick={onClick}>
    {loading ? (
      <div className="remove_button__loader">
        <MiniLoader />
      </div>
    ) : (
      <i className="fa fa-times" aria-hidden="true" />
    )}
  </div>
);
