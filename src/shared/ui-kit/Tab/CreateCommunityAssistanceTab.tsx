import React, { useEffect, useState } from "react";
import axios from "axios";
import URL from "shared/functions/getURL";
import {
  Fade,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  TablePagination,
} from "@material-ui/core";
import {
  StyledMenuItem,
  StyledSlider,
  StyledBlueSelect,
} from "shared/ui-kit/Styled-components/StyledComponents";
import { withStyles, Theme, createStyles } from "@material-ui/core/styles";
import { RootState, useTypedSelector } from "store/reducers/Reducer";
import DateFnsUtils from "@date-io/date-fns";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { useDispatch, useSelector } from "react-redux";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as ArrowUpSolid } from "assets/icons/chevron-up-solid.svg";
import { ReactComponent as ArrowDownSolid } from "assets/icons/chevron-down-solid.svg";
import CustomSwitch from "shared/ui-kit/CustomSwitch";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { setSelectedUser } from "store/actions/SelectedUser";
import { useHistory } from "react-router-dom";
import { ReactComponent as CloseCircleSolid } from "assets/icons/times-circle-solid.svg";
const infoIcon = require("assets/icons/info_icon.png");
const searchIcon = require("assets/icons/search_right_blue.png");
const calendarIcon = require("assets/icons/calendar_icon.png");

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      fontFamily: "Agrandir",
      fontSize: "10px",
      color: "#656E7E",
      border: "none",
      fontWeight: "bold",
    },
    body: {
      fontSize: "14px",
      fontFamily: "Agrandir",
      border: "none",
      color: "#656E7E",
    },
  })
)(TableCell);

const Levels = [1, 2, 3, 4, 5, 6];

