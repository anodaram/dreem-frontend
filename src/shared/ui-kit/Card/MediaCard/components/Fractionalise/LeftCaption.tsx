import React from 'react'
import { makeStyles } from "@material-ui/core/styles";

import Box from 'shared/ui-kit/Box';

interface Props {
    title: string;
    description: string;
}
const useStyles = makeStyles((theme) => ({
    labelTitle: {
        fontWeight: 400,
        fontSize: "18px",
        lineHeight: "18px",
        color: "#181818",
        marginBottom: "6px",
    },
    labelDescription: {
        fontWeight: 400,
        fontSize: "14px",
        lineHeight: "16px",
        color: "#707582",
        margin: 0,
    }
}));

const LeftCaption = (props: Props) => {
    const classes = useStyles();
    const { title, description } = props;

    return (
        <Box flexDirection="row">
            <p className={classes.labelTitle}>
                {title}
            </p>
            <p className={classes.labelDescription}>
                {description}
            </p>

        </Box>
    )
}

export default LeftCaption;
