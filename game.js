var canvas = $("#game-canvas")[0];
var ctx = canvas.getContext("2d");
//circle definitions
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;

var ballRadius = 10;
//paddle definitions
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth)/2;
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
function draw() {
  ctx.clearRect(0,0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  if(gameWon) {
    drawGameWon();
  } else {
    drawScore();
    drawLives();
  }
  drawBricks();
  collisionDetection();
  x += dx;
  y += dy;
  requestAnimationFrame(draw);

  if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }

  if(y + dy < ballRadius) {
    dy = -dy;
  } else if(y + dy > canvas.height - ballRadius - paddleHeight) {
    if(x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      lives--;
      if(!lives) {
        alert("Game Over");
        document.location.reload();
      } else {
        x = canvas.width/2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth)/2;
      }
    }
  }

  if(rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if(leftPressed && paddleX > 0) {
    paddleX -= 7;
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x,y,ballRadius,0, Math.PI*2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#259a3b";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (var i = 0; i < colBricks; i++) {
    for (var j = 0; j < rowBricks; j++) {
      if(bricks[i][j].status == 1) {
        var brickX = i * (brickWidth + brickPadding) + brickOffsetLeft;
        var brickY = j * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[i][j].x = brickX;
        bricks[i][j].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#f01313";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function collisionDetection() {
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
}

function drawScore() {
  ctx.font = "16px Helvetica";
  ctx.fillStyle = "#000000";
  ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
  ctx.font = "16px Helvetica";
  ctx.fillStyle = "#000000";
  ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function drawGameWon() {
  ctx.font = "24px Helvetica";
  var date = Date.now();
  ctx.fillStyle = date % 1600 < 800 ? "#FFFFFF" : "#ee1414";
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText("Game Won!", canvas.width/2, canvas.height/2);
}

$(document).keydown(keyDownHandler);
$(document).keyup(keyUpHandler);
$(document).mousemove(mouseMoveHandler);

function keyDownHandler(event) {
  if(event.keyCode == 39) {
    rightPressed = true;
  } else if(event.keyCode == 37) {
    leftPressed = true;
  }
}

function keyUpHandler(event) {
  if(event.keyCode == 39) {
    rightPressed = false;
  } else if(event.keyCode == 37) {
    leftPressed = false;
  }
}

function mouseMoveHandler(event) {
  var relativeX = event.clientX - canvas.offsetLeft;
  if(relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth/2;
  }
}

requestAnimationFrame(draw);


//helper methods
function collidedWithBrick(brick) {
  var distX = Math.abs(x - brick.x - brickWidth/2);
  var distY = Math.abs(y - brick.y - brickHeight/2);
  if(distX > (brickWidth/2 + ballRadius) ||
     distY > (brickHeight/2 + ballRadius)) {
    return false;
  }

  if(distX <= brickWidth/2 || distY <= brickHeight/2) {
    return true;
  }

  var cornerX = distX - brickWidth/2;
  var cornerY = distY - brickHeight/2;
  return (cornerX*cornerX + cornerY*cornerY <= ballRadius*ballRadius);
}
