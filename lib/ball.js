(function() {
  if (typeof Breakout === "undefined") {
    window.Breakout = {};
  }

  var Ball = Breakout.Ball = function(canvas, ctx, options) {
    options = options || {};
    this.canvas = canvas;
    this.ctx = ctx;

    this.x = canvas.width/2;
    this.y = canvas.height - 30;
    this.dx = options.dx || 2;
    this.dy = options.dy || -2;
    this.radius = options.radius || 6;

    this.wentFaster = false;
  };

  Ball.prototype.draw = function () {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    this.ctx.fillStyle = "#0095DD";
    this.ctx.fill();
    this.ctx.closePath();
  };

  Ball.prototype.move = function () {
    this.x += this.dx;
    this.y += this.dy;
  };

  Ball.prototype.collidedWithWall = function () {
    if(this.x + this.dx > this.canvas.width - this.radius || this.x + this.dx < this.radius) {
      this.dx = -this.dx;
    }

    if(this.y + this.dy < this.radius) {
      this.dy = -this.dy;
    }
  };

  Ball.prototype.reset = function () {
    this.x = this.canvas.width/2;
    this.y = this.canvas.height - 30;
    this.dx = 2;
    this.dy = -2;
  };

  Ball.prototype.collidedWithBrick = function(brick) {
    var distX = Math.abs(this.x - brick.x - brick.width/2);
    var distY = Math.abs(this.y - brick.y - brick.height/2);
    if(distX > (brick.width/2 + this.radius) ||
       distY > (brick.height/2 + this.radius)) {
      return false;
    }

    if(distX <= brick.width/2 || distY <= brick.height/2) {
      return true;
    }

    var cornerX = distX - brick.width/2;
    var cornerY = distY - brick.height/2;
    return (cornerX*cornerX + cornerY*cornerY <= this.radius*this.radius);
  };

  Ball.prototype.goFaster = function () {
    if(!this.wentFaster) {
      this.dx *= 1.5;
      this.dy *= 1.5;
      this.wentFaster = true;
    }
  };
})();
