// Load the Ball class
require("../lib/ball.js");

describe("Ball", () => {
  let canvas, ctx, ball;

  beforeEach(() => {
    canvas = mockCanvas;
    ctx = mockContext;
    ball = new Breakout.Ball(canvas, ctx);

    // Reset mocks
    jest.clearAllMocks();
  });

  describe("constructor", () => {
    it("should initialize with default values", () => {
      expect(ball.canvas).toBe(canvas);
      expect(ball.ctx).toBe(ctx);
      expect(ball.x).toBe(canvas.width / 2);
      expect(ball.y).toBe(canvas.height - 30);
      expect(ball.dx).toBe(2);
      expect(ball.dy).toBe(-2);
      expect(ball.radius).toBe(6);
      expect(ball.minSpeed).toBe(2);
      expect(ball.maxSpeed).toBe(8);
      expect(ball.wentFaster).toBe(0);
    });

    it("should initialize with custom options", () => {
      const options = {
        dx: 3,
        dy: -3,
        radius: 8,
        minSpeed: 1,
        maxSpeed: 10,
      };
      const customBall = new Breakout.Ball(canvas, ctx, options);

      expect(customBall.dx).toBe(3);
      expect(customBall.dy).toBe(-3);
      expect(customBall.radius).toBe(8);
      expect(customBall.minSpeed).toBe(1);
      expect(customBall.maxSpeed).toBe(10);
    });
  });

  describe("draw", () => {
    it("should draw the ball using canvas context", () => {
      ball.draw();

      expect(ctx.beginPath).toHaveBeenCalled();
      expect(ctx.arc).toHaveBeenCalledWith(
        ball.x,
        ball.y,
        ball.radius,
        0,
        Math.PI * 2
      );
      expect(ctx.fillStyle).toBe("#0095DD");
      expect(ctx.fill).toHaveBeenCalled();
      expect(ctx.closePath).toHaveBeenCalled();
    });
  });

  describe("move", () => {
    it("should update ball position based on velocity", () => {
      const initialX = ball.x;
      const initialY = ball.y;

      ball.move();

      expect(ball.x).toBe(initialX + ball.dx);
      expect(ball.y).toBe(initialY + ball.dy);
    });
  });

  describe("changeAngle", () => {
    it("should set velocity to maxSpeed when input exceeds maxSpeed", () => {
      ball.changeAngle(10);
      expect(ball.dx).toBe(ball.maxSpeed);

      ball.changeAngle(-10);
      expect(ball.dx).toBe(-ball.maxSpeed);
    });

    it("should set velocity to minSpeed when input is below minSpeed", () => {
      ball.changeAngle(1);
      expect(ball.dx).toBe(ball.minSpeed);

      ball.changeAngle(-1);
      expect(ball.dx).toBe(-ball.minSpeed);
    });

    it("should set velocity to input when within speed limits", () => {
      ball.changeAngle(5);
      expect(ball.dx).toBe(5);

      ball.changeAngle(-4);
      expect(ball.dx).toBe(-4);
    });
  });

  describe("collidedWithWall", () => {
    it("should reverse horizontal velocity when hitting left wall", () => {
      ball.x = 5;
      ball.dx = -2;
      const initialDy = ball.dy;

      ball.collidedWithWall();

      expect(ball.dx).toBe(2);
      expect(ball.dy).toBe(initialDy);
    });

    it("should reverse horizontal velocity when hitting right wall", () => {
      ball.x = canvas.width - 5;
      ball.dx = 2;
      const initialDy = ball.dy;

      ball.collidedWithWall();

      expect(ball.dx).toBe(-2);
      expect(ball.dy).toBe(initialDy);
    });

    it("should reverse vertical velocity when hitting top wall", () => {
      ball.y = 5;
      ball.dy = -2;
      const initialDx = ball.dx;

      ball.collidedWithWall();

      expect(ball.dy).toBe(2);
      expect(ball.dx).toBe(initialDx);
    });

    it("should not change velocity when not near walls", () => {
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
      const initialDx = ball.dx;
      const initialDy = ball.dy;

      ball.collidedWithWall();

      expect(ball.dx).toBe(initialDx);
      expect(ball.dy).toBe(initialDy);
    });
  });

  describe("reset", () => {
    it("should reset ball to initial position and velocity", () => {
      ball.x = 100;
      ball.y = 100;
      ball.dx = 5;
      ball.dy = 5;
      ball.wentFaster = 2;

      ball.reset();

      expect(ball.x).toBe(canvas.width / 2);
      expect(ball.y).toBe(canvas.height - 30);
      expect(ball.dx).toBe(2);
      expect(ball.dy).toBe(-2);
      expect(ball.wentFaster).toBe(1);
    });
  });

  describe("collidedWithPaddle", () => {
    let paddle;

    beforeEach(() => {
      paddle = {
        x: 200,
        width: 75,
      };
    });

    it("should return true when ball collides with paddle", () => {
      ball.x = paddle.x + paddle.width / 2;

      expect(ball.collidedWithPaddle(paddle)).toBe(true);
    });

    it("should return false when ball is far from paddle", () => {
      ball.x = paddle.x + paddle.width + ball.radius + 10;

      expect(ball.collidedWithPaddle(paddle)).toBe(false);
    });

    it("should return true when ball is at paddle edge", () => {
      ball.x = paddle.x + paddle.width / 2 + paddle.width / 2 + ball.radius;

      expect(ball.collidedWithPaddle(paddle)).toBe(true);
    });
  });

  describe("collidedWithBrick", () => {
    let brick;

    beforeEach(() => {
      brick = {
        x: 100,
        y: 50,
        width: 75,
        height: 20,
      };
    });

    it("should return true when ball center is inside brick", () => {
      ball.x = brick.x + brick.width / 2;
      ball.y = brick.y + brick.height / 2;

      expect(ball.collidedWithBrick(brick)).toBe(true);
    });

    it("should return false when ball is far from brick", () => {
      ball.x = brick.x + brick.width + ball.radius + 10;
      ball.y = brick.y + brick.height + ball.radius + 10;

      expect(ball.collidedWithBrick(brick)).toBe(false);
    });

    it("should return true when ball touches brick edge", () => {
      ball.x = brick.x + brick.width / 2;
      ball.y = brick.y - ball.radius;

      expect(ball.collidedWithBrick(brick)).toBe(true);
    });

    it("should handle corner collision correctly", () => {
      // Position ball at corner - need to be closer for collision
      ball.x = brick.x + brick.width + ball.radius - 2;
      ball.y = brick.y + brick.height + ball.radius - 2;

      expect(ball.collidedWithBrick(brick)).toBe(true);
    });
  });

  describe("goFaster", () => {
    it("should increase speed when stage is higher than wentFaster", () => {
      const initialDx = ball.dx;
      const initialDy = ball.dy;

      ball.goFaster(1);

      expect(Math.abs(ball.dx)).toBeGreaterThan(Math.abs(initialDx));
      expect(Math.abs(ball.dy)).toBeGreaterThan(Math.abs(initialDy));
      expect(ball.wentFaster).toBe(1);
    });

    it("should not increase speed when stage equals wentFaster", () => {
      ball.wentFaster = 1;
      const initialDx = ball.dx;
      const initialDy = ball.dy;

      ball.goFaster(1);

      expect(ball.dx).toBe(initialDx);
      expect(ball.dy).toBe(initialDy);
      expect(ball.wentFaster).toBe(1);
    });

    it("should not increase speed when stage is lower than wentFaster", () => {
      ball.wentFaster = 2;
      const initialDx = ball.dx;
      const initialDy = ball.dy;

      ball.goFaster(1);

      expect(ball.dx).toBe(initialDx);
      expect(ball.dy).toBe(initialDy);
      expect(ball.wentFaster).toBe(2);
    });

    it("should respect speed limits when going faster", () => {
      ball.dx = 7; // Close to max speed
      ball.goFaster(1);

      expect(Math.abs(ball.dx)).toBeLessThanOrEqual(ball.maxSpeed);
    });
  });
});
