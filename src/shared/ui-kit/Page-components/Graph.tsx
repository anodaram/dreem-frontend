import React, { useState, useEffect } from "react";
import PrintChart from "shared/ui-kit/Chart/Chart";
import "./Graph.css";

const Graph = React.memo((props: any) => {
  const [data, setData] = useState<any>();

  const months = ["Jan", "Feb", "March", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

  useEffect(() => {
    if (props.data) {
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data]);

  const getData = () => {
    //sort info list to be sure everything is o.k
    let labels: any[] = [];
    const graphData: any[] = [];

    if ((!props.data.data2 || props.data.data2.length <= 0) && props.data.length > 0) {
      // case only 1 data
      const d = [...props.data];
      const newData: any[] = [];
      d.map(item => {
        if (!newData.find(newItem => newItem.x === item.x)) {
          newData.push(item);
        }
      });
      newData.sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime());

      graphData.push({
        type: "line",
        data: newData.map(item => item.y),
        fill: true,
        backgroundColor: "#46D2ED",
        borderColor: "#46D2ED",
        lineTension: 0,
      });
      labels = newData.map(item => item.x);
    } else if (
      props.data.data1 &&
      props.data.data1.length > 0 &&
      props.data.data2 &&
      props.data.data2.length > 0
    ) {
      // case 2 datas
      const data1 = [...props.data.data1];
      const newData1: any[] = [];
      data1.map(item => {
        if (!newData1.find(newItem => newItem.x === item.x)) {
          newData1.push(item);
        }
      });
      newData1.sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime());

      graphData.push({
        type: "line",
        data: newData1.map(item => item.y),
        fill: true,
        backgroundColor: "#46D2ED",
        borderColor: "#46D2ED",
        lineTension: 0,
      });
      labels = newData1.map(item => item.x);

      const data2 = [...props.data.data2];
      const newData2: any[] = [];
      data2.map(item => {
        if (!newData2.find(newItem => newItem.x === item.x)) {
          newData2.push(item);
        }
      });
      newData2.sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime());

      graphData.push({
        type: "line",
        data: newData2.map(item => item.y),
        fill: true,
        backgroundColor: "#E36E6E",
        borderColor: "#E36E6E",
        lineTension: 0,
      });
      labels = [...labels, ...newData2.map(item => item.x)];

      //+ case 3 datas
      if (props.data.data3 && props.data.data3.length > 0) {
        const data3 = [...props.data.data3];
        const newData3: any[] = [];
        data3.map(item => {
          if (!newData3.find(newItem => newItem.x === item.x)) {
            newData3.push(item);
          }
        });
        newData3.sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime());

        graphData.push({
          type: "line",
          data: newData3.map(item => item.y),
          fill: true,
          backgroundColor: "#64C89E",
          borderColor: "#64C89E",
          lineTension: 0,
        });
        labels = [...labels, ...newData3.map(item => item.x)];
      }
    }

    labels = [...new Set(labels)];
    labels.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    setData({ graphData: graphData, labels: labels });
  };

  return (
    <div className="pod-graph" style={{ alignItems: "center", display: "flex" }}>
      {data && (
        <PrintChart
          config={{
            config: {
              data: {
                labels: data.labels.map(
                  item => `${months[new Date(item).getUTCMonth()]} ${new Date(item).getUTCDate()}`
                ),
                datasets: data.graphData,
              },

              options: {
                responsive: true,
                maintainAspectRatio: false,
                chartArea: {
                  backgroundColor: "#F7F9FECC",
                },
                elements: {
                  point: {
                    radius: 0,
                    hitRadius: 5,
                    hoverRadius: 5,
                  },
                },

                legend: {
                  display: false,
                },

                layout: {
                  padding: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                  },
                },

                scales: {
                  xAxes: [
                    {
                      display: true,
                      gridLines: {
                        color: "#ffffff00",
                        zeroLineColor: "transparent",
                      },
                      ticks: {
                        beginAtZero: true,
                        fontColor: "grey",
                        fontSize: 8,
                        fontFamily: "Agrandir",
                      },
                    },
                  ],
                  yAxes: [
                    {
                      display: false,
                    },
                  ],
                },

                tooltips: {
                  mode: "label",
                  intersect: false,
                  callbacks: {
                    //This removes the tooltip title
                    title: function () {},
                    label: function (tooltipItem, data) {
                      return `${tooltipItem.yLabel.toFixed(4)}`;
                    },
                  },
                  //this removes legend color
                  displayColors: false,
                  yPadding: 10,
                  xPadding: 10,
                  position: "nearest",
                  caretSize: 10,
                  backgroundColor: "rgba(255,255,255,0.9)",
                  bodyFontSize: 15,
                  bodyFontColor: "#303030",
                },
              },
            },
            configurer: (config: any, ref: CanvasRenderingContext2D): object => {
              if (config.data.datasets.length > 0) {
                let gradient = ref.createLinearGradient(0, 0, 0, ref.canvas.clientHeight);
                gradient.addColorStop(0, "#46D2EDFF");
                gradient.addColorStop(1, "#46D2ED00");
                config.data.datasets[0].backgroundColor = gradient;
              }
              if (config.data.datasets.length > 1) {
                let gradient = ref.createLinearGradient(0, 0, 0, ref.canvas.clientHeight);
                gradient.addColorStop(0, "#E36E6EFF");
                gradient.addColorStop(1, "#E36E6E00");
                config.data.datasets[1].backgroundColor = gradient;
              }
              if (config.data.datasets.length > 2) {
                let gradient = ref.createLinearGradient(0, 0, 0, ref.canvas.clientHeight);
                gradient.addColorStop(0, "#64C89EFF");
                gradient.addColorStop(1, "#64C89E00");
                config.data.datasets[1].backgroundColor = gradient;
              }

              return config;
            },
          }}
          canvasHeight={150}
        />
      )}
    </div>
  );
});

export default Graph;
