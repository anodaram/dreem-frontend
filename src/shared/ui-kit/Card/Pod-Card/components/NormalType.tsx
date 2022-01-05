import React from "react";
import { useHistory } from "react-router-dom";

enum MEDIA_TYPE {
  VIDEO_TYPE = "VIDEO_TYPE",
  LIVE_VIDEO_TYPE = "LIVE_VIDEO_TYPE",
  AUDIO_TYPE = "AUDIO_TYPE",
  LIVE_AUDIO_TYPE = "LIVE_AUDIO_TYPE",
  BLOG_TYPE = "BLOG_TYPE",
  BLOG_SNAP_TYPE = "BLOG_SNAP_TYPE",
  DIGITAL_ART = "DIGITAL_ART_TYPE",
}

const NormalTypeContent = React.memo(
  ({ pod, disableClick, type }: any) => {
    const history = useHistory();

    return (
      <div
        className="pod-card-info"
        onClick={() => {
          if (!disableClick) {
            if (type === "Digital-NFT") {
              history.push(`/pods/MediaNFT/${pod.PodAddress}`);
            } else {
              if (type.includes("NFT")) {
                history.push(`/pods/MediaNFT/${pod.PodAddress}`);
              } else {
                history.push(`/pods/FT/${pod.PodAddress}`);
              }
            }
          }
        }}
      >
        <div className="name">{pod.Name ?? pod.TokenName ?? ""}</div>
        {pod.MediasType && pod.MediasType.length > 0 && (
          <div className="media-buttons">
            {pod.MediasType.filter((_, index) => index < 2).map((mediaType, index) => (
              <span key={index}>
                <img
                  src={require(`assets/mediaIcons/small/${
                    mediaType === MEDIA_TYPE.VIDEO_TYPE
                      ? "video"
                      : mediaType === MEDIA_TYPE.LIVE_VIDEO_TYPE
                      ? "video_live"
                      : mediaType === MEDIA_TYPE.AUDIO_TYPE
                      ? "audio"
                      : mediaType === MEDIA_TYPE.LIVE_AUDIO_TYPE
                      ? "audio_live"
                      : mediaType === MEDIA_TYPE.BLOG_TYPE
                      ? "blog"
                      : mediaType === MEDIA_TYPE.BLOG_SNAP_TYPE
                      ? "blog_snap"
                      : "digital_art"
                  }.png`)}
                  alt={mediaType}
                />
                {mediaType === MEDIA_TYPE.VIDEO_TYPE
                  ? "Video"
                  : mediaType === MEDIA_TYPE.LIVE_VIDEO_TYPE
                  ? "Live Video"
                  : mediaType === MEDIA_TYPE.AUDIO_TYPE
                  ? "Audio"
                  : mediaType === MEDIA_TYPE.LIVE_AUDIO_TYPE
                  ? "Audio Live"
                  : mediaType === MEDIA_TYPE.BLOG_TYPE
                  ? "Blog"
                  : mediaType === MEDIA_TYPE.BLOG_SNAP_TYPE
                  ? "Blog Snap"
                  : "Digital Art"}
              </span>
            ))}
            {pod.MediasType.length > 2 && <b>and {pod.MediasType.length - 2} more</b>}
          </div>
        )}
        <div className="main-info">
          <div>
            <span>Price</span>
            <p>ECH {pod.MaxPrice || 0}</p>
          </div>
          <div>
            <span>👓 Views</span>
            <p>{pod.TotalViews || 0}</p>
          </div>
          <div className="invest-info">
            <span>Investors</span>
            <p>{pod.Investors ? pod.Investors.length : 0}</p>
            <span>Investors share</span>
            <p>{pod.InvestorDividend ? `${pod.InvestorDividend * 100}%` : "0%"}</p>
          </div>
        </div>
      </div>
    );
  },
  (prevPros, nextProps) => {
    return (
      prevPros.type === nextProps.type &&
      prevPros.disableClick === nextProps.disableClick &&
      prevPros.pod === nextProps.pod
    );
  }
);

export default NormalTypeContent;
