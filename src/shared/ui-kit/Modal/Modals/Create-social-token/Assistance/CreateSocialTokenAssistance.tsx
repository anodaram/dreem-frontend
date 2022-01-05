import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import axios from "axios";

import {
  Fade,
  InputBase,
  TableCell,
  Tooltip,
} from "@material-ui/core";
import { createStyles, Theme, withStyles, makeStyles } from "@material-ui/core/styles";
import { Autocomplete } from "@material-ui/lab";

import { useTypedSelector } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import {
  StyledMenuItem,
  StyledSelect,
} from "shared/ui-kit/Styled-components/StyledComponents";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import { DateInput } from "shared/ui-kit/DateTimeInput";
import { PrimaryButton } from "shared/ui-kit";
import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as ArrowDownSolid } from "assets/icons/chevron-down-solid.svg";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import Box from 'shared/ui-kit/Box';

const infoIcon = require("assets/icons/info.svg");

const useStyles = makeStyles(theme => ({
  flexRowInput: {
    display: 'flex'
  },
  infoImg: {
    marginTop: -theme.spacing(1)
  },
  inputBox: {
    width: "100%",
    marginTop: "10px",
    background: "rgb(247, 248, 250)",
    border: "1px solid rgb(153, 161, 179)",
    borderRadius: "10px",
    height: "52px",
    padding: "0px 19px",
    display: "flex",
    alignItems: "center",
  }
}));

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      fontFamily: "Agrandir",
      fontSize: "14px",
      color: "black",
      border: "none",
      fontWeight: "normal",
      textTransform: "none",
    },
    body: {
      fontSize: "14px",
      fontFamily: "Agrandir",
      border: "none",
      color: "black",
      textTransform: "none",
    },
  })
)(TableCell);

const Levels = [1, 2, 3, 4, 5, 6];

const arePropsEqual = (prevProps, currProps) => {
  return JSON.stringify(prevProps.token) == JSON.stringify(currProps.token);
};

