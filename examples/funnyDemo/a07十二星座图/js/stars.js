class Stars {
  constructor(ctx, width, height, r = 1) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.stars = this.getStars(r);
  }
  getStars(r) {
    let stars = [];
    stars.push({
      x: this.width,
      y: this.height,
      r: Math.random() + r,
    });
    return stars;
  }
  draw() {
    let ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = "white";

    this.stars.forEach((star) => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, 2 * Math.PI);
      ctx.fill();
    });
    ctx.restore();
  }
}
class Moon {
  constructor(ctx, width, height) {
    this.ctx = ctx
    this.width = width
    this.height = height
  }

  draw() {
    let ctx = this.ctx
    let gradient = ctx.createRadialGradient(200, 200, 80, 200, 200, 800)
    gradient.addColorStop(0, 'rgb(255,255,255)')
    gradient.addColorStop(0.01, 'rgb(70,70,80)')
    gradient.addColorStop(0.2, 'rgb(40,40,50)')
    gradient.addColorStop(0.4, 'rgb(20,20,30)')
    gradient.addColorStop(1, 'rgb(0,0,10)')
    ctx.save()
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, this.width, this.height)
    ctx.restore()
  }
}
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let w = (canvas.width = window.innerWidth);
let h = (canvas.height = window.innerHeight);

ctx.font = "16px Courier New";

const stars = new Stars(ctx, w, h, 200)
let timer = null

let count = 0
let type = 0

let arr = []
for (let i = 0; i < 200; i++) {
  arr = [...arr, {
    w: Math.random() * w,
    h: Math.random() * h,
  }]
}

