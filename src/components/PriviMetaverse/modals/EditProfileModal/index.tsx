import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { countries } from "countries-list";

import { useMediaQuery, useTheme } from "@material-ui/core";

import { RootState } from "store/reducers/Reducer";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { editUser } from "store/actions/User";
import { Modal, PrimaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import URL from "shared/functions/getURL";
import { DateInput } from "shared/ui-kit/DateTimeInput";
import { createNFTModalStyles } from "./index.styles";
import { AutocompleteSingleSelect } from "shared/ui-kit/Autocomplete/SingleSelect/AutocompleteSingleSelect";

const TABS = ["General", "Social"];

type Country = {
  id: string;
  name: string;
};

const EditProfileModal = (props: any) => {
  const classes = createNFTModalStyles();
  const { showAlertMessage } = useAlertMessage();
  const userSelector = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const [user, setUser] = useState<any>(userSelector ? userSelector : { country: "", dob: new Date() });
  const [editionProgress, setEditionProgress] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>({ id: "", name: "" });

  const [currentTab, setCurrentTab] = useState(TABS[0]);

  const ALL_COUNTRIES = React.useMemo(
    () => Object.entries(countries).map(([key, c]) => ({ id: key, name: c.name })),
    [countries]
  );

  useEffect(() => {
    if (userSelector && !editionProgress && !user.name) {
      const userCopy = { ...userSelector } as any;
      userCopy.name = userSelector.firstName + " " + userSelector.lastName;

      userCopy.userAddress = !userCopy.userAddress ? "" : userCopy.userAddress;
      userCopy.urlSlug = !userCopy.urlSlug ? "" : userCopy.urlSlug;

      setUser(userCopy);
    }
    //eslint-disable react-hooks/exhaustive-deps
  }, [userSelector, editionProgress]);

  const checkSlug = async () => {
    const acceptedChars = "^[a-zA-Z0-9\\._' ]{1,100}$";
    user.urlSlug.match(acceptedChars);

    //check special characters
    if (user.urlSlug.includes("/")) {
      showAlertMessage("You don't have to include '/' in your profile url", { variant: "error" });
      return false;
    } else {
      if (user.urlSlug.includes(".", user.urlSlug.length - 1)) {
        showAlertMessage("URL can't end with a .", { variant: "error" });
        return false;
      } else if (user.urlSlug.includes(".", 0)) {
        showAlertMessage("URL can't start with a .", { variant: "error" });
        return false;
      } else {
        //check if slug exists
        return await axios
          .get(`${URL()}/user/checkSlugExists/${user.urlSlug}/${user.id}/user`)
          .then(response => {
            if (response.data.success) {
              if (response.data.data.urlSlugExists) {
                showAlertMessage(
                  "This profile URL is already being used for another user. Please use another one.",
                  {
                    variant: "error",
                  }
                );
                return false;
              } else {
                return true;
              }
            } else {
              showAlertMessage("error when checking url, please try again", { variant: "error" });
              return false;
            }
          })
          .catch(error => {
            showAlertMessage("error when making the request, please try again", { variant: "error" });
            return false;
          });
      }
    }

    return true;
  };

  const editProfile = async () => {
    if (!editionProgress) {
      setEditionProgress(true);
      const flag = await checkSlug();
      if (flag) {
        let nameSplit = user.name.split(" ");
        let lastNameArray = nameSplit.filter((item, i) => {
          return i !== 0;
        });
        user.firstName = nameSplit[0];
        user.lastName = "";
        for (let i = 0; i < lastNameArray.length; i++) {
          if (lastNameArray.length === i + 1) {
            user.lastName = user.lastName + lastNameArray[i];
          } else {
            user.lastName = user.lastName + lastNameArray[i] + " ";
          }
        }

        axios
          .post(`${URL()}/user/editUser`, user)
          .then(async response => {
            if (response.data.success) {
              showAlertMessage("Profile updated successfully!", { variant: "success" });
              localStorage.setItem("urlSlug", user.urlSlug);
              dispatch(editUser(response.data.data));

              setTimeout(async () => {
                await props.onRefresh();
                props.onClose();
              }, 1000);
            } else {
              let message = "";
              for (const validation of response.data.validations) {
                if (!validation.success) {
                  message = `${message}${validation.message}\n`;
                }
              }
              showAlertMessage(message ?? "Error when checking updating profile, please try again", {
                variant: "error",
              });
              setEditionProgress(false);
            }
          })
          .catch(error => {
            showAlertMessage("Error when making the request", { variant: "error" });
            setEditionProgress(false);
          });
      } else {
        setEditionProgress(false);
      }
    }
  };

  const handleDateChange = (elem: any) => {
    setUser({
      ...user,
      dob: new Date(elem).getTime(),
    });
  };

  return (
    <Modal
      size="medium"
      isOpen={props.open}
      onClose={props.onClose}
      showCloseIcon
      className={classes.content}
      style={{
        padding: isMobile ? "47px 22px 63px" : "47px 58px 63px",
      }}
    >
      <div className={classes.modalContent}>
        <Box className={classes.title} textAlign="center">
          Edit Profile
        </Box>
        <Box display="flex" justifyContent="center" mt={2.5} mb={3.5}>
          <Box className={classes.tab}>
            {TABS.map((tab, index) => (
              <Box
                key={`tab-${index}`}
                className={`${classes.tabItem} ${currentTab === TABS[index] && classes.tabSelectedItem}`}
                onClick={() => setCurrentTab(tab)}
              >
                {tab}
              </Box>
            ))}
          </Box>
        </Box>
        {currentTab === TABS[0] && (
          <>
            <Box className={classes.itemTitle} mb={1}>
              Name
            </Box>
            <input
              className={`${classes.inputBox} ${classes.input}`}
              placeholder="Enter your name"
              value={user.name}
              onChange={e => {
                setUser({ ...user, name: e.target.value });
              }}
            />
            <Box className={classes.itemTitle} mb={1} mt={2.5}>
              Country
            </Box>
            <Box className={classes.countryContainer}>
              <AutocompleteSingleSelect
                allItems={ALL_COUNTRIES}
                selectedItem={ALL_COUNTRIES.find(item => item.name === user.country) || selectedCountry}
                onSelectedItemChange={country => {
                  setSelectedCountry(country);
                  setUser({
                    ...user,
                    country: country.name,
                  });
                }}
                placeholder="Select countries"
                getOptionLabel={country => country.name}
                renderOption={country => country.name}
              />
            </Box>
            <Box className={classes.itemTitle} mb={1} mt={2.5}>
              Date of Birth
            </Box>
            <Box className={`${classes.inputBox} ${classes.timeSelect}`}>
              <DateInput
                format={"dd.MM.yyyy"}
                placeholder="Select your date of birthday"
                value={user.dob}
                maxDate={new Date().getTime()}
                onChange={handleDateChange}
              />
            </Box>
            <Box className={classes.itemTitle} mb={1} mt={3.5}>
              Profile URL
            </Box>
            <input
              className={`${classes.inputBox} ${classes.input}`}
              placeholder={"Enter a custom profile URL"}
              value={user.urlSlug}
              onChange={e => {
                setUser({
                  ...user,
                  urlSlug: e.target.value,
                });
              }}
            />
            <Box className={classes.itemTitle} mb={1} mt={2.5}>
              Bio
            </Box>
            <input
              className={`${classes.inputBox} ${classes.input}`}
              placeholder="Enter your Bio"
              value={user.bio}
              onChange={e => {
                setUser({
                  ...user,
                  bio: e.target.value,
                });
              }}
            />
          </>
        )}
        {currentTab === TABS[1] && (
          <>
            <Box className={classes.itemTitle} mb={1}>
              Twitter
            </Box>
            <Box className={`${classes.inputBox} ${classes.socialInput}`}>
              <input
                placeholder="Type your nickname"
                value={user.twitter}
                onChange={e => {
                  setUser({
                    ...user,
                    twitter: e.target.value,
                  });
                }}
              />
              <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20 1.875C19.25 2.25 18.5 2.375 17.625 2.5C18.5 2 19.125 1.25 19.375 0.25C18.625 0.75 17.75 1 16.75 1.25C16 0.5 14.875 0 13.75 0C11.125 0 9.125 2.5 9.75 5C6.375 4.875 3.375 3.25 1.25 0.75C0.125 2.625 0.75 5 2.5 6.25C1.875 6.25 1.25 6 0.625 5.75C0.625 7.625 2 9.375 3.875 9.875C3.25 10 2.625 10.125 2 10C2.5 11.625 4 12.875 5.875 12.875C4.375 14 2.125 14.625 0 14.375C1.875 15.5 4 16.25 6.25 16.25C13.875 16.25 18.125 9.875 17.875 4C18.75 3.5 19.5 2.75 20 1.875Z"
                  fill="white"
                />
              </svg>
            </Box>
            <Box className={classes.itemTitle} mb={1} mt={2.5}>
              Facebook
            </Box>
            <Box className={`${classes.inputBox} ${classes.socialInput}`}>
              <input
                placeholder="Type your nickname"
                value={user.facebook}
                onChange={e => {
                  setUser({
                    ...user,
                    facebook: e.target.value,
                  });
                }}
              />
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20 10C20 4.5 15.5 0 10 0C4.5 0 0 4.5 0 10C0 15 3.625 19.125 8.375 19.875V12.875H5.875V10H8.375V7.75C8.375 5.25 9.875 3.875 12.125 3.875C13.25 3.875 14.375 4.125 14.375 4.125V6.625H13.125C11.875 6.625 11.5 7.375 11.5 8.125V10H14.25L13.75 12.875H11.375V20C16.375 19.25 20 15 20 10Z"
                  fill="white"
                />
              </svg>
            </Box>
            <Box className={classes.itemTitle} mb={1} mt={2.5}>
              Instagram
            </Box>
            <Box className={`${classes.inputBox} ${classes.socialInput}`}>
              <input
                placeholder="Type your nickname"
                value={user.instagram}
                onChange={e => {
                  setUser({
                    ...user,
                    instagram: e.target.value,
                  });
                }}
              />
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M10 1.80723C12.6506 1.80723 13.0121 1.80723 14.0964 1.80723C15.0602 1.80723 15.5422 2.04819 15.9036 2.16868C16.3855 2.40964 16.747 2.53012 17.1084 2.89157C17.4699 3.25301 17.7108 3.61446 17.8313 4.09639C17.9518 4.45783 18.0723 4.93976 18.1928 5.90362C18.1928 6.98795 18.1928 7.22892 18.1928 10C18.1928 12.7711 18.1928 13.0121 18.1928 14.0964C18.1928 15.0602 17.9518 15.5422 17.8313 15.9036C17.5904 16.3855 17.4699 16.747 17.1084 17.1084C16.747 17.4699 16.3855 17.7108 15.9036 17.8313C15.5422 17.9518 15.0602 18.0723 14.0964 18.1928C13.0121 18.1928 12.7711 18.1928 10 18.1928C7.22892 18.1928 6.98795 18.1928 5.90362 18.1928C4.93976 18.1928 4.45783 17.9518 4.09639 17.8313C3.61446 17.5904 3.25301 17.4699 2.89157 17.1084C2.53012 16.747 2.28916 16.3855 2.16868 15.9036C2.04819 15.5422 1.92771 15.0602 1.80723 14.0964C1.80723 13.0121 1.80723 12.7711 1.80723 10C1.80723 7.22892 1.80723 6.98795 1.80723 5.90362C1.80723 4.93976 2.04819 4.45783 2.16868 4.09639C2.40964 3.61446 2.53012 3.25301 2.89157 2.89157C3.25301 2.53012 3.61446 2.28916 4.09639 2.16868C4.45783 2.04819 4.93976 1.92771 5.90362 1.80723C6.98795 1.80723 7.3494 1.80723 10 1.80723ZM10 0C7.22892 0 6.98795 0 5.90362 0C4.81928 0 4.09639 0.240965 3.49398 0.481928C2.89157 0.722892 2.28916 1.08434 1.68675 1.68675C1.08434 2.28916 0.843374 2.77109 0.481928 3.49398C0.240965 4.09639 0.120482 4.81928 0 5.90362C0 6.98795 0 7.3494 0 10C0 12.7711 0 13.0121 0 14.0964C0 15.1807 0.240965 15.9036 0.481928 16.506C0.722892 17.1084 1.08434 17.7108 1.68675 18.3133C2.28916 18.9157 2.77109 19.1566 3.49398 19.5181C4.09639 19.759 4.81928 19.8795 5.90362 20C6.98795 20 7.3494 20 10 20C12.6506 20 13.0121 20 14.0964 20C15.1807 20 15.9036 19.759 16.506 19.5181C17.1084 19.2771 17.7108 18.9157 18.3133 18.3133C18.9157 17.7108 19.1566 17.2289 19.5181 16.506C19.759 15.9036 19.8795 15.1807 20 14.0964C20 13.0121 20 12.6506 20 10C20 7.3494 20 6.98795 20 5.90362C20 4.81928 19.759 4.09639 19.5181 3.49398C19.2771 2.89157 18.9157 2.28916 18.3133 1.68675C17.7108 1.08434 17.2289 0.843374 16.506 0.481928C15.9036 0.240965 15.1807 0.120482 14.0964 0C13.0121 0 12.7711 0 10 0Z"
                  fill="white"
                />
                <path
                  d="M10 4.81928C7.10843 4.81928 4.81928 7.10843 4.81928 10C4.81928 12.8916 7.10843 15.1807 10 15.1807C12.8916 15.1807 15.1807 12.8916 15.1807 10C15.1807 7.10843 12.8916 4.81928 10 4.81928ZM10 13.3735C8.19277 13.3735 6.62651 11.9277 6.62651 10C6.62651 8.19277 8.07229 6.62651 10 6.62651C11.8072 6.62651 13.3735 8.07229 13.3735 10C13.3735 11.8072 11.8072 13.3735 10 13.3735Z"
                  fill="white"
                />
                <path
                  d="M15.3012 5.90362C15.9666 5.90362 16.506 5.3642 16.506 4.6988C16.506 4.03339 15.9666 3.49398 15.3012 3.49398C14.6358 3.49398 14.0964 4.03339 14.0964 4.6988C14.0964 5.3642 14.6358 5.90362 15.3012 5.90362Z"
                  fill="white"
                />
              </svg>
            </Box>
          </>
        )}
        <Box className={classes.buttons} mt={7}>
          <PrimaryButton size="medium" onClick={editProfile} disabled={editionProgress}>
            Save changes
          </PrimaryButton>
        </Box>
      </div>
    </Modal>
  );
};

export default EditProfileModal;
