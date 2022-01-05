import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const getFullToolBar = () => {
  return (
    <div id="standalone-container">
      <div id="toolbar-container">
        <span className="ql-formats">
          <select className="ql-font"></select>
          <select className="ql-size"></select>
        </span>
        <span className="ql-formats">
          <button className="ql-bold"></button>
          <button className="ql-italic"></button>
          <button className="ql-underline"></button>
          <button className="ql-strike"></button>
        </span>
        <span className="ql-formats">
          <select className="ql-color"></select>
          <select className="ql-background"></select>
        </span>
        <span className="ql-formats">
          <button className="ql-script" value="sub"></button>
          <button className="ql-script" value="super"></button>
        </span>
        <span className="ql-formats">
          <button className="ql-header" value="1"></button>
          <button className="ql-header" value="2"></button>
          <button className="ql-blockquote"></button>
          <button className="ql-code-block"></button>
        </span>
        <span className="ql-formats">
          <button className="ql-list" value="ordered"></button>
          <button className="ql-list" value="bullet"></button>
          <button className="ql-indent" value="-1"></button>
          <button className="ql-indent" value="+1"></button>
        </span>
        <span className="ql-formats">
          <button className="ql-direction" value="rtl"></button>
          <select className="ql-align"></select>
        </span>
        <span className="ql-formats">
          <button className="ql-link"></button>
          <button className="ql-image"></button>
          <button className="ql-video"></button>
          <button className="ql-formula"></button>
        </span>
        <span className="ql-formats">
          <button className="ql-clean"></button>
        </span>
      </div>
      <div id="editor-container"></div>
    </div>
  );
};

const QuillEditor = ({ editorState, onChange, readOnly = false }) => {
  return (
    <div>
      {!readOnly && getFullToolBar()}
      <ReactQuill
        modules={{
          toolbar: "#toolbar-container",
        }}
        placeholder={"Compose a content..."}
        theme={"snow"}
        readOnly={readOnly}
        value={editorState}
        onChange={onChange}
      />
    </div>
  );
};

export default QuillEditor;