const AssistanceTab = React.memo((props: any) => {
  //REDUX
  const userSelector = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch();
  const history = useHistory();

  const loggedUser = useTypedSelector(state => state.user);

  const [canEdit, setCanEdit] = useState<boolean>(true);

  const [hideFilter, setHideFilter] = useState<boolean>(true);

  /* --------- request assistance params ----------- */
  const [searchValue, setSearchValue] = useState<string>("");
  const [levelSelection, setLevelSelection] = useState<number>(1);
  const [assistances, setAssistances] = useState<string>("");
  const [rate, setRate] = useState<number>(100);
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  const [offerToken, setOfferToken] = useState<string>("");
  const [offerAmount, setOfferAmount] = useState<number>(0);
  const [offerPaymentDate, setOfferPaymentDate] = useState<number>(
    new Date().setDate(new Date().getDate() + 1)
  );

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredUsers.length - page * rowsPerPage);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleRateChange = (event, newValue) => {
    setRate(newValue);
  };

  const handlePaymentDateChange = (elem: any) => {
    setOfferPaymentDate(new Date(elem).getTime());
  };

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
      .then(response => {
        if (response.data.success) {
          //should be remove user's id from the list ?? so they don't message themselves
          const allUsers = [...response.data.data].filter(user => user.id !== loggedUser.id) ?? [];
          allUsers.forEach(user => {
            let image = "";
            if (
              user.anon !== undefined &&
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

          // sort users alphabetically
          allUsers.sort(function (a, b) {
            return ("" + a.firstName).localeCompare(b.firstName);
          });

          setUsers(allUsers);
          setFilteredUsers(allUsers);
        }
      })
      .catch(error => {
        console.log(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          if (
            searchValue.length > 0 &&
            value.firstName &&
            value.firstName.length > 0 &&
            value.firstName.toUpperCase().includes(searchValue.toUpperCase())
          ) {
            newUsers.push(value);
          } else if (
            searchValue.length > 0 &&
            value.urlSlug &&
            value.urlSlug.length > 0 &&
            value.urlSlug.toUpperCase().includes(searchValue.toUpperCase())
          ) {
            newUsers.push(value);
          } else if (
            searchValue.length > 0 &&
            !newUsers.includes(value) &&
            value.email &&
            value.email.toUpperCase().includes(searchValue.toUpperCase())
          ) {
            newUsers.push(value);
          } else if (
            searchValue.length > 0 &&
            !newUsers.includes(value) &&
            value.address &&
            value.address.toUpperCase().includes(searchValue.toUpperCase())
          ) {
            newUsers.push(value);
          } else if (searchValue === "") {
            newUsers.push(value);
          }
        }
      });

      if (props.community && props.community.Offers && props.community.Offers.length > 0) {
        let usersFilter: any[] = newUsers.filter(user => {
          let userIsInOffers = props.community.Offers.find(offer => offer.userId === user.id);
          if (!userIsInOffers || !userIsInOffers.token || !userIsInOffers.amount) {
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
  }, [levelSelection, assistances, rate, searchValue]);

  useEffect(() => {
    if (props.tokenObjList && props.tokenObjList.length > 0) {
      setOfferToken(props.tokenObjList[0].token);
    }
  }, [props.tokenObjList]);

  // -------- Assistance add functions ------
  const addOffer = offerObj => {
    const communityCopy = { ...props.community };
    communityCopy.Offers = communityCopy.Offers ?? [];

    let findIndex = communityCopy.Offers.findIndex(offer => offer.userId === offerObj.userId);

    if (findIndex === -1) {
      communityCopy.Offers.push(offerObj);
      props.setCommunity(communityCopy);
    } else {
      if (
        communityCopy.Offers &&
        communityCopy.Offers[findIndex] &&
        (!communityCopy.Offers[findIndex].amount || !communityCopy.Offers[findIndex].token)
      ) {
        communityCopy.Offers[findIndex].amount = offerObj.amount;
        communityCopy.Offers[findIndex].token = offerObj.token;
        communityCopy.Offers[findIndex].status = "negotiating";
        props.setCommunity(communityCopy);
      }
    }
  };

  const removeOffer = (offerObj: any) => {
    const communityCopy = { ...props.community };
    communityCopy.Offers = communityCopy.Offers ?? [];

    let findIndex = communityCopy.Offers.findIndex(offer => offer.userId === offerObj.userId);

    if (findIndex !== -1) {
      communityCopy.Offers.splice(findIndex, 1);
      communityCopy.directlyUpdate = true;
      props.setCommunity(communityCopy);
    }
  };

  const assistanceTableHeaders: Array<CustomTableHeaderInfo> = [
    {
      headerName: "",
      headerWidth: "30px",
    },
    {
      headerName: "NAME",
    },
    {
      headerName: "ASSISTANCES",
    },
    {
      headerName: "RATE",
    },
    {
      headerName: "LEVEL",
    },
    {
      headerName: "",
      headerWidth: "150px",
    },
  ];
  const [assistanceTableData, setAssistanceTableData] = useState<Array<Array<CustomTableCellInfo>>>([]);

  const validateInfo = () => {
    if (!offerToken || offerToken === "") {
      return false;
    } else if (!offerAmount || offerAmount <= 0) {
      return false;
    } else if (
      !(
        new Date(offerPaymentDate).getTime() ||
        new Date(offerPaymentDate).getTime() === 0 ||
        new Date(offerPaymentDate).getTime() <= new Date().getTime()
      )
    ) {
      return false;
    }
    return true;
  };

  const handleRequest = () => {
    if (validateInfo()) {
      addOffer(props.offerObj);
    }
  };

  useEffect(() => {
    const tableData: Array<Array<CustomTableCellInfo>> = filteredUsers
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map(row => {
        const offerIndex =
          props && props.community && props.community.Offers
            ? props.community.Offers.findIndex(off => off.userId === row.userId)
            : -1;

        return [
          {
            cell: (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div
                  className="user-image"
                  style={{
                    backgroundImage: `url(${row.imageUrl})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    cursor: "pointer",
                    marginBottom: "10px",
                  }}
                  onClick={() => {
                    history.push(`/profile/${row.id}`);
                    dispatch(setSelectedUser(row.id));
                  }}
                />
                <span
                  style={{
                    cursor: "pointer",
                    color: "black",
                    marginTop: "5px",
                    marginLeft: "8px",
                    width: "100px",
                  }}
                  onClick={() => {
                    history.push(`/profile/${row.id}`);
                    dispatch(setSelectedUser(row.id));
                  }}
                >
                  {row.firstName}
                </span>
              </div>
            ),
            cellAlign: "center",
          },
          {
            cell: row.assistances ?? 0,
            cellAlign: "center",
          },
          {
            cell: `${props.row.rate ?? 0}%`,
            cellAlign: "center",
          },
          {
            cell: props.row.level ?? 1,
            cellAlign: "center",
          },
          {
            cell:
              offerIndex == -1 ? (
                <button
                  onClick={handleRequest}
                  style={{
                    margin: 0,
                    background: "linear-gradient(97.4deg, #29E8DC 14.43%, #03EAA5 79.45%)",
                  }}
                  disabled={props.disabled}
                >
                  Request support
                </button>
              ) : (
                <button disabled>Saved Offer</button>
              ),
            cellAlign: "right",
          },
        ];
      });

    setAssistanceTableData(tableData);
  }, [filteredUsers, page, rowsPerPage]);

  const offerTableHeaders: Array<CustomTableHeaderInfo> = [
    {
      headerName: "",
      headerWidth: "30px",
    },
    {
      headerName: "NAME",
    },
    {
      headerName: "STATUS",
    },
    {
      headerName: "TOKEN",
    },
    {
      headerName: "OFFER AMOUNT",
    },
    {
      headerName: "PAYMENT DATE",
    },
    {
      headerName: "REMOVE OFFER",
      headerAlign: "center",
    },
  ];
  const [offerTableData, setOfferTableData] = useState<Array<Array<CustomTableCellInfo>>>([]);

  useEffect(() => {
    const tableData: Array<Array<CustomTableCellInfo>> = props.community.Offers.map(row => {
      const user = users[users.findIndex(u => u.id === row.userId)];
      return [
        {
          cell: (
            <div
              className="user-image"
              style={{
                backgroundImage: user ? `url(${user.imageUrl})` : "none",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
                cursor: "pointer",
              }}
            />
          ),
        },
        {
          cell: (
            <span
              style={{
                cursor: "pointer",
              }}
            >
              {user ? user.firstName : ""}
            </span>
          ),
        },
        {
          cell: row.status,
        },
        {
          cell: row.token,
        },
        {
          cell: row.amount,
        },
        {
          cell:
            new Date(row.paymentDate).getDate() < 10
              ? `0${new Date(row.paymentDate).getDate()}`
              : new Date(row.paymentDate).getDate() / new Date(row.paymentDate).getMonth() + 1 < 10
              ? `0${new Date(row.paymentDate).getMonth() + 1}`
              : new Date(row.paymentDate).getMonth() + 1 / new Date(row.paymentDate).getFullYear(),
          cellAlign: "right",
        },
        {
          cell:
            row.status !== "accepted" ? (
              <div style={{ cursor: "pointer" }} onClick={() => removeOffer(row)}>
                <SvgIcon>
                  <CloseCircleSolid />
                </SvgIcon>
              </div>
            ) : null,
        },
      ];
    });

    setOfferTableData(tableData);
  }, [props.community.Offers]);

  return (
    <div
      className="request-assistance-on"
      style={{
        backgroundColor: !canEdit ? "hsla(210, 27%, 91%, 0.2)" : "transparent",
        padding: !canEdit ? "0px 30px" : 0,
        marginLeft: !canEdit ? "-30px" : 0,
        width: "100%",
        flexGrow: 1,
      }}
    >
      {/* ---------- REQUEST ASSISTANCE SECTION ---------- */}
      <div className="title">
        <h4>
          Request Assistance
          <Tooltip
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            arrow
            className="tooltipHeaderInfo"
            title={``}
          >
            <img className="infoIconCreateCommunity" src={infoIcon} alt={"info"} />
          </Tooltip>
        </h4>
        <div className="option-buttons community-token">
          <CustomSwitch
            checked={props.community.AssistanceRequired}
            onChange={() => {
              let communityCopy = { ...props.community };
              communityCopy.AssistanceRequired = !communityCopy.AssistanceRequired;
              communityCopy.CommunityToken = !props.community.AssistanceRequired;
              communityCopy.RuleBased = !props.community.AssistanceRequired;
              props.setCommunity(communityCopy);
              setHideFilter(!props.community.AssistanceRequired);
            }}
          />
        </div>
      </div>

      {props.community.AssistanceRequired ? (
        !hideFilter ? (
          <div className="filters">
            <h5
              className="cursor-pointer"
              onClick={() => {
                setHideFilter(!hideFilter);
              }}
            >
              <SvgIcon>
                <ArrowUpSolid />
              </SvgIcon>
            </h5>
            <h5>
              <span>Filter options</span>
              <span>Assistance Offer</span>
            </h5>
            <Grid container spacing={5} direction="row" alignItems="center" justify="flex-start">
              <Grid item xs={12} md={6} justify="space-between">
                <label>
                  <img src={searchIcon} alt={"search"} />
                  <InputWithLabelAndTooltip
                    type="text"
                    inputValue={searchValue}
                    placeHolder="Id, email..."
                    onInputValueChange={e => setSearchValue(e.target.value)}
                  />
                </label>
                <div className="flexRowInputs">
                  <div className="dropdown">
                    <p>
                      Level{" "}
                      <Tooltip
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                        arrow
                        className="tooltipHeaderInfo"
                        title={``}
                      >
                        <img className="infoIconCreateCommunity" src={infoIcon} alt={"info"} />
                      </Tooltip>
                    </p>
                    <StyledBlueSelect
                      disableUnderline
                      labelId="simple-select-label"
                      id="simple-select"
                      className="blue-underline"
                      value={levelSelection}
                      onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
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
                    </StyledBlueSelect>
                  </div>
                  <label>
                    <InputWithLabelAndTooltip
                      labelName="Assistances"
                      tooltip={""}
                      type="number"
                      inputValue={assistances}
                      minValue={"0"}
                      onInputValueChange={e => setAssistances(e.target.value)}
                    />
                  </label>
                </div>
                <div className="slider">
                  <div className="labels">
                    <p>
                      Rate
                      <Tooltip
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                        arrow
                        className="tooltipHeaderInfo"
                        title={``}
                      >
                        <img className="infoIconCreateCommunity" src={infoIcon} alt={"info"} />
                      </Tooltip>
                    </p>
                    <p>{rate}%</p>
                  </div>
                  <StyledSlider
                    defaultValue={rate}
                    valueLabelDisplay="auto"
                    step={1}
                    max={100}
                    aria-labelledby="continuous-slider"
                    onChangeCommitted={handleRateChange}
                  />
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <div className="flexRowInputs">
                  <div className="infoHeaderCreateCommunity">Token</div>
                  <img className="infoIconCreateCommunity" src={infoIcon} alt={"info"} />
                </div>
                <TokenSelect
                  tokens={props.tokenObjList}
                  value={offerToken}
                  onChange={e => {
                    setOfferToken(e.target.value);
                  }}
                />
                <InputWithLabelAndTooltip
                  labelName="Total Amount"
                  tooltip={""}
                  type="number"
                  inputValue={assistances}
                  minValue={"0.01"}
                  placeHolder={"0"}
                  disabled={!canEdit}
                  onInputValueChange={e => setOfferAmount(Number(e.target.value))}
                />
                <div className="flexRowInputs">
                  <div className="infoHeaderCreateCommunity">End Contract Date</div>
                  <Tooltip
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    arrow
                    className="tooltipHeaderInfo"
                    title={""}
                  >
                    <img className="infoIconCreateCommunity" src={infoIcon} alt={"info"} />
                  </Tooltip>
                </div>
                <div
                  className="textFieldCreateCommunity"
                  style={{
                    paddingTop: "1px",
                    paddingBottom: "1px",
                  }}
                >
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      id="date-picker-expiration-date"
                      minDate={new Date().setDate(new Date().getDate() + 1)}
                      format="MM.dd.yyyy"
                      placeholder="Select date..."
                      value={offerPaymentDate}
                      onChange={handlePaymentDateChange}
                      disabled={!canEdit}
                      keyboardIcon={
                        <img className="iconCalendarCreatePod" src={calendarIcon} alt={"calendar"} />
                      }
                    />
                  </MuiPickersUtilsProvider>
                </div>
              </Grid>
            </Grid>
          </div>
        ) : (
          <div
            className="filters cursor-pointer"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setHideFilter(!hideFilter);
            }}
          >
            <h5 style={{ margin: 0 }}>
              <SvgIcon>
                <ArrowDownSolid />
              </SvgIcon>
            </h5>
          </div>
        )
      ) : null}

      {props.community.AssistanceRequired && filteredUsers ? (
        <div className="users">
          <CustomTable headers={assistanceTableHeaders} rows={assistanceTableData} />

          {/* <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          /> */}
        </div>
      ) : null}
      {props.community.AssistanceRequired && props.community.Offers && props.community.Offers.length > 0 ? (
        <h4>
          Assistance Requested
          <Tooltip
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            arrow
            className="tooltipHeaderInfo"
            title={``}
          >
            <img className="infoIconCreateCommunity" src={infoIcon} alt={"info"} />
          </Tooltip>
        </h4>
      ) : null}
      {props.community.AssistanceRequired && props.community.Offers && props.community.Offers.length > 0 ? (
        <div className="users">
          <CustomTable headers={offerTableHeaders} rows={offerTableData} />
          <div className="buttonCreatePodRow">
            <button onClick={props.saveCommunity} className="buttonCreatePod">
              Save Community as Work in progress
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
});

export default AssistanceTab;
