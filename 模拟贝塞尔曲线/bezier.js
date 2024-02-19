class ArbitraryBezier {
  points = []
  sportList = [] // 运动中的点
  bezierList = [] // 贝塞尔曲线的点
  complete = 1000 // 完成时间
  speed = 4 // 移动速度
  process = 0 // 当前进度

  constructor(ctx, points) {
    this.ctx = ctx
    this.c = this.ctx.getContext('2d')
    this.points = points
  }
  drawBezier(fList) {
    fList.forEach(item => {
      this.c.beginPath();
      this.c.fillStyle = 'green';
      this.c.arc(item.x, item.y, 2, 0, Math.PI * 2);
      this.c.fill();
    });
  }

  drawPoint(points) {
    points.forEach(item => {
      this.c.fillStyle = item.color || 'orange';
      this.c.beginPath();
      this.c.arc(item.x, item.y, 3, 0, 2 * Math.PI);
      this.c.fill();
    })
  }

  drawLine(points) {
    this.c.beginPath()
    this.c.setLineDash([5, 5]);
    this.c.strokeStyle = 'green';

    for (let i = 0; i < points.length - 1; i++) {
      const prev = points[i]
      const next = points[i + 1]
      this.c.moveTo(prev.x, prev.y);
      this.c.lineTo(next.x, next.y);
      this.c.stroke();
    }
  }
  countPoint(points) {
    if (points.length <= 1) {
      return;
    }
    const sportPoints = []
    for (let i = 0; i < points.length - 1; i++) {
      sportPoints.push(this.getPoints(points[i], points[i + 1], this.process))
    }

    if (sportPoints.length <= 1) {
      this.bezierList.push(...sportPoints)
      return;
    }

    let list = []

    for (let i = 0; i < sportPoints.length - 1; i++) {
      list.push(sportPoints[i], sportPoints[i + 1])
    }

    this.sportList.push(list)

    this.countPoint(sportPoints, this.process)
  }
  sport() {
    this.clear()

    this.process += this.speed;

    this.countPoint(this.points)

    // 先绘制示意点和线
    this.drawPoint(this.points)

    this.drawLine(this.points)

    // 然后绘制运动之后的点和线条
    this.sportList.forEach(list => {
      this.drawPoint(list)
      this.drawLine(list)
    })

    // 绘制贝塞尔线条
    this.drawBezier(this.bezierList)

    if (this.process > this.complete) {
      return;
    }
    requestAnimationFrame(() => this.sport());
  }
  clear() {
    this.c.clearRect(0, 0, this.ctx.width, this.ctx.height);
    this.sportList.length = 0
    // 需要保留 bezierList 中的数据，否则贝塞尔曲线显示不出来
  }
  getPoints(one, two) {
    const ratio = this.process / this.complete
    return {
      x: (two.x - one.x) * ratio + one.x,
      y: (two.y - one.y) * ratio + one.y
    }
  }
}
