import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Menu, Modal } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import { NavLink } from 'react-router-dom';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { useTypedSelector } from 'store/reducers/Reducer';
import { signOut, updateTutorialsSeen } from 'store/actions/User';
import './Button.css';
import { useHistory } from 'react-router-dom';
import URL from '../../functions/getURL';
import axios from 'axios';

//menu style
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menu: {
      display: 'flex',
      marginTop: '50px',
    },
    label: {
      textDecoration: 'none',
      fontFamily: 'Agrandir',
      fontSize: '12px',
    },
    logout: {
      color: '#a74242',
      textDecoration: 'none',
      fontFamily: 'Agrandir',
      fontSize: '12px',
    },
  })
);

export default function SettingsButton(props) {
  const classes = useStyles();
  const user = useTypedSelector((state) => state.user);
  const dispatch = useDispatch();
  const history = useHistory();

  //menu functions
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [
    openRestartTutorialsModal,
    setOpenRestartTutorialsModal,
  ] = useState<boolean>(false);
  const handleOpenRestartTutorialsModal = () => {
    setOpenRestartTutorialsModal(true);
  };
  const handleCloseRestartTutorialsModal = () => {
    setOpenRestartTutorialsModal(false);
  };

  const handleRestartTutorials = () => {
    const body = {
      userId: user.id,
      tutorialsSeen: {
        communities: false,
        pods: false,
        creditPools: false,
      },
    };

    axios
      .post(`${URL()}/user/updateTutorialsSeen`, body)
      .then((response) => {
        if (response.data.success) {
          console.log('finished tutorial  ' + props.tutorial);

          //update redux data aswell
          dispatch(updateTutorialsSeen(body.tutorialsSeen));
          handleCloseRestartTutorialsModal();
        } else {
          console.log(`Finish ${props.tutorial} tutorials failed`);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={
          props.green
            ? 'button settings-button green'
            : 'button settings-button'
        }
      >
        <img src={require('assets/icons/settings.png')} alt="settings" />
      </button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        className={classes.menu}
      >
        <MenuItem onClick={handleClose}>
          <NavLink className={classes.label} to={`/profile/${user.id}`}>
            Profile
          </NavLink>
        </MenuItem>
        <MenuItem
          className={classes.label}
          onClick={handleOpenRestartTutorialsModal}
        >
          Restart tutorials
        </MenuItem>
        <Modal
          open={openRestartTutorialsModal}
          onClose={handleCloseRestartTutorialsModal}
          className="modal"
        >
          <div className="modal-content ">
            <h3>Do you want to restart the tutorials from all pages?</h3>
            <div className="buttons">
              <button onClick={handleRestartTutorials}>Yes</button>
              <button
                onClick={handleCloseRestartTutorialsModal}
                style={{ backgroundColor: '#656E7E' }}
              >
                No
              </button>
            </div>
          </div>
        </Modal>
      </Menu>
    </>
  );
}
