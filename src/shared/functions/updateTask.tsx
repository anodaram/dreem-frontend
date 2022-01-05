import axios from "axios";
import URL from "./getURL";

// update task
export const updateTask = async (userId, taskTitle) => {
  return new Promise((resolve, reject) => {
    const bodyTask = {
      userId: userId,
      taskTitle: taskTitle,
    };

    axios
      .post(`${URL()}/tasks/updateTask`, bodyTask)
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          // Do something here if needed.
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(e => {
        resolve(false);
      });
  });
};
