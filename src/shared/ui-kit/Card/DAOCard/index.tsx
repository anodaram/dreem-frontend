import React, { useEffect, useState } from "react";
import Axios from "axios";
import cls from "classnames";
import { useHistory } from "react-router";

import styles from "./index.module.css";
import { ChooseWalletModal } from "shared/ui-kit/Modal/Modals/ChooseWalletModal";
import { SecondaryButton, SignatureRequestModal } from "shared/ui-kit";
import { useTypedSelector } from "store/reducers/Reducer";
import Box from "shared/ui-kit/Box";
import JoinUpDAOModal from "shared/ui-kit/Modal/Modals/JoinUpDAO";
import {
  ProgressAcceptIcon,
  ProgressDeclineIcon,
  ProgressPendingIcon,
} from "shared/ui-kit/Icons/progressIcons/index.styles";
import { buildJsxFromObject } from "shared/functions/commonFunctions";
import { FruitSelect } from "shared/ui-kit/Select/FruitSelect";
import URL from "shared/functions/getURL";
import FinalStepModal from "shared/ui-kit/Modal/Modals/FinalStepModal";

export default function DAOCard({ item, heightFixed }) {
  const user = useTypedSelector(state => state.user);
  const history = useHistory();

  const [community, setCommunity] = React.useState<any>(item);

  const [requestStatus, setRequestStatus] = useState<string>("");
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);

  const [onHover, setOnHover] = useState<boolean>(false);
  const [openJoinUpModal, setOpenJoinUpModal] = useState<boolean>(false);
  const [openChooseWalletModal, setOpenChooseWalletModal] = useState(false);
  const [openFinalStepModal, setOpenFinalStepModal] = useState(false);
  const [openSignatureRequestModal, setOpenSignatureRequestModal] = useState(false);

  useEffect(() => {
    //(search if the user has required access and update the status)
    if (!(community.arrayMembersId && community.arrayMembersId.includes(user.id)) && community.EntryConditions && community.EntryConditions === "By request") {
      Axios.post(`${URL()}/community/getUserProposalStatus`, {
        communityId: community.id,
        userId: user.id,
      }).then(res => {
        const resp = res.data;
        if (resp.success) {
          setRequestStatus(resp.data.status);
        } else {
          setRequestStatus("");
        }
      }).catch((err) => {
        console.error('Error: getUserProposalStatus', err);
        setRequestStatus("");
      });
    } else {
      setRequestStatus("");
    }
  }, [community]);

  const handleJoin = e => {
    e.preventDefault();
    e.stopPropagation();
    if (
      community.EntryType &&
      !community.EntryType.includes("Open") &&
      community.arrayMembersId &&
      !community.arrayMembersId.includes(user.id)
    ) {
      if (community.EntryType !== "By request") {
        setOpenJoinUpModal(true);
      } else {
        requestJoin();
      }
    } else {
      joinDAO();
    }
  };

  const requestJoin = () => {
    const body = {
      userAddress: user.id,
      communityAddress: community.CommunityAddress,
    };

    Axios.post(`${URL()}/community/requestJoin`, body).then(res => {
      const resp = res.data;
      if (resp.success) {
        setOpenJoinUpModal(true);
      } else {
      }
    });
  };

  const joinDAO = () => {
    const body = {
      userAddress: user.id,
      communityAddress: community.CommunityAddress,
    };
    // leave
    if (community.arrayMembersId && community.arrayMembersId.includes(user.id)) {
      Axios.post(`${URL()}/community/leave`, body).then(res => {
        const resp = res.data;
        if (resp.success) {
          const itemCopy = { ...community };
          itemCopy.arrayMembersId = itemCopy.arrayMembersId
            ? itemCopy.arrayMembersId.filter(member => member.id !== user.id)
            : [];

          itemCopy.Members = itemCopy.Members.filter(item => item.id !== user.id);

          setCommunity(itemCopy);
          setOpenJoinUpModal(true);
        } else {
        }
      });
    }
    // join
    else {
      Axios.post(`${URL()}/community/join`, body).then(res => {
        const resp = res.data;
        if (resp.success) {
          const itemCopy = { ...community };
          itemCopy.arrayMembersId = [...(itemCopy.arrayMembersId ?? []), user.id];

          itemCopy.Members = [...(itemCopy.Members || []), { date: new Date().getTime(), id: user.id }];

          console.log("join", itemCopy.arrayMembersId);
          setCommunity(itemCopy);
          setOpenJoinUpModal(true);
        }
      });
    }
  };

  const handleFollow = e => {
    e.preventDefault();
    e.stopPropagation();
    const body = {
      userAddress: user.id,
      communityAddress: community.CommunityAddress,
    };
    // unfollow
    if (
      !community.Followers ||
      (community.Followers &&
        (community.Followers.includes(user.id) || community.Followers.includes(user.address)))
    ) {
      Axios.post(`${URL()}/community/unfollow`, body).then(res => {
        const resp = res.data;
        if (resp.success) {
          const itemCopy = { ...community };
          itemCopy.Followers = itemCopy.Followers
            ? itemCopy.Followers.filter(member => member.id !== user.id)
            : [];

          setCommunity(itemCopy);
        }
      });
    }
    // follow
    else {
      Axios.post(`${URL()}/community/follow`, body).then(res => {
        const resp = res.data;
        if (resp.success) {
          const itemCopy = { ...community };
          itemCopy.Followers = [...(itemCopy.Followers ?? []), user.id];

          setCommunity(itemCopy);
        }
      });
    }
  };

  const handleFruit = type => {
    const body = {
      userId: user.id,
      fruitId: type,
      communityAddress: community.CommunityAddress,
    };

    Axios.post(`${URL()}/community/fruit`, body).then(res => {
      const resp = res.data;
      if (resp.success) {
        const itemCopy = { ...community };
        itemCopy.fruits = [...(itemCopy.fruits || []), { userId: user.id, fruitId: type, date: new Date().getTime() }]

        setCommunity(itemCopy);
      }
    });
  };

  const handleOpenSignatureModal = () => {
    if (community?.CommunityAddress) {
      const body = {
        StakingAddress: community.StakingAddress,
        StakingAmount: community.StakingAmount,
        StakingToken: community.StakingToken,
      };

      setSignRequestModalDetail(buildJsxFromObject(body));
      setOpenSignatureRequestModal(true);
    }
  };

  const handleJoinDao = () => {
    if (community.EntryType) {
      if (community.EntryType.includes("Staking")) {
        setRequestStatus("Pending");
        setOpenJoinUpModal(false);
        setOpenChooseWalletModal(true);
      } else {
        Axios.post(`${URL()}/community/joiningRequest/v2`, {
          Data: {
            Payload: {
              CommunityId: community?.CommunityAddress,
            },
            Address: user.id,
          }
        }).then(res => {
          const resp = res.data;
          if (resp.success) {
            setRequestStatus("Pending");
          }
        });
      }
    } else if (
      !community.EntryType ||
      (community.EntryType && community.EntryType.includes("Open"))
    ) {
      history.push(`/daos/${community.CommunityAddress}`);
    }

    setOpenJoinUpModal(false);
  }

  return (
    <div
      className={styles.cardContainer}
      onMouseEnter={() => setOnHover(true)}
      onMouseLeave={() => setOnHover(false)}
    >
      <div className={styles.card}>
        <div
          className={styles.cardCover}
          onClick={() => {
            history.push(`/daos/${community.CommunityAddress}`);
          }}
          style={
            community.dimensions && !heightFixed
              ? {
                height: 0,
                paddingBottom: `${(community.dimensions.height / community.dimensions.width) * 100 >= 120
                  ? (community.dimensions.height / community.dimensions.width) * 100
                  : 120
                  }%`,
              }
              : {
                height: "272px",
              }
          }
        >
          <div className={styles.aspectRatioWrapper}>
            {!community.Url || community.Url === "" || community.HasPhoto === false ? (
              <div className={styles.image} />
            ) : (
              <img className={styles.image} src={`${community.Url}?${Date.now()}`} alt={community.Name} />
            )}
          </div>
          <div className={cls({ [styles.hidden]: !onHover }, styles.aspectRatioWrapper)}>
            <div className={styles.content}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <div
                  className={styles.avatar}
                  style={{
                    backgroundImage:
                      community.userData && community.userData.imageURL && community.userData.imageURL !== ""
                        ? `url(${community.userData.imageURL})`
                        : "none",
                  }}
                />
                <h5>
                  {community.userData && community.userData.name ? community.userData.name : "Creator name"}
                </h5>
              </Box>
              <Box display="flex" flexDirection="column" alignItems="center" mb={"16px"}>
                <h6>{community.arrayMembersId ? community.arrayMembersId.length : 0} Members</h6>
                <h6>{community && community.TotalViews ? community.TotalViews : 0} Views</h6>{" "}
              </Box>
              <Box display="flex" flexDirection="column" mb={"16px"}>
                {requestStatus !== "" ? (
                  <Box display="flex" mb={1} alignItems="center" fontSize="14px" className={styles.status}>
                    <b>Request status:</b>
                    {requestStatus}
                    {requestStatus === "Denied" ? (
                      <ProgressDeclineIcon />
                    ) : (
                      <ProgressPendingIcon />
                    )}
                  </Box>
                ) : (
                  <SecondaryButton size="small" onClick={handleJoin}>
                    {community.arrayMembersId && community.arrayMembersId.includes(user.id)
                      ? "Leave"
                      : `Join up${community.EntryType && !community.EntryType.includes("Open")
                        ? community.EntryType.includes("Staking")
                          ? ` by staking`
                          : ` by request`
                        : ""
                      }`
                    }
                  </SecondaryButton>
                )}
                <SecondaryButton size="small" onClick={handleFollow}>
                  {!community.Followers ||
                    (community.Followers &&
                      (community.Followers.includes(user.id) || community.Followers.includes(user.address)))
                    ? "Follow"
                    : "Unfollow"}
                </SecondaryButton>
              </Box>

              {heightFixed &&
                user &&
                community.arrayMembersId &&
                community.arrayMembersId.includes(user.id) && (
                  <FruitSelect
                    fruitObject={community}
                    onGiveFruit={handleFruit}
                    members={community.Members}
                  />
                )}
            </div>
          </div>
        </div>
      </div>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" mt={2}>
        <Box mr={2}>
          <h5>{community.Name}</h5>
        </Box>
        {!heightFixed && user && community.arrayMembersId && community.arrayMembersId.includes(user.id) && (
          <FruitSelect
            fruitObject={community}
            onGiveFruit={handleFruit}
            members={community.Members}
          />
        )}
      </Box>
      {openJoinUpModal && (
        <JoinUpDAOModal
          open={openJoinUpModal}
          joinType={
            community.EntryConditions
              ? community.EntryConditions === "By request"
                ? 1
                : community.arrayMembersId && community.arrayMembersId.includes(user.id)
                  ? 0
                  : 2
              : 0
          }
          onAccept={handleJoinDao}
          onClose={() => {
            setOpenJoinUpModal(false);
          }}
        />
      )}
      {openChooseWalletModal && (
        <ChooseWalletModal
          theme="dark"
          isOpen={openChooseWalletModal}
          onClose={() => {
            setOpenChooseWalletModal(false);
          }}
          onAccept={() => {
            setOpenChooseWalletModal(false);
            setOpenFinalStepModal(true);
            setTimeout(() => {
              setOpenFinalStepModal(false);
              handleOpenSignatureModal();
            }, 2000);
          }}
        />
      )}
      {openFinalStepModal && (
        <FinalStepModal
          isOpen={openFinalStepModal}
          onClose={() => {
            setOpenFinalStepModal(false);
          }}
          theme="dark"
        />
      )}
      {openSignatureRequestModal && (
        <SignatureRequestModal
          theme="dark"
          open={openSignatureRequestModal}
          address={user.address}
          transactionFee="0.0000"
          detail={signRequestModalDetail}
          handleOk={joinDAO}
          handleClose={() => setOpenSignatureRequestModal(false)}
        />
      )}
    </div>
  );
}

export const FruitCounters = ({ counter1, counter2, counter3 }) => {
  return (
    <Box
      color="white"
      display="flex"
      alignItems="center"
      fontFamily="Agrandir GrandLight"
      fontSize="14px"
      fontWeight="800"
      marginTop="8px"
    >
      <Box display="flex" alignItems="center" marginRight="14px">
        <img
          src={require("assets/emojiIcons/watermelon.png")}
          alt="watermelon"
          style={{ marginRight: "4px" }}
        />
        {counter1}
      </Box>
      <Box display="flex" alignItems="center" marginRight="14px">
        <img src={require("assets/emojiIcons/avocado.png")} alt="avocado" style={{ marginRight: "4px" }} />
        {counter2}
      </Box>
      <Box display="flex" alignItems="center" marginRight="14px">
        <img src={require("assets/emojiIcons/orange.png")} alt="orange" style={{ marginRight: "4px" }} />
        {counter3}
      </Box>
    </Box>
  );
};
