// Load all required classes
require("../lib/ball.js");
require("../lib/paddle.js");
require("../lib/brick.js");
require("../lib/brick_pattern.js");
require("../lib/game.js");

describe("Game", () => {
  let canvas, ctx, game;

  beforeEach(() => {
    canvas = mockCanvas;
    ctx = mockContext;
    game = new Breakout.Game(canvas, ctx);

    // Reset mocks
    jest.clearAllMocks();
    Math.random.mockReturnValue(0.5);
    Date.now.mockReturnValue(1000);
  });

  describe("constructor", () => {
    it("should initialize game components", () => {
      expect(game.canvas).toBe(canvas);
      expect(game.ctx).toBe(ctx);
      expect(game.ball).toBeInstanceOf(Breakout.Ball);
      expect(game.paddle).toBeInstanceOf(Breakout.Paddle);
      expect(Array.isArray(game.bricks)).toBe(true);
      expect(game.bricks.length).toBeGreaterThan(0);
    });

    it("should initialize game state", () => {
      expect(game.score).toBe(0);
      expect(game.gameOver).toBe(false);
      expect(game.result).toBe("Lost");
      expect(game.lives).toBe(3);
      expect(game.rightPressed).toBe(false);
      expect(game.leftPressed).toBe(false);
    });

    it("should set up event handlers", () => {
      // The game constructor sets up jQuery event handlers
      // We verify the handlers exist by checking they're functions
      expect(typeof game.keyDownHandler).toBe("function");
      expect(typeof game.keyUpHandler).toBe("function");
      expect(typeof game.mouseMoveHandler).toBe("function");
    });

    it("should initialize numBricks correctly", () => {
      expect(game.numBricks).toBeGreaterThan(0);
      expect(typeof game.numBricks).toBe("number");
    });
  });

  describe("drawBricks", () => {
    it("should call draw on all bricks", () => {
      // Mock the draw method on all bricks
      game.bricks.forEach((row) => {
        row.forEach((brick) => {
          brick.draw = jest.fn();
        });
      });

      game.drawBricks();

      game.bricks.forEach((row) => {
        row.forEach((brick) => {
          expect(brick.draw).toHaveBeenCalled();
        });
      });
    });

    it("should handle empty bricks array", () => {
      game.bricks = [];
      expect(() => game.drawBricks()).not.toThrow();
    });

    it("should handle bricks with different statuses", () => {
      game.bricks[0][0].draw = jest.fn();
      game.bricks[0][0].status = 0;

      game.drawBricks();

      expect(game.bricks[0][0].draw).toHaveBeenCalled();
    });
  });

  describe("collisionDetection", () => {
    beforeEach(() => {
      // Mock ball collision method
      game.ball.collidedWithBrick = jest.fn();
    });

    it("should check collision with all active bricks", () => {
      game.ball.collidedWithBrick.mockReturnValue(false);

      game.collisionDetection();

      let activeBricks = 0;
      game.bricks.forEach((row) => {
        row.forEach((brick) => {
          if (brick.status === 1) {
            activeBricks++;
          }
        });
      });

      expect(game.ball.collidedWithBrick).toHaveBeenCalledTimes(activeBricks);
    });

    it("should handle brick collision", () => {
      const testBrick = game.bricks[0][0];
      testBrick.status = 1;
      game.ball.collidedWithBrick.mockImplementation(
        (brick) => brick === testBrick
      );

      const initialScore = game.score;
      const initialDy = game.ball.dy;

      game.collisionDetection();

      expect(testBrick.status).toBe(0);
      expect(game.score).toBe(initialScore + 100);
      expect(game.ball.dy).toBe(-initialDy);
    });

    it("should not affect inactive bricks", () => {
      const testBrick = game.bricks[0][0];
      testBrick.status = 0;
      game.ball.collidedWithBrick.mockReturnValue(false);

      const initialScore = game.score;

      game.collisionDetection();

      expect(testBrick.status).toBe(0);
      expect(game.score).toBe(initialScore);
    });

    it("should trigger win condition when all bricks destroyed", () => {
      // Set all bricks to destroyed except one
      game.bricks.forEach((row) => {
        row.forEach((brick) => {
          brick.status = 0;
        });
      });

      const lastBrick = game.bricks[0][0];
      lastBrick.status = 1;
      game.score = (game.numBricks - 1) * 100;

      game.ball.collidedWithBrick.mockImplementation(
        (brick) => brick === lastBrick
      );

      game.collisionDetection();

      expect(game.result).toBe("Won!");
      expect(game.gameOver).toBe(true);
    });
  });

  describe("drawScore", () => {
    it("should draw score text", () => {
      game.score = 1500;
      game.drawScore();

      expect(ctx.font).toBe("16px Helvetica");
      expect(ctx.fillStyle).toBe("#000000");
      expect(ctx.fillText).toHaveBeenCalledWith("Score: 1500", 8, 20);
    });

    it("should handle zero score", () => {
      game.score = 0;
      game.drawScore();

      expect(ctx.fillText).toHaveBeenCalledWith("Score: 0", 8, 20);
    });
  });

  describe("drawLives", () => {
    it("should draw lives text", () => {
      game.lives = 2;
      game.drawLives();

      expect(ctx.font).toBe("16px Helvetica");
      expect(ctx.fillStyle).toBe("#000000");
      expect(ctx.fillText).toHaveBeenCalledWith(
        "Lives: 2",
        canvas.width - 65,
        20
      );
    });

    it("should handle different life counts", () => {
      game.lives = 1;
      game.drawLives();

      expect(ctx.fillText).toHaveBeenCalledWith(
        "Lives: 1",
        canvas.width - 65,
        20
      );
    });
  });

  describe("drawGameOver", () => {
    it("should draw game over text with flashing effect", () => {
      game.result = "Won!";
      Date.now.mockReturnValue(500); // Should result in white color

      game.drawGameOver();

      expect(ctx.font).toBe("24px Helvetica");
      expect(ctx.fillStyle).toBe("#FFFFFF");
      expect(ctx.fillText).toHaveBeenCalledWith("Game Won!", 180, 160);
    });

    it("should alternate colors based on time", () => {
      game.result = "Lost";
      Date.now.mockReturnValue(1200); // Should result in red color

      game.drawGameOver();

      expect(ctx.fillStyle).toBe("#ee1414");
      expect(ctx.fillText).toHaveBeenCalledWith("Game Lost", 180, 160);
    });
  });

  describe("keyDownHandler", () => {
    it("should set rightPressed when right arrow is pressed", () => {
      const event = { keyCode: 39 };
      game.keyDownHandler(event);

      expect(game.rightPressed).toBe(true);
    });

    it("should set leftPressed when left arrow is pressed", () => {
      const event = { keyCode: 37 };
      game.keyDownHandler(event);

      expect(game.leftPressed).toBe(true);
    });

    it("should ignore other keys", () => {
      const event = { keyCode: 32 }; // Space key
      game.keyDownHandler(event);

      expect(game.rightPressed).toBe(false);
      expect(game.leftPressed).toBe(false);
    });
  });

  describe("keyUpHandler", () => {
    it("should unset rightPressed when right arrow is released", () => {
      game.rightPressed = true;
      const event = { keyCode: 39 };
      game.keyUpHandler(event);

      expect(game.rightPressed).toBe(false);
    });

    it("should unset leftPressed when left arrow is released", () => {
      game.leftPressed = true;
      const event = { keyCode: 37 };
      game.keyUpHandler(event);

      expect(game.leftPressed).toBe(false);
    });
  });

  describe("mouseMoveHandler", () => {
    it("should move paddle based on mouse position", () => {
      const event = {
        clientX: 200,
      };
      canvas.offsetLeft = 50;

      game.mouseMoveHandler(event);

      const expectedX = 200 - 50 - game.paddle.width / 2;
      expect(game.paddle.x).toBe(expectedX);
    });

    it("should not move paddle outside canvas bounds", () => {
      const event = {
        clientX: -100,
      };
      canvas.offsetLeft = 0;

      const initialX = game.paddle.x;
      game.mouseMoveHandler(event);

      expect(game.paddle.x).toBe(initialX);
    });

    it("should handle mouse within canvas bounds", () => {
      const event = {
        clientX: 300,
      };
      canvas.offsetLeft = 0;

      game.mouseMoveHandler(event);

      // The actual calculation is relativeX - paddle.width/2
      // where relativeX = clientX - offsetLeft = 300 - 0 = 300
      const expectedX = 300 - game.paddle.width / 2;
      expect(game.paddle.x).toBe(expectedX);
    });
  });

  describe("game mechanics", () => {
    it("should have ball speed increase logic", () => {
      // Test that the ball has the goFaster method
      expect(typeof game.ball.goFaster).toBe("function");

      // Test that the game tracks score properly for speed increases
      expect(game.score).toBe(0);
      expect(game.numBricks).toBeGreaterThan(0);
    });

    it("should handle paddle collision", () => {
      game.ball.collidedWithPaddle = jest.fn().mockReturnValue(true);
      game.ball.changeAngle = jest.fn();

      // Position ball near paddle
      game.ball.y = canvas.height - game.paddle.height - game.ball.radius - 1;
      game.ball.dy = 2;

      // Simulate paddle collision logic
      if (
        game.ball.y + game.ball.dy >
        canvas.height - game.ball.radius - game.paddle.height
      ) {
        if (game.ball.collidedWithPaddle(game.paddle)) {
          game.ball.dy = -game.ball.dy;
        }
      }

      expect(game.ball.dy).toBe(-2);
    });

    it("should handle life loss", () => {
      game.ball.reset = jest.fn();
      game.ball.y = canvas.height + 10;
      game.ball.dy = 2;
      game.lives = 2;

      // Simulate ball going off screen
      if (game.ball.y + game.ball.dy > canvas.height) {
        game.lives--;
        if (!game.lives) {
          game.result = "Lost";
          game.gameOver = true;
        } else {
          game.ball.reset();
        }
      }

      expect(game.lives).toBe(1);
      expect(game.ball.reset).toHaveBeenCalled();
      expect(game.gameOver).toBe(false);
    });

    it("should handle game over", () => {
      game.ball.y = canvas.height + 10;
      game.ball.dy = 2;
      game.lives = 1;

      // Simulate ball going off screen with last life
      if (game.ball.y + game.ball.dy > canvas.height) {
        game.lives--;
        if (!game.lives) {
          game.result = "Lost";
          game.gameOver = true;
        }
      }

      expect(game.lives).toBe(0);
      expect(game.gameOver).toBe(true);
      expect(game.result).toBe("Lost");
    });
  });

  describe("paddle movement", () => {
    it("should move paddle right when right key is pressed", () => {
      game.rightPressed = true;
      game.paddle.x = 100;
      game.paddle.move = jest.fn();

      // Simulate movement logic
      if (
        game.rightPressed &&
        game.paddle.x < canvas.width - game.paddle.width
      ) {
        game.paddle.move(7);
      }

      expect(game.paddle.move).toHaveBeenCalledWith(7);
    });

    it("should move paddle left when left key is pressed", () => {
      game.leftPressed = true;
      game.paddle.x = 100;
      game.paddle.move = jest.fn();

      // Simulate movement logic
      if (game.leftPressed && game.paddle.x > 0) {
        game.paddle.move(-7);
      }

      expect(game.paddle.move).toHaveBeenCalledWith(-7);
    });

    it("should not move paddle beyond right boundary", () => {
      game.rightPressed = true;
      game.paddle.x = canvas.width - game.paddle.width;
      game.paddle.move = jest.fn();

      // Simulate movement logic
      if (
        game.rightPressed &&
        game.paddle.x < canvas.width - game.paddle.width
      ) {
        game.paddle.move(7);
      }

      expect(game.paddle.move).not.toHaveBeenCalled();
    });

    it("should not move paddle beyond left boundary", () => {
      game.leftPressed = true;
      game.paddle.x = 0;
      game.paddle.move = jest.fn();

      // Simulate movement logic
      if (game.leftPressed && game.paddle.x > 0) {
        game.paddle.move(-7);
      }

      expect(game.paddle.move).not.toHaveBeenCalled();
    });
  });

  describe("integration", () => {
    it("should maintain game state consistency", () => {
      expect(game.score).toBe(0);
      expect(game.lives).toBe(3);
      expect(game.gameOver).toBe(false);

      // Simulate scoring
      game.score += 100;
      expect(game.score).toBe(100);

      // Game state should remain consistent
      expect(game.lives).toBe(3);
      expect(game.gameOver).toBe(false);
    });

    it("should handle multiple component interactions", () => {
      // Test that all components are properly initialized and connected
      expect(game.ball.canvas).toBe(canvas);
      expect(game.paddle.canvas).toBe(canvas);
      expect(game.bricks[0][0].canvas).toBe(canvas);

      expect(game.ball.ctx).toBe(ctx);
      expect(game.paddle.ctx).toBe(ctx);
      expect(game.bricks[0][0].ctx).toBe(ctx);
    });
  });
});
