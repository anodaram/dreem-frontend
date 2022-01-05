import React, { useState, useEffect } from "react";
import { Dialog } from "@material-ui/core";
import "./TutorialModal.css";
import { communitiesTutorials, creditPoolsTutorials, podsTutorials } from "./Tutorials";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import { updateTask } from "../../../functions/updateTask";
import URL from "../../../functions/getURL";
import { updateTutorialsSeen } from "store/actions/User";

export default function TutorialModal(props) {
  //store
  let user = useSelector((state: RootState) => state.user);

  //hooks
  const dispatch = useDispatch();
  const [tutorials, setTutorials] = useState<any>([]);
  const [index, setIndex] = useState<number>(0);

  // useEffect(() => {
  //   if (props.tutorial === "communities") {
  //     setTutorials(communitiesTutorials.Tutorials);
  //   } else if (props.tutorial === "creditPools") {
  //     setTutorials(creditPoolsTutorials.Tutorials);
  //   } else if (props.tutorial === "pods") {
  //     setTutorials(podsTutorials.Tutorials);
  //   }
  // }, []);

  //functions
  const handleNext = () => {
    setIndex(index + 1);
  };

  const handleFinishTutorial = () => {
    const body = {
      userId: user.id,
      tutorialsSeen: {
        communities: props.tutorial === "communities" ? true : user.tutorialsSeen.communities,
        pods: props.tutorial === "pods" ? true : user.tutorialsSeen.pods,
        creditPools: props.tutorial === "creditPools" ? true : user.tutorialsSeen.creditPools,
      },
    };

    if (
      (user.tutorialsSeen.communities && !user.tutorialsSeen.pods && !user.tutorialsSeen.creditPools) ||
      (!user.tutorialsSeen.communities && user.tutorialsSeen.pods && !user.tutorialsSeen.creditPools) ||
      (!user.tutorialsSeen.communities && !user.tutorialsSeen.pods && user.tutorialsSeen.creditPools)
    ) {
      updateTask(user.id, "Finish a pop-up flow");
    }

    if (user.tutorialsSeen.communities && user.tutorialsSeen.pods && user.tutorialsSeen.creditPools) {
      updateTask(user.id, "Read at least 3 pop-up sections (1st screen and 2nd screen)");
    }

    axios
      .post(`${URL()}/user/updateTutorialsSeen`, body)
      .then(response => {
        if (response.data.success) {
          console.log("finished tutorial  " + props.tutorial);

          //update redux data aswell
          dispatch(updateTutorialsSeen(body.tutorialsSeen));
          props.handleClose();
        } else {
          console.log(`Finish ${props.tutorial} tutorials failed`);
        }
      })
      .catch(error => {
        console.log(error);
        //alert('Error handling anonymous avatar update');
      });
  };

  if (tutorials.length > 0)
    return (
      <Dialog
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        className="modal"
      >
        <div className="modal-content tutorials-modal">
          <button className="skip" onClick={handleFinishTutorial}>
            Skip for now
          </button>
          <div
            className="tutorial-image"
            style={{
              backgroundImage: `url(${require(`assets/tutorialImages/${tutorials[index].Image}.png`)})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          />
          <h3>{tutorials[index].Title}</h3>
          <p>{tutorials[index].Body}</p>
          <div className="bottom">
            <span>{index === 0 ? "Introduction" : `${index} of ${tutorials.length - 1}`}</span>
            <button onClick={index < tutorials.length - 1 ? handleNext : handleFinishTutorial}>
              {index < tutorials.length - 1 ? "Next" : "Finish"}
            </button>
          </div>
        </div>
      </Dialog>
    );
  else return null;
}
