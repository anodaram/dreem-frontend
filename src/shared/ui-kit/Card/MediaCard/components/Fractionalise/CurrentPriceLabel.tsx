import React from 'react'
import { makeStyles } from "@material-ui/core/styles";

import Box from 'shared/ui-kit/Box';

interface Props {
    title: string;
    price: string;
}
const useStyles = makeStyles((theme) => ({
    labelTitle: {
        fontWeight: 800,
        fontSize: "18px",
        lineHeight: "18px",
        color: "#181818"
    },
    labelPrice: {
        fontWeight: 400,
        fontSize: "22px",
        lineHeight: "104.5%",
        color: "#181818"
    }
}));

const CurrentPriceLabel = (props: Props) => {
    const classes = useStyles();
    const { title, price } = props;

    return (
        <Box flexDirection="row">
            <p className={classes.labelTitle}>
                {title}
            </p>
            <p className={classes.labelPrice}>
                {price}
            </p>

        </Box>
    )
}

export default CurrentPriceLabel;
