import React, { useEffect, useState } from "react";
import { Tooltip, Fade } from "@material-ui/core";
import styled from "styled-components";
import axios from "axios";
import URL from "shared/functions/getURL";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as StarRegular } from "assets/icons/star-regular.svg";
import { ReactComponent as StarSolid } from "assets/icons/star-solid.svg";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  cursor: pointer;
`;

interface IProps {
	wallPostId: string;
	onlySuperFollowers: boolean;
}

export const SuperFollowerToggle: React.FC<IProps> = ({ wallPostId, onlySuperFollowers }) => {
	const [isSuperFollower, toggleSuperFollower] = useState(onlySuperFollowers);

	useEffect(() => {
		toggleSuperFollower(onlySuperFollowers);
	}, [onlySuperFollowers]);

	const toggleSuperFollowersHandler = () => {
		axios
			.post(`${URL()}/user/wall/onlyForSuperFollowers`, {
				wallPostId,
				OnlySuperFollowers: !isSuperFollower,
			})
			.then(() => {
				toggleSuperFollower(!isSuperFollower);
			})
			.catch(error => {
				console.log(error);
			});
	};

	return (
		<Wrapper onClick={toggleSuperFollowersHandler} className={"super-followers=toggle"}>
			<Tooltip
				TransitionComponent={Fade}
				TransitionProps={{ timeout: 600 }}
				arrow={true}
				className="tooltipSuperFollowerToggle"
				title={"Click to limit the display only for supefollowers"}
			>
				<React.Fragment>
					{!isSuperFollower ? (
						<div style={{ color: "#aba313", fontSize: "30" }}>
							<SvgIcon>
								<StarRegular />
							</SvgIcon>
						</div>
					) : (
						<div style={{ color: "#aba313", fontSize: "30" }}>
							<SvgIcon>
								<StarSolid />
							</SvgIcon>
						</div>
					)}
				</React.Fragment>
			</Tooltip>
		</Wrapper>
	);
};
