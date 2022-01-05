import React, { useState } from "react";
import { makeStyles, Modal, Divider, Button } from "@material-ui/core";
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import styled from "styled-components";
import { SearchIcon } from "shared/ui-kit/Icons";
import Box from 'shared/ui-kit/Box';

const useStyles = makeStyles((theme) => ({
    modalContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    paper: {
        position: 'absolute',
        minWidth: "700px",
        borderRadius: "14px",
        background: "white",
        paddingLeft: "38px",
        paddingRight: "38px",
        overflowY: "scroll",
        height: "90vh",
        outline: "none"
    },
    title: {
        fontWeight: 700,
        fontSize: "22px",
        lineHeight: "104.5%",
        fontFamily: "Agrandir",
        color: "#181818"
    },
    digitalArt: {
        fontWeight: 400,
        fontSize: "30px",
        lineHeight: "31.35px",
        fontFamily: "Agrandir"
    },
    divider: {
        opacity: 0.2,
        background: '#707582',
        border: "1px solid #707582",
        transform: "rotate(90deg)"
    },
    currentPrice: {
        fontWeight: 800,
        fontSize: "18px",
        lineHeight: "104.5%",
        color: '#181818'
    },
    fractionaliseButton: {
        background: "#181818",
        color: "white",
        fontSize: "22.8px",
        height: "56px",
        fontWeight: 700,
        fontFamily: "Agrandir",
        lineHeight: "30px",
        borderRadius: "14px",
        width: "100%",
        marginTop: "56px",
        marginBottom: "56px",
        textTransform: "none"
    },
    roundInputBox: {
        background: "#F7F9FE",
        border: "1px solid #707582",
        boxSizing: "border-box",
        borderRadius: "11.36px",
        width: "100%"
    },
    iconButton: {
        padding: "10px"
    },
    searchBoxPaper: {
        height: 40,
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: "100%",
        borderRadius: "11.36px",
        boxSizing: "border-box",
        background: "#F7F9FE",
        border: "1px solid #707582"
    },
    searchBox: {
        flex: 1,
        background: "#F7F9FE",
        paddingLeft: "20px",
        color: "#99A1B3",
        fontSize: "14px",
        lineHeight: "120%"
    },
    userName: {
        background: "-webkit-linear-gradient(#23D0C6 100%, #00CC8F 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        fontSize: 14,
    },
    userItem: {
        alignItems: "center",
        marginTop: "16px",
        marginBottom: "16px"
    },
    goToUser: {
        flexDirection: "row",
        alignItems: "center",
    },
    headerTitle: {
        marginTop: "30px"
    }
}));

export const UserIcon = styled.div<{ imageUrl: string }>`
  background-size: cover;
  height: 32px;
  width: 32px;
  min-width: 32px;
  min-height: 32px;
  border-radius: 50%;
  margin-right: 15px;
  background-color: #5a5a5a;
  background-image: ${({ imageUrl }) => imageUrl};
  border: 2px solid white;
  box-shadow: 0px 2px 8px rgb(0 0 0 / 50%)
`

const BuyFraction = (props: any) => {
    const classes = useStyles();

    const [currentCoin, setCurrentCoin] = useState("USDC");
    const [buyBackCoin, setBuyBackCoin] = useState("USDC");

    return (
        <Modal className={classes.modalContainer} open={props.open} onClose={() => { props.handleClose() }} >
            <div className={classes.paper}>
                <Box className={classes.headerTitle} display="flex">
                    <Box style={{ width: "50%" }} flexGrow={1}>
                        <h2 className={classes.title}>View All Owners</h2>
                    </Box>
                    <Box p={1}>
                        <img
                            src={require('assets/icons/x_darkblue.png')}
                            alt={'x'}
                            onClick={() => props.handleClose()}
                            style={{ cursor: "pointer" }}
                        />
                    </Box>
                </Box>
                <p className={classes.digitalArt}>My Awesome Digital Art</p>
                <Box>
                    <Paper component="form" className={classes.searchBoxPaper}>
                        <InputBase
                            className={classes.searchBox}
                            placeholder="Search for a specific user"
                            inputProps={{ 'aria-label': 'search for a specific user' }}
                        />
                        <IconButton type="submit" className={classes.iconButton} aria-label="search">
                            <SearchIcon />
                        </IconButton>
                    </Paper>
                </Box>
                <Box >
                    {[0, 1, 2, 3,].map(value =>
                        <>
                            <Box display="flex" className={classes.userItem}>
                                <Box>
                                    <UserIcon imageUrl={require('assets/icons/x_darkblue.png')} />
                                </Box>
                                <Box flexGrow={1}>
                                    <p className={classes.userName}>User_Name</p>
                                </Box>
                                <Box display="flex" className={classes.goToUser}>
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17.0625 1.04042L7.06247 11.0404M17.0625 1.04042L17.0625 7.04041M17.0625 1.04042L11.0625 1.04041M7.0625 1.04042H1.0625V17.0404H17.0625V11.0404" stroke="#727F9A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </Box>
                            </Box>
                            <Divider />
                        </>
                    )}
                </Box>
                <Box display="flex">
                    <Box style={{ width: "100%" }}>
                        <Button className={classes.fractionaliseButton} variant="contained">Buy Fraction</Button>
                    </Box>
                </Box>

            </div>
        </Modal >
    )
}
export default BuyFraction;
