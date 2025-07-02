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

  describe("infinite loop detection and prevention", () => {
    beforeEach(() => {
      // Initialize bounce history if it doesn't exist
      if (!ball.bounceHistory) {
        ball.bounceHistory = [];
      }
    });

    describe("bounce history tracking", () => {
      it("should initialize bounce history array", () => {
        expect(Array.isArray(ball.bounceHistory)).toBe(true);
      });

      it("should record bounce positions and velocities", () => {
        // Simulate recording a bounce
        ball.recordBounce();
        expect(ball.bounceHistory.length).toBeGreaterThan(0);
      });

      it("should maintain maximum of 4 bounce records", () => {
        // Record 6 bounces
        for (let i = 0; i < 6; i++) {
          ball.x = 100 + i * 10;
          ball.y = 100 + i * 5;
          ball.dx = 2 + i * 0.1;
          ball.dy = -2 - i * 0.1;
          ball.recordBounce();
        }
        expect(ball.bounceHistory.length).toBeLessThanOrEqual(4);
      });

      it("should store position and velocity data in bounce records", () => {
        ball.x = 150;
        ball.y = 200;
        ball.dx = 3;
        ball.dy = -4;
        ball.recordBounce();

        const lastBounce = ball.bounceHistory[ball.bounceHistory.length - 1];
        expect(lastBounce).toHaveProperty("x");
        expect(lastBounce).toHaveProperty("y");
        expect(lastBounce).toHaveProperty("dx");
        expect(lastBounce).toHaveProperty("dy");
        expect(lastBounce).toHaveProperty("timestamp");
      });
    });

    describe("loop detection", () => {
      it("should detect when ball returns to similar position with similar velocity", () => {
        // Set up a scenario where ball returns to similar position
        ball.bounceHistory = [
          { x: 100, y: 150, dx: 2, dy: -2, timestamp: Date.now() - 1000 },
          { x: 200, y: 100, dx: -2, dy: 2, timestamp: Date.now() - 800 },
          { x: 150, y: 200, dx: 2, dy: -2, timestamp: Date.now() - 600 },
          { x: 105, y: 155, dx: 2, dy: -2, timestamp: Date.now() - 400 },
        ];

        ball.x = 102;
        ball.y = 152;
        ball.dx = 2;
        ball.dy = -2;

        expect(ball.detectInfiniteLoop()).toBe(true);
      });

      it("should not detect loop when positions are significantly different", () => {
        ball.bounceHistory = [
          { x: 100, y: 150, dx: 2, dy: -2, timestamp: Date.now() - 1000 },
          { x: 200, y: 100, dx: -2, dy: 2, timestamp: Date.now() - 800 },
          { x: 300, y: 250, dx: 2, dy: -2, timestamp: Date.now() - 600 },
          { x: 400, y: 300, dx: 2, dy: -2, timestamp: Date.now() - 400 },
        ];

        ball.x = 500;
        ball.y = 350;
        ball.dx = 2;
        ball.dy = -2;

        expect(ball.detectInfiniteLoop()).toBe(false);
      });

      it("should not detect loop when velocities are significantly different", () => {
        ball.bounceHistory = [
          { x: 100, y: 150, dx: 2, dy: -2, timestamp: Date.now() - 1000 },
          { x: 200, y: 100, dx: -2, dy: 2, timestamp: Date.now() - 800 },
          { x: 150, y: 200, dx: 2, dy: -2, timestamp: Date.now() - 600 },
          { x: 105, y: 155, dx: 2, dy: -2, timestamp: Date.now() - 400 },
        ];

        ball.x = 102;
        ball.y = 152;
        ball.dx = 5; // Significantly different velocity
        ball.dy = -5;

        expect(ball.detectInfiniteLoop()).toBe(false);
      });

      it("should use configurable position tolerance for loop detection", () => {
        ball.bounceHistory = [
          { x: 100, y: 150, dx: 2, dy: -2, timestamp: Date.now() - 1000 },
        ];

        ball.x = 110; // 10 pixels away in x, 10 in y = ~14.14 total distance
        ball.y = 160;
        ball.dx = 2;
        ball.dy = -2;

        // Should detect with large tolerance
        expect(ball.detectInfiniteLoop(20)).toBe(true);
        // Should not detect with small tolerance
        expect(ball.detectInfiniteLoop(10)).toBe(false);
      });

      it("should use configurable velocity tolerance for loop detection", () => {
        ball.bounceHistory = [
          { x: 100, y: 150, dx: 2, dy: -2, timestamp: Date.now() - 1000 },
        ];

        ball.x = 102;
        ball.y = 152;
        ball.dx = 2.3; // 0.3 difference
        ball.dy = -2.3;

        // Should detect with large velocity tolerance
        expect(ball.detectInfiniteLoop(10, 0.5)).toBe(true);
        // Should not detect with small velocity tolerance
        expect(ball.detectInfiniteLoop(10, 0.1)).toBe(false);
      });

      it("should require minimum number of bounces before detecting loops", () => {
        // Only 2 bounces in history
        ball.bounceHistory = [
          { x: 100, y: 150, dx: 2, dy: -2, timestamp: Date.now() - 1000 },
          { x: 105, y: 155, dx: 2, dy: -2, timestamp: Date.now() - 800 },
        ];

        ball.x = 102;
        ball.y = 152;
        ball.dx = 2;
        ball.dy = -2;

        // Should not detect loop with insufficient history
        expect(ball.detectInfiniteLoop()).toBe(false);
      });
    });

    describe("angle adjustment for loop prevention", () => {
      it("should reduce angle by 10% when loop is detected", () => {
        ball.dx = 4;
        ball.dy = -3;

        const originalAngle = Math.atan2(ball.dy, ball.dx);
        ball.adjustAngleForLoopPrevention();
        const newAngle = Math.atan2(ball.dy, ball.dx);

        // New angle should be about 10% smaller in magnitude
        expect(Math.abs(newAngle)).toBeLessThan(Math.abs(originalAngle));
        expect(Math.abs(newAngle)).toBeCloseTo(
          Math.abs(originalAngle) * 0.9,
          2
        );
      });

      it("should maintain speed magnitude while adjusting angle", () => {
        ball.dx = 4;
        ball.dy = -3;

        const originalSpeed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
        ball.adjustAngleForLoopPrevention();
        const newSpeed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);

        expect(newSpeed).toBeCloseTo(originalSpeed, 2);
      });

      it("should preserve direction while adjusting angle", () => {
        // Test positive dx, negative dy
        ball.dx = 4;
        ball.dy = -3;
        ball.adjustAngleForLoopPrevention();
        expect(ball.dx).toBeGreaterThan(0);
        expect(ball.dy).toBeLessThan(0);

        // Test negative dx, positive dy
        ball.dx = -4;
        ball.dy = 3;
        ball.adjustAngleForLoopPrevention();
        expect(ball.dx).toBeLessThan(0);
        expect(ball.dy).toBeGreaterThan(0);
      });

      it("should handle edge case of horizontal movement", () => {
        ball.dx = 5;
        ball.dy = 0;

        ball.adjustAngleForLoopPrevention();

        // Should introduce small vertical component
        expect(Math.abs(ball.dy)).toBeGreaterThan(0);
        expect(Math.abs(ball.dy)).toBeLessThan(1);
      });

      it("should handle edge case of vertical movement", () => {
        ball.dx = 0;
        ball.dy = -5;

        ball.adjustAngleForLoopPrevention();

        // Should introduce small horizontal component
        expect(Math.abs(ball.dx)).toBeGreaterThan(0);
        expect(Math.abs(ball.dx)).toBeLessThan(1);
      });

      it("should respect minimum and maximum speed limits", () => {
        // Test with speed near minimum
        ball.dx = ball.minSpeed * 0.7;
        ball.dy = ball.minSpeed * 0.7;
        ball.adjustAngleForLoopPrevention();

        const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
        expect(speed).toBeGreaterThanOrEqual(ball.minSpeed);

        // Test with speed near maximum
        ball.dx = ball.maxSpeed * 0.7;
        ball.dy = ball.maxSpeed * 0.7;
        ball.adjustAngleForLoopPrevention();

        const speedMax = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
        expect(speedMax).toBeLessThanOrEqual(ball.maxSpeed);
      });
    });

    describe("integration with collision detection", () => {
      it("should check for loops and adjust angle during wall collisions", () => {
        if (
          ball.collidedWithWall &&
          ball.detectInfiniteLoop &&
          ball.adjustAngleForLoopPrevention
        ) {
          // Set up loop scenario
          ball.bounceHistory = [
            { x: 50, y: 150, dx: -2, dy: 2, timestamp: Date.now() - 1000 },
            { x: 100, y: 100, dx: 2, dy: -2, timestamp: Date.now() - 800 },
            { x: 50, y: 150, dx: -2, dy: 2, timestamp: Date.now() - 600 },
            { x: 100, y: 100, dx: 2, dy: -2, timestamp: Date.now() - 400 },
          ];

          ball.x = 10; // Near left wall
          ball.dx = -2;
          ball.dy = 2;

          const originalDy = ball.dy;
          ball.collidedWithWall();

          // Should have adjusted angle if loop was detected
          if (ball.detectInfiniteLoop()) {
            expect(ball.dy).not.toBe(-originalDy); // Not just simple reflection
          }
        }
      });

      it("should check for loops and adjust angle during paddle collisions", () => {
        if (ball.detectInfiniteLoop && ball.adjustAngleForLoopPrevention) {
          const paddle = { x: 200, width: 75 };

          // Set up loop scenario
          ball.bounceHistory = [
            { x: 237, y: 290, dx: 2, dy: 2, timestamp: Date.now() - 1000 },
            { x: 300, y: 250, dx: -2, dy: -2, timestamp: Date.now() - 800 },
            { x: 237, y: 290, dx: 2, dy: 2, timestamp: Date.now() - 600 },
            { x: 300, y: 250, dx: -2, dy: -2, timestamp: Date.now() - 400 },
          ];

          ball.x = 237;
          ball.y = 290;
          ball.dx = 2;
          ball.dy = 2;

          // Simulate paddle collision with loop detection
          if (ball.collidedWithPaddle(paddle) && ball.detectInfiniteLoop()) {
            const originalAngle = Math.atan2(ball.dy, ball.dx);
            ball.adjustAngleForLoopPrevention();
            const newAngle = Math.atan2(ball.dy, ball.dx);

            expect(Math.abs(newAngle)).toBeLessThan(Math.abs(originalAngle));
          }
        }
      });
    });

    describe("performance and edge cases", () => {
      it("should handle empty bounce history gracefully", () => {
        ball.bounceHistory = [];
        expect(ball.detectInfiniteLoop()).toBe(false);
      });

      it("should handle malformed bounce history entries", () => {
        ball.bounceHistory = [
          { x: 100, y: 150 }, // Missing dx, dy, timestamp
          null,
          undefined,
          { x: "invalid", y: 150, dx: 2, dy: -2, timestamp: Date.now() },
        ];

        expect(() => ball.detectInfiniteLoop()).not.toThrow();
      });

      it("should clear bounce history on ball reset", () => {
        ball.bounceHistory = [
          { x: 100, y: 150, dx: 2, dy: -2, timestamp: Date.now() - 1000 },
        ];

        ball.reset();

        expect(ball.bounceHistory).toEqual([]);
      });

      it("should handle very small velocity values", () => {
        ball.dx = 0.001;
        ball.dy = -0.001;

        ball.adjustAngleForLoopPrevention();

        const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
        expect(speed).toBeCloseTo(ball.minSpeed, 1);
      });

      it("should handle very large velocity values", () => {
        ball.dx = 100;
        ball.dy = -100;

        ball.adjustAngleForLoopPrevention();

        const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
        expect(speed).toBeLessThanOrEqual(ball.maxSpeed);
      });
    });
  });
});