const CreateSocialTokenAssistance = React.memo((props: any) => {
  //REDUX

  const loggedUser = useTypedSelector((state) => state.user);

  const [canEdit, setCanEdit] = useState<boolean>(true);

  const [hideFilter, setHideFilter] = useState<boolean>(false);

  /* --------- request assistance params ----------- */
  const [searchValue, setSearchValue] = useState<string>("");
  const [levelSelection, setLevelSelection] = useState<number>(1);
  const [assistances, setAssistances] = useState<number>(0);
  const [rate, setRate] = useState<number>(100);
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);

  const [offerToken, setOfferToken] = useState<string>("BAL");
  const [offerAmount, setOfferAmount] = useState<number>(0);
  const [offerPaymentDate, setOfferPaymentDate] = useState<number>(
    new Date().setDate(new Date().getDate() + 1)
  );

  const [autocompleteKey, setAutocompleteKey] = useState<number>(
    new Date().getTime()
  );
  //key changes everytime an item is added to the list so it's cleared

  const classes = useStyles();

  const handlePaymentDateChange = (elem: any) => {
    setOfferPaymentDate(new Date(elem).getTime());
  };

  useEffect(() => {
    if (!props.creation) {
      setHideFilter(false);
    }
  }, [props.creation]);

  useEffect(() => {
    if (props.canEdit !== undefined) {
      setCanEdit(props.canEdit);
    }
  }, [props.canEdit]);

  // assistance functions
  // get users list from backend
  useEffect(() => {
    axios
      .post(`${URL()}/chat/getUsers`)
      .then((response) => {
        if (response.data.success) {
          //should be remove user's id from the list ?? so they don't message themselves
          const allUsers =
            [...response.data.data].filter(
              (user) => user.id !== loggedUser.id
            ) ?? [];
          allUsers.forEach((user) => {
            let image = "";
            if (
              user.anon != undefined &&
              user.anon === true &&
              user.anonAvatar &&
              user.anonAvatar.length > 0
            ) {
              image = `${require(`assets/anonAvatars/${user.anonAvatar}`)}`;
            } else {
              if (user.hasPhoto && user.url) {
                image = `${user.url}?${Date.now()}`;
              }
            }
            user.imageUrl = image;
            user.assistances = user.assistances ?? 0;
            user.rate = user.rate ?? 0;
          });
          setUsers(allUsers);
          setFilteredUsers(allUsers);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [loggedUser.id]);

  const userFilterFunctions = () => {
    //filter by user input
    const newUsers = [] as any[];

    if (users.length > 0) {
      users.forEach((value: any, index: number) => {
        if (
          value.level >= levelSelection &&
          value.assistances >= assistances &&
          Number(value.rate * 100) <= Number(rate)
        ) {
          newUsers.push(value);
        }
      });

      if (props.token && props.token.Offers && props.token.Offers.length > 0) {
        let usersFilter: any[] = newUsers.filter((user) => {
          let userIsInOffers = props.token.Offers.find(
            (offer) => offer.userId === user.id
          );
          if (
            !userIsInOffers ||
            !userIsInOffers.token ||
            !userIsInOffers.amount
          ) {
            return user;
          }
        });

        setFilteredUsers(usersFilter);
      } else {
        setFilteredUsers(newUsers);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  };

  useEffect(() => {
    userFilterFunctions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelSelection, assistances, rate]);

  useEffect(() => {
    if (props.tokenObjList && props.tokenObjList.length > 0) {
      setOfferToken(props.tokenObjList[0].token);
    }
  }, [props.tokenObjList]);

  // -------- Assistance add functions ------
  const addOffer = (offerObj) => {
    const tokenCopy = { ...props.token };
    tokenCopy.Offers = tokenCopy.Offers ?? [];

    let findIndex = tokenCopy.Offers.findIndex(
      (offer) => offer.userId === offerObj.userId
    );

    if (findIndex === -1) {
      tokenCopy.Offers.push(offerObj);
      //console.log("token", tokenCopy);
      props.setToken(tokenCopy);
    } else {
      if (
        tokenCopy.Offers &&
        tokenCopy.Offers[findIndex] &&
        (!tokenCopy.Offers[findIndex].amount ||
          !tokenCopy.Offers[findIndex].token)
      ) {
        tokenCopy.Offers[findIndex].amount = offerObj.amount;
        tokenCopy.Offers[findIndex].token = offerObj.token;
        tokenCopy.Offers[findIndex].status = "negotiating";
        //console.log("token", tokenCopy);
        props.setToken(tokenCopy);
      }
    }
  };

  const removeOffer = (offerObj: any) => {
    const tokenCopy = { ...props.token };
    tokenCopy.Offers = tokenCopy.Offers ?? [];

    let findIndex = tokenCopy.Offers.findIndex(
      (offer) => offer.userId === offerObj.userId
    );

    if (findIndex !== -1) {
      tokenCopy.Offers.splice(findIndex, 1);
      tokenCopy.directlyUpdate = true;
      props.setToken(tokenCopy);
    }
  };

  return (
    <div
      style={{
        padding: !canEdit ? "0px 30px" : 0,
        marginLeft: !canEdit ? "-30px" : 0,
        width: "100%",
        flexGrow: 1,
      }}
    >
      {/* ---------- REQUEST ASSISTANCE SECTION ---------- */}

      {(props.token && props.token.AssistanceRequired) || !props.creation ? (
        !hideFilter ? (
          <div style={{ boxShadow: "none" }}>
            <Grid
              container
              spacing={0}
              direction="row"
              alignItems="flex-start"
              justify="flex-start"
            >
              <Grid item xs={12} md={12} justify="space-between">
                <Grid container spacing={1}>
                  <Grid item xs={6} className="flexRowStartCenterAssistance">
                    <div className={classes.flexRowInput}>
                      <div className="infoHeaderCreatePod">Assistances</div>
                      <Tooltip
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                        arrow
                        title={``}
                      >
                        <img
                          className={classes.infoImg}
                          src={infoIcon}
                          alt={"info"}
                        />
                      </Tooltip>
                    </div>
                    <InputWithLabelAndTooltip
                      overriedClasses={classes.inputBox}
                      placeHolder="0"
                      type={"number"}
                      minValue={0}
                      inputValue={assistances}
                      onInputValueChange={(e) => {
                        setAssistances(Number(e.target.value));
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} className="flexRowStartCenterAssistance">
                    <div className="dropdown">
                      <div className={classes.flexRowInput}>
                        <div className="infoHeaderCreatePod">Level</div>
                        <Tooltip
                          TransitionComponent={Fade}
                          TransitionProps={{ timeout: 600 }}
                          arrow
                          title={``}
                        >
                          <img
                            className={classes.infoImg}
                            src={infoIcon}
                            alt={"info"}
                          />
                        </Tooltip>
                      </div>
                      <StyledSelect
                        disableUnderline
                        value={levelSelection}
                        className={classes.inputBox}
                        onChange={(
                          event: React.ChangeEvent<{ value: unknown }>
                        ) => {
                          setLevelSelection(event.target.value as number);
                        }}
                      >
                        {Levels.map((option: number, i: number) => {
                          return (
                            <StyledMenuItem value={option} key={i}>
                              {option}
                            </StyledMenuItem>
                          );
                        })}
                      </StyledSelect>
                    </div>
                  </Grid>
                </Grid>

                <Grid
                  container
                  spacing={1}
                  direction="row"
                  alignItems="flex-start"
                  justify="flex-start"
                  style={{ marginTop: 30 }}
                >
                  <Grid item xs={12} md={4}>
                    <div
                      className={classes.flexRowInput}
                      style={{ marginTop: "20px" }}
                    >
                      <div className="infoHeaderCreatePod">Token</div>
                    </div>
                    <TokenSelect
                      tokens={props.tokenObjList}
                      value={offerToken}
                      onChange={(e) => {
                        setOfferToken(e.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <div
                      className={classes.flexRowInput}
                      style={{ marginTop: "20px", width: "fit-content" }}
                    >
                      <div >Total Amount</div>
                    </div>
                    <InputWithLabelAndTooltip
                      overriedClasses={classes.inputBox}
                      style={{ marginTop: 0 }}
                      type="number"
                      minValue="0.01"
                      inputValue={offerAmount}
                      onInputValueChange={(elem) => {
                        setOfferAmount(Number(elem.target.value));
                      }}
                      placeHolder={"0"}
                      disabled={!canEdit}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <div
                      className={classes.flexRowInput}
                      style={{ marginTop: "20px", width: "fit-content" }}
                    >
                      <div
                        className="infoHeaderCreatePod"
                        style={{ whiteSpace: "pre-wrap" }}
                      >
                        End Contract Date
                      </div>
                    </div>
                    <div
                      style={{
                        paddingTop: "1px",
                        paddingBottom: "1px",
                      }}
                    >
                      <DateInput
                        id="date-picker-expiration-date"
                        minDate={new Date().setDate(new Date().getDate() + 1)}
                        format="MM.dd.yyyy"
                        placeholder="Select date..."
                        value={offerPaymentDate}
                        onChange={handlePaymentDateChange}
                        disabled={!canEdit}
                      />
                    </div>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={12}>
                <div
                  style={{
                    background: "#f7f8fa",
                    border: "1px solid #99a1b3",
                    borderRadius: 10,
                    height: 56,
                    width: "100%",
                    padding: "0px 19px 0px 19px",
                    display: "flex",
                    alignItems: "center",
                    marginTop: '10px'
                  }}
                >
                  <Autocomplete
                    id="autocomplete-0"
                    className="autocomplete"
                    style={{ width: "calc(100% - 17px)" }}
                    freeSolo
                    clearOnBlur
                    value={searchValue}
                    key={autocompleteKey}
                    onChange={(event: any, newValue: any | null) => {
                      if (newValue && canEdit) {
                        setSearchValue(newValue);
                        addOffer({
                          token: offerToken,
                          amount: offerAmount,
                          paymentDate: offerPaymentDate,
                          userId: newValue.id,
                          status: "pending",
                        });
                        // reset search query
                        setAutocompleteKey(new Date().getTime());
                      }
                    }}
                    options={["", ...filteredUsers]}
                    renderOption={(option, { selected }) => {
                      if (option)
                        return (
                          <React.Fragment>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                borderBottom: "1px solid #EFF2F8",
                                width: "100%",
                                paddingBottom: "10px",
                                justifyContent: "space-between",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {option !== "" ? (
                                  <div
                                    style={{
                                      backgroundImage:
                                        typeof option !== "string" &&
                                          option.imageUrl
                                          ? `url(${option.imageUrl})`
                                          : "none",
                                      backgroundRepeat: "no-repeat",
                                      backgroundSize: "cover",
                                      backgroundPosition: "center",
                                      cursor: "pointer",
                                      border: "1.5px solid #FFFFFF",
                                      marginRight: 14,
                                      width: 30,
                                      minWidth: 30,
                                      height: 30,
                                      backgroundColor: "#F7F9FE",
                                      borderRadius: "50%",
                                    }}
                                  />
                                ) : null}
                                <div
                                  style={{
                                    color: "black",
                                    fontSize: 14,
                                    fontFamily: "Agrandir",
                                  }}
                                >
                                  {typeof option !== "string" ? (
                                    <span>
                                      {option.urlSlug
                                        ? `@${option.urlSlug}`
                                        : option.firstName}
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>
                              <div
                                style={{
                                  color: "#29E8DC",
                                  fontSize: 14,
                                  display: "flex",
                                  alignItems: "center",
                                  fontFamily: "Agrandir",
                                }}
                              >
                                Request support
                                <img
                                  src={require("assets/icons/add.png")}
                                  alt={""}
                                  style={{ marginLeft: 10 }}
                                />
                              </div>
                            </div>
                          </React.Fragment>
                        );
                      else return null;
                    }}
                    getOptionLabel={(option) =>
                      option &&
                        option !== undefined &&
                        option !== "" &&
                        typeof option !== "string"
                        ? option.urlSlug
                          ? `@${option.urlSlug}`
                          : option.firstName
                            ? option.firstName
                            : ""
                        : ""
                    }
                    getOptionSelected={(option) =>
                      option &&
                      typeof option !== "string" &&
                      option !== "" &&
                      props.token.Offers &&
                      props.token.Offers.length > 0 &&
                      option.id === props.token.Offers[0].userId
                    }
                    renderInput={(params) => (
                      <InputBase
                        ref={params.InputProps.ref}
                        inputProps={params.inputProps}
                        autoFocus
                        placeholder={"Search specific users"}
                        style={{ fontFamily: "Agrandir", width: "100%" }}
                      />
                    )}
                  />
                  <img
                    src={require("assets/icons/search.png")}
                    alt={""}
                    style={{ width: 17, height: 17 }}
                  />
                </div>
              </Grid>
            </Grid>
          </div>
        ) : (
          <div
            className="filters"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setHideFilter(!hideFilter);
            }}
          >
            <h5 style={{ margin: 0 }}>
              <SvgIcon><ArrowDownSolid /></SvgIcon>
            </h5>
          </div>
        )
      ) : null}

      {/* {((props.token && props.token.AssistanceRequired) || !props.creation) &&
        props.token.Offers &&
        props.token.Offers.length > 0 ? ( */}
      <div className="users">
        {/* <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell style={{ width: 120 }}>People</StyledTableCell>
                <StyledTableCell align="center">Assistances</StyledTableCell>
                <StyledTableCell align="center">Rate</StyledTableCell>
                <StyledTableCell align="center">Level</StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
                {props.token.Offers.some((o) => o.status !== "accepted") ? (
                  <StyledTableCell style={{ width: 30 }}></StyledTableCell>
                ) : null}
              </TableRow>
            </TableHead>
            <TableBody>
              {props.token.Offers.map((row, i) => {
                return (
                  <OfferTableRow
                    row={row}
                    i={i}
                    key={row.userId}
                    user={users[users.findIndex((u) => u.id === row.userId)]}
                    removeOffer={() => removeOffer(row)}
                  />
                );
              })}
            </TableBody>
          </Table> */}
        <Box display="flex" justifyContent="flex-end" my={3}>
          <PrimaryButton size="medium" onClick={props.saveToken}>
            Save Token as Work in progress
            </PrimaryButton>
        </Box>
      </div>
      {/* ) : null} */}
    </div >
  );
}, arePropsEqual);

export default CreateSocialTokenAssistance;