const str = [
  {
    title: '白羊座',
    describe: '情如风雪无常，却是一动即殇',
    match: '巨蟹座99.9%；狮子座90%；',
    data: [
      [
        [0.30, 0.78],
        [0.34, 0.66],
        [0.28, 0.48],
        [0.60, 0.26],
        [0.65, 0.20],
        [0.71, 0.23],
        [0.70, 0.32],
        [0.72, 0.36]
      ],
      [
        [0, 1, 2, 3, 4, 5],
        [3, 6, 7]
      ]
    ]
  },
  {
    title: '天秤座',
    describe: '问灵十三载，等一不归人',
    match: '双子座90%；水瓶座90%；',
    data: [
      [
        [0.16, 0.67],
        [0.34, 0.60],
        [0.60, 0.27],
        [0.75, 0.23],
        [0.84, 0.47],
        [0.63, 0.74],
        [0.51, 0.78]
      ],
      [
        [0, 1, 2, 3, 4, 5, 6]
      ]
    ]
  },
  {
    title: '摩羯座',
    describe: '往后余生不再真心，花花世界甚得我心',
    match: '金牛座90%；处女座90%；',
    data: [
      [
        [0.78, 0.21],
        [0.78, 0.34],
        [0.75, 0.45],
        [0.75, 0.70],
        [0.69, 0.78],
        [0.31, 0.66],
        [0.22, 0.49],
        [0.30, 0.53],
        [0.53, 0.54]
      ],
      [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 1]
      ]
    ]
  },
  {
    title: '水瓶座',
    describe: '错过了长安古意，失约了洛阳花期',
    match: '双子座90%；天秤座90%；',
    data: [
      [
        [0.45, 0.21],
        [0.37, 0.35],
        [0.27, 0.51],
        [0.30, 0.58],
        [0.29, 0.64],
        [0.48, 0.79],
        [0.51, 0.71],
        [0.58, 0.68],
        [0.73, 0.74],
        [0.43, 0.53],
        [0.53, 0.47]
      ],
      [
        [0, 1, 2, 3, 4, 5, 6, 7, 8],
        [2, 9, 10]
      ]
    ]
  },
  {
    title: '双鱼座',
    describe: '终是庄周梦了蝶，你是恩赐也是劫',
    match: '巨蟹座90%；天蝎座',
    data: [
      [
        [0.28, 0.43],
        [0.28, 0.53],
        [0.36, 0.73],
        [0.43, 0.78],
        [0.50, 0.70],
        [0.53, 0.62],
        [0.57, 0.58],
        [0.63, 0.43],
        [0.67, 0.39],
        [0.74, 0.39],
        [0.77, 0.34],
        [0.72, 0.30],
        [0.75, 0.22],
        [0.23, 0.50],
        [0.66, 0.33]
      ],
      [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        [0, 13, 1],
        [8, 14, 11]
      ]
    ]
  },
  {
    title: '金牛座',
    describe: '终是我的十恶不赦，配不上你明月清风',
    match: '处女座90%；摩羯座90%；',
    data: [
      [
        [0.29, 0.21],
        [0.39, 0.36],
        [0.50, 0.51],
        [0.50, 0.57],
        [0.61, 0.63],
        [0.77, 0.71],
        [0.79, 0.79],
        [0.22, 0.43],
        [0.39, 0.57],
        [0.60, 0.71],
        [0.67, 0.76]
      ],
      [
        [0, 1, 2, 3, 4, 5, 6],
        [7, 8, 3],
        [4, 9, 10]
      ]
    ]
  },
  {
    title: '双子座',
    describe: '错把陈醋当成墨，写尽半生纸上酸',
    match: '天秤座90%；水瓶座90%；',
    data: [
      [
        [0.18, 0.37],
        [0.25, 0.45],
        [0.35, 0.55],
        [0.39, 0.68],
        [0.49, 0.77],
        [0.51, 0.63],
        [0.57, 0.78],
        [0.28, 0.29],
        [0.42, 0.32],
        [0.61, 0.49],
        [0.72, 0.60],
        [0.83, 0.59],
        [0.69, 0.75],
        [0.22, 0.54],
        [0.35, 0.43],
        [0.48, 0.21]
      ],
      [
        [0, 1, 2, 3, 4],
        [2, 5, 6],
        [7, 8, 9, 10, 11],
        [9, 12],
        [13, 1, 14, 8, 15]
      ]
    ]
  },
  {
    title: '巨蟹座',
    describe: '苦酒折柳今相离，无风无月也无你',
    match: '白羊座99.9%；天蝎座90%；',
    data: [
      [
        [0.16, 0.39],
        [0.27, 0.36],
        [0.52, 0.49],
        [0.57, 0.65],
        [0.83, 0.78],
        [0.44, 0.21]
      ],
      [
        [0, 1, 2, 3, 4],
        [2, 5]
      ]
    ]
  },
  {
    title: '狮子座',
    describe: '纵然万劫不复相思入骨，我也待你眉眼如初，岁月如故',
    match: '射手座95%；白羊座90%；',
    data: [
      [
        [0.16, 0.75],
        [0.23, 0.67],
        [0.39, 0.77],
        [0.71, 0.53],
        [0.64, 0.39],
        [0.55, 0.37],
        [0.47, 0.27],
        [0.54, 0.24],
        [0.60, 0.27],
        [0.85, 0.56]
      ],
      [
        [0, 1, 2, 3, 4, 5, 6, 7, 8],
        [3, 9]
      ]
    ]
  },
  {
    title: '处女座',
    describe: '我自踱步而来，不为风，不为云，只为你',
    match: '金牛座90%；摩羯座90%；',
    data: [
      [
        [0.16, 0.59],
        [0.35, 0.63],
        [0.44, 0.70],
        [0.62, 0.51],
        [0.77, 0.46],
        [0.84, 0.37],
        [0.60, 0.42],
        [0.65, 0.26],
        [0.34, 0.75]
      ],
      [
        [0, 1, 2, 3, 4, 5],
        [3, 6, 7],
        [2, 8]
      ]
    ]
  },
  {
    title: '天蝎座',
    describe: '问灵十三载，等一不归人',
    match: '巨蟹座90%；双鱼座90%；',
    data: [
      [
        [0.17, 0.50],
        [0.28, 0.63],
        [0.19, 0.70],
        [0.28, 0.78],
        [0.41, 0.77],
        [0.49, 0.72],
        [0.57, 0.55],
        [0.59, 0.44],
        [0.69, 0.31],
        [0.74, 0.21],
        [0.82, 0.29],
        [0.79, 0.44],
        [0.73, 0.50],
        [0.38, 0.47]
      ],
      [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        [1, 13],
        [8, 11]
      ]
    ]
  },
  {
    title: '射手座',
    describe: '三里清风三里路，步步清风步步你',
    match: '白羊座90%；狮子座90%；',
    data: [
      [
        [0.22, 0.66],
        [0.24, 0.51],
        [0.45, 0.40],
        [0.54, 0.37],
        [0.59, 0.43],
        [0.66, 0.50],
        [0.63, 0.60],
        [0.66, 0.67],
        [0.74, 0.53],
        [0.77, 0.39],
        [0.49, 0.47],
        [0.29, 0.68],
        [0.30, 0.78],
        [0.48, 0.21],
        [0.52, 0.27],
        [0.59, 0.29]
      ],
      [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [2, 10, 11, 12],
        [10, 4],
        [13, 14, 15, 3],
        [14, 3]
      ]
    ]
  },
]

