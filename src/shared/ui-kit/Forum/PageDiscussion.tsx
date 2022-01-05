import React, { useEffect, useState } from "react";
import "./PageDiscussion.css";
import axios from "axios";
import URL from "../../functions/getURL";

import { useTypedSelector } from "store/reducers/Reducer";
import ModalNewTopic from "./ModalNewTopic";
import { TextareaAutosize } from "@material-ui/core";
import Moment from "react-moment";
import { LoadingWrapper } from "../Hocs";

const PageDiscussion = props => {
  const users = useTypedSelector(state => state.usersInfoList);
  const user = useTypedSelector(state => state.user);

  const [topicView, setTopicView] = useState<any>({});

  const [posts, setPosts] = useState<
    {
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
      createdByImage: string;
      createdAt: number;
      createdAtFormat: string;
      lastComment: number;
      lastCommentFormat: string;
      countComments: number;
    }[]
  >([]);

  const [openNewTopic, setOpenNewTopic] = useState<boolean>(false);

  const [commentContent, setCommentContent] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [status, setStatusBase] = React.useState<any>("");
  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);
  const [isPostsLoading, setIsPostsLoading] = useState<boolean>(false);
  const [isCommentsLoading, setIsCommentsLoading] = useState<boolean>(false);

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

  const handleOpenNewTopic = () => {
    setOpenNewTopic(true);
  };

  const handleCloseNewTopic = () => {
    setOpenNewTopic(false);
  };

  useEffect(() => {
    props.pageDiscussionRef.current = refreshPosts;

    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, props.discussions]);

  const refreshPosts = React.useCallback(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    // API call
    const params = {
      postType: props.postType,
      linkId: props.linkId,
    };

    if (props.discussions) {
      setPosts(props.discussions);
    } else setIsPostsLoading(true);
    axios
      .post(`${URL()}/forum/posts/`, params)
      .then(res => {
        const newPosts = [] as any;
        let len = res.data.data.length;
        for (let i = 0; i < len; i++) {
          let curData = res.data.data[i];

          let post = {};
          post["id"] = curData.id;
          post["categoryId"] = curData.categoryId;
          post["categoryName"] = curData.categoryName;

          post["linkId"] = curData.linkId;
          post["postType"] = curData.postType;

          post["content"] = curData.content;
          post["subject"] = curData.subject;
          post["createdBy"] = curData.createdBy;
          post["createdByName"] = curData.createdByName;
          post["createdByHasPhoto"] = curData.createdByHasPhoto ?? false;
          post["createdAt"] = curData.createdAt;
          post["createdAtFormat"] = curData.createdAtFormat;
          post["lastComment"] = curData.lastComment;
          post["lastCommentFormat"] = curData.lastCommentFormat;
          post["countComments"] = curData.countComments;
          post["createdByImage"] = "";

          if (users && users.length > 0) {
            post["createdByImage"] = users[users.findIndex(user => user.id === curData.createdBy)].imageURL;
            post["createdByName"] = users[users.findIndex(user => user.id === curData.createdBy)].name;
          }

          // push to array
          newPosts.push(post);
        }

        setPosts(newPosts);
        setIsPostsLoading(false);
      })
      .catch(() => {
        setIsPostsLoading(false);
      });
  };

  useEffect(() => {
    if (topicView.id) {
      loadTopic();
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [topicView]);

  const loadTopic = () => {
    setIsPostsLoading(true);
    axios
      .get(`${URL()}/forum/${topicView.id}`)
      .then(res => {
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
        setIsPostsLoading(false);
      })
      .catch(() => {
        setIsPostsLoading(false);
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
        postId: topicView.id.toString(),
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

  if (posts.length === 0)
    return (
      <div className={"no-content-container"}>
        <span>🕳️</span>
        <h4>No discussions yet</h4>
        <button onClick={handleOpenNewTopic}>Start a discussion</button>
      </div>
    );
  else
    return (
      <div className="discussion-posts">
        <div className="discussion-headers">
          <LoadingWrapper loading={isPostsLoading}>
            <>
              {posts.map((val, index) => {
                return (
                  <div
                    className={val === topicView ? "discussion-header selected" : "discussion-header"}
                    key={`discussion-${index}`}
                    onClick={() => {
                      setTopicView(val);
                    }}
                  >
                    {val.subject}
                  </div>
                );
              })}
            </>
          </LoadingWrapper>
        </div>
        <div className="selected-discussion">
          <LoadingWrapper loading={isCommentsLoading}>
            <>
              {Object.keys(topicView).length > 0 ? (
                <div className="discussions-content ">
                  {comments.length > 0 ? (
                    comments.map(val => {
                      let userFound = users.find(usr => usr.id === val.createdByImage);
                      return (
                        <div
                          className={val.createdBy === user.id ? "discussion-item mine" : "discussion-item"}
                          key={val.id}
                        >
                          {val.createdBy !== user.id ? (
                            <div
                              className="avatar"
                              style={{
                                backgroundImage: userFound ? userFound.url : "none",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }}
                            />
                          ) : null}
                          <div className="bubble">
                            {val.content}
                            <div className="messageDateFromNow">
                              <Moment fromNow>{1620774386}</Moment>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="no-comments">
                      <span>🏁</span>
                      <span>Start the conversation!</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="no-comments">
                  <span>🏁</span>
                  <span>Select a conversation and start discussing!</span>
                </div>
              )}

              {Object.keys(topicView).length > 0 ? (
                <div className="inputDiscordChat">
                  <div className="iconsDiscordMessage">
                    <div className="iconImgDiscordMessage">
                      <img
                        src={require("assets/mediaIcons/old/audio_live.png")}
                        alt={"upload audio"}
                        // onClick={startAudioRecording}
                        style={{
                          width: "20px",
                          height: "20px",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                    <div className="iconImgDiscordMessage">
                      <img
                        src={require("assets/icons/attachment_icon.svg")}
                        alt={"Attachment"}
                        // onClick={uploadAttachment}
                        style={{
                          width: "20px",
                          height: "20px",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                    <div className="iconImgDiscordMessage">
                      <img
                        src={require("assets/icons/emoji_icon.svg")}
                        alt={"emoji"}
                        style={{
                          width: "20px",
                          height: "20px",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <TextareaAutosize
                      rowsMin={1}
                      required={true}
                      value={commentContent}
                      onChange={commentContent => setCommentContent(commentContent.target.value)}
                      placeholder="Type here..."
                      className="comment"
                    />
                    <button disabled={disableSubmit}>
                      <img src={require("assets/icons/send_white.png")} alt="send" />
                    </button>
                  </form>
                </div>
              ) : null}
            </>
          </LoadingWrapper>
        </div>
        <ModalNewTopic
          open={openNewTopic}
          handleClose={handleCloseNewTopic}
          postType={props.PostType}
          linkId={props.LinkId}
          pageDiscussionRef={props.pageDiscussionRef}
        />
      </div>
    );
};

export default PageDiscussion;
