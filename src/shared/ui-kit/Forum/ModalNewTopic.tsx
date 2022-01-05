import React, { useState } from "react";
import "./ModalNewTopic.css";

import axios from "axios";

import { Modal } from "@material-ui/core";
import AlertMessage from "../Alert/AlertMessage";

import "shared/ui-kit/Modal/Modals/Modal.css";
import URL from "../../functions/getURL";
import ImageTitleDescription from "../Page-components/ImageTitleDescription";

export default function ModalNewTopic(props) {
  const [postTitle, setPostTitle] = useState<string>("");
  const [postContent, setPostContent] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [status, setStatusBase] = React.useState<any>("");
  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);

  // const [isModerator, setIsModerator] = useState<boolean>(user.role == "FORUM_MODERATOR");
  const [photo, setPhoto] = useState<any>(null);
  const [photoImg, setPhotoImg] = useState<any>(null);
  const [document, setDocument] = React.useState<string | Blob>("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let values = { postTitle, postContent };
    let validatedErrors = validate(values);
    setErrors(validatedErrors);

    if (Object.keys(validatedErrors).length === 0) {
      console.log("no errors, send create topic request now");

      let formData = new FormData();
      formData.append("subject", postTitle);
      formData.append("content", postContent);
      formData.append("postType", props.postType);
      formData.append("linkId", props.linkId);

      formData.append("image", photo);
      formData.append("document", document);
      console.log(photo);
      console.log(document);

      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };

      setDisableSubmit(true);

      axios
        .post(`${URL()}/forum/`, formData)
        .then(res => {
          console.log("API call result : ", res);

          if (res.data.success) {
            setStatusBase({
              msg: "post create success",
              key: Math.random(),
              variant: "success",
            });

            setPostTitle("");
            setPostContent("");

            props.pageDiscussionRef.current(); // will call PageDiscussion refreshposts
            props.handleClose(res.data.data);
          } else {
            setStatusBase({
              msg: "new post create failed",
              key: Math.random(),
              variant: "error",
            });
          }

          setDisableSubmit(false);
        })
        .catch(async err => {
          console.log("Error in Posts.tsx -> handleSubmit() : ", err);
          setStatusBase({
            msg: "post create failed",
            key: Math.random(),
            variant: "error",
          });

          setDisableSubmit(false);
        });
    } // if no errors
  }; // handleSubmit

  function validate(values: { [key: string]: any }): { [key: string]: any } {
    var errors: { [key: string]: string } = {};

    if (values.postTitle === null || values.postTitle === "") {
      errors.postTitle = "postTitle required";
    }

    if (values.postContent === null || values.postContent === "") {
      errors.postContent = "postContent required";
    }

    return errors;
  }

  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      className="modal modalCreateModal"
    >
      <div className="modal-content modalCreatePost modal-new-topic">
        <div className="exit" onClick={props.handleClose}>
          <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
        </div>
        <div className="title">
          <h2>
            {`New
            ${
              props.postType === "pei"
                ? "Issue"
                : props.postType === "ped" ||
                  props.postType === "ft" ||
                  props.postType === "cp" ||
                  props.postType === "pnft"
                ? "discution"
                : props.postType === "pep"
                ? "Proposal"
                : "Topic"
            }`}
          </h2>
        </div>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <ImageTitleDescription
            photoImg={photoImg}
            photoTitle="Post Image"
            setterPhoto={setPhoto}
            setterPhotoImg={setPhotoImg}
            titleTitle="Post title"
            title={postTitle}
            setterTitle={title => {
              setPostTitle(title);
            }}
            titlePlaceholder="Post title..."
            descTitle="Post content"
            desc={postContent}
            setterDesc={desc => {
              setPostContent(desc);
            }}
            descPlaceholder="Post content..."
            imageSize={6}
            infoSize={6}
          />
          {errors.postTitle ? (
            <div className="error">{errors.postTitle}</div>
          ) : errors.postContent ? (
            <div className="error">{errors.postContent}</div>
          ) : null}

          {
            <label>
              <p>Document</p>
              <input
                name="document"
                type="file"
                className="document"
                onChange={e => setDocument(e!.target!.files![0]!)}
              />
            </label>
          }
          <div className="buttons buttons-single">
            <button disabled={disableSubmit}>
              Create{" "}
              {props.postType === "pei"
                ? "Issue"
                : props.postType === "ped" ||
                  props.postType === "ft" ||
                  props.postType === "cp" ||
                  props.postType === "pnft"
                ? "discution"
                : props.postType === "pep"
                ? "Proposal"
                : "Topic"}
            </button>
          </div>
        </form>

        {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
      </div>
    </Modal>
  );
}
