const PLAYER_COUNT_3 = 10;
const MAX_DATA_COUNT_3 = 100;
const SMOOTHNESS_3 = 1;
const dataCount_3 = [];
for (let i = 0; i < PLAYER_COUNT_3; i++) {
  dataCount_3.push(Math.floor(Math.random() * (MAX_DATA_COUNT_3 - 1)) + MAX_DATA_COUNT_3 / 4);
}

const highestDataCount3 = Math.max(...dataCount_3);

const REFRESH_DELAY_3 = 250;
const TOTAL_REFRESH_COUNT_3 = 100;
let refreshCount3 = 0;

const labels3 = PLAYER_NAMES.slice(0, PLAYER_COUNT_3);
const data3 = randomNumbers(PLAYER_COUNT_3, SMOOTHNESS_3, 100, 1000).map((value, index) => value.toFixed(0));
const dataset3 = {
  data: labels3.map((name, index) => ({
    y: name,
    x: data3[Math.floor(Math.random() * labels3.length)],
  })),
  // backgroundColor: HIGH_CONTRAST_COLORS.slice(0, PLAYER_COUNT_3).map(color => `${color}10`),
  backgroundColor: HIGH_CONTRAST_COLORS.slice(0, PLAYER_COUNT_3).map(color => `rgba(255,255,255,0.15)`),
  // borderColor: HIGH_CONTRAST_COLORS.slice(0, PLAYER_COUNT_3),
  borderColor: HIGH_CONTRAST_COLORS.slice(0, PLAYER_COUNT_3).map(color => `rgba(255,255,255,0.35)`),
  borderWidth: 1,
  borderRadius: IS_MOBILE ? 5 : 5,
};

let delayed3;

const progress3 = document.getElementById('progress-chart-3');

const legendPlugin3 = {
  id: "navigation_arrows",
  beforeDraw: (chart, args, options) => {
    const {
      ctx
    } = chart;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = options.color;
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  },
  defaults: {
    color: 'lightGreen'
  }
}

const config3 = {
  type: 'bar',
  data: {
    labels: labels3,
    datasets: [dataset3]
  },
  options: {
    indexAxis: 'y',
    aspectRatio: IS_MOBILE ? 1 : 2,
    animations: {
      colors: {
        duration: 100,
      }
    },
    responsive: true,
    color: "white",
    plugins: {
      custom_plugin_move_chart: false,
      legend: {
        position: 'top',
        display: false,
        labels: {
          font: {
            color: "white"
          }
        }
      },
      title: {
        display: true,
        text: 'Racing Bar Chart',
        color: "white",
        font: {
          size: 20,
          weight: 'bold'
        }
      },
      tooltip: {
        enabled: false,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.x !== null) {
              const value = context.parsed.x;
              label += value.toFixed(0);
            }
            return label;
          }
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
        min: 0, // 0-based index
        max: IS_MOBILE ? 9 : 9, // 0-based index
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


const sortAllData3 = () => {
  let mergedData = chart3.config.data.labels.map((label, i) => {
    return {
      labels: chart3.config.data.labels[i],
      dataPoints: chart3.config.data.datasets[0].data[i],
      newDataPoints: {
        y: chart3.config.data.datasets[0].data[i].y,
        x: Number(chart3.config.data.datasets[0].data[i].x) + Math.random() * 10,
      },
      backgroundColor: chart3.config.data.datasets[0].backgroundColor[i],
      borderColor: chart3.config.data.datasets[0].borderColor[i],
    };
  });
  const _labels = [];
  // const _dataPoints = [];
  // const _backgroundColor = [];
  // const _borderColor = [];
  let sortedData = mergedData.sort((a, b) => {
    return b.newDataPoints.x - a.newDataPoints.x;
  });
  for (let i = 0; i < sortedData.length; i++) {
    const dataPoint = sortedData[i].newDataPoints;
    const value = dataPoint.x;
    const label = dataPoint.y;
    _labels.push(label);
    const correspondingDataPoint = chart3.config.data.datasets[0].data.find(data => data.y === label);
    correspondingDataPoint.x = value;
  }
  chart3.config.data.labels = _labels;
  chart3.update("active");
};




let chart3;
const initializeChart3 = () => {
  // chart3 = new Chart(document.getElementById('chart3'), JSON.parse(JSON.stringify(config3)));
  const {
    data,
    ...rest
  } = config3;
  chart3 = new Chart(document.getElementById('chart3'), {
    ...rest,
    data: JSON.parse(JSON.stringify(data))
  });
  sortAllData3();
};
initializeChart3();




const intervalCallback3 = () => {
  if (refreshCount3 < TOTAL_REFRESH_COUNT_3) {
    sortAllData3();
    refreshCount3++;
    progress3.value = refreshCount3 / TOTAL_REFRESH_COUNT_3;
  } else {
    clearInterval(refreshInterval3);
    progress3.value = 1;
    btn3Pause.style.display = 'none';
    btn3Resume.style.display = 'none';
  }
};

// let refreshInterval3 = setInterval(intervalCallback3, REFRESH_DELAY_3);
let refreshInterval3;

const btnStart = document.getElementById('btn3-start');
const btn3Pause = document.getElementById('btn3-pause');
const btn3Resume = document.getElementById('btn3-resume');
const btn3Reset = document.getElementById('btn3-reset');

btnStart.addEventListener('click', () => {
  refreshCount3 = 0;
  refreshInterval3 = setInterval(intervalCallback3, REFRESH_DELAY_3);
  btnStart.style.display = 'none';
  btn3Pause.style.display = 'inline-block';
  btn3Resume.style.display = 'none';
  btn3Reset.disabled = false;
});

btn3Pause.addEventListener('click', () => {
  clearInterval(refreshInterval3);
  btn3Pause.style.display = 'none';
  btn3Resume.style.display = 'inline-block';
});

btn3Resume.addEventListener('click', () => {
  refreshInterval3 = setInterval(intervalCallback3, REFRESH_DELAY_3);
  btn3Pause.style.display = 'inline-block';
  btn3Resume.style.display = 'none';
});

btn3Reset.addEventListener('click', () => {
  clearInterval(refreshInterval3);
  chart3.destroy();
  delayed3 = false;
  initializeChart3();
  progress3.value = 0;
  btn3Pause.style.display = 'none';
  btn3Resume.style.display = 'none';
  btnStart.style.display = 'inline-block';
  btn3Reset.disabled = true;
  refreshCount3 = 0;
  // refreshInterval3 = setInterval(intervalCallback3, REFRESH_DELAY_3);
});
