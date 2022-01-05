import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import { Dialog } from "@material-ui/core";

import { RootState, useTypedSelector } from "store/reducers/Reducer";
import GeneralTab from "shared/ui-kit/Tab/CreateCommunityGeneralTab";
import AssistanceTab from "shared/ui-kit/Tab/CreateCommunityAssistanceTab";
import TokenomicsTab from "shared/ui-kit/Tab/CreateCommunityTokenomicsTab";
import OffersTab from "shared/ui-kit/Tab/OffersTab";
import URL from "shared/functions/getURL";
import { signTransaction } from "shared/functions/signTransaction";
import { updateTask } from "shared/functions/updateTask";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

export default function EditCommunityWIPModal(props) {
  const userSelector = useSelector((state: RootState) => state.user);

  //REDUX
  const loggedUser = useTypedSelector(state => state.user);

  //HOOKS
  const [generalAssistanceOrTokenomics, setGeneralAssistanceOrTokenomics] = useState<number>(0);
  const [community, setCommunity] = useState<any>({});
  const [status, setStatus] = useState<any>("");

  //general info
  const [photo, setPhoto] = useState<any>(null);
  const [tokenphoto, setTokenPhoto] = useState<any>(null);
  const [tokenObjList, setTokenObjList] = useState<any[]>([]);

  const [offerAccepted, setOfferAccepted] = useState<boolean>(false);

  useEffect(() => {
    if (props.community) {
      let communityCopy = { ...props.community };
      setCommunity(communityCopy);

      if (communityCopy.Offers && communityCopy.Offers.length > 0) {
        let offerIndex = communityCopy.Offers.findIndex(off => off.userId === userSelector.id);
        if (communityCopy.Offers[offerIndex] && communityCopy.Offers[offerIndex].status === "accepted") {
          setOfferAccepted(true);
        }
      }
    }
  }, [props.community]);

  // get token list from backend
  useEffect(() => {
    if (props.open === true) {
      axios.get(`${URL()}/wallet/getCryptosRateAsList`).then(res => {
        const resp = res.data;
        if (resp.success) {
          const tokenObjList: any[] = [];
          const data = resp.data;
          data.forEach(rateObj => {
            tokenObjList.push({ token: rateObj.token, name: rateObj.name });
          });
          setTokenObjList(tokenObjList);
        }
      });
    }
  }, [props.open]);

  //create community function
  const createCommunity = async () => {
    let validation = await validateCommunityinfo();

    if (validation === true) {
      // constructing body
      let body = { ...community }; // copy from community
      body.MainHashtag = community.Hashtags.length > 0 ? community.Hashtags[0] : "";
      body.Creator = loggedUser.id;
      body.Frequency = "DAILY"; // TODO: let user pick from Daily, Weekly, Monthly
      body.AMM = body.AMM.toUpperCase();
      body.InitialSupply = Number(body.InitialSupply);
      body.TargetSupply = Number(body.TargetSupply);
      body.TargetPrice = Number(body.TargetPrice);
      body.SpreadDividend = Number(body.SpreadDividend) / 100;
      body.LockUpDate = 0;
      body.workInProgressId = community.id;

      // transaction obj to sign
      const txnObj = {
        Creator: body.Creator,
        AMM: body.AMM,
        TargetSupply: body.TargetSupply,
        TargetPrice: body.TargetPrice,
        SpreadDividend: body.SpreadDividend,
        FundingToken: body.FundingToken,
        TokenSymbol: body.TokenSymbol,
        TokenName: body.TokenName,
        Frequency: body.Frequency,
        InitialSupply: body.InitialSupply,
        LockUpDate: body.LockUpDate,
      };

      const [hash, signature] = await signTransaction(loggedUser.mnemonic, txnObj);
      body.Hash = hash;
      body.Signature = signature;

      body.HasPhoto = !!photo;

      if (body.Levels.length === 1 && body.Levels.Name === "" && body.Levels.Description === "") {
        body.Levels = [];
      }

      axios
        .post(`${URL()}/community/createCommunity`, body)
        .then(async response => {
          const resp = response.data;
          if (resp.success) {
            const answerBody = {
              userAddress: loggedUser.id,
              communityAddress: resp.data.communityAddress,
            };

            if (body.HasPhoto) {
              await uploadImage(answerBody.communityAddress, community.TokenSymbol);
            }

            // follow the community
            axios.post(`${URL()}/community/follow`, answerBody).then(res => {
              // const resp = res.data;
              // if (resp.success) {
              //   setStatus({
              //     msg: 'follow success',
              //     key: Math.random(),
              //     variant: 'success',
              //   });
              // } else {
              //   setStatus({
              //     msg: 'follow failed',
              //     key: Math.random(),
              //     variant: 'error',
              //   });
              // }
            });

            // join the community
            axios.post(`${URL()}/community/join`, answerBody).then(res => {
              // const resp = res.data;
              // if (resp.success) {
              //   setStatus({
              //     msg: 'Joined community successfully',
              //     key: Math.random(),
              //     variant: 'success',
              //   });
              // } else {
              //   setStatus({
              //     msg: 'Joined community failed',
              //     key: Math.random(),
              //     variant: 'error',
              //   });
              // }
            });

            await updateTask(loggedUser.id, "Create a Community");

            setStatus({
              msg: "Community Created!",
              key: Math.random(),
              variant: "success",
            });

            setTimeout(() => {
              if (props.handleRefresh) {
                props.handleRefresh();
                props.refreshAllProfile();
              }
              props.handleClose();
            }, 1000);
          } else {
            setStatus({
              msg: "Error when making the request",
              key: Math.random(),
              variant: "error",
            });
          }
        })
        .catch(error => {
          setStatus({
            msg: "Error when making the request",
            key: Math.random(),
            variant: "error",
          });
        });
    }
  };

  //save community function
  const saveCommunity = async () => {
    let validation = await validateCommunityinfo();

    if (validation === true) {
      console.log("savecommunity");
      // constructing body
      let body = { ...community }; // copy from community
      body.MainHashtag = community.Hashtags.length > 0 ? community.Hashtags[0] : "";
      body.Creator = loggedUser.id;

      body.HasPhoto = !!photo;

      if (body.Levels.length === 1 && body.Levels.Name === "" && body.Levels.Description === "") {
        body.Levels = [];
      }

      axios
        .post(`${URL()}/community/saveCommunity`, body)
        .then(async response => {
          const resp = response.data;
          if (resp.success) {
            if (body.HasPhoto) {
              await uploadImage(resp.data.communityAddress, community.TokenSymbol);
            }
            community.directlyUpdate = false;
            setCommunity(community);
            setTimeout(() => {
              if (props.handleRefresh) {
                props.handleRefresh();
              }
              props.handleClose();
            }, 1000);
          } else {
            setStatus({
              msg: "Error when making the request",
              key: Math.random(),
              variant: "error",
            });
          }
          setStatus({
            msg: "Community saved!",
            key: Math.random(),
            variant: "success",
          });
        })
        .catch(error => {
          setStatus({
            msg: "Error when making the request",
            key: Math.random(),
            variant: "error",
          });
        });
    }
  };

  const validateCommunityinfo = async () => {
    //remove blank levels and required tokens
    let communityCopy = { ...community };
    communityCopy.Levels.forEach((level, index) => {
      if (level.Name === "" && level.Description === "") {
        communityCopy.Levels.splice(index, 1);
      }
    });
    communityCopy.RequiredTokens.forEach((token, index) => {
      if (token.tokenValue === "") {
        communityCopy.RequiredTokens.splice(index, 1);
      }
    });
    //remove community apps if no options selected
    if (community.BlogsEnabled) {
      let enabled = false;
      community.Blogs.forEach(elem => {
        if (elem === false) {
          enabled = true;
          return;
        }
      });
      if (!enabled) {
        communityCopy.BlogsEnabled = false;
      }
    }
    if (community.MemberDirectoriesEnabled) {
      let enabled = false;
      community.MemberDirectories.forEach(elem => {
        if (elem === false) {
          enabled = true;
          return;
        }
      });
      if (!enabled) {
        communityCopy.MemberDirectoriesEnabled = false;
      }
    }
    if (community.ProjectsEnabled) {
      let enabled = false;
      community.Projects.forEach(elem => {
        if (elem === false) {
          enabled = true;
          return;
        }
      });
      if (!enabled) {
        communityCopy.ProjectsEnabled = false;
      }
    }
    if (community.AppsEnabled) {
      let enabled = false;
      community.Apps.forEach(elem => {
        if (elem === false) {
          enabled = true;
          return;
        }
      });
      if (!enabled) {
        communityCopy.AppsEnabled = false;
      }
    }

    setCommunity(communityCopy);

    if (!(community.Name.length >= 5)) {
      setStatus({
        msg: "Name field invalid. Minimum 5 characters required.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!(community.Description.length >= 20)) {
      setStatus({
        msg: "Description field invalid. Minimum 20 characters required",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } /*else if (
      community.CommunityToken &&
      (!community.TokenName ||
        community.TokenName === "" ||
        community.TokenName.length < 5)
    ) {
      setErrorMsg("Token Name field invalid. Minimum 5 characters required.");
      handleClickError();
      return false;
    } else if (
      community.CommunityToken &&
      (!community.TokenSymbol ||
        community.TokenSymbol === "" ||
        community.TokenSymbol.length < 3 ||
        community.TokenSymbol > 6)
    ) {
      setErrorMsg(
        "Token ID field invalid. Between 3 and 6 characters required."
      );
      handleClickError();
      return false;
    } else if (
      community.CommunityToken &&
      (!community.TokenDescription || community.TokenDescription === "")
    ) {
      setErrorMsg("Token description field invalid");
      handleClickError();
      return false;
    } else if (
      community.CommunityToken &&
      (!community.FundingToken || community.FundingToken === "")
    ) {
      setErrorMsg("Funding Token field invalid");
      handleClickError();
      return false;
    } else if (
      community.CommunityToken &&
      (!community.TargetSpread || community.TargetSpread === "")
    ) {
      setErrorMsg("Token Target Spread field invalid");
      handleClickError();
      return false;
    } else if (
      community.CommunityToken &&
      (!community.SpreadDividend ||
        community.SpreadDividend === "" ||
        community.SpreadDividend < 0.1 ||
        community.SpreadDividend > 20)
    ) {
      setErrorMsg(
        "Trading Spread field invalid. Value must be between 0.1% and 20%."
      );
      handleClickError();
      return false;
    } else if (
      community.CommunityToken &&
      (!community.TargetPrice ||
        community.TargetPrice === "" ||
        community.TargetPrice === 0)
    ) {
      setErrorMsg("Target Price field invalid. Value must be greater than 0.");
      handleClickError();
      return false;
    } else if (
      community.CommunityToken &&
      (!community.TargetSupply || community.TargetSupply === "")
    ) {
      setErrorMsg("Target Supply field invalid");
      handleClickError();
      return false;
    } else if (
      community.CommunityToken &&
      (!community.InitialSupply ||
        community.InitialSupply === "" ||
        !(community.InitialSupply < community.TargetSupply))
    ) {
      setErrorMsg(
        "Initial Supply field invalid. Value must be between 0 and Target Supply."
      );
      handleClickError();
      return false;
    } else if (
      community.CommunityToken &&
      (!community.AMM || community.AMM === "")
    ) {
      setErrorMsg("AMM field invalid");
      handleClickError();
      return false;
    } else if (
      community.RuleBased &&
      (!community.RequiredTokens || community.RequiredTokens.length <= 0)
    ) {
      setErrorMsg("Required Tokens quantity invalid");
      handleClickError();
      return false;
    } else if (
      community.RuleBased &&
      (!community.RequiredTokens || community.RequiredTokens.length <= 0)
    ) {
      setErrorMsg("Required Tokens quantity invalid");
      handleClickError();
      return false;
    }*/ else
      return true;
  };

  //photo functions
  const uploadImage = async (id, tokenSymbol) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("image", photo, id);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      axios
        .post(`${URL()}/community/changeCommunityPhoto`, formData, config)
        .then(response => {
          let body = { dimensions: community.dimensions, id: community.CommunityAddress };
          axios.post(`${URL()}/community/updateCommunityPhotoDimensions`, body).catch(error => {
            console.log(error);

            alert("Error uploading photo");
          });
          resolve(true);
        })
        .catch(error => {
          console.log(error);

          resolve(true);
          // alert("Error uploading photo");
        });
      if (tokenSymbol && tokenSymbol !== "") {
        //change token photo (if creating token aswell)
        const formTokenData = new FormData();
        if (tokenphoto) {
          formTokenData.append("image", tokenphoto, tokenSymbol);
        } else {
          formTokenData.append("image", photo, tokenSymbol);
        }
        axios
          .post(`${URL()}/wallet/changeTokenPhoto`, formTokenData, config)
          .then(response => {
            let body = { dimensions: community.tokenDimensions ?? community.dimensions, id: tokenSymbol };
            axios.post(`${URL()}/wallet/updateTokenPhotoDimensions`, body).catch(error => {
              console.log(error);

              alert("Error uploading photo");
            });
            resolve(true);
          })
          .catch(error => {
            console.log(error);
            resolve(true);
            // alert("Error uploading token photo");
          });
      }
    });
  };

  //MODAL
  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      className="modalCreateModal"
      fullWidth
      maxWidth={"md"}
    >
      <div className="modal-content create-community-modal modalCreatePadding">
        <div className="exit" onClick={props.handleClose}>
          <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
        </div>

        <div className="cards-options">
          <button
            className={generalAssistanceOrTokenomics === 0 ? "selected" : "unselected"}
            onClick={() => setGeneralAssistanceOrTokenomics(0)}
          >
            General
          </button>
          {props.isCreator ? (
            <button
              className={generalAssistanceOrTokenomics === 1 ? "selected" : "unselected"}
              onClick={() => setGeneralAssistanceOrTokenomics(1)}
            >
              Assistance
            </button>
          ) : null}
          <button
            className={generalAssistanceOrTokenomics === 2 ? "selected" : "unselected"}
            onClick={() => setGeneralAssistanceOrTokenomics(2)}
          >
            Chat
          </button>
          <button
            className={generalAssistanceOrTokenomics === 3 ? "selected" : "unselected"}
            onClick={() => setGeneralAssistanceOrTokenomics(3)}
          >
            Tokenomics
          </button>
        </div>

        <h2>Create New Community</h2>

        {community ? (
          generalAssistanceOrTokenomics === 0 ? (
            <GeneralTab
              community={community}
              setCommunity={comm => setCommunity(comm)}
              setPhoto={setPhoto}
              canEdit={props.isCreator}
            />
          ) : generalAssistanceOrTokenomics === 1 && props.isCreator ? (
            <>
              <AssistanceTab
                community={community}
                setCommunity={comm => setCommunity(comm)}
                tokenObjList={tokenObjList}
                canEdit={props.isCreator}
                refreshCommunity={props.refreshCommunity}
                saveCommunity={() => {
                  saveCommunity();
                }}
              />
            </>
          ) : generalAssistanceOrTokenomics === 2 ? (
            <>
              <OffersTab
                item={community}
                typeItem="Community"
                setItem={comm => setCommunity(comm)}
                tokenObjList={tokenObjList}
                canEdit={props.isCreator}
                saveItem={saveCommunity}
                refreshItem={props.refreshCommunity}
                refreshAllProfile={() => props.refreshAllProfile()}
              />
            </>
          ) : generalAssistanceOrTokenomics === 3 && (props.isCreator || offerAccepted) ? (
            <TokenomicsTab
              community={community}
              setCommunity={setCommunity}
              createCommunity={createCommunity}
              setTokenPhoto={setTokenPhoto}
              tokenObjList={tokenObjList}
              isCreator={props.isCreator}
              creation={false}
              saveCommunity={saveCommunity}
            />
          ) : null
        ) : null}

        {status && (
          <AlertMessage
            key={status.key}
            message={status.msg}
            variant={status.variant}
            onClose={() => setStatus(undefined)}
          />
        )}
      </div>
    </Dialog>
  );
}
