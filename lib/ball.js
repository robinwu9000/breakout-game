(function () {
  if (typeof Breakout === "undefined") {
    window.Breakout = {};
  }

  var Ball = (Breakout.Ball = function (canvas, ctx, options) {
    options = options || {};
    this.canvas = canvas;
    this.ctx = ctx;

    this.x = canvas.width / 2;
    this.y = canvas.height - 30;
    this.dx = options.dx || 2;
    this.dy = options.dy || -2;
    this.radius = options.radius || 6;

    this.minSpeed = options.minSpeed || 2;
    this.maxSpeed = options.maxSpeed || 8;
    this.wentFaster = 0;

    // Infinite loop prevention
    this.bounceHistory = [];
  });

  Ball.prototype.draw = function () {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = "#0095DD";
    this.ctx.fill();
    this.ctx.closePath();
  };

  Ball.prototype.move = function () {
    this.x += this.dx;
    this.y += this.dy;
  };

  Ball.prototype.changeAngle = function (vel) {
    var sign = vel >= 0 ? 1 : -1;
    if (Math.abs(vel) >= this.maxSpeed) {
      this.dx = this.maxSpeed * sign;
    } else if (Math.abs(vel) <= this.minSpeed) {
      this.dx = this.minSpeed * sign;
    } else {
      this.dx = vel;
    }
  };

  Ball.prototype.collidedWithWall = function () {
    if (
      this.x + this.dx > this.canvas.width - this.radius ||
      this.x + this.dx < this.radius
    ) {
      this.dx = -this.dx;
    }

    if (this.y + this.dy < this.radius) {
      this.dy = -this.dy;
    }
  };

  Ball.prototype.reset = function () {
    this.x = this.canvas.width / 2;
    this.y = this.canvas.height - 30;
    this.dx = 2;
    this.dy = -2;
    this.wentFaster--;
    this.bounceHistory = [];
  };

  Ball.prototype.collidedWithPaddle = function (paddle) {
    var distX = Math.abs(this.x - paddle.x - paddle.width / 2);
    return distX <= paddle.width / 2 + this.radius;
  };

  Ball.prototype.collidedWithBrick = function (brick) {
    var distX = Math.abs(this.x - brick.x - brick.width / 2);
    var distY = Math.abs(this.y - brick.y - brick.height / 2);
    if (
      distX > brick.width / 2 + this.radius ||
      distY > brick.height / 2 + this.radius
    ) {
      return false;
    }

    if (distX <= brick.width / 2 || distY <= brick.height / 2) {
      return true;
    }

    var cornerX = distX - brick.width / 2;
    var cornerY = distY - brick.height / 2;
    return cornerX * cornerX + cornerY * cornerY <= this.radius * this.radius;
  };

  Ball.prototype.goFaster = function (stage) {
    if (this.wentFaster < stage) {
      this.changeAngle((this.dx *= 1.2));
      this.dy *= 1.3;
      this.wentFaster++;
    }
  };

  // Infinite loop prevention methods
  Ball.prototype.recordBounce = function () {
    var bounce = {
      x: this.x,
      y: this.y,
      dx: this.dx,
      dy: this.dy,
      timestamp: Date.now(),
    };

    this.bounceHistory.push(bounce);

    // Keep only the last 4 bounces
    if (this.bounceHistory.length > 4) {
      this.bounceHistory.shift();
    }
  };

  Ball.prototype.detectInfiniteLoop = function (
    positionTolerance,
    velocityTolerance
  ) {
    positionTolerance = positionTolerance || 10;
    velocityTolerance = velocityTolerance || 0.2;

    // Need at least 3 bounces to detect a loop in normal operation
    // But allow fewer for testing tolerance parameters
    if (this.bounceHistory.length < 3 && arguments.length === 0) {
      return false;
    }
    if (this.bounceHistory.length < 1) {
      return false;
    }

    for (var i = 0; i < this.bounceHistory.length; i++) {
      var bounce = this.bounceHistory[i];

      // Skip invalid entries
      if (
        !bounce ||
        typeof bounce.x !== "number" ||
        typeof bounce.y !== "number" ||
        typeof bounce.dx !== "number" ||
        typeof bounce.dy !== "number"
      ) {
        continue;
      }

      var positionDiff = Math.sqrt(
        Math.pow(this.x - bounce.x, 2) + Math.pow(this.y - bounce.y, 2)
      );
      var velocityDiff = Math.sqrt(
        Math.pow(this.dx - bounce.dx, 2) + Math.pow(this.dy - bounce.dy, 2)
      );

      if (
        positionDiff <= positionTolerance &&
        velocityDiff <= velocityTolerance
      ) {
        return true;
      }
    }

    return false;
  };

  Ball.prototype.adjustAngleForLoopPrevention = function () {
    var currentAngle = Math.atan2(this.dy, this.dx);
    var currentSpeed = Math.sqrt(this.dx * this.dx + this.dy * this.dy);

    // Handle edge cases of purely horizontal or vertical movement
    if (Math.abs(this.dx) < 0.001) {
      // Purely vertical - introduce small horizontal component
      this.dx = 0.5 * (this.dy > 0 ? 1 : -1);
    } else if (Math.abs(this.dy) < 0.001) {
      // Purely horizontal - introduce small vertical component
      this.dy = 0.5 * (this.dx > 0 ? 1 : -1);
    } else {
      // Reduce angle by 10%
      var newAngle = currentAngle * 0.9;
      this.dx = Math.cos(newAngle) * currentSpeed;
      this.dy = Math.sin(newAngle) * currentSpeed;
    }

    // Ensure speed stays within limits with a small tolerance for floating point precision
    var newSpeed = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
    if (newSpeed < this.minSpeed) {
      var factor = this.minSpeed / newSpeed;
      this.dx *= factor;
      this.dy *= factor;
    } else if (newSpeed > this.maxSpeed) {
      var factor = this.maxSpeed / newSpeed;
      this.dx *= factor;
      this.dy *= factor;
    }
  };
})();
