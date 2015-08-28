(function(){
  if(typeof Breakout === "undefined") {
    window.Breakout = {};
  }

  var BrickPattern = Breakout.BrickPattern = function(canvas, ctx, options) {
    options = options || {};
    this.canvas = canvas;
    this.ctx = ctx;

    this.colBricks = options.colBricks || 8;
    this.rowBricks = options.rowBricks || 4;
    this.brickWidth = options.brickWidth || 50;
    this.brickHeight = options.brickHeight || 10;
    this.padding = options.padding || 5;
    this.offsetTop = 30;
    this.offsetLeft = 20;

    this.bricks = [];
    this.numBricks = 0;
  };

  BrickPattern.prototype.addBricks = function () {
    for (var i = 0; i < this.colBricks; i++) {
      this.bricks[i] = [];
      for (var j = 0; j < this.rowBricks; j++) {
        var brickX = i * (this.brickWidth + this.padding) + this.offsetLeft;
        var brickY = j * (this.brickHeight + this.padding) + this.offsetTop;
        var options = {x: brickX, y: brickY, width: this.brickWidth,
                       height: this.brickHeight};
        this.bricks[i][j] = new Breakout.Brick(this.canvas, this.ctx, options);
        this.numBricks++;
      }
    }

    return this.bricks;
  };

  BrickPattern.prototype.numStartBricks = function () {
    return this.numBricks;
  };
})();
