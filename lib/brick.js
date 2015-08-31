(function() {
  if(typeof Breakout === "undefined") {
    window.Breakout = {};
  }

  var Brick = Breakout.Brick = function(canvas, ctx, options) {
    options = options || {};
    this.canvas = canvas;
    this.ctx = ctx;

    this.color = options.color || "#f01313";
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.width = options.width || 75;
    this.height = options.height || 20;
    this.status = options.status || 1;
  };

  Brick.prototype.draw = function () {
    if(this.status == 1) {
      this.ctx.beginPath();
      this.ctx.rect(this.x, this.y, this.width, this.height);
      this.ctx.fillStyle = this.color;
      this.ctx.fill();
      this.ctx.closePath();
    }
  };
})();
