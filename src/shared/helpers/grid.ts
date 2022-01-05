export const gridColumnCount = () => {
  const width = window.innerWidth;
  if (width < 800) {
    return 1;
  } else if (width < 1200) {
    return 2;
  } else if (width < 1440) {
    return 3;
  } else {
    return 4;
  }
};
