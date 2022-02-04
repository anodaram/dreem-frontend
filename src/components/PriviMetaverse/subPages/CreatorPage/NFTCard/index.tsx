import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Skeleton } from "@material-ui/lab";
import Tooltip from "@material-ui/core/Tooltip";
import { useSelector } from "react-redux";

import Box from "shared/ui-kit/Box";
import {CustomTable} from "shared/ui-kit/Table";
import { PrimaryButton } from "shared/ui-kit";
import { getDefaultImageUrl } from "shared/services/user/getUserAvatar";
import { nftCardStyles } from "./index.styles";
import ContentPreviewModal from "components/PriviMetaverse/modals/ContentPreviewModal";
import { getUser } from "store/selectors/user";

export default function NFTCard(props) {
  const headers = [
    {headerName: 'NFT'},
    {headerName: 'NFT Name'},
    {headerName: 'Collection'},
    {headerName: 'Explorer'},
    {headerName: 'Minting status'}
  ]
  
  const classes = nftCardStyles(props);
  const history = useHistory();
  const userSelector = useSelector(getUser);
  const [items, setItems] = useState<any>(props?.items); 
  console.log(props?.items)

  const [openContentPreview, setOpenContentPreview] = useState<boolean>(false);

  const handleOpenDetail = () => {
    if (props.item?.worldIsExtension || props.popup) {
      setOpenContentPreview(true);
    } else {
      history.push(`/realms/${props?.item?.id}`);
    }
  };

  const handleClose = e => {
    e.preventDefault();
    e.stopPropagation();
    setOpenContentPreview(false);
  };

  const isOwner = props?.items?.creatorId === userSelector.id;

  return (
    <Box className={classes.card}>
      {props.isLoading ? (
        <Box className={classes.skeleton}>
          <Skeleton variant="rect" width="100%" />
          <Skeleton variant="rect" width={props.isFeature ? "20%" : "100%"} />
          <Skeleton variant="rect" width={props.isFeature ? "20%" : "80%"} />
        </Box>
      ) : (
        <>
          <Box className={classes.header}>
            <div>NFT</div>
            <div>NFT Name</div>
            <div>Collection</div>
            <div>Explorer</div>
            <div>Minting status</div>
            <div>&nbsp;</div>
          </Box>
          {items?.map((nft, i) => (
            <div className={classes.row}>
              <div><img className={classes.image} src={nft.item.textureThumbnail} alt="NFT image" /></div>
              <div>{nft.item.erc721Name}</div>
              <div>{nft.item.collectionName}</div>
              <div>{nft.chain == "POLYGON" && <PolygonIcon/>}</div>
              <div><Box className={classes.status}>{nft.erc721MintedCount}/{nft.erc721TotalSupply}</Box></div>
              <div><PrimaryButton className={classes.button} size="medium">continue minting</PrimaryButton></div>
            </div>
          ))}
        </>
      )}
    </Box>
  );
}

const PolygonIcon = () => (
  <svg width="23" height="21" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.3272 6.54011C17.1071 6.41709 16.8591 6.35251 16.607 6.35251C16.3549 6.35251 16.1069 6.41709 15.8868 6.54011L12.5823 8.45677L10.337 9.70677L7.03267 11.6234C6.81254 11.7463 6.56462 11.8109 6.3125 11.8109C6.06038 11.8109 5.81246 11.7463 5.59233 11.6234L2.96563 10.1234C2.75191 10.0009 2.5734 9.8253 2.44734 9.61364C2.32127 9.40198 2.2519 9.16139 2.24593 8.91511V5.95677C2.24297 5.70862 2.30861 5.46447 2.4356 5.25125C2.5626 5.03803 2.74602 4.86403 2.96563 4.74844L5.54991 3.29011C5.77004 3.1672 6.01796 3.10268 6.27008 3.10268C6.52219 3.10268 6.77012 3.1672 6.99025 3.29011L9.57453 4.74844C9.78824 4.87099 9.96675 5.04658 10.0928 5.25824C10.2189 5.4699 10.2883 5.71049 10.2942 5.95677V7.87344L12.5395 6.58177V4.66511C12.5424 4.41695 12.4768 4.1728 12.3498 3.95958C12.2228 3.74637 12.0394 3.57237 11.8198 3.45677L7.03267 0.706963C6.81254 0.584056 6.56462 0.519531 6.3125 0.519531C6.06038 0.519531 5.81246 0.584056 5.59233 0.706963L0.719793 3.45696C0.500212 3.57254 0.316814 3.74651 0.189821 3.95969C0.0628281 4.17287 -0.00282692 4.41698 9.57185e-05 4.66511V10.2068C-0.00286197 10.4549 0.0627765 10.6991 0.189771 10.9123C0.316766 11.1255 0.500183 11.2995 0.719793 11.4151L5.59176 14.1651C5.81189 14.288 6.05981 14.3525 6.31193 14.3525C6.56405 14.3525 6.81197 14.288 7.0321 14.1651L10.3365 12.2901L12.5817 10.9984L15.8863 9.12344C16.1064 9.00043 16.3543 8.93584 16.6064 8.93584C16.8586 8.93584 17.1065 9.00043 17.3266 9.12344L19.9109 10.5818C20.1246 10.7043 20.3031 10.8799 20.4292 11.0916C20.5552 11.3032 20.6246 11.5438 20.6306 11.7901V14.7484C20.6335 14.9966 20.5679 15.2407 20.4409 15.454C20.3139 15.6672 20.1305 15.8412 19.9109 15.9568L17.3266 17.4568C17.1065 17.5797 16.8586 17.6442 16.6064 17.6442C16.3543 17.6442 16.1064 17.5797 15.8863 17.4568L13.302 15.9984C13.0883 15.8759 12.9098 15.7003 12.7837 15.4886C12.6577 15.277 12.5883 15.0364 12.5823 14.7901V12.8733L10.337 14.1649V16.0816C10.3341 16.3297 10.3997 16.5739 10.5267 16.7871C10.6537 17.0003 10.8371 17.1743 11.0567 17.2899L15.9287 20.0399C16.1488 20.1628 16.3967 20.2274 16.6489 20.2274C16.901 20.2274 17.1489 20.1628 17.369 20.0399L22.241 17.2899C22.4547 17.1674 22.6332 16.9918 22.7593 16.7801C22.8853 16.5684 22.9547 16.3279 22.9607 16.0816V10.5401C22.9637 10.292 22.898 10.0478 22.771 9.83458C22.644 9.62137 22.4606 9.44737 22.241 9.33177L17.3272 6.54011Z" fill="#E9FF26"/>
  </svg>
);
