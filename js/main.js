// =========================================================================================================|
// =========================================================================================================|
// =====================| Constants 

const PLAYER_NAMES = [
  'Lebron James',
  'Steph Curry',
  'Kevin Durant',
  'Klay Thompson',
  'Anthony Davis',
  'Draymond Green',
  'Kyrie Irving',
  'Damian Lillard',
  'Giannis Antetokounmpo',
  'Joel Embiid',
]

const HIGH_CONTRAST_COLORS = [
  '#F47921',
  '#239BC0',
  '#FAAF17',
  '#4B2FFA',
  '#CAFA2F',
  '#AC0AFA',
  '#49FA3C',
  '#FA0AFA',
  '#37FFAF',
  '#FA0A5A'
];

const LOW_CONTRAST_COLORS = [
  "#f47921",
  "#fc9350",
  "#ffad7a",
  "#ffc6a3",
  "#ffe0ce",
  "#f9f9f9",
  "#d6e6ee",
  "#b2d3e2",
  "#8cc0d7",
  "#62adcb",
  "#239bc0",
];

const IS_MOBILE = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// =========================================================================================================|
// =========================================================================================================|
// =====================| Utilities

function smoothRandom(factor, start) {
  let last = (start !== undefined) ? start : Math.random();
  let halfEnvelope = (1 / factor) / 2;
  return function () {
    // clamp output range to [0,1] as Math.random()
    let max = Math.min(1, last + halfEnvelope);
    let min = Math.max(0, last - halfEnvelope);
    // return a number within halfRange of the last returned value
    return last = Math.random() * (max - min) + min;
  };
}

function randomNumbers(x, factor = 10, min = 1000, max = 2000) {
  const numbers = [];
  const start = Math.floor(Math.random() * (max - min)) + min;
  const scaledStart = start / max;
  const smooth = smoothRandom(factor, scaledStart);
  for (let i = 0; i < x; i++) {
    numbers.push(smooth() * max);
  }
  return numbers;
}

const randomDates = (x) => {
  const dates = [];
  for (let i = 0; i < x; i++) {
    dates.push(new Date(new Date().getTime() - Math.floor(Math.random() * (5 * 365 * 24 * 60 * 60 * 1000))));
  }
  return dates.sort((a, b) => a - b);
}

// =========================================================================================================|
// =========================================================================================================|
// =====================| Custom plugins

Chart.register({
  id: "custom_plugin_move_chart",
  afterEvent(chart, args) {
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
    } = chart;
    canvas.addEventListener("mousemove", (e) => {
      const x = args.event.x;
      const y = args.event.y;
      const isInLeftCircle = x >= left - 15 && x <= left + 15 && y >= height / 2 + top - 15 && y <= height / 2 + top + 15;
      const isInRightCircle = x >= right - 15 && x <= right + 15 && y >= height / 2 + top - 15 && y <= height / 2 + top + 15;
      if (isInLeftCircle) {
        if (!IS_MOBILE) canvas.style.cursor = "pointer";
      } else if (isInRightCircle) {
        if (!IS_MOBILE) canvas.style.cursor = "pointer";
      } else {
        canvas.style.cursor = "default";
      }
    });
  },
  afterDraw(chart, args, pluginOptions) {
    const {
      ctx,
      chartArea: {
        left,
        right,
        top,
        bottom,
        width,
        height
      }
    } = chart;

    class CircleChevron {
      draw(ctx, x1, pixel) {
        // Circle
        const angle = Math.PI / 180;
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.fillStyle = '#464453';
        ctx.arc(x1, height / 2 + top, 15, angle * 0, angle * 360, false);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
        // ./Circle
        // Arrow
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'white';
        ctx.moveTo(x1 + pixel, height / 2 + top - pixel * 1.5);
        ctx.lineTo(x1 - pixel, height / 2 + top);
        ctx.lineTo(x1 + pixel, height / 2 + top + pixel * 1.5);
        ctx.stroke();
        ctx.closePath();
        // ./Arrow
      }
    }

    const circleLeft = new CircleChevron();
    circleLeft.draw(ctx, left, 5);

    const circleRight = new CircleChevron();
    circleRight.draw(ctx, right, -5);

  },

});

Chart.register({
  id: "custom_plugin_racing_chart",
  afterDatasetDraw(chart, args, pluginOptions) {
    chart.data.datasets.forEach((dataset, i) => {
      const meta = chart.getDatasetMeta(i);
      if (!meta.hidden) {
        meta.data.forEach((element, index) => {
          const {
            x: elementX,
            y: elementY,
            width
          } = element;
          if (!isNaN(elementY)) {
            const id = `meta-${meta.index}-index-${index}`;
            let customTooltip;
            if (!document.getElementById(id)) {
              customTooltip = document.createElement('div');
              customTooltip.className = 'custom-tooltip';
              customTooltip.id = id;
              customTooltip.style.opacity = 0;
              customTooltip.style.width = "auto";
              customTooltip.style.height = "auto";
              customTooltip.style.color = "white";
              customTooltip.style.position = 'absolute';
              customTooltip.style.zIndex = '1';
              customTooltip.style.pointerEvents = 'none';
              window.document.body.appendChild(customTooltip);
            } else {
              customTooltip = document.getElementById(id);
            }
            const dataPointValue = dataset.data[index];
            if (dataPointValue != null) {
              const displayValue =  Number(dataPointValue.x).toFixed(0);
              customTooltip.innerHTML = `
                <div class="custom-tooltip-body">
                    <div class="custom-tooltip-body-item-value">${displayValue}</div>
                </div>`;
            }
            const canvasRect = chart.canvas.getBoundingClientRect();
            const htmlElementLeft = canvasRect.left + window.scrollX + elementX + "px";
            const htmlElementTop = canvasRect.top + window.scrollY + elementY + "px";
            customTooltip.style.transform = `translate(calc(-100% - 1em), -50%)`;
            customTooltip.style.opacity = 1;
            customTooltip.style.textAlign = 'right';
            customTooltip.style.pointerEvents = 'auto';
            customTooltip.style.left = htmlElementLeft;
            customTooltip.style.top = htmlElementTop;
          }
        });
      }
    });
  }
});
