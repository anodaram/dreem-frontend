export function getOperatingSystem(window: Window) {
  let operatingSystem = "Not known";
  if (window.navigator.appVersion.indexOf("Win") !== -1) {
    operatingSystem = "Windows";
  }
  if (window.navigator.appVersion.indexOf("Mac") !== -1) {
    operatingSystem = "Mac";
  }
  if (window.navigator.appVersion.indexOf("X11") !== -1) {
    operatingSystem = "UNIX";
  }
  if (window.navigator.appVersion.indexOf("Linux") !== -1) {
    operatingSystem = "Linux";
  }

  return operatingSystem;
}