const str1 = [
  [
    [0.16, 0.67],
    [0.34, 0.60],
    [0.60, 0.27],
    [0.75, 0.23],
    [0.84, 0.47],
    [0.63, 0.74],
    [0.51, 0.78]
  ],
  [
    [0, 1, 2, 3, 4, 5, 6]
  ]
]

const str2 = [
  [
    [0.16, 0.39],
    [0.27, 0.36],
    [0.52, 0.49],
    [0.57, 0.65],
    [0.83, 0.78],
    [0.44, 0.21],
  ],
  [
    [0, 1, 2, 3, 4],
    [2, 5],
  ],
];

//  绘制星座
const constellation = (ctx, ary, w, h) => {
  let points = ary[0], //
    lines = ary[1];
  ctx.strokeStyle = "#FFF";
  let len = lines.length,
    line,
    point;
  while (len--) {
    line = lines[len];
    point = points[line[0]];
    ctx.moveTo(point[0] * w - 30, point[1] * h + 200);
    for (let i = 1; i < line.length; i++) {
      point = points[line[i]];
      ctx.lineTo(point[0] * w - 30, point[1] * h + 200);
    }
  }
  ctx.stroke();

  let cur;
  for (let i = 0; i < points.length; i++) {
    cur = points[i];
    new Stars(ctx, cur[0] * w - 30, cur[1] * h + 200, 4).draw()
  }


  // 描绘星星
  arr.map(item => {
    new Stars(ctx, item.w, item.h, 1).draw()
  })
};



const init = () => {
  clearInterval(timer)


  setInterval(() => {
    count++
  }, 3000)

  timer = setInterval(() => {
    console.log(count, '99')
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // new Moon(ctx, w, h).draw()
    ctx.strokeText('十二星座图————致张东晓', 70, 60)
    ctx.strokeText(`${str[count % 12].title}: ${str[count % 12].describe}`, 20, 100);
    ctx.strokeText(`匹配星座: ${str[count % 12].match}`, 20, 140);
    constellation(ctx, str[count % 12].data, 400, 400)
  }, 1000);
}

const music = () => {
  let audioElement = new Audio();
  audioElement.src = "../static/iw ix - 天空之城（钢琴版）（Cover 久石让）.mp3";
  audioElement.loop = true;
  audioElement.play();
}

window.onload = function () {
  // 在这里执行你想要在页面加载完成后执行的代码
  console.log('页面加载完成！');
  init()

  setTimeout(() => {
    music()
  }, 1000)

};

// 添加beforeunload事件监听器
window.addEventListener('beforeunload', function (event) {
  // 在页面卸载前清除定时器
  clearInterval(timer);

  // 这里可以添加其他清理操作，如果有的话
});