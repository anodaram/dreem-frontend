import React, { useEffect } from "react";
import { Chart } from "chart.js";
import "./Chart-Plugin";

const PrintChart = ({ config, canvasHeight = 0 }) => {
  const chartRef = React.createRef<HTMLCanvasElement>();
  const [chart, setChart] = React.useState<any>(null);

  useEffect(() => {
    let el = chartRef.current as HTMLCanvasElement;
    let myChartRef = el.getContext("2d") as CanvasRenderingContext2D;

    if (chart) {
      Object.keys(config).forEach((key) => {
        chart[key] = config[key];
      });
      if (config.configurer !== undefined) {
        config.configurer(config.config, myChartRef);
      }
      chart.update();
    } else {
      if (config.configurer !== undefined) {
        setChart(
          new Chart(myChartRef, config.configurer(config.config, myChartRef))
        );
      } else {
        setChart(new Chart(myChartRef, config.config));
      }
    }
  }, [config]);

  return (
    <canvas ref={chartRef} height={canvasHeight > 0 ? canvasHeight : "100%"} />
  );
};

export default PrintChart;
