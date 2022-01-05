import { Chart } from "chart.js";

Chart.plugins.register({
  afterDatasetsDraw: function (chart) {
    let chart_type = chart.config.type;
    if (
      chart.tooltip._active &&
      chart.tooltip._active.length &&
      chart_type === "line"
    ) {
      var activePoint = chart.tooltip._active[0],
        ctx = chart.chart.ctx,
        y_axis = chart.scales["y-axis-0"],
        x = activePoint.tooltipPosition().x,
        y = activePoint.tooltipPosition().y,
        bottomY = y_axis.bottom;

      // draw line
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, bottomY + 1);
      ctx.setLineDash([2, 3]);
      ctx.lineWidth = 1;
      //ctx.strokeStyle = "#9d9d9d";
      ctx.stroke();
      ctx.restore();
    }
  },
  afterUpdate: function (chart, options) {
    chart.chartArea.top = 0;
    var dataset = chart.config.data.datasets[0];
    var yOffset = 0;

    // for (var i = 0; i < dataset.data.length; i++) {
    //   for (var key in dataset._meta) {
    //     if (dataset._meta[key].data.length > 0) {
    //       var model = dataset._meta[key].data[i]._model;
    //       model.y += yOffset;
    //       model.controlPointNextY += yOffset;
    //       model.controlPointPreviousY += yOffset;
    //     }
    //   }
    // }
  },
});
