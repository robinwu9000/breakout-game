(function() {
  if(typeof Breakout === "undefined") {
    window.Breakout = {};
  }

  var Game = Breakout.Game = function(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.ball = new Breakout.Ball(canvas, ctx);
    this.paddle = new Breakout.Paddle(canvas, ctx);

    $(document).keydown(this.keyDownHandler.bind(this));
    $(document).keyup(this.keyUpHandler.bind(this));
    $(document).mousemove(this.mouseMoveHandler.bind(this));

    // requestAnimationFrame(this.draw);
  };

  // //circle definitions
  // var x = canvas.width/2;
  // var y = canvas.height-30;
  // var dx = 2;
  // var dy = -2;
  //
  // var ballRadius = 10;

  // //paddle definitions
  // var paddleHeight = 10;
  // var paddleWidth = 75;
  // var paddleX = (this.canvas.width - paddleWidth)/2;
  //brick definitions
  var rowBricks = 3;
  var colBricks = 5;
  var brickWidth = 75;
  var brickHeight = 20;
  var brickPadding = 10;
  var brickOffsetTop = 30;
  var brickOffsetLeft = 30;
  var bricks = [];
  for (var i = 0; i < colBricks; i++) {
    bricks[i] = [];
    for (var j = 0; j < rowBricks; j++) {
      bricks[i][j] = {x: 0, y: 0, status: 1};
    }
  }
  //score definitions
  var score = 0;
  var gameWon = false;
  var lives = 3;
  //input definitions
  var rightPressed = false;
  var leftPressed = false;
  //game loop stuff
  Game.prototype.draw = function() {
    this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
    // drawBall();
    this.ball.draw();
    this.paddle.draw();
    this.ball.move();
    // if(gameWon) {
    //   drawGameWon();
    // } else {
    //   drawScore();
    //   drawLives();
    // }
    // drawBricks();
    // collisionDetection();
    // x += dx;
    // y += dy;
    requestAnimationFrame(this.draw.bind(this));

    // if(x + dx > this.canvas.width - ballRadius || x + dx < ballRadius) {
    //   dx = -dx;
    // }

    // if(y + dy < ballRadius) {
    //   dy = -dy;
    // } else if(y + dy > this.canvas.height - ballRadius - paddleHeight) {
    //   if(x > paddleX && x < paddleX + paddleWidth) {
    //     dy = -dy;
    //   } else {
    //     lives--;
    //     if(!lives) {
    //       alert("Game Over");
    //       document.location.reload();
    //     } else {
    //       x = this.canvas.width/2;
    //       y = this.canvas.height - 30;
    //       dx = 2;
    //       dy = -2;
    //       paddleX = (this.canvas.width - paddleWidth)/2;
    //     }
    //   }
    // }

    // if(rightPressed && paddleX < this.canvas.width - paddleWidth) {
    //   paddleX += 7;
    // } else if(leftPressed && paddleX > 0) {
    //   paddleX -= 7;
    // }
  };

  // function drawBall() {
  //   ctx.beginPath();
  //   ctx.arc(x,y,ballRadius,0, Math.PI*2);
  //   ctx.fillStyle = "#0095DD";
  //   ctx.fill();
  //   ctx.closePath();
  // }

  // Game.prototype.drawPaddle = function() {
  //   this.ctx.beginPath();
  //   this.ctx.rect(paddleX, this.canvas.height - paddleHeight, paddleWidth, paddleHeight);
  //   this.ctx.fillStyle = "#259a3b";
  //   this.ctx.fill();
  //   this.ctx.closePath();
  // };

  Game.prototype.drawBricks = function() {
    for (var i = 0; i < colBricks; i++) {
      for (var j = 0; j < rowBricks; j++) {
        if(bricks[i][j].status == 1) {
          var brickX = i * (brickWidth + brickPadding) + brickOffsetLeft;
          var brickY = j * (brickHeight + brickPadding) + brickOffsetTop;
          bricks[i][j].x = brickX;
          bricks[i][j].y = brickY;
          this.ctx.beginPath();
          this.ctx.rect(brickX, brickY, brickWidth, brickHeight);
          this.ctx.fillStyle = "#f01313";
          this.ctx.fill();
          this.ctx.closePath();
        }
      }
    }
  };

  Game.prototype.collisionDetection = function() {
    for (var i = 0; i < colBricks; i++) {
      for (var j = 0; j < rowBricks; j++) {
        var brick = bricks[i][j];
        if(brick.status == 1) {
          if(collidedWithBrick(brick)) {
            dy = -dy;
            brick.status = 0;
            score += 100;
            if(score/100 == colBricks * rowBricks) {
              gameWon = true;
            }
          }
        }
      }
    }
  };

  Game.prototype.drawScore = function() {
    this.ctx.font = "16px Helvetica";
    this.ctx.fillStyle = "#000000";
    this.ctx.fillText("Score: " + score, 8, 20);
  };

  Game.prototype.drawLives = function() {
    this.ctx.font = "16px Helvetica";
    this.ctx.fillStyle = "#000000";
    this.ctx.fillText("Lives: " + lives, this.canvas.width - 65, 20);
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
      rightPressed = true;
    } else if(event.keyCode == 37) {
      leftPressed = true;
    }
  };

  Game.prototype.keyUpHandler = function(event) {
    if(event.keyCode == 39) {
      rightPressed = false;
    } else if(event.keyCode == 37) {
      leftPressed = false;
    }
  };

  Game.prototype.mouseMoveHandler = function(event) {
    var relativeX = event.clientX - this.canvas.offsetLeft;
    if(relativeX > 0 && relativeX < this.canvas.width) {
      paddleX = relativeX - paddleWidth/2;
    }
  };



  //helper methods
  // function collidedWithBrick(brick) {
  //   var distX = Math.abs(x - brick.x - brickWidth/2);
  //   var distY = Math.abs(y - brick.y - brickHeight/2);
  //   if(distX > (brickWidth/2 + ballRadius) ||
  //      distY > (brickHeight/2 + ballRadius)) {
  //     return false;
  //   }
  //
  //   if(distX <= brickWidth/2 || distY <= brickHeight/2) {
  //     return true;
  //   }
  //
  //   var cornerX = distX - brickWidth/2;
  //   var cornerY = distY - brickHeight/2;
  //   return (cornerX*cornerX + cornerY*cornerY <= ballRadius*ballRadius);
  // }
})();
