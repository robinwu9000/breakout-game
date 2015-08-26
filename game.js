var canvas = $("#game-canvas")[0];
var ctx = canvas.getContext("2d");

var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;

var ballRadius = 10;

var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth)/2;

var rightPressed = false;
var leftPressed = false;

function draw() {
  ctx.clearRect(0,0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  x += dx;
  y += dy;
  requestAnimationFrame(draw);

  if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }

  if(y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
    dy = -dy;
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

$(document).keydown(keyDownHandler);
$(document).keyup(keyUpHandler);

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

requestAnimationFrame(draw);
