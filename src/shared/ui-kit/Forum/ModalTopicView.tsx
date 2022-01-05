import React, { useEffect, useState } from "react";
import "./ModalTopicView.css";

import axios from "axios";

import { Modal } from "@material-ui/core";
import AlertMessage from "../Alert/AlertMessage";

import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import "shared/ui-kit/Modal/Modals/Modal.css";
import URL from "../../functions/getURL";
import { useTypedSelector } from "store/reducers/Reducer";
import { setSelectedUser } from "store/actions/SelectedUser";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LoadingWrapper } from "../Hocs";

export default function ModalTopicView(props) {
  const history = useHistory();
  const dispatch = useDispatch();

  const users = useTypedSelector(state => state.usersInfoList);
  const [commentContent, setCommentContent] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [status, setStatusBase] = React.useState<any>("");
  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  const [post, setPost] = useState<{
    id: number;
    categoryId: number;
    categoryName: string;
    linkId: string;
    postType: string;
    content: string;
    subject: string;
    createdBy: string;
    createdByName: string;
    createdByHasPhoto: boolean;
    createdAt: number;
    createdAtFormat: string;
    lastComment: number;
    lastCommentFormat: string;
    countComments: number;
    imageFile: string;
    documentFile: string;
    createdByImage: string;
  }>();

  const [comments, setComments] = useState<
    {
      id: number;
      postId: number;
      content: string;
      createdBy: string;
      createdByName: string;
      createdByHasPhoto: boolean;
      createdAt: number;
      createdAtFormat: string;
      createdByImage: string;
    }[]
  >([]);

  useEffect(() => {
    if (props.postId) {
      console.log("changed", props.postId);

      loadTopic();
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [props.postId, users]);

  const loadTopic = () => {
    setIsDataLoading(true);
    axios
      .get(`${URL()}/forum/${props.postId}`)
      .then(res => {
        let newPost = {
          id: res.data.data.post.id,
          categoryId: res.data.data.post.categoryId,
          categoryName: res.data.data.post.categoryName,

          linkId: res.data.data.post.linkId,
          postType: res.data.data.post.postType,

          content: res.data.data.post.content,
          subject: res.data.data.post.subject,
          createdBy: res.data.data.post.createdBy,
          createdByName: res.data.data.post.createdByName,
          createdByHasPhoto: res.data.data.post.createdByHasPhoto,
          createdAt: res.data.data.post.createdAt,
          createdAtFormat: res.data.data.post.createdAtFormat,
          lastComment: res.data.data.post.lastComment,
          lastCommentFormat: res.data.data.post.lastCommentFormat,
          countComments: res.data.data.post.countComments,
          createdByImage: "",
          imageFile: res.data.data.post.imageFile,
          documentFile: res.data.data.post.documentFile,
        };

        if (users && users.length > 0) {
          newPost["createdByImage"] = users[users.findIndex(user => user.id === newPost.createdBy)].imageURL;
        }

        setPost(newPost);

        const newComments = [] as any;
        let len = res.data.data.comments.length;
        for (let i = 0; i < len; i++) {
          let curData = res.data.data.comments[i];

          let comment = {};
          comment["id"] = curData.id; // commentId
          comment["postId"] = curData.postId;
          comment["content"] = curData.content;
          comment["createdBy"] = curData.createdBy;
          comment["createdByName"] = curData.createdByName;
          comment["createdByHasPhoto"] = curData.createdByHasPhoto;
          comment["createdAt"] = curData.createdAt;
          comment["createdAtFormat"] = curData.createdAtFormat;

          if (users && users.length > 0) {
            comment["createdByImage"] =
              users[users.findIndex(user => user.id === curData.createdBy)].imageURL;
          }

          // push to array
          newComments.push(comment);
        }

        setComments(newComments);
        setIsDataLoading(false);
      })
      .catch(() => {
        setIsDataLoading(false);
      });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let values = { commentContent };
    let validatedErrors = validate(values);
    setErrors(validatedErrors);

    if (Object.keys(validatedErrors).length === 0) {
      console.log("no errors, send create comment request now");

      // API call
      const params = {
        content: commentContent,
        postId: props.postId,
      };

      setDisableSubmit(true);

      axios
        .post(`${URL()}/forum/comment/`, params)
        .then(res => {
          console.log("API call result : ", res);

          if (res.data.success) {
            setStatusBase({
              msg: "comment create success",
              key: Math.random(),
              variant: "success",
            });

            setCommentContent("");
            loadTopic();
          } else {
            setStatusBase({
              msg: "comment create failed",
              key: Math.random(),
              variant: "error",
            });
          }

          setDisableSubmit(false);
        })
        .catch(async err => {
          console.log("Error in Topic.tsx -> handleSubmit() : ", err);
          setStatusBase({
            msg: "comment create failed",
            key: Math.random(),
            variant: "error",
          });

          setDisableSubmit(false);
        });
    } // if no errors
  }; // handleSubmit

  function validate(values: { [key: string]: any }): { [key: string]: any } {
    var errors: { [key: string]: string } = {};

    if (values.commentContent === null || values.commentContent === "") {
      errors.commentContent = "commentContent required";
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
      <div className="modal-content modalCreatePost w50 modal-topic-view">
        <div className="exit" onClick={props.handleClose}>
          <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
        </div>
        <div className="discussions">
          <LoadingWrapper loading={isDataLoading}>
            <>
              {post ? (
                <div className="discussion-item" key={post.id}>
                  <div className="title">
                    <h2>{post.subject}</h2>
                  </div>

                  <div className="bottom-items">
                    <span
                      onClick={() => {
                        history.push(`/profile/${post.createdBy}`);
                        dispatch(setSelectedUser(post.createdBy));
                      }}
                    >
                      <div
                        className="user-image cursor-pointer"
                        style={{
                          backgroundImage:
                            post.createdByImage && post.createdByImage.length > 0
                              ? `url(${post.createdByImage})`
                              : `none`,
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          height: "30px",
                        }}
                      />

                      <p>{post.createdByName}</p>
                    </span>

                    <span>{post.createdAtFormat}</span>
                  </div>

                  <p>{post.content}</p>

                  <div className="bottom-items">
                    <span>
                      <img
                        src={
                          false
                            ? require("assets/icons/message_darkblue.png")
                            : require("assets/icons/message_gray.png")
                        }
                        alt={"star"}
                      />
                      <p>
                        <a>{post.countComments} responses</a>
                      </p>
                    </span>
                  </div>

                  {post.imageFile ? (
                    <>
                      <br />
                      <img
                        src={URL() + "/forum/image/" + post.id + "/" + post.imageFile}
                        width={400}
                        height={400}
                        style={{ width: 400, height: 400 }}
                        alt="forum"
                      />
                    </>
                  ) : (
                    ""
                  )}
                  {post.documentFile ? (
                    <>
                      <br />
                      <a href={URL() + "/forum/document/" + post.id + "/" + post.documentFile}>
                        {post.documentFile}
                      </a>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                ""
              )}

              {comments.map(val => {
                return (
                  <div className="discussion-item" key={val.id}>
                    <div className="bottom-items">
                      <span
                        className="cursor-pointer"
                        onClick={() => {
                          history.push(`/profile/${val.createdBy}`);
                          dispatch(setSelectedUser(val.createdBy));
                        }}
                      >
                        <div
                          className="user-image"
                          style={{
                            backgroundImage:
                              val.createdByHasPhoto && val.createdByImage && val.createdByImage.length > 0
                                ? `url(${val.createdByImage})`
                                : "none",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            height: "30px",
                          }}
                        />

                        <p>{val.createdByName}</p>
                      </span>

                      <span>{val.createdAtFormat}</span>
                    </div>

                    <p>{val.content}</p>
                  </div>
                );
              })}

              <form onSubmit={handleSubmit}>
                <div>
                  <label>
                    <TextareaAutosize
                      value={commentContent}
                      required={true}
                      onChange={commentContent => setCommentContent(commentContent.target.value)}
                      rowsMin={6}
                      cols={90}
                      placeholder="comment"
                      className="comment"
                    />
                  </label>
                  {errors.commentContent ? <div className="error">{errors.commentContent}</div> : ""}
                </div>
                <button disabled={disableSubmit}>Submit Comment</button>
              </form>
            </>
          </LoadingWrapper>
        </div>
        {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
      </div>
    </Modal>
  );
}
