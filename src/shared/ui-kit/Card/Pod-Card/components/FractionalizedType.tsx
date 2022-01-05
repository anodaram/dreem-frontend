import React from "react";

enum MEDIA_TYPE {
  VIDEO_TYPE = "VIDEO_TYPE",
  LIVE_VIDEO_TYPE = "LIVE_VIDEO_TYPE",
  AUDIO_TYPE = "AUDIO_TYPE",
  LIVE_AUDIO_TYPE = "LIVE_AUDIO_TYPE",
  BLOG_TYPE = "BLOG_TYPE",
  BLOG_SNAP_TYPE = "BLOG_SNAP_TYPE",
  DIGITAL_ART = "DIGITAL_ART_TYPE",
}

const FractionalizedTypeContent = React.memo(({ pod }: any) => {
  return (
    <div className="pod-card-info fractionalized-type">
      <div className="name">{pod.TokenName ? pod.TokenName : ""}</div>
      <div className="media-buttons-owned-by">
        <div className="media-buttons">
          {pod.MediasType && pod.MediasType.length > 0 && (
            <span>
              <img
                src={require(`assets/mediaIcons/small/${
                  pod.MediasType[0] === MEDIA_TYPE.VIDEO_TYPE
                    ? "video"
                    : pod.MediasType[0] === MEDIA_TYPE.LIVE_VIDEO_TYPE
                    ? "video_live"
                    : pod.MediasType[0] === MEDIA_TYPE.AUDIO_TYPE
                    ? "audio"
                    : pod.MediasType[0] === MEDIA_TYPE.LIVE_AUDIO_TYPE
                    ? "audio_live"
                    : pod.MediasType[0] === MEDIA_TYPE.BLOG_TYPE
                    ? "blog"
                    : pod.MediasType[0] === MEDIA_TYPE.BLOG_SNAP_TYPE
                    ? "blog_snap"
                    : "digital_art"
                }.png`)}
                alt={pod.MediasType[0]}
              />
              {pod.MediasType[0] === MEDIA_TYPE.VIDEO_TYPE
                ? "Video"
                : pod.MediasType[0] === MEDIA_TYPE.LIVE_VIDEO_TYPE
                ? "Live Video"
                : pod.MediasType[0] === MEDIA_TYPE.AUDIO_TYPE
                ? "Audio"
                : pod.MediasType[0] === MEDIA_TYPE.LIVE_AUDIO_TYPE
                ? "Audio Live"
                : pod.MediasType[0] === MEDIA_TYPE.BLOG_TYPE
                ? "Blog"
                : pod.MediasType[0] === MEDIA_TYPE.BLOG_SNAP_TYPE
                ? "Blog Snap"
                : "Digital Art"}
            </span>
          )}
        </div>
        <div className="investors">
          <span>Investors</span>
          <p>{pod.Investors ? pod.Investors.length : 0}</p>
        </div>
      </div>
      <div className="main-info">
        <div>
          <span>Interest Rate</span>
          <p>{pod.InvestorDividend ? `${pod.InvestorDividend * 100}%` : "0%"}</p>
        </div>
        <div className="invest-info">
          <span>Buy-back</span>
          <p>ETH {pod.MaxPrice ? pod.MaxPrice : 0}</p>
        </div>
      </div>
      <div className="price-info">
        <span>Price</span>
        <p>ETH {pod.MaxPrice ? pod.MaxPrice : 0}</p>
        <span className="percentage-info">($)/per 0% fraction</span>
      </div>
    </div>
  );
});

export default FractionalizedTypeContent;
