import React, { useState, useEffect, useRef } from "react";

import {
  Fade,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  Tooltip,
  useMediaQuery,
  Select,
  MenuItem,
} from "@material-ui/core";
import SvgIcon from "@material-ui/core/SvgIcon";

import { useTypedSelector } from "store/reducers/Reducer";
import { StyledSelect, StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import CommunityApps from "./components/CommunityAppCard";
import { ReactComponent as PlusSolid } from "assets/icons/plus-solid.svg";
import { ReactComponent as CloseSolid } from "assets/icons/close-solid.svg";
import CustomSwitch from "shared/ui-kit/CustomSwitch";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import Box from "shared/ui-kit/Box";

const imageIcon = require("assets/icons/image_icon.png");
const infoIcon = require("assets/icons/info_icon.png");

const blockChains = ["PRIVI", "Ethereum"];

const GeneralTab = React.memo((props: any) => {
  const inputRef = useRef<any>();
  //REDUX
  const loggedUser = useTypedSelector(state => state.user);

  const [canEdit, setCanEdit] = useState<boolean>(true);

  //const privacyOptions = ["Linear", "Private", "Hidden", "Custom"];
  const privacyOptions = ["Linear", "Private", "Hidden", "Custom"];
  //hashtags
  const [hashtag, setHashtag] = useState<string>("");
  //user management //admins
  const [admin, setAdmin] = useState<string>("");
  //users
  const userRoles = ["Moderator", "Treasurer", "Ambassador", "Member"];
  const [user, setUser] = useState<string>("");
  const [userRole, setUserRole] = useState<string>(userRoles[0]);
  const [userRoleList, setUserRoleList] = useState<any[]>([]);
  //invitation users /friend
  const [friendsSearcher, setFriendsSearcher] = useState<string>("");

  const [requiredToken, setRequiredToken] = useState<any>("");

  //switch
  const [openAdvertising, setOpenAdvertising] = useState<boolean>(false);
  const [paymentsAllowed, setPaymentAllowed] = useState<boolean>(false);

  const mobileMatches = useMediaQuery("(max-width:375px)");

  const handleChange = () => {
    setOpenAdvertising(value => !value);
    let communityCopy = {
      ...props.community,
    };
    communityCopy.OpenAdvertising = openAdvertising;
    props.setCommunity(communityCopy);
  };

  const handleChangePayment = () => {
    setPaymentAllowed(value => !value);
    let communityCopy = {
      ...props.community,
    };
    communityCopy.PaymentsAllowed = paymentsAllowed;
    props.setCommunity(communityCopy);
  };

  const handleChangeToken = val => {
    setRequiredToken(val);
    props.setCommunity({
      ...props.community,
      FundingToken: val,
    });
  };

  useEffect(() => {
    if (props.canEdit !== undefined) {
      setCanEdit(props.canEdit);
    }
  }, [props.canEdit]);

  //add button component
  const AddButtonCreateModal = (propsFunction: any) => {
    return (
      <Box className="createHashtagButton cursor-pointer" onClick={() => propsFunction.functionParams()}>
        <button className="createHashtagButton-inner__text"> + Add </button>
      </Box>
    );
  };

  const onChangeCommunityPhoto = (files: any) => {
    props.setPhoto(files[0]);
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      props.setPhotoImg(reader.result);

      let image = new Image();

      if (reader.result !== null && (typeof reader.result === "string" || reader.result instanceof String)) {
        image.src = reader.result.toString();

        //save dimensions
        image.onload = function () {
          let height = image.height;
          let width = image.width;

          const communityCopy = props.community;
          communityCopy.dimensions = { height: height, width: width };
          props.setCommunity(communityCopy);

          return true;
        };
      }
    });
    reader.readAsDataURL(files[0]);
  };

  const fileInputCommunityPhoto = e => {
    e.preventDefault();
    const files = e.target.files;
    if (files.length) {
      handleFiles(files);
    }
  };

  const dragOver = e => {
    e.preventDefault();
  };

  const dragEnter = e => {
    e.preventDefault();
  };

  const dragLeave = e => {
    e.preventDefault();
  };

  const fileDrop = e => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: any) => {
    for (let i = 0; i < files.length; i++) {
      if (validateFile(files[i])) {
        onChangeCommunityPhoto(files);
      } else {
        files[i]["invalid"] = true;
        // Alert invalid image
      }
    }
  };

  const validateFile = file => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/x-icon"];
    if (validTypes.indexOf(file.type) === -1) {
      return false;
    }
    return true;
  };

  const removeImage = () => {
    props.setPhoto(null);
    props.setPhotoImg(null);
  };

  const addLevel = () => {
    if (canEdit) {
      let communityCopy = { ...props.community };
      let array = [...communityCopy.Levels];
      array.push({
        Name: "",
        Description: "",
      });
      communityCopy.Levels = array;
      props.setCommunity(communityCopy);
    }
  };

  const addAdmin = () => {
    if (admin && admin !== "" && canEdit) {
      //TODO: check if email exists ???
      let communityCopy = { ...props.community };
      let array = [...communityCopy.Admins];
      array.push({
        name: admin,
        status: "Pending",
      });
      communityCopy.Admins = array;
      props.setCommunity(communityCopy);
      setAdmin("");
    }
  };

  // ------------------- USER ROLES ------------------------

  const addUserRole = () => {
    // here "user" is the input email
    if (user && user !== "" && userRole && userRole !== "" && canEdit) {
      let communityCopy = { ...props.community };
      let newUserRoles: any = { ...communityCopy.UserRoles };
      if (newUserRoles[user]) {
        // user already in the map
        newUserRoles[user].roles[userRole] = "Pending";
        newUserRoles[user].name = user;
      } else {
        // user added for the first time
        const roles = {};
        roles[userRole] = "Pending";
        newUserRoles[user] = {
          roles: roles,
          name: user,
        };
      }
      communityCopy.UserRoles = newUserRoles;
      props.setCommunity(communityCopy);
      setUser(""); // reset field
    }
  };

  const deletetUserRoles = (email, role) => {
    if (canEdit) {
      let communityCopy = { ...props.community };
      let newUserRoles: any = { ...communityCopy.UserRoles };
      if (newUserRoles[email]) {
        if (newUserRoles[email].roles[role]) delete newUserRoles[email].roles[role];
        if (Object.keys(newUserRoles[email].roles).length === 0) delete newUserRoles[email];
      }
      communityCopy.UserRoles = newUserRoles;
      props.setCommunity(communityCopy);
    }
  };

  useEffect(() => {
    const newList: any[] = [];
    let email: string = "";
    let roleObj: any = null;
    for ([email, roleObj] of Object.entries(props.community.UserRoles)) {
      let role: string = "";
      let roleStatus: any = "";
      for ([role, roleStatus] of Object.entries(roleObj.roles)) {
        newList.push({
          email: email,
          role: role,
          status: roleStatus,
        });
      }
    }
    setUserRoleList(newList);
  }, [props.community.UserRoles]);

  // -----------------------------------------------------

  const addInvitation = () => {
    if (friendsSearcher && friendsSearcher !== "" && canEdit) {
      //TODO: check if email exists ???
      let communityCopy = { ...props.community };
      let array = [...communityCopy.InvitationUsers];
      array.push(friendsSearcher);
      communityCopy.InvitationUsers = array;
      props.setCommunity(communityCopy);
      setFriendsSearcher(""); // reset field
    }
  };

  //input component
  function renderInputCreateModal(p) {
    return (
      <Box style={{ width: "100%", display: "flex", flexWrap: "wrap" }}>
        <InputWithLabelAndTooltip
          labelName={p.name}
          tooltip={p.info}
          type={p.type}
          inputValue={p.value ? p.value : props.community[p.item]}
          placeHolder={p.placeholder}
          disabled={!canEdit}
          minValue={p.min}
          onInputValueChange={e => {
            props.setCommunity({
              ...props.community,
              [p.item]: e.target.value,
            });
          }}
          style={{
            width: "100%",
            marginRight: "0px",
          }} />
      </Box>
    );
  }

  //selector component
  const SelectorCreateModal = (p: any) => {
    return (
      <FormControl style={{ width: "100%" }} className="selectorFormControlCommunity">
        <StyledSelect
          disableUnderline
          value={p.selectValue}
          style={{
            border: "1px solid hsla(212, 25%, 60%, 0.3)",
            marginLeft: 0,
            height: "46px",
            paddingLeft: "16px",
            borderRadius: "16px",
          }}
          onChange={p.selectFunction}
          disabled={!canEdit}
        >
          {p.selectItems.map((item, i) => {
            return (
              <StyledMenuItem key={i} value={item}>
                {item}
              </StyledMenuItem>
            );
          })}
        </StyledSelect>
      </FormControl>
    );
  };

  //hashtag label
  const HashtagLabel = p => {
    return (
      <Box className={p.main ? "hashtagLabel hashtagLabelMain" : "hashtagLabel"}>
        <Box style={{ display: "flex !important", justifyContent: "center !important" }}>{p.value}</Box>
      </Box>
    );
  };

  const inputHashHandler = (e: any) => {
    setHashtag(e.target.value);
  };

  //admin label
  const AdminsMailLabel = p => {
    return (
      <Box className="adminsMailLabelCommunity">
        <Box className="adminsNameMailLabelCommunity">
          <Box>{p.admin.name}</Box>
          <button
            className="deleteItemButton"
            onClick={(e: any) => {
              e.preventDefault();
              props.setCommunity({
                ...props.community,
                Admins: [...props.community.Admins].splice(p.index, 1),
              });
            }}
            disabled={!canEdit}
          >
            <SvgIcon><CloseSolid /></SvgIcon>
          </button>
        </Box>
        {p.admin.status === "Accepted" ? (
          <Box className="adminsStatusLabelCommunity">{p.admin.status}</Box>
        ) : null}
        {p.admin.status === "Pending" ? (
          <Box className="adminsStatusLabelCommunity pendingStatusLabelCommunity">
            {p.admin.status}, resend invite
          </Box>
        ) : null}
      </Box>
    );
  };

  //role user label
  const RoleLabel = p => {
    return (
      <Box className="adminsMailLabelCommunity">
        <Box className="adminsNameMailLabelCommunity">
          <Box className="mainHashtagLabelCommunity">{p.user.role}</Box>
          <Box>{p.user.email}</Box>
          <button
            className="deleteItemButton"
            onClick={(e: any) => {
              deletetUserRoles(p.user.email, p.user.role);
            }}
            disabled={!canEdit}
          >
            <SvgIcon><CloseSolid /></SvgIcon>
          </button>
        </Box>
        {p.user.status === "Accepted" ? (
          <Box className="adminsStatusLabelCommunity">{p.user.status}</Box>
        ) : null}
        {p.user.status === "Pending" ? (
          <Box className="adminsStatusLabelCommunity pendingStatusLabelCommunity">
            {p.user.status}, resend invite
          </Box>
        ) : null}
      </Box>
    );
  };

  //invitation / friend label
  const FriendLabel = p => {
    return (
      <Box className="insurerRowCreateCommunity">
        <Box className="photoInsurerRowCommunity"></Box>
        <Box className="nameInsurerRowCommunity">{p.user}</Box>
        <Box className="closeButtonInsurerRowCommunity">
          <button
            disabled={!canEdit}
            className="deleteItemButton"
            onClick={(e: any) => {
              e.preventDefault();
              props.setCommunity({
                ...props.community,
                InvitationUsers: [...props.community.InvitationUsers].splice(p.index, 1),
              });
            }}
          >
            <SvgIcon><CloseSolid /></SvgIcon>
          </button>
        </Box>
      </Box>
    );
  };

  return (
    <Box
      style={{
        backgroundColor: !canEdit ? "hsla(210, 27%, 91%, 0.2)" : "transparent",
        padding: !canEdit ? "0px 30px" : 0,
        marginLeft: !canEdit ? "-30px" : 0,
        width: "100%",
        flexGrow: 1,
      }}
    >
      {/*GENERAL INFO*/}
      {/* <h4>General Community info</h4> */}
      <Grid container spacing={2} direction="row" alignItems="flex-start" justify="flex-start">
        <Grid item xs={12} sm={6} md={6} style={{ marginTop: 0 }}>
          {renderInputCreateModal({
            name: "Community name",
            placeholder: "Proposal question",
            type: "text",
            width: 400,
            item: "Name",
            info: `Please name your community`,
          })}

          <Box className="flexRowInputs">
            <Box className="infoHeaderCreateCommunity" style={{ fontSize: "18px", color: "#181818" }}>
              Community description
            </Box>
            <Tooltip
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 600 }}
              arrow
              className="tooltipHeaderInfo"
              title={`Please tell us about your community`}
            >
              <img className="infoIconCreateCommunity" src={infoIcon} alt={"info"} />
            </Tooltip>
          </Box>
          <textarea
            disabled={!canEdit}
            className="textAreaCommunityDescription"
            rows={10}
            style={{ width: "95%", display: "flex", flexWrap: "wrap" }}
            value={props.community.Description}
            onChange={elem => {
              props.setCommunity({
                ...props.community,
                Description: elem.target.value,
              });
            }}
            placeholder="Proposal description"
          />
        </Grid>
        {mobileMatches && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box className="flexRowInputs">
                <Box className="infoHeaderCreateCommunity" style={{ fontSize: "18px", color: "#181818" }}>
                  Hashtag
                </Box>
                <Tooltip
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  arrow
                  className="tooltipHeaderInfo"
                  title={`Please provide at least one hashtag for your community. As the Communities grow, this field will help people discover your community`}
                >
                  <img className="infoIconCreateCommunity" src={infoIcon} alt={"info"} />
                </Tooltip>
              </Box>
              <Box className="hashtagsRowCreatePod" style={{ height: "auto", margin: "10px 0 0 0" }}>
                {props.community.Hashtags && props.community.Hashtags.length ? (
                  <Box className="flexRowInputs" style={{ padding: "5px 0" }}>
                    {props.community.Hashtags.map((hashtag, i) => {
                      if (i === 0) {
                        return <HashtagLabel key={i} value={hashtag} index={i} main={true} />;
                      } else {
                        return <HashtagLabel key={i} value={hashtag} index={i} main={false} />;
                      }
                    })}
                  </Box>
                ) : null}

                {/* //hashtag button TODO use HashTags component */}
                <Input
                  className="textFieldCreateCommunity"
                  style={{
                    color: "black",
                    width: "100%",
                    margin: "0 20px 0 0",
                    height: 49,
                  }}
                  type="text"
                  value={hashtag}
                  onChange={e => inputHashHandler(e)}
                  placeholder="#"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="add"
                        onClick={e => {
                          if (hashtag && hashtag !== "") {
                            e.preventDefault();
                            props.setCommunity({
                              ...props.community,
                              Hashtags: [...props.community.Hashtags, "#" + hashtag],
                            });
                            setHashtag("");
                          }
                        }}
                      >
                        <SvgIcon>
                          <PlusSolid />
                        </SvgIcon>
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box className="marginTopFieldCreatePod">
                <Box style={{ width: "100%" }} className="flexRowInputs social">
                  {renderInputCreateModal({
                    name: "Twitter ID",
                    placeholder: "Enter Twitter ID...",
                    type: "text",
                    width: "100%",
                    item: "TwitterId",
                    value: loggedUser.twitter,
                    info: `Please link to a Twitter page if you so choose`,
                  })}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box className="flexRowInputs">
                <Box className="infoHeaderCreateCommunity" style={{ fontSize: "18px", color: "#181818" }}>
                  Choose Blockchain Network
                </Box>
                <Tooltip
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  arrow
                  className="tooltipHeaderInfo"
                  title={`Please tell us about your community`}
                >
                  <img className="infoIconCreateCommunity" src={infoIcon} alt={"info"} />
                </Tooltip>
              </Box>
              <TokenSelect
                tokens={props.tokenObjList}
                value={requiredToken}
                onChange={e => {
                  setRequiredToken(e.target.value);
                }}
                style={{
                  paddingRight: "20px",
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box className="flexRowInputs">
                <Box className="infoHeaderCreateCommunity" style={{ fontSize: "18px", color: "#181818" }}>
                  Community Image
                </Box>
                <Tooltip
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  arrow
                  className="tooltipHeaderInfo"
                  title={`Please add image`}
                >
                  <img className="infoIconCreateCommunity" src={infoIcon} alt={"info"} />
                </Tooltip>
              </Box>
              {props.photoImg ? (
                <Box className="imageCreateCommunityDiv">
                  <Box
                    className="imageCreateCommunity"
                    style={{
                      backgroundImage: `url(${props.photoImg})`,
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      if (canEdit) {
                        if (inputRef && inputRef.current) {
                          inputRef.current.click();
                        }
                      }
                    }}
                  />
                  <Box className="removeImageButton cursor-pointer" onClick={() => removeImage()}>
                    <SvgIcon><CloseSolid /></SvgIcon>
                  </Box>

                  <InputWithLabelAndTooltip
                    type="file"
                    hidden
                    onInputValueChange={e => fileInputCommunityPhoto(e)}
                    style={{
                      display: "none",
                    }}
                    reference={inputRef} />
                </Box>
              ) : (
                <Box
                  className="dragImageHereCreateCommunity"
                  onDragOver={dragOver}
                  onDragEnter={dragEnter}
                  onDragLeave={dragLeave}
                  onDrop={fileDrop}
                  style={{
                    cursor: "pointer",
                    margin: "8px 0 0 0",
                    height: "242px",
                  }}
                  onClick={() => {
                    if (canEdit) {
                      if (inputRef && inputRef.current) {
                        inputRef.current.click();
                      }
                    }
                  }}
                >
                  <img className="dragImageHereIcon" src={imageIcon} alt={"camera"} />
                  <Box className="dragImageHereLabel">Drag Image Here</Box>
                  <InputWithLabelAndTooltip
                    type="file"
                    hidden
                    onInputValueChange={e => fileInputCommunityPhoto(e)}
                    style={{
                      display: "none",
                    }}
                    reference={inputRef} />
                </Box>
              )}
            </Grid>
            <Grid item xs={12}>
              <Box className="flexRowInputs">
                <Box className="infoHeaderCreateCommunity" style={{ fontSize: "18px", color: "#181818" }}>
                  Privacy
                </Box>
                <Tooltip
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  arrow
                  className="tooltipHeaderInfo"
                  title={`Public communities mean anyone can come follow and join, Private means that users have to request permission. For now those are the only two options`}
                >
                  <img className="infoIconCreateCommunity" src={infoIcon} alt={"info"} />
                </Tooltip>
              </Box>
              <Box className="option-buttons flex privacy">
                {privacyOptions.map(option => {
                  return (
                    <button
                      disabled={!canEdit}
                      key={option}
                      className={props.community.Privacy === option ? "selected" : undefined}
                      id="publicButtonCreatePod"
                      onClick={() => {
                        props.setCommunity({
                          ...props.community,
                          Privacy: option,
                        });
                      }}
                      style={{ margin: "3px 3px 0 0" }}
                    >
                      {option}
                    </button>
                  );
                })}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Grid item xs={12}>
                <Box className="flexRowInputs allow-payment-community">
                  <Box className="infoHeaderCreateCommunity" style={{ fontSize: "18px", color: "#181818" }}>
                    Allow payments within this community
                  </Box>
                  <Tooltip
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    arrow
                    className="tooltipHeaderInfo"
                    title={`Your community token and other internal or external tokens can be transacted within this community, please select if you wish to make this a possibility `}
                  >
                    <img className="infoIconCreateCommunity" src={infoIcon} alt={"info"} />
                  </Tooltip>
                </Box>
                <Box className="option-buttons flex" id="openAdvOptions">
                  <CustomSwitch
                    checked={paymentsAllowed}
                    onChange={handleChangePayment}
                  />
                </Box>
              </Grid>
              <Box className="flexRowInputs" mt={2.5}>
                <Box className="infoHeaderCreateCommunity" style={{ fontSize: "18px", color: "#181818" }}>
                  Open to advertising
                </Box>
                <Tooltip
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  arrow
                  className="tooltipHeaderInfo"
                  title={`When ads are viewed within the system those who view or click on the ad earn PRIVI Data Coins. Not yet operational but will be soon!`}
                >
                  <img className="infoIconCreateCommunity" src={infoIcon} alt={"info"} />
                </Tooltip>
              </Box>
              <Box className="option-buttons flex" id="openAdvOptions">
                <CustomSwitch checked={openAdvertising} onChange={handleChange} />
              </Box>
            </Grid>
          </Grid>
        )}
        {!mobileMatches && (
          <Grid item xs={12} sm={6} md={6}>
            <Box className="flexRowInputs">
              <Box className="infoHeaderCreateCommunity" style={{ fontSize: "18px", color: "#181818" }}>
                Community Image
              </Box>
              <Tooltip
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
                arrow
                className="tooltipHeaderInfo"
                title={`Please add image`}
              >
                <img className="infoIconCreateCommunity" src={infoIcon} alt={"info"} />
              </Tooltip>
            </Box>
            {props.photoImg ? (
              <Box className="imageCreateCommunityDiv">
                <Box
                  className="imageCreateCommunity"
                  style={{
                    backgroundImage: `url(${props.photoImg})`,
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (canEdit) {
                      if (inputRef && inputRef.current) {
                        inputRef.current.click();
                      }
                    }
                  }}
                />
                <Box className="removeImageButton cursor-pointer" onClick={() => removeImage()}>
                  <SvgIcon><CloseSolid /></SvgIcon>
                </Box><InputWithLabelAndTooltip
                  type="file"
                  hidden
                  onInputValueChange={e => fileInputCommunityPhoto(e)}
                  style={{
                    display: "none",
                  }}
                  reference={inputRef} />
              </Box>
            ) : (
              <Box
                className="dragImageHereCreateCommunity"
                onDragOver={dragOver}
                onDragEnter={dragEnter}
                onDragLeave={dragLeave}
                onDrop={fileDrop}
                style={{
                  cursor: "pointer",
                  margin: "8px 0 0 0",
                  height: "242px",
                }}
                onClick={() => {
                  if (canEdit) {
                    if (inputRef && inputRef.current) {
                      inputRef.current.click();
                    }
                  }
                }}
              >
                <img className="dragImageHereIcon" src={imageIcon} alt={"camera"} />
                <Box className="dragImageHereLabel">Drag Image Here</Box>
                <InputWithLabelAndTooltip
                  type="file"
                  hidden
                  onInputValueChange={e => fileInputCommunityPhoto(e)}
                  style={{
                    display: "none",
                  }}
                  reference={inputRef} />
              </Box>
            )}
          </Grid>
        )}
      </Grid>
      {!mobileMatches && (
        <>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box className="flexRowInputs">
                <Box className="infoHeaderCreateCommunity" style={{ fontSize: "18px", color: "#181818" }}>
                  Hashtags
                </Box>
                <Tooltip
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  arrow
                  className="tooltipHeaderInfo"
                  title={`Please provide at least one hashtag for your community. As the Communities grow, this field will help people discover your community`}
                >
                  <img className="infoIconCreateCommunity" src={infoIcon} alt={"info"} />
                </Tooltip>
              </Box>
              <Box className="hashtagsRowCreatePod" style={{ height: "auto", margin: "10px 0 0 0" }}>
                {props.community.Hashtags && props.community.Hashtags.length ? (
                  <Box className="flexRowInputs" style={{ padding: "5px 0" }}>
                    {props.community.Hashtags.map((hashtag, i) => {
                      if (i === 0) {
                        return <HashtagLabel key={i} value={hashtag} index={i} main={true} />;
                      } else {
                        return <HashtagLabel key={i} value={hashtag} index={i} main={false} />;
                      }
                    })}
                  </Box>
                ) : null}

                {/* //hashtag button TODO use HashTags component */}
                <Input
                  className="textFieldCreateCommunity"
                  style={{
                    color: "black",
                    width: "100%",
                    margin: "0 20px 0 0",
                    height: 49,
                  }}
                  type="text"
                  value={hashtag}
                  onChange={e => inputHashHandler(e)}
                  placeholder="#"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="add"
                        onClick={e => {
                          if (hashtag && hashtag !== "") {
                            e.preventDefault();
                            props.setCommunity({
                              ...props.community,
                              Hashtags: [...props.community.Hashtags, "#" + hashtag],
                            });
                            setHashtag("");
                          }
                        }}
                      >
                        <SvgIcon>
                          <PlusSolid />
                        </SvgIcon>
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box className="flexRowInputs">
                <Box className="infoHeaderCreateCommunity" style={{ fontSize: "18px", color: "#181818" }}>
                  Privacy
                </Box>
                <Tooltip
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  arrow
                  className="tooltipHeaderInfo"
                  title={`Public communities mean anyone can come follow and join, Private means that users have to request permission. For now those are the only two options`}
                >
                  <img className="infoIconCreateCommunity" src={infoIcon} alt={"info"} />
                </Tooltip>
              </Box>
              <Box className="option-buttons flex privacy">
                {privacyOptions.map(option => {
                  return (
                    <button
                      disabled={!canEdit}
                      key={option}
                      className={props.community.Privacy === option ? "selected" : undefined}
                      id="publicButtonCreatePod"
                      onClick={() => {
                        props.setCommunity({
                          ...props.community,
                          Privacy: option,
                        });
                      }}
                      style={{ margin: "3px 3px 0 0" }}
                    >
                      {option}
                    </button>
                  );
                })}
              </Box>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box className="marginTopFieldCreatePod">
                <Box style={{ width: "100%" }} className="flexRowInputs social">
                  {renderInputCreateModal({
                    name: "Twitter ID",
                    placeholder: "Enter Twitter ID...",
                    type: "text",
                    width: "100%",
                    item: "TwitterId",
                    value: loggedUser.twitter,
                    info: `Please link to a Twitter page if you so choose`,
                  })}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box className="flexRowInputs" mt={2.5}>
                <Box className="infoHeaderCreateCommunity" style={{ fontSize: "18px", color: "#181818" }}>
                  Open to advertising
                </Box>
                <Tooltip
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  arrow
                  className="tooltipHeaderInfo"
                  title={`Please tell us about your community`}
                >
                  <img className="infoIconCreateCommunity" src={infoIcon} alt={"info"} />
                </Tooltip>
              </Box>
              <FormControl variant="outlined" style={{ maxHeight: 46, width: "100%" }}>
                <Select
                  labelId="claimable-pod-blockchain"
                  id="claimable-pod-blockchain"
                  value={requiredToken}
                  onChange={e => handleChangeToken(e.target.value)}
                  style={{ maxHeight: 46 }}
                >
                  {blockChains.map(chain => (
                    <MenuItem value={chain} key={chain}>
                      {chain}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box className="flexRowInputs">
                  <Box className="infoHeaderCreateCommunity" style={{ fontSize: "18px", color: "#181818" }}>
                    Choose Blockchain Network
                  </Box>
                  <Tooltip
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    arrow
                    className="tooltipHeaderInfo"
                    title={`Please tell us about your community`}
                  >
                    <img className="infoIconCreateCommunity" src={infoIcon} alt={"info"} />
                  </Tooltip>
                </Box>
                <TokenSelect
                  tokens={props.tokenObjList}
                  value={requiredToken}
                  onChange={e => {
                    setRequiredToken(e.target.value);
                  }}
                  style={{
                    paddingRight: "20px",
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Box className="flexRowInputs allow-payment-community">
                  <Box className="infoHeaderCreateCommunity" style={{ fontSize: "18px", color: "#181818" }}>
                    Allow payments within this community
                  </Box>
                  <Tooltip
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    arrow
                    className="tooltipHeaderInfo"
                    title={`Your community token and other internal or external tokens can be transacted within this community, please select if you wish to make this a possibility `}
                  >
                    <img className="infoIconCreateCommunity" src={infoIcon} alt={"info"} />
                  </Tooltip>
                </Box>
                <Box className="option-buttons flex" id="openAdvOptions">
                  <CustomSwitch checked={paymentsAllowed} onChange={handleChangePayment} />
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </>
      )}
      {/* COMMUNITY LEVELS */}
      <h4 style={{ margin: "10px 0" }}>Community Levels</h4>
      <Box className="flexRowInputs" style={{ marginTop: "0" }}>
        <Box className="infoHeaderCreateCommunity" style={{ fontSize: "18px", color: "#181818" }}>
          Levels
        </Box>
        <Tooltip
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 600 }}
          arrow
          className="tooltipHeaderInfo"
          title={`You can create levels within your community for which your members can acheive. This can be customized after the creation of your community`}
        >
          <img className="infoIconCreateCommunity" src={infoIcon} alt={"info"} />
        </Tooltip>
      </Box>
      {props.community.Levels && props.community.Levels.length > 0
        ? props.community.Levels.map((level, index) => {
          return (
            <Box
              className="flexRowInputs level"
              key={`level-${index + 1}`}
              style={{ marginTop: "10px", justifyContent: "space-between" }}
            >
              <Box className="number" style={{ margin: 0 }}>
                {index + 1}
              </Box>
              <InputWithLabelAndTooltip
                overriedClasses="textFieldCreateCommunity level-name"
                type="text"
                inputValue={props.community.Levels[index].Name}
                placeHolder={`Level ${index + 1} Name`}
                onInputValueChange={e => {
                  let communityCopy = { ...props.community };
                  communityCopy.Levels[index].Name = e.target.value;
                  props.setCommunity(communityCopy);
                }}
                disabled={!canEdit}
                style={{
                  width: "calc(340px - 24px)",
                  margin: 0,
                }} />
              <InputWithLabelAndTooltip
                overriedClasses="textFieldCreateCommunity level-description"
                type="text"
                inputValue={props.community.Levels[index].Description}
                placeHolder={`Level ${index + 1} Description`}
                onInputValueChange={e => {
                  let communityCopy = { ...props.community };
                  communityCopy.Levels[index].Description = e.target.value;
                  props.setCommunity(communityCopy);
                }}
                disabled={!canEdit}
                style={{
                  width: "calc(340px - 24px)",
                  margin: 0,
                }} />
            </Box>
          );
        })
        : null}
      <Grid item xs={12}>
        {!mobileMatches && (
          <Box className="flex" style={{ justifyContent: "flex-end", padding: "5px 25px" }}>
            <AddButtonCreateModal functionParams={() => addLevel()} />
          </Box>
        )}
        {mobileMatches && (
          <Box className="flex" style={{ justifyContent: "flex-end" }}>
            <AddButtonCreateModal functionParams={() => addLevel()} />
          </Box>
        )}
      </Grid>
      {/* COMMUNITY APPS*/}
      <Box className="flexRowInputs">
        <Box className="infoHeaderCreateCommunity">Community Apps</Box>
        <Tooltip
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 600 }}
          arrow
          className="tooltipHeaderInfo"
          title={`As PRIVI grows, the features and apps you will have available to your to customize your commuity will grow as well. For now, this is just to show you what is possible! `}
        >
          <img className="infoIconCreateCommunity" src={infoIcon} alt={"info"} />
        </Tooltip>
      </Box>
      <Box className="community-apps">
        {props.community && (
          <Box className="community-apps">
            <CommunityApps
              type="Blog"
              community={props.community}
              setCommunity={props.setCommunity}
              canEdit={canEdit}
            />
            <CommunityApps
              type="Member Directory"
              community={props.community}
              setCommunity={props.setCommunity}
              canEdit={canEdit}
            />
            <CommunityApps
              type="Projects"
              community={props.community}
              setCommunity={props.setCommunity}
              canEdit={canEdit}
            />
            <CommunityApps
              type="Apps"
              community={props.community}
              setCommunity={props.setCommunity}
              canEdit={canEdit}
            />
          </Box>
        )}
      </Box>

      {/* USER MANAGEMENT */}
      <Box className="modalCreatePadding userManagementCreatePod">
        <h4 style={{ margin: "10px 0" }}>User management</h4>

        {/* ADD ADMINS */}
        <Box
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            flexDirection: "column",
          }}
        >
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <Box className="itemRow" width={1}>
                <Box className="flexRowInputsCommunitiesModal">
                  <Box className="infoHeaderCommunitiesModal" style={{ fontSize: "18px", color: "#181818" }}>
                    Admins (Email)
                  </Box>
                  <Tooltip
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    arrow
                    className="tooltipHeaderInfo"
                    title={``}
                  >
                    <img className="infoIconCreateCommunity" src={infoIcon} alt={"info"} />
                  </Tooltip>
                </Box>
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  width={1}
                  marginTop={1}
                  marginBottom={1}
                >
                  <Input
                    className="textFieldCreateCommunity"
                    disableUnderline
                    style={{
                      color: "black",
                      width: "100%",
                      height: 46,
                    }}
                    type="text"
                    value={admin}
                    onChange={e => setAdmin(e.target.value)}
                    placeholder="Add admin by email"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton aria-label="add" onClick={() => addAdmin()}>
                          <SvgIcon>
                            <PlusSolid />
                          </SvgIcon>
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </Box>
              </Box>
              {props.community.Admins && props.community.Admins.length !== 0 ? (
                <Box>
                  {props.community.Admins.map((item, i) => {
                    return <AdminsMailLabel key={i} index={i} admin={item} />;
                  })}
                </Box>
              ) : null}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box className="itemRow" width={1}>
                <Box className="flexRowInputsCommunitiesModal">
                  <Box className="infoHeaderCommunitiesModal" style={{ fontSize: "18px", color: "#181818" }}>
                    Invite Friends to Community
                  </Box>
                  <Tooltip
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    arrow
                    className="tooltipHeaderInfo"
                    title={`You can also invite friends to your community after its creation `}
                  >
                    <img className="infoIconCreateCommunity" src={infoIcon} alt={"info"} />
                  </Tooltip>
                </Box>
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  width={1}
                  marginTop={1}
                  marginBottom={1}
                >
                  <Input
                    className="textFieldCreateCommunity"
                    style={{
                      color: "black",
                      width: "100%",
                      height: 46,
                    }}
                    type="text"
                    disableUnderline
                    value={friendsSearcher}
                    onChange={e => setFriendsSearcher(e.target.value)}
                    placeholder="Add user by email"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton aria-label="add" onClick={() => addInvitation()}>
                          <SvgIcon>
                            <PlusSolid />
                          </SvgIcon>
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </Box>
              </Box>
              {props.community.InvitationUsers &&
                props.community.InvitationUsers.map((user, i) => {
                  return <FriendLabel key={i} index={i} user={user} />;
                })}
            </Grid>
          </Grid>
          <Box className="itemRow" width={1} marginTop={1}>
            <Box className="flexRowInputsCommunitiesModal">
              <Box className="infoHeaderCommunitiesModal" style={{ fontSize: "18px", color: "#181818" }}>
                User and roles
              </Box>
              <Tooltip
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
                arrow
                className="tooltipHeaderInfo"
                title={`Please invite those who you think would bring value to your community either as an admin or moderator`}
              >
                <img className="infoIconCreateCommunity" src={infoIcon} alt={"info"} />
              </Tooltip>
            </Box>
            <Box display="flex" flexDirection="row" width={1} marginTop={1} marginBottom={1}>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                  <Input
                    className="textFieldCreateCommunity"
                    style={{
                      color: "black",
                      width: "100%",
                      height: 46,
                      marginRight: "8px",
                    }}
                    type="text"
                    disableUnderline
                    value={user}
                    onChange={e => setUser(e.target.value)}
                    placeholder="Add user by email"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton aria-label="add" onClick={() => addUserRole()}>
                          <SvgIcon>
                            <PlusSolid />
                          </SvgIcon>
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box width={1} mt={1}>
                    <Box className="user-roles-selector">
                      <SelectorCreateModal
                        selectValue={userRole}
                        selectFunction={e => setUserRole(e.target.value)}
                        selectItems={userRoles}
                      />
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
          {props.community.UserRoles && Object.values(props.community.UserRoles).length > 0 ? (
            <Box>
              {userRoleList.map((item, i) => {
                return <RoleLabel key={i} index={i} user={item} />;
              })}
            </Box>
          ) : null}
        </Box>
        <Box
          className="flexCenterCenterRowInputsCommunitiesModal"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "30px",
            marginBottom: "30px",
            borderRadius: 10,
          }}
        >
          <button className="createCommunity">Create</button>
        </Box>
      </Box>
    </Box>
  );
});

export default GeneralTab;
