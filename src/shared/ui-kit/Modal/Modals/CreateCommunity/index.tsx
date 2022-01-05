import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

import { FormControl } from "@material-ui/core";

import { useCreateCommunityStyles } from "./index.styles";
import CreateCommunityGeneralTab from "./components/GeneralTab";
import CreateCommunityBlockchainTab from "./components/BlockchainTab";
import CreateCommunityFoundersTab from "./components/FoundersTab";
import CreateCommunityConditionsTab from "./components/ConditionsTab";
import { Modal, PrimaryButton, Gradient, SecondaryButton } from "shared/ui-kit";
import URL from "shared/functions/getURL";
import { updateTask } from "shared/functions/updateTask";
import { useTypedSelector } from "store/reducers/Reducer";
import { StyledSelect, StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";
import { buildJsxFromObject, parseDateFromStr } from "shared/functions/commonFunctions";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { ICreateCommunity, createCommunity } from "shared/services/API";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

const COMMUNITY_TOPIC = {
  world: "World issues",
  venture_capital: "Venture Capital",
  ai: "Artificial Inteligence",
  startups: "Startups",
  technology: "Technology",
};

const entryCondintionMapping = {
  "Open to everyone": "OpenToJoin",
  "By request": "Approval",
  Staking: "Staking",
};

export default function CreateCommunityModal(props) {
  //REDUX
  const user = useTypedSelector(state => state.user);
  //HOOKS
  const classes = useCreateCommunityStyles();
  const [community, setCommunity] = useState<any>({
    About: COMMUNITY_TOPIC.world,
    FoundersType: "Many founders",
    Name: "",
    Description: "",
    Hashtags: [],
    Network: "Ethereum",
    OpenAdvertising: false,
    Founders: [
      { Address: user.address, Ownership: "" },
      { Address: "", Ownership: "" },
    ],
    FoundersVotingTime: "",
    FoundersConsensus: "",
    TreasuryVotingTime: "",
    TreasuryConsensus: "",
    EntryConditions: "Open to everyone",
    StakingAmount: "",
    StakingToken: "ETH",
  });

  const [page, setPage] = useState(0);

  const [successMsg, setSuccessMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);

  //general info
  const [tokenList, setTokenList] = useState<any[]>([]);

  const payloadRef = useRef<any>({});
  const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);

  // get token list from backend
  useEffect(() => {
    if (props.open === true) {
      axios.get(`${URL()}/wallet/getCryptosRateAsList`).then(res => {
        const resp = res.data;
        if (resp.success) {
          const tokenList: any[] = [];
          const data = resp.data;
          data.forEach(rateObj => {
            tokenList.push(rateObj.token);
          });
          setTokenList(tokenList);
        }
      });
    }
  }, [props.open]);

  const handleOpenSignatureModal = async () => {
    let foundersVotingTime = parseDateFromStr(community.FoundersVotingTime);
    let treasuryVotingTime = parseDateFromStr(community.TreasuryVotingTime);
    if ((await validateCommunityinfo()) === true && foundersVotingTime && treasuryVotingTime) {
      const founders: { [key: string]: number } = {};
      community.Founders.forEach(founder => {
        if (founder && founder.Address && founder.Ownership)
          founders[founder.Address] = Number(founder.Ownership) / 100;
      });
      const payload: ICreateCommunity = {
        Founders: founders,
        EntryType: entryCondintionMapping[community.EntryConditions],
        FoundersConsensus: (Number(community.FoundersConsensus) / 100).toString(),
        FoundersVotingTime: Math.floor(foundersVotingTime / 1000),
        TreasuryConsensus: (Number(community.TreasuryConsensus) / 100).toString(),
        TreasuryVotingTime: Math.floor(treasuryVotingTime / 1000),
      };
      if (payload.EntryType == "Staking") {
        const entryConditions: { [key: string]: number } = {};
        entryConditions[community.StakingToken] = Number(community.StakingAmount);
        payload.EntryConditions = entryConditions;
      }
      payloadRef.current = payload;
      setSignRequestModalDetail(buildJsxFromObject(payload));
      setOpenSignRequestModal(true);
    }
  };

  const handleCreateCommunity = async () => {
    try {
      const payload = payloadRef.current;
      if (Object.keys(payload).length) {
        const additionalData = {
          About: community.About,
          FoundersType: community.FoundersType,
          Name: community.Name,
          Description: community.Description,
          Hashtags: community.Hashtags,
          Network: community.Network,
          OpenAdvertising: community.OpenAdvertising,
          EntryConditions: community.EntryConditions,
          StakingAmount: community.StakingAmount,
          StakingToken: community.StakingToken,
          MainHashtag: community.Hashtags.length > 0 ? community.Hashtags[0] : "",
          Creator: user.id,
        };
        const createCommunityRes = await createCommunity(payload, additionalData);
        if (createCommunityRes.success) {
          const answerBody = {
            userAddress: user.id,
            communityAddress: createCommunityRes.data,
          };
          // community created
          if (Object.keys(payload.Founders ?? {}).length > 1) {
            // follow the community
            await axios.post(`${URL()}/community/follow`, answerBody);
            // join the community
            await axios.post(`${URL()}/community/join`, answerBody);
            // update task
            await updateTask(user.id, "Create a Community");
          }
          setSuccessMsg("Community created!");
          handleClickSuccess();
          setTimeout(() => {
            props.handleRefresh();
            props.handleClose();
          }, 1000);
        } else {
          setErrorMsg("Create community error");
          handleClickError();
        }
      }
    } catch (e) {
      setErrorMsg("Unexpected error: " + e);
      handleClickError();
    }
  };

  const checkIfExist = (): Promise<any> => {
    return new Promise<any>((resolve, reject) => {
      try {
        axios
          .post(`${URL()}/community/checkCommunityInfo`, {
            communityName: community.Name,
          })
          .then(response => {
            const resp = response.data.data.communityExists;
            resolve(resp);
          })
          .catch(error => {
            console.log(error);
            setErrorMsg("Error when making the request");
            handleClickError();
          });
      } catch (e) {
        reject(e);
      }
    });
  };

  const validateFirstPage = async () => {
    const check: any = await checkIfExist();
    if (!(community.Name.length >= 5)) {
      setErrorMsg("Name field invalid. Minimum 5 characters required.");
      handleClickError();
      return false;
    } else if (check === true) {
      setErrorMsg("Name field invalid. A community with this name already exist.");
      handleClickError();
      return false;
    } else if (!(community.Description.length >= 20)) {
      setErrorMsg("Description field invalid. Minimum 20 characters required");
      handleClickError();
      return false;
    } else return true;
  };

  const validateThirdPage = () => {
    let total = 0;
    for (let i = 0; i < community.Founders.length; i++) {
      const founder = community.Founders[i];
      total = Number(founder.Ownership) + total;
      if (founder.Ownership && (!founder.Address || founder.Address.length <= 10)) {
        setErrorMsg("Address field invalid. Please fill in the field");
        handleClickError();
        return false;
      }
    }

    if (total !== 100) {
      setErrorMsg("Total of Ownership percentages should be 100%");
      handleClickError();
      return false;
    } else return true;
  };

  const validateFourthPage = () => {
    if (!parseDateFromStr(community.FoundersVotingTime)) {
      setErrorMsg("Founders Voting time field invalid");
      handleClickError();
      return false;
    } else if (
      !community.FoundersConsensus ||
      community.FoundersConsensus === "" ||
      community.FoundersConsensus < 10 ||
      community.FoundersConsensus > 100
    ) {
      setErrorMsg("Founders Consensus field invalid. Should be between 10 and 100%");
      handleClickError();
      return false;
    } else if (!parseDateFromStr(community.TreasuryVotingTime)) {
      setErrorMsg("Treasury Voting time field invalid");
      handleClickError();
      return false;
    } else if (
      !community.TreasuryConsensus ||
      community.TreasuryConsensus === "" ||
      community.TreasuryConsensus < 10 ||
      community.TreasuryConsensus > 100
    ) {
      setErrorMsg("Treasury Consensus field invalid. Should be between 10 and 100%");
      handleClickError();
      return false;
    } else if (
      community.EntryConditions === "Staking" &&
      (!community.StakingAmount || community.StakingAmount === "")
    ) {
      setErrorMsg("Staking amount field invalid");
      handleClickError();
      return false;
    } else if (
      community.EntryConditions === "Staking" &&
      (!community.StakingToken || community.StakingToken === "")
    ) {
      setErrorMsg("Staking token field invalid. Please select a token");
      handleClickError();
      return false;
    } else return true;
  };

  const validateCommunityinfo = async () => {
    if ((await validateFirstPage()) && validateThirdPage() && validateFourthPage()) {
      return true;
    } else {
      setErrorMsg("Error when validating. Please check all the fields");
      handleClickError();
      return false;
    }
  };

  // save community function
  const saveCommunity = async () => {
    const validation = await validateCommunityinfo();

    if (validation === true) {
      // constructing body
      const body = { ...community }; // copy from community
      body.MainHashtag = community.Hashtags.length > 0 ? community.Hashtags[0] : "";
      body.Creator = user.id;

      if (body.Levels.length === 1 && body.Levels.Name === "" && body.Levels.Description === "") {
        body.Levels = [];
      }

      axios
        .post(`${URL()}/community/saveCommunity`, body)
        .then(async response => {
          const resp = response.data;
          if (resp.success) {
            setTimeout(() => {
              props.handleRefresh();
              props.handleClose();
            }, 1000);
          } else {
            setErrorMsg("Error when making the request");
            handleClickError();
          }
          setSuccessMsg("Community saved!");
          handleClickSuccess();
        })
        .catch(error => {
          console.log(error);
          setErrorMsg("Error when making the request");
          handleClickError();
        });
    }
  };

  const handleClickSuccess = () => {
    setOpenSuccess(true);
    setTimeout(() => {
      setOpenSuccess(false);
    }, 3000);
  };
  const handleClickError = () => {
    setOpenError(true);
    setTimeout(() => {
      setOpenError(false);
    }, 3000);
  };
  const handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSuccess(false);
  };
  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenError(false);
  };

  const handleNextStep = async () => {
    if ((page === 1 && (await validateFirstPage())) || page === 2 || (page === 3 && validateThirdPage())) {
      setPage(page + 1);
    }
  };

  return (
    <Modal
      className={classes.root}
      size="medium"
      isOpen={props.open}
      onClose={props.handleClose}
      showCloseIcon
    >
      <div>
        <SignatureRequestModal
          open={openSignRequestModal}
          address={user.address}
          transactionFee="0.0000"
          detail={signRequestModalDetail}
          handleOk={handleCreateCommunity}
          handleClose={() => setOpenSignRequestModal(false)}
        />

        {page === 0 ? (
          <div className={classes.firstPage}>
            <img src={require("assets/emojiIcons/sparkle.png")} alt="sparkle" />
            <h3>New Community</h3>
            <div className={classes.label}>What is your Community going to be about</div>
            <FormControl variant="outlined">
              <StyledSelect
                className={classes.select}
                value={community.About}
                onChange={v => {
                  const communityCopy = { ...community };
                  communityCopy.About = v.target.value;
                  setCommunity(communityCopy);
                }}
                renderValue={() => (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={require(`assets/emojiIcons/${Object.keys(COMMUNITY_TOPIC).find(
                        key => COMMUNITY_TOPIC[key] === community?.About
                      )}.png`)}
                      style={{ marginRight: 10 }}
                    />
                    {community?.About}
                  </div>
                )}
              >
                {Object.values(COMMUNITY_TOPIC).map((item, index) => (
                  <StyledMenuItem key={index} value={item}>
                    {item}
                  </StyledMenuItem>
                ))}
              </StyledSelect>
            </FormControl>
            <div className={classes.label}>Is it going to have one or more founders?</div>
            <FormControl variant="outlined">
              <StyledSelect
                className={classes.select}
                value={community.FoundersType}
                onChange={v => {
                  const communityCopy = { ...community };
                  communityCopy.FoundersType = v.target.value;
                  setCommunity(communityCopy);
                }}
              >
                {["Many founders"].map((item, index) => (
                  <StyledMenuItem key={index} value={item}>
                    {item}
                  </StyledMenuItem>
                ))}
              </StyledSelect>
            </FormControl>
            <span>
              Generate a multi founder and signature community to make sure you can take decisions together!{" "}
            </span>

            <PrimaryButton onClick={() => setPage(1)} size="medium">
              Continue
            </PrimaryButton>
          </div>
        ) : (
          <div className={classes.content}>
            <h5>{`Create new ${
              community.FoundersType === "Many founders" ? `co-founded ` : ""
            }community`}</h5>
            <div className={classes.stepsBorder} />
            <div className={classes.steps}>
              {["General", "Blockchain", "Founders", "Treasury"].map((tab, index) => (
                <div className={index + 1 <= page ? classes.selected : undefined} key={`tab-${index}`}>
                  <button onClick={handleNextStep}>{index + 1}</button>
                  {tab}
                </div>
              ))}
            </div>

            {page === 1 ? (
              <CreateCommunityGeneralTab community={community} setCommunity={setCommunity} />
            ) : page === 2 ? (
              <CreateCommunityBlockchainTab community={community} setCommunity={setCommunity} />
            ) : page === 3 ? (
              <CreateCommunityFoundersTab community={community} setCommunity={setCommunity} />
            ) : (
              <CreateCommunityConditionsTab
                community={community}
                setCommunity={setCommunity}
                tokenList={tokenList}
              />
            )}

            {page !== 4 ? (
              <div className={classes.buttons}>
                <SecondaryButton onClick={saveCommunity} size="medium">
                  Save Progress
                </SecondaryButton>
                <PrimaryButton onClick={handleNextStep} size="medium">
                  Next <img src={require("assets/icons/arrow_right_white.png")} alt="next" />
                </PrimaryButton>
              </div>
            ) : (
              <PrimaryButton onClick={handleOpenSignatureModal} size="medium" style={{ width: "auto" }}>
                Submit Community Proposal
              </PrimaryButton>
            )}
          </div>
        )}

        {openSuccess && (
            <AlertMessage
              key={Math.random()}
              message={successMsg}
              variant="success"
              onClose={handleCloseSuccess}
            />
          )}
          {openError && (
            <AlertMessage
              key={Math.random()}
              message={errorMsg}
              variant="error"
              onClose={handleCloseError}
            />
          )}
      </div>
    </Modal>
  );
}
