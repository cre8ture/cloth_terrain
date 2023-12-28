class Mouse {
  constructor(entities, canvas, ctx) {
    this.entities = entities;
    // Drag Interaction
    this.draggedPoint = null;
    this.draggedPoints = [];

    this.down = false;
    this.coord = new Vector();
    this.offset = new Vector();
    this.offsetCoord = new Vector();
    this.canvas = canvas;
    this.ctx = ctx;

    this.canvas.addEventListener('mousedown', (e) => {
      this.down = true;
      this.coord.setXY(e.offsetX, e.offsetY);
      this.draggedPoints = this.getNearestPoints();
      if (this.draggedPoints.length > 0) {
        // Store the offset for each point
        this.offsets = this.draggedPoints.map(point => {
          return new Vector(e.offsetX - point.pos.x, e.offsetY - point.pos.y);
        });
        this.offsetCoord = Vector.sub(this.coord, this.offsets[0]);
      }
    })
    
// TOUCH
this.canvas.addEventListener('touchstart', (e) => {
  let offset = e.touches[0];
  this.down = true;
  this.coord.setXY(offset.clientX, offset.clientY);
  this.draggedPoints = this.getNearestPoints();
  if (this.draggedPoints.length > 0) {
    this.offset.setXY(offset.clientX - this.draggedPoints[0].pos.x, offset.clientY - this.draggedPoints[0].pos.y);
    this.offsetCoord = Vector.sub(this.coord, this.offset);
  }
})
    this.canvas.addEventListener("mouseup", (e) => {
      if (this.draggedPoint) {
        this.draggedPoint.resetVelocity();
      }
      this.down = false;
      this.draggedPoint = null;
    });

    this.canvas.addEventListener('mousemove', (e) => {
      this.coord.setXY(e.offsetX, e.offsetY);
      if (this.down && this.draggedPoints.length > 0) {
        for (let i = 0; i < this.draggedPoints.length; i++) {
          // console.log("this.coord, this.offsets[i]", this.coord, this.offsets, this.offsets[i])
          this.offsetCoord = Vector.sub(this.coord, this.offsets[i]);
          // Ensure that pos is an instance of Vector before calling setXY
          if (this.draggedPoints[i].pos instanceof Vector) {
            this.draggedPoints[i].pos.setXY(this.offsetCoord.x, this.offsetCoord.y);
          }
        }
      }
    })

    // TOUCH
    this.canvas.addEventListener("touchstart", (e) => {
      let offset = e.touches[0];
      this.down = true;
      this.coord.setXY(offset.clientX, offset.clientY);
      this.draggedPoints = this.getNearestPoints();
      if (this.draggedPoints.length > 0) {
        this.offset.setXY(
          offset.clientX - this.draggedPoints[0].pos.x,
          offset.clientY - this.draggedPoints[0].pos.y
        );
        this.offsetCoord = Vector.sub(this.coord, this.offset);
      }
    });
    this.canvas.addEventListener("touchend", (e) => {
      if (this.draggedPoint) {
        this.draggedPoint.resetVelocity();
      }
      this.down = false;
      this.draggedPoint = null;
    });
    this.canvas.addEventListener("touchmove", (e) => {
      let offset = e.touches[0];
      this.coord.setXY(offset.pageX, offset.pageY);
      this.offsetCoord = Vector.sub(this.coord, this.offset);
    });
  }

  dragPoint_old() {
    if (!this.down) return;
    console.log(
      "this.offsetCoord.x, this.offsetCoord.y",
      this.offsetCoord.x,
      this.offsetCoord.y
    );
    this.draggedPoint.pos.setXY(this.offsetCoord.x, this.offsetCoord.y);
  }

  dragPoint() {
    if (!this.down) return;


    let points = this.getNearestPoints();
    points.forEach((point) =>
      point.pos.setXY(this.offsetCoord.x, this.offsetCoord.y)
    );
  }

  drag() {
    if (!this.down) {
      // this.draggedPoint = this.getNearestPoint();
      this.draggedPoints = this.getNearestPoints();
      this.draggedPoint = this.draggedPoints[0];
    }
    if (this.draggedPoint) {
      this.renderDraggedPoint(this.draggedPoint);
      this.dragPoint();
    }
  }

  renderDraggedPoint(point) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = "black";
    this.ctx.arc(point.pos.x, point.pos.y, point.radius * 1.5, 0, Math.PI * 2);
    this.ctx.stroke();
    this.ctx.closePath();
  }

  getNearestPoint_old() {
    // if (!this.down) return false;
    let d = 20;
    let p = null;
    for (let k = 0; k < this.entities.length; k++) {
      for (let i = 0; i < this.entities[k].points.length; i++) {
        let dist = this.entities[k].points[i].pos.dist(this.coord);
        if (dist < d) {
          p = this.entities[k].points[i];
        }
      }
    }
    return p;
  }

  getNeighbors(point) {
    let neighbors = [];

    // Get the point's position in the array
    let x = point.x;
    let y = point.y;

    // Check each of the point's four neighbors
    if (this.points[x - 1] && this.points[x - 1][y]) {
      neighbors.push(this.points[x - 1][y]); // Left neighbor
    }
    if (this.points[x + 1] && this.points[x + 1][y]) {
      neighbors.push(this.points[x + 1][y]); // Right neighbor
    }
    if (this.points[x][y - 1]) {
      neighbors.push(this.points[x][y - 1]); // Top neighbor
    }
    if (this.points[x][y + 1]) {
      neighbors.push(this.points[x][y + 1]); // Bottom neighbor
    }

    return neighbors;
  }
  getNearestPoints() {
    let d = 40;
    let points = [];
    for (let k = 0; k < this.entities.length; k++) {
      for (let i = 0; i < this.entities[k].points.length; i++) {
        let dist = this.entities[k].points[i].pos.dist(this.coord);
        if (dist < d) {
          points.push(this.entities[k].points[i]);
        }
      }
    }
    // Sort the points by distance and return the first four
    let nearestPoints = points.sort((a, b) => a.pos.dist(this.coord) - b.pos.dist(this.coord)).slice(0, 4);
    this.draggedPoints = nearestPoints;
    return nearestPoints;
  }
}
