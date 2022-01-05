import * as React from "react";
import { AutoSizer, CellMeasurer, CellMeasurerCache, Masonry, WindowScroller } from "react-virtualized";
import createCellPositioner from "./createCellPositioner";
import MediaCard from "shared/ui-kit/Card/MediaCard";

import styled from "styled-components";
import { CircularLoadingIndicator } from "shared/ui-kit";
import PodCard from "shared/ui-kit/Card/Pod-Card";
import ClaimablePodCard from "shared/ui-kit/Card/Pod-Claimable-Card";
import CommunityCard from "shared/ui-kit/Card/CommunityCard";
import AcquisitionCard from "shared/ui-kit/Card/AcquisitionCard";
import DAOCard from "shared/ui-kit/Card/DAOCard";

export const VirtualizedMasnory = ({
  list,
  loadMore,
  hasMore,
  triggerPlaylists = false,
  scrollElement,
  type = "media",
  podType = 0,
  disableClick = false,
  itemRender,
  isList = false,
}) => {
  const currentScrollTop = React.useRef<number>(0);
  const columnCount = React.useRef<number>(4);
  const cache = React.useRef<CellMeasurerCache>(
    new CellMeasurerCache({
      defaultHeight: 250,
      defaultWidth: 280,
      fixedWidth: true,
    })
  );
  const masonry = React.useRef<any>();
  const columnWidth = React.useRef<number>(280);
  const heightRef = React.useRef<number>(300);
  // const [height, setHeight] = React.useState<number>(300);
  const gutterSize = React.useRef<number>(20);
  const overscanByPixels = React.useRef<number>(20);
  const cellPositioner = React.useRef<any>(
    createCellPositioner({
      cellMeasurerCache: cache.current,
      columnCount: columnCount.current,
      columnWidth: columnWidth.current,
      spacer: gutterSize.current,
    })
  );

  React.useEffect(() => {
    cache.current.clearAll();
    resetCellPositioner();
    masonry.current.clearCellPositions();
  }, [podType]);

  React.useEffect(() => {
    if (list && list.length === 0) {
      cache.current.clearAll();
      resetCellPositioner();
      masonry.current.clearCellPositions();
    }
  }, [list]);

  const getCard = (datum: any, index: number) => {
    if (itemRender) {
      return itemRender(datum, index);
    }
    if (type === "media") {
      return (
        <MediaCard
          media={datum.media}
          dimensions={datum.dimensions}
          key={`${index}-card`}
          triggerPlaylists={triggerPlaylists}
        />
      );
    }
    if (type === "pod") {
      if (podType === 0) {
        return (
          <PodCard
            pod={datum}
            type={
              "Digital-NFT"
              //podType === 1 ? "Digital-NFT" : podType === 2 ? "FT" : "Physical-NFT"
            }
            key={`${datum.PodAddress}${"Digital-NFT"
              //podType === 1 ? "Digital-NFT" : podType === 2 ? "FT" : "Physical-NFT"
              }`}
            disableClick={disableClick}
          />
        );
      } else {
        return <ClaimablePodCard trending={false} key={`${index}-claimable-card`} media={datum} />;
      }
    }
    if (type === "community") {
      return (
        <CommunityCard
          community={datum}
          key={`${index}-community-card`}
          disableClick={disableClick}
          dimensions={datum.dimensions}
        />
      );
    }
    if (type === "acquisition") {
      return <AcquisitionCard data={datum} key={`${index}-acquisition`} />;
    }
    if (type === "DAO") {
      return <DAOCard item={datum} heightFixed={false} key={`${index}-DAO`} />;
    }
  };

  const calculateColumnCount = width => {
    if (width < 485 || isList) {
      columnCount.current = 1;
    } else if (width < 820) {
      columnCount.current = 2;
    } else if (width < 1200) {
      columnCount.current = 3;
    } else {
      columnCount.current = 4;
    }

    columnWidth.current = (width - (columnCount.current - 1) * gutterSize.current) / columnCount.current;
  };

  const cellRenderer = ({ index, key, parent, style }) => {
    const datum = list[index % list.length];

    if (datum) {
      return (
        <CellMeasurer cache={cache.current} index={index} key={key} parent={parent}>
          {({ registerChild }) => (
            <div
              ref={registerChild}
              style={{
                ...style,
                width: columnWidth.current,
                padding: "4px",
              }}
            >
              {getCard(datum, index)}
            </div>
          )}
        </CellMeasurer>
      );
    }
  };

  const resetCellPositioner = () => {
    if (cellPositioner.current) {
      cellPositioner.current.reset({
        columnCount: columnCount.current,
        columnWidth: columnWidth.current,
        spacer: gutterSize.current,
      });
    }
  };

  const setMasonryRef = ref => {
    masonry.current = ref;
  };

  const onResize = ({ width }) => {
    calculateColumnCount(width);
    cache.current.clearAll();
    resetCellPositioner();
    masonry.current.clearCellPositions();
  };

  const renderAutoSizer = ({ height, scrollTop }) => {
    // setHeight(height);
    heightRef.current = height;
    currentScrollTop.current = scrollTop;

    return (
      <AutoSizer disableHeight height={height} onResize={onResize}>
        {renderMasonry}
      </AutoSizer>
    );
  };

  const onScroll = props => {
    if (hasMore && scrollElement.clientHeight + scrollElement.scrollTop >= scrollElement.scrollHeight - 150) {
      loadMore();
    }
    currentScrollTop.current = props.scrollTop;
  };

  const renderMasonry = ({ width }) => {
    return (
      <Masonry
        autoHeight={true}
        cellCount={list.length}
        cellMeasurerCache={cache.current}
        cellPositioner={cellPositioner.current}
        cellRenderer={cellRenderer}
        height={heightRef.current || 300}
        overscanByPixels={overscanByPixels.current}
        ref={setMasonryRef}
        scrollTop={currentScrollTop.current}
        width={width}
      />
    );
  };

  return (
    <React.Fragment>
      <WindowScroller
        overscanByPixels={overscanByPixels.current}
        scrollElement={scrollElement}
        onScroll={onScroll}
      >
        {renderAutoSizer}
      </WindowScroller>
      {hasMore && (
        <LoadingIndicatorWrapper>
          <CircularLoadingIndicator />
        </LoadingIndicatorWrapper>
      )}
    </React.Fragment>
  );
};

const LoadingIndicatorWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 50px;
`;
