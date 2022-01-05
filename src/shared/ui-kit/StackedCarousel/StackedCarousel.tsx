import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import andgleLeftIcon from 'assets/icons/arrow-left-small.svg';

const StyledStackedCarousel = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
`;

const StackedPlanCard = styled.div<{count: number, index: number, zIndex: any}>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${props => props.count > 1 ? `calc(${props.index} * ((100% - 100px) / ${props.count - 1}))` : 0};
  z-index: ${props => props.zIndex || 0};
  ${props => (props.count === 1) && `
    left: 50%;
    transform: translate(-50%, 0);
  `}
`;

const SlideButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  z-index: 100;
  transform: translate(0, -50%);
  background: #FFFFFF;
  border: 1.5px solid rgba(113, 112, 130, 0.3);
  box-sizing: border-box;
  user-select: none;

  &:hover {
    box-shadow: 0px 7px 40px rgba(0, 0, 0, 0.15),
    0px 0px 4px rgba(130, 136, 148, 0.16), 0px 0px 2px rgba(130, 136, 148, 0.08);
  }

  &.prev {
    left: -12px;
    transform: translate(0, -50%) rotate(-180deg);
  }
  &.next {
    right: -12px;
  }
`;

const ImageContent = styled.img<{borderColor: string}>`
  width: 100px;
  height: 100px;
  border: ${props => `2px solid ${props.borderColor}`};
  border-radius: 4px;
`;

const BORDER_COLOR = {
  claimable: '#24C1A3',
  music: '#6398ff',
  video: '#d763ff',
  digitalArt: '#ff50c4'
}

export const StackedCarousel = props => {
  const { items, type } = props;
  const count = items.length;
  const [showPrevBtn, setShowPrevBtn] = useState(false);
  const [showNextBtn, setShowNextBtn] = useState(false);
  const [selectedItem, setSelectedItem] = useState(items[count - 1]);
  const selectedIndex = items.findIndex((item) => item.id === selectedItem.id);
  const zIndex = (index) => {
    if (selectedIndex < 0) return 0;
    return index <= selectedIndex ? count : count - index;
  };

  const moveToNext = (direction) => {
    let next;
    if (selectedIndex < 0) {
      next = items[count - 1];
    } else {
      next = direction > 0 ? items[selectedIndex + 1] : items[selectedIndex - 1];
    }
    setSelectedItem(next);
  };

  useEffect(() => {
    if ( count === 1 ) {
      setShowPrevBtn(false);
      setShowNextBtn(false);
    } else if (selectedIndex < 0) {
      setShowPrevBtn(false);
      setShowNextBtn(true);
    } else if (selectedIndex === 0) {
      setShowPrevBtn(true);
      setShowNextBtn(false);
    } else if (selectedIndex === count - 1) {
      setShowPrevBtn(false);
      setShowNextBtn(true);
    } else {
      setShowPrevBtn(true);
      setShowNextBtn(true);
    }
  }, [count, selectedIndex]);

  if (count === 0)
    return <div />;

  return (
    <StyledStackedCarousel>
      {
        items.map((item, index) => {
          return (
            <StackedPlanCard key={item.id} index={index} count={count} zIndex={() => zIndex(index)} >
              <ImageContent src={item.image} alt="img" borderColor={BORDER_COLOR[type]}/>
            </StackedPlanCard>
          );
        })
      }
      {showPrevBtn && <SlideButton className="prev" onClick={() => moveToNext(1)}>
        <img src={andgleLeftIcon} width={24} height={24} alt="Next" />
      </SlideButton>}
      {showNextBtn && <SlideButton className="next" onClick={() => moveToNext(-1)}>
        <img src={andgleLeftIcon} width={24} height={24} alt="Next" />
      </SlideButton>}
    </StyledStackedCarousel>
  );
};
