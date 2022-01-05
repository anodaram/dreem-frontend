import axios from 'axios';
import URL from './getURL';

export const userInfo = async (
  userId: string,
  loginUser?: {
    id: string;
    anon: boolean;
    firstName: string;
    lastName: string;
    anonAvatar: string;
    hasPhoto: boolean;
    url: string;
  }
): Promise<{ name: string; imageURL: string }> => {
  let user: { name: string; imageURL: string } = { name: '', imageURL: '' };

  if (!loginUser || userId !== loginUser.id) {
    await axios
      .get(`${URL()}/user/getBasicInfo/${userId}`)
      .then((response) => {
        if (response.data.success) {
          let data = response.data.data;
          user.name = data.name;
          if (data.anon != undefined && data.anon === false) {
            if (data.hasPhoto && data.url) {
              user.imageURL = `${data.url}?${Date.now()}`;
            }
          } else if (data.anonAvatar && data.anonAvatar.length > 0) {
            user.imageURL = `${require(`assets/anonAvatars/${data.anonAvatar}`)}`;
          }
        }
      })
      .catch((error) => {
        console.log(error);
        //alert('Error getting basic Info');
      });
  } else {
    user.name =
      loginUser.firstName + loginUser.lastName && loginUser.lastName.length > 0
        ? ` ${loginUser.lastName}`
        : '';
    if (
      loginUser.anon != undefined &&
      loginUser.anon === true &&
      loginUser.anonAvatar &&
      loginUser.anonAvatar.length > 0
    ) {
      user.imageURL = `${require(`assets/anonAvatars/${loginUser.anonAvatar}`)}`;
    } else {
      if (loginUser.hasPhoto && loginUser.url) {
        user.imageURL = `${loginUser.url}?${Date.now()}`;
      }
    }
  }

  return user;
};
