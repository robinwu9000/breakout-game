(function(){
  if(typeof Breakout === "undefined") {
    window.Breakout = {};
  }

  var BrickPattern = Breakout.BrickPattern = function(canvas, ctx, options) {
    options = options || {};
    this.canvas = canvas;
    this.ctx = ctx;

    this.colBricks = options.colBricks || 5;
    this.rowBricks = options.rowBricks || 3;
    this.brickWidth = options.brickWidth || 75;
    this.brickHeight = options.brickHeight || 20;
    this.padding = options.padding || 10;
    this.offsetTop = 30;
    this.offsetLeft = 30;

    this.bricks = [];
    return this.addBricks();
  };

  BrickPattern.prototype.addBricks = function () {
    for (var i = 0; i < this.colBricks; i++) {
      this.bricks[i] = [];
      for (var j = 0; j < this.rowBricks; j++) {
        var brickX = i * (this.brickWidth + this.padding) + this.offsetLeft;
        var brickY = j * (this.brickHeight + this.padding) + this.offsetTop;
        // bricks[i][j].x = brickX;
        // bricks[i][j].y = brickY;
        var options = {x: brickX, y: brickY, width: this.brickWidth,
                       height: this.brickHeight};
        this.bricks[i][j] = new Breakout.Brick(this.canvas, this.ctx, options);
      }
    }

    return this.bricks;
  };
})();
