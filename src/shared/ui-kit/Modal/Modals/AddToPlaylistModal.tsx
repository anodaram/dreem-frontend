import { Modal } from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";

import cls from "classnames";
import { useTypedSelector } from "store/reducers/Reducer";
import CreatePlaylistModal from "./CreatePlaylistModal";
import StyledCheckbox from "shared/ui-kit/Checkbox";
import URL from "shared/functions/getURL";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

import styles from "./AddToPlaylistModal.module.scss";
import { PrimaryButton } from "shared/ui-kit";
import { SearchWithCreate } from "shared/ui-kit/SearchWithCreate";

const AddToPlaylistModal = (props: any) => {
  //STORE
  const user = useTypedSelector(state => state.user);

  //HOOKS
  const [userPlaylists, setUserPlaylists] = useState<any[]>([]);
  const [filteredPlaylists, setFilteredPlaylists] = useState<any[]>([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState<any[]>([]);

  const [searchValue, setSearchValue] = useState<string>("");

  const [status, setStatus] = useState<any>("");

  const [openPlaylistModal, setOpenPlaylistModal] = useState<boolean>(false);
  const handleOpenPlaylistModal = () => {
    setOpenPlaylistModal(true);
  };
  const handleClosePlaylistModal = () => {
    setOpenPlaylistModal(false);
  };

  useEffect(() => {
    if (props.open) {
      axios.get(`${URL()}/media/getMyPlaylists/${user.id}`).then(res => {
        const resp = res.data;
        if (resp.success) {
          const data = resp.data;

          if (data.length > 0) {
            setUserPlaylists(data);
            setFilteredPlaylists(data);
          }
        }
      });
    }
  }, [props.open]);

  useEffect(() => {
    if (searchValue !== "") {
      const fitlered = [] as any[];
      userPlaylists.forEach(playlist => {
        if (playlist.Title.toUpperCase().includes(searchValue.toUpperCase())) {
          fitlered.push(playlist);
        }
      });

      setFilteredPlaylists(fitlered);
    } else {
      setFilteredPlaylists(userPlaylists);
    }
  }, [searchValue]);

  /*----------------- CREATE PLAYLIST FUNCTION -------------------*/
  const handleAddToPlaylists = () => {
    let playlistIds = [] as any;
    selectedPlaylists.forEach(playlist => {
      playlistIds.push(playlist.id);
    });

    const body: any = {
      PlaylistIds: playlistIds,
      ChainType: props.chainType,
      MediaId: props.mediaId,
      MediaType: props.mediaType,
      Thumbnail: props.mediaImage,
    };

    axios.post(`${URL()}/media/addToMyPlaylists`, body).then(res => {
      const resp = res.data;
      if (resp.success) {
        setStatus({
          msg: "Request success",
          key: Math.random(),
          variant: "success",
        });
        setTimeout(() => {
          if (props.update) props.update();
          props.handleClose();
          setSelectedPlaylists([]);
          setSearchValue("");
        }, 500);
      }
    });
  };

  /*---------------- CREATE PLAYLIST MODAL COMPONENT--------------*/
  return (
    <Modal open={props.open} onClose={props.handleClose} className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.exit} onClick={props.handleClose}>
          <img src={require("assets/icons/cross_gray.png")} alt={"x"} />
        </div>
        <div className={styles.content}>
          <h2>Add to Playlist</h2>
          <label>
            Search by playlist title
            <div className={styles.searcher}>
              <SearchWithCreate
                searchValue={searchValue}
                handleSearchChange={e => {
                  setSearchValue(e.target.value);
                }}
                searchPlaceholder={`E.g. Pablo Picasso con Capello`}
              />
            </div>
          </label>
          <div className={styles.playLists}>
            {filteredPlaylists.map((playlist, index) => (
              <div
                className={styles.tile}
                key={index}
                onClick={() => {
                  const selectedPlaylistsCopy = [...selectedPlaylists];
                  if (selectedPlaylistsCopy.includes(playlist)) {
                    selectedPlaylistsCopy.splice(selectedPlaylistsCopy.indexOf(playlist), 1);
                  } else {
                    selectedPlaylistsCopy.push(playlist);
                  }

                  setSelectedPlaylists(selectedPlaylistsCopy);
                }}
              >
                <div className={styles.left}>
                  <div className={styles.thumbnails}>
                    {playlist.Thumbnails && playlist.Thumbnails.length > 0 ? (
                      playlist.Thumbnails.map((thumbnail, index) =>
                        playlist.Thumbnails.length === 1 ||
                          (playlist.Thumbnails.length > 1 && playlist.Thumbnails.length <= 3 && index < 2) ||
                          (playlist.Thumbnails.length > 3 && index < 4) ? (
                          <div
                            key={index}
                            className={cls(
                              {
                                [styles.only]: playlist.Thumbnails.length === 1,
                              },
                              {
                                [styles.two]:
                                  playlist.Thumbnails.length > 1 &&
                                  playlist.Thumbnails.length <= 3 &&
                                  index < 2,
                              },
                              {
                                [styles.four]: playlist.Thumbnails.length > 3 && index < 4,
                              }
                            )}
                            style={{
                              backgroundImage:
                                thumbnail && thumbnail !== ""
                                  ? thumbnail.includes("media/getMediaMainPhoto")
                                    ? `url(${URL()}/${thumbnail})`
                                    : `url(${thumbnail})`
                                  : "none",
                              backgroundRepeat: "no-repeat",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          />
                        ) : null
                      )
                    ) : (
                      <div className={styles.only} />
                    )}
                  </div>
                  <div className={styles.column}>
                    <div className={styles.title}>{playlist.Title}</div>
                    <div className={styles.length}>
                      {`${playlist.EthMedias && playlist.PriviMedias
                        ? playlist.EthMedias.length + playlist.PriviMedias.length
                        : 0
                        } Videos`}
                    </div>
                  </div>
                </div>
                <StyledCheckbox
                  checked={selectedPlaylists.includes(playlist) ? true : false}
                  name="checked"
                />
              </div>
            ))}
          </div>
          <div className={styles.buttons}>
            <PrimaryButton size="medium" onClick={handleOpenPlaylistModal}>+ Create</PrimaryButton>
            <PrimaryButton size="medium" onClick={handleAddToPlaylists}>Done</PrimaryButton>
          </div>
        </div>
        {status && (
          <AlertMessage
            key={status.key}
            message={status.msg}
            variant={status.variant}
            onClose={() => setStatus(undefined)}
          />
        )}
        <CreatePlaylistModal
          open={openPlaylistModal}
          handleClose={handleClosePlaylistModal}
          update={props.update}
        />
      </div>
    </Modal>
  );
};

export default AddToPlaylistModal;
