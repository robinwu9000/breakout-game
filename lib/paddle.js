(function() {
  if(typeof Breakout === "undefined") {
    window.Breakout = {};
  }

  var Paddle = Breakout.Paddle = function (canvas, ctx, options) {
    options = options || {};
    this.canvas = canvas;
    this.ctx = ctx;

    this.height = options.paddleHeight || 10;
    this.width = options.paddleWidth || 75;
    this.x = (canvas.width - this.width)/2;
  };

  Paddle.prototype.draw = function () {
    this.ctx.beginPath();
    this.ctx.rect(this.x, this.canvas.height - this.height, this.width, this.height);
    this.ctx.fillStyle = "#259a3b";
    this.ctx.fill();
    this.ctx.closePath();
  };
})();
