import axios from "axios";
import URL from "./getURL";

export async function sumTotalViews(obj, isMediaPod = false) {
  let path = "";
  let body = obj;

  if (obj.CommunityAddress) {
    path = "/community/sumTotalViews";
  } else if (obj.CreditAddress) {
    path = "/priviCredit/sumTotalViews";
  } else if (obj.PodAddress) {
    if (isMediaPod) {
      path = "/mediaPod/sumTotalViews";
    } else {
      path = "/pod/sumTotalViews";
    }
  } else if (obj.TokenSymbol) {
    path = "/social/sumTotalViews";
  } else if (obj.ProfileAddress) {
    path = "/user/sumTotalViews";
  } else if (obj.MediaSymbol || (obj.eth && obj.id) || obj.type === "playList") {
    path = "/media/sumTotalViews";
  }

  axios
    .post(`${URL()}` + path, body)
    .then(response => {
      const resp = response.data;
      if (resp.success) {
        // return resp.TotalViews;
      }
    })
    .catch(error => {
      console.log(error);
    });
}
