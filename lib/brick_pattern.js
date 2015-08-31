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
    this.brickHeight = options.brickHeight || 11;
    this.padding = options.padding || 6;
    this.offsetTop = 30;
    this.offsetLeft = 20;

    this.bricks = [];
    this.numBricks = 0;
  };

  BrickPattern.prototype.addBricks = function () {
    var colors = ["#3dd517", "#f01313", "#2521cb", "#d6d410", "#8d1bd2", "#e68d17"];
    colors = shuffle(colors);
    for (var i = 0; i < this.rowBricks; i++) {
      this.bricks[i] = [];
      var rowColor = colors.pop();
      for (var j = 0; j < this.colBricks; j++) {
        var brickX = j * (this.brickWidth + this.padding) + this.offsetLeft;
        var brickY = i * (this.brickHeight + this.padding) + this.offsetTop;
        var options = {x: brickX, y: brickY, width: this.brickWidth,
                       height: this.brickHeight, color: rowColor};
        this.bricks[i][j] = new Breakout.Brick(this.canvas, this.ctx, options);
        this.numBricks++;
      }
    }

    return this.bricks;
  };

  BrickPattern.prototype.numStartBricks = function () {
    return this.numBricks;
  };

  function shuffle(array) {
    var m = array.length, t, i;

    while(m) {
      i = Math.floor(Math.random() * m--);
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }

    return array;
  }
})();
