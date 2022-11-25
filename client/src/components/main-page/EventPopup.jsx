import React from "react";
import "../css-files/Popup.css";

const Popup = ({active, setActive, children}) => {
  return (
    <div className={active ? "popup active" : "popup"} onClick={() => setActive(false)}>
      <div className={active ? "popup__content active" : "popup__content"} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

export default Popup;
