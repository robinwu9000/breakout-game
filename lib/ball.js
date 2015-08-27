(function() {
  if (typeof Breakout === "undefined") {
    window.Breakout = {};
  }

  var Ball = Breakout.Ball = function(canvas, options) {
    this.ctx = canvas.getContext("2d");
    this.x = canvas.width/2;
    this.y = canvas.height - 30;
    this.dx = options.dx || 2;
    this.dy = options.dy || -2;
    this.radius = options.radius || 10;
  };

  Ball.prototype.draw = function () {
    this.ctx.beginPath();
    this.ctx.arc(x,y,this.radius,0, Math.PI*2);
    this.ctx.fillStyle = "#0095DD";
    this.ctx.fill();
    this.ctx.closePath();
  };

  Ball.prototype.reset = function () {
    this.x = canvas.width/2;
    this.y = canvas.height - 30;
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
})();
