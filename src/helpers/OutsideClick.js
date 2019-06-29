import React, { useEffect, useRef, useContext } from "react";
import Context from "../context";

export default ({ children }) => {
  const wrapperRef = useRef(null);
  const { isOutsideClicked, setOutsideClicked } = useContext(Context);

  const handleClickOutside = event => {
    if (wrapperRef && !wrapperRef.current.contains(event.target)) {
      console.log("isOutsideClicked");
      setOutsideClicked(true);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return <div ref={wrapperRef}>{children}</div>;
};
