import React, { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import axios from "axios";
// import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import URL, { METAVERSE_MAINTENCE_URL } from "shared/functions/getURL";
import Header from "shared/ui-kit/Header/Header";
import { setUser } from "store/actions/User";
import PriviMetaverseRouter from "./PriviMetaverseRouter";
import { signOut } from "../../store/actions/User";
import { setLoginBool } from "../../store/actions/LoginBool";
import { setPublicy, setUnderMaintenanceInfo } from "../../store/actions/UnderMaintenanceInfo";
import { useAuth } from "../../shared/contexts/AuthContext";
import { priviMetaversePageStyles } from "./index.styles";

export default function PriviMetaverse() {
  const classes = priviMetaversePageStyles();
  // const history = useHistory();
  const dispatch = useDispatch();
  const { setSignedin } = useAuth();

  const { account } = useWeb3React();

  useEffect(() => {
    const checkUnderMaintenance = async () => {
      let info: any = await checkServerIsUnderMaintenance();
      if (info?.underMaintenance) {
        setSignedin(false);
        dispatch(signOut());
        localStorage.removeItem("userSlug");
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        localStorage.removeItem("address");
        // history.push("/");
        dispatch(setLoginBool(false));
      }
      dispatch(setUnderMaintenanceInfo(info));
    };

    const checkStatus = async () => {
      const address = localStorage.getItem("address");
      if ((account && account.length > 0) || address) {
        const res = await axios.post(`${URL()}/wallet/getEthAddressStatus`, {
          address: account ?? address,
          appName: "PriviMetaverse",
        });

        if (res.data.success === true && res.data.data?.status !== "authorized") {
          // history.push("/");
        }
      } else {
        // history.push("/");
      }
    };

    const checkFree = async () => {
      axios.get(`${URL()}/maintenance/getAppFree/PriviMetaverse`).then(res => {
        if (res.data.success) {
          dispatch(setPublicy(res.data.data.status));
        }
      });
    };

    const checkUserInfo = () => {
      const token: string = localStorage.getItem("token") || "";
      const userId: string = localStorage.getItem("userId") || "";
      if (token && userId) {
        axios
          .get(`${URL()}/user/getLoginInfo/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(response => {
            if (response.data.success) {
              const data = response.data.data;
              dispatch(setUser(data));
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    };

    checkUnderMaintenance();
    checkFree();
    checkStatus();
    checkUserInfo();
  }, []);

  const checkServerIsUnderMaintenance = async () => {
    return new Promise((resolve, reject) => {
      axios
        .get(METAVERSE_MAINTENCE_URL())
        .then(response => {
          if (response?.data?.status?.metaverse?.canPlay) {
            resolve({
              underMaintenance: false,
              timestamp: 0,
              message: "",
            });
          } else {
            console.log("Under Maintenance");
            resolve({
              underMaintenance: true,
              timestamp: response?.data?.status?.metaverse?.maintenance?.estimatedTimestamp || 0,
              message: response?.data?.status?.metaverse?.maintenance?.message || "",
            });
          }
        })
        .catch(error => {
          console.log(error);
          console.log("Under Maintenance");
          resolve({
            underMaintenance: true,
            timestamp: 0,
            message: "Maintenance in Progress",
          });
          // alert("Error getting basic Info");
        });
    });
  };

  return (
    <div className={classes.priviMetaverse}>
      <Header />
      <div className={classes.mainContainer}>
        <div className={classes.content} id="scroll-container">
          <PriviMetaverseRouter />
        </div>
      </div>
    </div>
  );
}
