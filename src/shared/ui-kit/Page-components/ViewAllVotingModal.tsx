import React, { useState, useEffect } from "react";
import "./ViewAllVotingModal.css";
import PollItem from "./PollItem";

const ViewAllVotingModal = (props: any) => {
  const [activeVoting, setActiveVoting] = useState<any[]>([]);
  const [oldVoting, setOldVoting] = useState<any[]>([]);

  useEffect(() => {
    let votings = [...props.votings];
    let actives = votings.filter(
      (item) => item.OpenVotation && item.OpenVotation === true
    );
    let old = votings.filter(
      (item) => item.OpenVotation && item.OpenVotation === false
    );
    setActiveVoting(actives);
    setOldVoting(old);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.votings]);

  return (
    <div className="viewAllVoting">
      <div className="exit" onClick={props.onCloseModal}>
        <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
      </div>
      <div className="headerViewAllVoting">{props.title}</div>
      {activeVoting && activeVoting.length > 0 ? (
        <div className="activeVotingRow">
          <div className="subheaderViewAllVoting">{props.openVotingsLabel}</div>
          <div className="rowViewAllVoting">
            {activeVoting && activeVoting.length > 0 ? (
              activeVoting.map((item, index) => {
                return (
                  <div className="pollItemSquare">
                    <PollItem
                      item={item}
                      itemType={props.type}
                      itemId={props.id}
                      onRefreshInfo={() => props.onRefreshInfo()}
                      scrollable={false}
                      noMargin={true}
                      key={`${index}-poll`}
                    />
                  </div>
                );
              })
            ) : (
              <div>No open voting</div>
            )}
          </div>
        </div>
      ) : null}

      <div className="closeVotingsViewAll">
        <div className="subheaderViewAllVoting">{props.closeVotingsLabel}</div>
        <div className="rowViewAllVoting">
          {oldVoting && oldVoting.length > 0 ? (
            oldVoting.map((item, index) => {
              return (
                <div className="pollItemSquare">
                  <PollItem
                    item={item}
                    itemType={props.type}
                    itemId={props.id}
                    onRefreshInfo={() => props.handleRefresh()}
                    scrollable={false}
                    noMargin={true}
                    key={`${index}-poll`}
                  />
                </div>
              );
            })
          ) : (
            <div>No old voting</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewAllVotingModal;
