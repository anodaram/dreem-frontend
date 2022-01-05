import React, { useState } from "react";
import "shared/ui-kit/Modal/Modals/Modal.css";
import "./SignTransaction.css";

const infoIcon = require("assets/icons/info_icon.png");

const SignTransaction = (props: any) => {

    const [mnemonic, setMnemonic] = useState<string>("");



    const handleStake = async () => {

    };



    return (
        <div className="modal-content w50 stake-modal">
            <div className="exit" onClick={props.handleClose}>
                <img
                    src={require("assets/icons/x_darkblue.png")}
                    alt={"x"}
                />
            </div>
            <div className="title">
                <h2>{`Mnemonic`}</h2>
            </div>

            <div className="square-container">
                <div className="right-item">
                    <div className="label">
                        Mnemonic
                        <img
                            src={infoIcon}
                            className="infoIconAddLiquidityModal"
                            alt={"info"}
                        />
                    </div>
                    <div className="input-wrapper">
                        <input
                            placeholder="Mnemonic..."
                            value={mnemonic}
                            onChange={(v) => {
                                setMnemonic(v.target.value);
                            }}
                            autoFocus
                        />
                    </div>
                </div>
            </div>

            <div className="square-container">
                <button
                    className="roundedButton left-item"
                    onClick={props.changeView}
                >
                    Back
            </button>

                <button
                    className="roundedButton right-item"
                    onClick={() => {
                        props.setMnemonic(mnemonic);
                        props.changeView();
                    }}
                >
                    Confirm
        </button>
            </div>
        </div>

    );
};
export default SignTransaction;
