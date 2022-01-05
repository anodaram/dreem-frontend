import React, { useRef } from 'react';
import './Hashtags.css';

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as CloseSolid } from "assets/icons/close-solid.svg";
const plusWhiteIcon = require('assets/icons/plus_white.png');
const infoIcon = require('assets/icons/info_icon.png');

const Hashtags = (props: any) => {
  const CreateHashtagButton = (p) => {
    const inputRef: any = useRef([]);

    return (
      <div>
        {p.addHashtag ? (
          <div className="createHashtagButtonInput">
            <input
              className="createHashtagInput"
              onChange={(elem) => {
                let value = elem.target.value;
                p.setterHashtag(value);
              }}
              ref={(el) => (inputRef.current[p.index] = el)}
              type="text"
              value={p.hashtag}
              placeholder="hashtag..."
            />
            <button
              className="addHashtagButton"
              onClick={(e: any) => {
                if (p.hashtag && p.hashtag !== '') {
                  e.preventDefault();
                  let hashtagsArray = [...p.hashtags];
                  hashtagsArray.push('#' + p.hashtag);
                  p.setterHashtags(hashtagsArray);
                  p.setterHashtag('');
                  p.setterAddHashtag(false);
                }
              }}
            >
              <img
                className="createHashtagButtonIcon"
                src={plusWhiteIcon}
                alt={'plus'}
              />
            </button>
          </div>
        ) : (
          <AddHashtagButton function={() => p.setterAddHashtag(true)} />
        )}
      </div>
    );
  };

  const HashtagLabel = (propsFunction) => {
    return (
      <div
        className={
          propsFunction.main ? 'hashtagLabel hashtagLabelMain' : 'hashtagLabel'
        }
      >
        {propsFunction.main ? (
          <div className="mainHashtagLabel">MAIN</div>
        ) : null}
        <div></div>
        <div>{propsFunction.value}</div>
        <button
          className="addHashtagButton"
          onClick={(e: any) => {
            //add collateral and update collaterals list
            e.preventDefault();
            let hashtagsCopy = [...props.hashtags];
            hashtagsCopy.splice(propsFunction.index, 1);
            props.setterHashtags(hashtagsCopy);
          }}
        >
          <SvgIcon>
            <CloseSolid />
          </SvgIcon>
        </button>
      </div>
    );
  };

  const AddHashtagButton = (propsFunction: any) => {
    return (
      <div className="createHashtagButton" onClick={propsFunction.function}>
        <img
          className="createHashtagButtonIcon"
          src={plusWhiteIcon}
          alt={'plus'}
        />
      </div>
    );
  };

  return (
    <div>
      <div className="flexRowInputs">
        <div className="infoHeaderCreatePod">Hashtags</div>
        <img className="infoIconCreatePod" src={infoIcon} alt={'info'} />
      </div>
      <div className="hashtagsRowCreatePod">
        {props.hashtags && props.hashtags.length ? (
          <div className="flexRowInputs">
            {props.hashtags.map((hashtag, i) => {
              if (i === 0) {
                return (
                  <HashtagLabel key={i} value={hashtag} index={i} main={true} />
                );
              } else {
                return (
                  <HashtagLabel
                    key={i}
                    value={hashtag}
                    index={i}
                    main={false}
                  />
                );
              }
            })}
          </div>
        ) : null}

        {CreateHashtagButton(props)}
      </div>
    </div>
  );
};

export default Hashtags;
