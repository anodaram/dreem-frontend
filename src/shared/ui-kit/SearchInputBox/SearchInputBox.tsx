import React from "react";
import "./SearchInputBox.css";

export const SearchInputBox = ({ keyword, setKeyword, placeholder = "", style = {}, iconStyle="black" }) => {
  return (
    <div className="search-inputbox">
      <input
        className="input"
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
        placeholder={placeholder}
        style={{ ...style }}
      />
      <img src={require(iconStyle=== "black" ? "assets/icons/search.png" : "assets/icons/search_gray.png")} className="icon" />
    </div>
  );
};
