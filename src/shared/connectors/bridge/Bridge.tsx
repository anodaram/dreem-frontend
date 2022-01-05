import React from 'react';

import './Bridge.css';

import Connect from './Connect';
import Swap from './Swap';

const Bridge = () => {

    return (
        <div className={'bridge_container'}>
            <Connect />
            <Swap />
            Swap is currently available for ETH, DAI and UNI (Ropsten testnet)
        </div>
    );
};

export default Bridge;
