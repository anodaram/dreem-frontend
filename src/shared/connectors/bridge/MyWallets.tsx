import React, { useState } from 'react';

import './MyWallets.css';

import { ReactComponent as CircleRegular } from "assets/icons/circle-regular.svg";
import { ReactComponent as CheckedCircleRegular } from "assets/icons/dot-circle-regular.svg";
import { ReactComponent as LaunchIcon } from "assets/icons/directions-solid.svg";
import { ReactComponent as AddIcon } from "assets/icons/plus-solid.svg";
import { ReactComponent as FileCopyOutlinedIcon } from "assets/icons/copy-regular.svg";

let walletTypes = [
    'Privi Wallet',
    'Metamask',
    'WalletConnect'
]

let walletImgs = [
    'privi_wallet',
    'metamask',
    'wallet_connect'
]

const WalletInfoContainer = ({
    walletInfo,
    handleDisconnect,
    handleClick,
    isActive
}) => {
    const {
        id, walletStatus, walletType
    } = walletInfo;

    if (id && id.length > 0 && walletType) {
        return (
            <div
                className={`wallet_info_container cursor-pointer ${isActive ? 'active_border' : 'disabled_border'}`}
                onClick={() => handleClick(id)}
            >
                <div className="info_top">
                    <div className="wallet_type">
                        <div>Connected with <br />{walletTypes[walletType]}</div>
                    </div>
                    <div className={`${isActive ? 'active' : 'disabled'}`}>
                        {isActive ? <div className="wallet_status">
                            <span>Active</span>
                            <CheckedCircleRegular className="active" />
                        </div> : <div className="wallet_status">
                            <span>Disabled</span>
                            <CircleRegular />
                        </div>}
                    </div>
                    <button onClick={() => handleDisconnect(id)} className="wallet_button">Disconnect</button>
                </div>
                <div className='wallet_code'>
                    {walletType > -1 ? <img src={require(`assets/walletImages/${walletImgs[walletType]}.svg`)} /> : null}
                    <span className={`${isActive ? 'active' : 'disabled'}`}>{`${id.slice(0, 5)}...${id.slice(id.length - 4, id.length)}`}</span>
                </div>
                <div className="wallet_transaction">
                    <div className="wallet_access">
                        <span><FileCopyOutlinedIcon />Copy Address</span>
                        <span><LaunchIcon /> View on Etherscan</span>
                    </div>
                    <div className="wallet_balance">
                        <span>Your Balance <br /></span>
                        <span>Transaction History</span>
                    </div>
                </div>
            </div>
        )
    } else return null
}

const MyWallets = ({ dataList, handleAddWallet, handleDisconnect }) => {
    const [shouldShowAll, setShouldShowAll] = useState<boolean>(false);
    const [curWalletIndex, setCurWalletIndex] = useState<number>(0);
    const handleClick = (index) => {
        setCurWalletIndex(index);
    }

    return (
        <>
            <div className='my-wallets-view'>
                {dataList.length > 0 ?
                    !shouldShowAll ?
                        dataList.slice(0, 2).map((wallet, index) =>
                            <WalletInfoContainer
                                key={wallet.id}
                                walletInfo={wallet}
                                handleDisconnect={handleDisconnect}
                                handleClick={() => handleClick(index)}
                                isActive={curWalletIndex === index}
                            />) :
                        dataList.map((wallet, index) =>
                            <WalletInfoContainer
                                key={wallet.id}
                                walletInfo={wallet}
                                handleDisconnect={handleDisconnect}
                                handleClick={handleClick}
                                isActive={curWalletIndex === index}
                            />) :
                    'No Wallets Found'}
            </div>
            <div className="extra_container">
                {!shouldShowAll && <button className="see_all" onClick={() => setShouldShowAll(true)}>See All</button>}
                <button onClick={handleAddWallet} className="add_wallet">
                    <AddIcon style={{ width: '16px', marginRight: '8px', marginBottom: '4px' }} />
                    <span>Add Wallet</span>
                </button>
            </div>
        </>
    );
};

export default MyWallets;
