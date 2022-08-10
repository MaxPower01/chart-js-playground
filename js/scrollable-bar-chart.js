const SCROLLABLE_BAR_CHART_LABELS = ["2010-2011", "2011-2012", "2012-2013", "2013-2014", "2014-2015", "2015-2016", "2016-2017", "2017-2018", "2018-2019", "2019-2020", "2020-2021", "2021-2022", "2022-2023"];
const SCROLLABLE_BAR_CHART_MAX_X_TICKS = 4;
const SCROLLABLE_BAR_CHART_DELAY_BETWEEN_POINTS = 300;

const scollableBarChartLabelsCount = SCROLLABLE_BAR_CHART_LABELS.length;

const scollableBarChartData = {
  labels: SCROLLABLE_BAR_CHART_LABELS,
  datasets: [{
      label: PLAYER_NAMES[0],
      data: randomNumbers(scollableBarChartLabelsCount, 0, 25, 100),
      backgroundColor: `${HIGH_CONTRAST_COLORS[0]}50`,
      borderColor: HIGH_CONTRAST_COLORS[0],
      fill: true,
      borderWidth: 1,
      borderRadius: IS_MOBILE ? 5 : 5
    },
    {
      label: PLAYER_NAMES[1],
      data: randomNumbers(scollableBarChartLabelsCount, 0, 25, 100),
      backgroundColor: `${HIGH_CONTRAST_COLORS[1]}50`,
      borderColor: HIGH_CONTRAST_COLORS[1],
      fill: true,
      borderWidth: 1,
      borderRadius: IS_MOBILE ? 5 : 5
    }
  ]
};

let scollableBarChartDelayed;

const scollableBarChartConfig = {
  type: 'bar',
  data: scollableBarChartData,
  options: {
    layout: {
      padding: {
        right: 16
      }
    },
    animation: {
      onComplete: () => {
        scollableBarChartDelayed = true;
      },
      delay: (context) => {
        let delay = 0;
        if (context.type === 'data' && context.mode === 'default' && !scollableBarChartDelayed) {
          delay = context.dataIndex * SCROLLABLE_BAR_CHART_DELAY_BETWEEN_POINTS + context.datasetIndex * SCROLLABLE_BAR_CHART_DELAY_BETWEEN_POINTS / 3;
        }
        return delay;
      },
    },
    aspectRatio: IS_MOBILE ? 1 : 2,
    maintainAspectRatio: true,
    responsive: true,
    color: "white",
    plugins: {
      custom_plugin_racing_chart: false,
      legend: {
        position: 'top',
        labels: {
          font: {
            color: "white"
          }
        }
      },
      title: {
        display: true,
        text: 'Scrollable Bar Chart',
        color: "white",
        font: {
          size: 20,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              const value = context.parsed.y;
              label += value.toFixed(2) + '%';
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        min: 0,
        max: SCROLLABLE_BAR_CHART_MAX_X_TICKS,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
          borderColor: "rgba(255, 255, 255, 0.15)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 1)",
        }
      },
      y: {
        display: true,
        beginAtZero: true,
        max: 100,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
          borderColor: "rgba(255, 255, 255, 0.15)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.75)",
          callback: function (value, index, ticks) {
            return value + "%";
          }
        }
      }
    }
  },
};

let scollableBarChart = new Chart(document.getElementById('scrollable-bar-chart'), scollableBarChartConfig);

function moveScroll() {
  const {
    ctx,
    canvas,
    chartArea: {
      left,
      right,
      top,
      bottom,
      width,
      height
    }
  } = scollableBarChart;
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const isInLeftCircle = x >= left - 15 && x <= left + 15 && y >= height / 2 + top - 15 && y <= height / 2 + top + 15;
    const isInRightCircle = x >= right - 15 && x <= right + 15 && y >= height / 2 + top - 15 && y <= height / 2 + top + 15;
    if (isInLeftCircle) {
      scollableBarChart.options.scales.x.min = Number(scollableBarChart.options.scales.x.min) - 1;
      scollableBarChart.options.scales.x.max = scollableBarChart.options.scales.x.min + SCROLLABLE_BAR_CHART_MAX_X_TICKS;
      if (scollableBarChart.options.scales.x.min < 0) { 
        scollableBarChart.options.scales.x.min = 0;
        scollableBarChart.options.scales.x.max = SCROLLABLE_BAR_CHART_MAX_X_TICKS;
      }
      scollableBarChart.update("active");
    } else if (isInRightCircle) {
      scollableBarChart.options.scales.x.min = Number(scollableBarChart.options.scales.x.min) + 1;
      scollableBarChart.options.scales.x.max = Number(scollableBarChart.options.scales.x.max) + 1;
      if (scollableBarChart.options.scales.x.max >= SCROLLABLE_BAR_CHART_LABELS.length) {
        scollableBarChart.options.scales.x.min = SCROLLABLE_BAR_CHART_LABELS.length - SCROLLABLE_BAR_CHART_MAX_X_TICKS - 1;
        scollableBarChart.options.scales.x.max = SCROLLABLE_BAR_CHART_LABELS.length;
      }
      scollableBarChart.update("active");
    }
  });
};
scollableBarChart.ctx.onclick = moveScroll();
