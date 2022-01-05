import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

import Box from "shared/ui-kit/Box";
import { useCreateDAOStyles } from "./index.styles";
import CreateDAOGeneralTab from "./components/GeneralTab";
import CreateDAOBlockchainTab from "./components/BlockchainTab";
import CreateDAOFoundersTab from "./components/FoundersTab";
import CreateDAOConditionsTab from "./components/ConditionsTab";
import { Modal } from "shared/ui-kit";
import URL from "shared/functions/getURL";
import { updateTask } from "shared/functions/updateTask";
import { useTypedSelector } from "store/reducers/Reducer";
import { buildJsxFromObject, parseDateFromStr } from "shared/functions/commonFunctions";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { ICreateCommunity, createCommunity } from "shared/services/API";
import { StyledSelectComponent } from "shared/ui-kit/Select/TokenSelect";
import { DAOButton } from "shared/ui-kit/Buttons/DAOButton";
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

export default function CreateDAOModal(props) {
  //REDUX
  const user = useTypedSelector(state => state.user);
  //HOOKS
  const classes = useCreateDAOStyles();
  const [dao, setDAO] = useState<any>({
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
    let foundersVotingTime = parseDateFromStr(dao.FoundersVotingTime);
    let treasuryVotingTime = parseDateFromStr(dao.TreasuryVotingTime);
    if ((await validateCommunityinfo()) === true && foundersVotingTime && treasuryVotingTime) {
      const founders: { [key: string]: number } = {};
      dao.Founders.forEach(founder => {
        if (founder && founder.Address && founder.Ownership)
          founders[founder.Address] = Number(founder.Ownership) / 100;
      });
      const payload: ICreateCommunity = {
        Founders: founders,
        EntryType: entryCondintionMapping[dao.EntryConditions],
        FoundersConsensus: (Number(dao.FoundersConsensus) / 100).toString(),
        FoundersVotingTime: Math.floor(foundersVotingTime / 1000),
        TreasuryConsensus: (Number(dao.TreasuryConsensus) / 100).toString(),
        TreasuryVotingTime: Math.floor(treasuryVotingTime / 1000),
      };
      if (payload.EntryType == "Staking") {
        const entryConditions: { [key: string]: number } = {};
        entryConditions[dao.StakingToken] = Number(dao.StakingAmount);
        payload.EntryConditions = entryConditions;
      }
      payloadRef.current = payload;
      setSignRequestModalDetail(buildJsxFromObject(payload));
      setOpenSignRequestModal(true);
    }
  };

  const handleCreateDAO = async () => {
    try {
      const payload = payloadRef.current;

      if (Object.keys(payload).length) {
        const additionalData = {
          About: dao.About,
          FoundersType: dao.FoundersType,
          Name: dao.Name,
          Description: dao.Description,
          Hashtags: dao.Hashtags,
          Network: dao.Network,
          OpenAdvertising: dao.OpenAdvertising,
          EntryConditions: dao.EntryConditions,
          StakingAmount: dao.StakingAmount,
          StakingToken: dao.StakingToken,
          MainHashtag: dao.Hashtags.length > 0 ? dao.Hashtags[0] : "",
          Creator: user.id,
        };
        const createDAORes = await createCommunity(payload, additionalData);

        if (createDAORes.success) {
          const answerBody = {
            userAddress: user.id,
            daoAddress: createDAORes.data,
          };
          // dao created
          if (Object.keys(payload.Founders ?? {}).length > 1) {
            // follow the dao
            await axios.post(`${URL()}/community/follow`, answerBody);
            // join the dao
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
          setErrorMsg("Create dao error");
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
            communityName: dao.Name,
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
    if (!(dao.Name.length >= 5)) {
      setErrorMsg("Name field invalid. Minimum 5 characters required.");
      handleClickError();
      return false;
    } else if (check === true) {
      setErrorMsg("Name field invalid. A DAO with this name already exist.");
      handleClickError();
      return false;
    } else if (!(dao.Description.length >= 20)) {
      setErrorMsg("Description field invalid. Minimum 20 characters required");
      handleClickError();
      return false;
    } else return true;
  };

  const validateThirdPage = () => {
    let total = 0;
    for (let i = 0; i < dao.Founders.length; i++) {
      const founder = dao.Founders[i];
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
    if (!parseDateFromStr(dao.FoundersVotingTime)) {
      setErrorMsg("Founders Voting time field invalid");
      handleClickError();
      return false;
    } else if (
      !dao.FoundersConsensus ||
      dao.FoundersConsensus === "" ||
      dao.FoundersConsensus < 10 ||
      dao.FoundersConsensus > 100
    ) {
      setErrorMsg("Founders Consensus field invalid. Should be between 10 and 100%");
      handleClickError();
      return false;
    } else if (!parseDateFromStr(dao.TreasuryVotingTime)) {
      setErrorMsg("Treasury Voting time field invalid");
      handleClickError();
      return false;
    } else if (
      !dao.TreasuryConsensus ||
      dao.TreasuryConsensus === "" ||
      dao.TreasuryConsensus < 10 ||
      dao.TreasuryConsensus > 100
    ) {
      setErrorMsg("Treasury Consensus field invalid. Should be between 10 and 100%");
      handleClickError();
      return false;
    } else if (dao.EntryConditions === "Staking" && (!dao.StakingAmount || dao.StakingAmount === "")) {
      setErrorMsg("Staking amount field invalid");
      handleClickError();
      return false;
    } else if (dao.EntryConditions === "Staking" && (!dao.StakingToken || dao.StakingToken === "")) {
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
      const body = { ...dao }; // copy from dao
      body.MainHashtag = dao.Hashtags.length > 0 ? dao.Hashtags[0] : "";
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
      isOpen={props.open}
      onClose={props.handleClose}
      showCloseIcon
      size="medium"
      theme="dark"
    >
      <Box color="white" fontSize="18px">
        <SignatureRequestModal
          theme="dark"
          open={openSignRequestModal}
          address={user.address}
          transactionFee="0.0000"
          detail={signRequestModalDetail}
          handleOk={handleCreateDAO}
          handleClose={() => setOpenSignRequestModal(false)}
        />

        {page === 0 ? (
          <div className={classes.firstPage}>
            <img src={require("assets/emojiIcons/sparkle.png")} alt="sparkle" />
            <Box mb={2}>New DAO</Box>
            <div className={classes.label}>What is your DAO going to be about</div>
            <Box mb={2} width="100%">
              <StyledSelectComponent
                value={dao.About}
                theme="dark"
                onChange={v => {
                  const daoCopy = { ...dao };
                  daoCopy.About = v.target.value;
                  setDAO(daoCopy);
                }}
                renderValue={() => (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={require(`assets/emojiIcons/${Object.keys(COMMUNITY_TOPIC).find(
                        key => COMMUNITY_TOPIC[key] === dao?.About
                      )}.png`)}
                      style={{ marginRight: 10 }}
                    />
                    {dao?.About}
                  </div>
                )}
                options={Object.values(COMMUNITY_TOPIC)}
              />
            </Box>
            <div className={classes.label}>Is it going to have one or more founders?</div>
            <StyledSelectComponent
              theme="dark"
              value={dao.FoundersType}
              onChange={v => {
                const daoCopy = { ...dao };
                daoCopy.FoundersType = v.target.value;
                setDAO(daoCopy);
              }}
              options={["Many founders"]}
            />
            <span>
              Generate a multi founder and signature DAO to make sure you can take decisions together!{" "}
            </span>

            <DAOButton onClick={() => setPage(1)}>Continue</DAOButton>
          </div>
        ) : (
          <div className={classes.content}>
            <Box fontSize="30px" mb={"24px"}>{`Create new ${
              dao.FoundersType === "Many founders" ? `co-founded ` : ""
            }DAO`}</Box>
            <div className={classes.stepsBorder} />
            <div className={classes.steps}>
              {["General", "Blockchain", "Founders", "Treasury"].map((tab, index) => (
                <div className={index + 1 <= page ? classes.selected : undefined} key={`tab-${index}`}>
                  <button
                    onClick={() => {
                      setPage(index + 1);
                    }}
                  >
                    {index + 1}
                  </button>
                  {tab}
                </div>
              ))}
            </div>

            {page === 1 ? (
              <CreateDAOGeneralTab dao={dao} setDAO={setDAO} />
            ) : page === 2 ? (
              <CreateDAOBlockchainTab dao={dao} setDAO={setDAO} />
            ) : page === 3 ? (
              <CreateDAOFoundersTab dao={dao} setDAO={setDAO} />
            ) : (
              <CreateDAOConditionsTab dao={dao} setDAO={setDAO} tokenList={tokenList} />
            )}

            {page !== 4 ? (
              <Box display="flex" width="100%" mt={6} justifyContent="space-between">
                <DAOButton onClick={saveCommunity}>Save Progress</DAOButton>
                <DAOButton onClick={handleNextStep}>Next</DAOButton>
              </Box>
            ) : (
              <Box display="flex" width="100%" mt={6} justifyContent="flex-end">
                <DAOButton onClick={handleOpenSignatureModal}>Submit DAO Proposal</DAOButton>
              </Box>
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
          <AlertMessage key={Math.random()} message={errorMsg} variant="error" onClose={handleCloseError} />
        )}
      </Box>
    </Modal>
  );
}
