const ANIMATED_LINE_CHART_PLAYERS_COUNT = 10;
const ANIMATED_LINE_CHART_DATA_COUNT = 100;
const ANIMATED_LINE_CHART_SMOOTHNESS = 20;
const ANIMATED_LINE_CHART_ANIMATION_DURATION = 5000;

const animatedLineChartDataPointsCounts = [];

for (let i = 0; i < ANIMATED_LINE_CHART_PLAYERS_COUNT; i++) {
  animatedLineChartDataPointsCounts.push(Math.floor(Math.random() * (ANIMATED_LINE_CHART_DATA_COUNT - 1)) + ANIMATED_LINE_CHART_DATA_COUNT / 4);
}

const animatedLineChartHighestDataPointsCount = Math.max(...animatedLineChartDataPointsCounts);
const animatedLineChartAllDates = randomDates(animatedLineChartHighestDataPointsCount);
const animatedLineChartDataPoints = [];

for (let i = 0; i < animatedLineChartDataPointsCounts.length; i++) {
  const data = randomNumbers(animatedLineChartDataPointsCounts[i], ANIMATED_LINE_CHART_SMOOTHNESS);
  animatedLineChartDataPoints.push(data.map((value, index) => {
    return {
      x: animatedLineChartAllDates[index],
      y: value,
    };
  }));
}

const animatedLineChartDatasets = [];

for (let i = 0; i < ANIMATED_LINE_CHART_PLAYERS_COUNT; i++) {
  animatedLineChartDatasets.push({
    label: PLAYER_NAMES[i],
    data: animatedLineChartDataPoints[i],
    backgroundColor: `${HIGH_CONTRAST_COLORS[i]}10`,
    borderColor: HIGH_CONTRAST_COLORS[i],
    pointBackgroundColor: HIGH_CONTRAST_COLORS[i],
    fill: true,
    // tension: 0,
  });
}

const animatedLineChartData = {
  labels: animatedLineChartAllDates.map(date => date.toLocaleDateString()),
  datasets: animatedLineChartDatasets,
};

const animatedLineChartDelayBetweenPoints = ANIMATED_LINE_CHART_ANIMATION_DURATION / animatedLineChartHighestDataPointsCount;
const animatedLineChartAnimation = {
  x: {
    type: 'number',
    easing: 'linear',
    duration: animatedLineChartDelayBetweenPoints,
    from: NaN, // the point is initially skipped
    delay(ctx) {
      if (ctx.type !== 'data' || ctx.xStarted) {
        return 0;
      }
      ctx.xStarted = true;
      return ctx.index * animatedLineChartDelayBetweenPoints;
    }
  },
  y: {
    type: 'number',
    easing: 'linear',
    duration: animatedLineChartDelayBetweenPoints,
    from: (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y,
    delay(ctx) {
      if (ctx.type !== 'data' || ctx.yStarted) {
        return 0;
      }
      ctx.yStarted = true;
      return ctx.index * animatedLineChartDelayBetweenPoints;
    }
  }
};

const animatedLineChartConfig = {
  type: 'line',
  data: animatedLineChartData,
  options: {
    animation: animatedLineChartAnimation,
    responsive: true,
    aspectRatio: IS_MOBILE ? 1 : 2,
    maintainAspectRatio: true,
    color: "white",
    elements: {
      point: {
        radius: IS_MOBILE ? 0.5 : 2,
        hitRadius: IS_MOBILE ? 1 : 3,
      },
      line: {
        tension: 0,
        borderWidth: IS_MOBILE ? 1 : 1,
      }
    },
    plugins: {
      custom_plugin_move_chart: false,
      custom_plugin_racing_chart: false,
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            color: "white"
          }
        }
      },
      title: {
        display: true,
        text: 'Animated Line Chart',
        color: "white",
        font: {
          size: 20,
          weight: 'bold'
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
          borderColor: "rgba(255, 255, 255, 0.15)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.5)",
        }
      },
      y: {
        display: true,
        beginAtZero: true,
        grace: "5%",
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
          borderColor: "rgba(255, 255, 255, 0.15)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 1)",
        }
      }
    }
  },
};

const animatedLineChartCanvas = document.getElementById('animated-line-chart');

let animatedLineChart = new Chart(animatedLineChartCanvas, animatedLineChartConfig);

const animatedLineChartBtn = document.getElementById('animated-line-chart-btn');

animatedLineChartBtn.addEventListener('click', () => {
  animatedLineChart.destroy();
  animatedLineChart = new Chart(animatedLineChartCanvas, animatedLineChartConfig);
});
