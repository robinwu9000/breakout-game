(function() {
  if(typeof Breakout === "undefined") {
    window.Breakout = {};
  }

  var Game = Breakout.Game = function(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.ball = new Breakout.Ball(canvas, ctx);
    this.paddle = new Breakout.Paddle(canvas, ctx);
    var pattern = new Breakout.BrickPattern(canvas, ctx);
    this.bricks = pattern.addBricks();
    this.numBricks = pattern.numStartBricks();

    this.score = 0;
    this.gameWon = false;
    this.lives = 3;

    $(document).keydown(this.keyDownHandler.bind(this));
    $(document).keyup(this.keyUpHandler.bind(this));
    $(document).mousemove(this.mouseMoveHandler.bind(this));

    this.rightPressed = false;
    this.leftPressed = false;
  };

  Game.prototype.draw = function() {
    this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
    this.ball.draw();
    this.paddle.draw();
    this.ball.move();
    if(this.gameWon) {
      this.drawGameWon();
    } else {
      this.drawScore();
      this.drawLives();
    }
    this.drawBricks();
    this.collisionDetection();
    requestAnimationFrame(this.draw.bind(this));
    this.ball.collidedWithWall();

    if(this.ball.y + this.ball.dy > this.canvas.height - this.ball.radius - this.paddle.height) {
      if(this.ball.x > this.paddle.x && this.ball.x < this.paddle.x + this.paddle.width) {
        if(this.ball.x < this.paddle.x + this.paddle.width/2) {
          this.ball.dx = -Math.abs(this.ball.dx);
        } else {
          this.ball.dx = Math.abs(this.ball.dx);
        }
        this.ball.dy = -this.ball.dy;
      } else {
        this.lives--;
        if(!this.lives) {
          alert("Game Over");
          document.location.reload();
        } else {
          this.ball.reset();
        }
      }
    }

    if(this.rightPressed && this.paddle.x < this.canvas.width - this.paddle.width) {
      this.paddle.move(7);
    } else if(this.leftPressed && this.paddle.x > 0) {
      this.paddle.move(-7);
    }
  };

  Game.prototype.drawBricks = function() {
    for (var i = 0; i < this.bricks.length; i++) {
      for (var j = 0; j < this.bricks[i].length; j++) {
        this.bricks[i][j].draw();
      }
    }
  };

  Game.prototype.collisionDetection = function() {
    for (var i = 0; i < this.bricks.length; i++) {
      for (var j = 0; j < this.bricks[i].length; j++) {
        var brick = this.bricks[i][j];
        if(brick.status == 1) {
          if(this.ball.collidedWithBrick(brick)) {
            this.ball.dy = -this.ball.dy;
            brick.status = 0;
            this.score += 100;
            if(this.score/100 === this.numBricks) {
              this.gameWon = true;
            }
          }
        }
      }
    }
  };

  Game.prototype.drawScore = function() {
    this.ctx.font = "16px Helvetica";
    this.ctx.fillStyle = "#000000";
    this.ctx.fillText("Score: " + this.score, 8, 20);
  };

  Game.prototype.drawLives = function() {
    this.ctx.font = "16px Helvetica";
    this.ctx.fillStyle = "#000000";
    this.ctx.fillText("Lives: " + this.lives, this.canvas.width - 65, 20);
  };

  Game.prototype.drawGameWon = function() {
    this.ctx.font = "24px Helvetica";
    var date = Date.now();
    this.ctx.fillStyle = date % 1600 < 800 ? "#FFFFFF" : "#ee1414";
    this.ctx.textAlign = "center"; this.ctx.textBaseline = "middle";
    this.ctx.fillText("Game Won!", this.canvas.width/2, this.canvas.height/2);
  };


  Game.prototype.keyDownHandler = function(event) {
    if(event.keyCode == 39) {
      this.rightPressed = true;
    } else if(event.keyCode == 37) {
      this.leftPressed = true;
    }
  };

  Game.prototype.keyUpHandler = function(event) {
    if(event.keyCode == 39) {
      this.rightPressed = false;
    } else if(event.keyCode == 37) {
      this.leftPressed = false;
    }
  };

  Game.prototype.mouseMoveHandler = function(event) {
    var relativeX = event.clientX - this.canvas.offsetLeft;
    if(relativeX > 0 && relativeX < this.canvas.width) {
      this.paddle.x = relativeX - this.paddle.width/2;
    }
  };
})();
