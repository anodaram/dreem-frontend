const randomScalingFactor = function () {
  return Math.round(Math.random() * 50 * (Math.random() > 0.5 ? 1 : 1)) + 50;
};

interface Point {
  x: number;
  y: any
}

const makePoints = (xs: number[], ys: number[], n): Point[] => {
  return xs
    .map((x, i) => {
      return {
        x: new Date(x).getTime() / 1000,
        y: ys[i]
      }
    })
    .reverse()
    .slice(0, n)
    .reverse();
};

const makeLineData = (xs: number[], n): number[] => {
  return xs
    .reverse()
    .slice(0, n)
    .reverse();
};

const makeLabels = (xs: number[], n) => {
  return xs
    .map((x) => new Date(x)
      .toLocaleString("eu",
        {
          day: 'numeric',
          month: 'numeric'
        }))
    .reverse()
    .slice(0, n)
    .reverse();
};

export {
  randomScalingFactor,
  makePoints,
  makeLabels,
  makeLineData
};
