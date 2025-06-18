// Load the Paddle class
require("../lib/paddle.js");

describe("Paddle", () => {
  let canvas, ctx, paddle;

  beforeEach(() => {
    canvas = mockCanvas;
    ctx = mockContext;
    paddle = new Breakout.Paddle(canvas, ctx);

    // Reset mocks
    jest.clearAllMocks();
  });

  describe("constructor", () => {
    it("should initialize with default values", () => {
      expect(paddle.canvas).toBe(canvas);
      expect(paddle.ctx).toBe(ctx);
      expect(paddle.height).toBe(10);
      expect(paddle.width).toBe(75);
      expect(paddle.x).toBe((canvas.width - paddle.width) / 2);
    });

    it("should initialize with custom options", () => {
      const options = {
        paddleHeight: 15,
        paddleWidth: 100,
      };
      const customPaddle = new Breakout.Paddle(canvas, ctx, options);

      expect(customPaddle.height).toBe(15);
      expect(customPaddle.width).toBe(100);
      expect(customPaddle.x).toBe((canvas.width - customPaddle.width) / 2);
    });

    it("should center paddle horizontally on canvas", () => {
      const expectedX = (canvas.width - paddle.width) / 2;
      expect(paddle.x).toBe(expectedX);
    });
  });

  describe("draw", () => {
    it("should draw the paddle using canvas context", () => {
      paddle.draw();

      expect(ctx.beginPath).toHaveBeenCalled();
      expect(ctx.rect).toHaveBeenCalledWith(
        paddle.x,
        canvas.height - paddle.height,
        paddle.width,
        paddle.height
      );
      expect(ctx.fillStyle).toBe("#259a3b");
      expect(ctx.fill).toHaveBeenCalled();
      expect(ctx.closePath).toHaveBeenCalled();
    });

    it("should draw paddle at bottom of canvas", () => {
      paddle.draw();

      expect(ctx.rect).toHaveBeenCalledWith(
        expect.any(Number),
        canvas.height - paddle.height,
        expect.any(Number),
        expect.any(Number)
      );
    });
  });

  describe("move", () => {
    it("should move paddle right when direction is positive", () => {
      const initialX = paddle.x;
      const direction = 5;

      paddle.move(direction);

      expect(paddle.x).toBe(initialX + direction);
    });

    it("should move paddle left when direction is negative", () => {
      const initialX = paddle.x;
      const direction = -5;

      paddle.move(direction);

      expect(paddle.x).toBe(initialX + direction);
    });

    it("should not move when direction is zero", () => {
      const initialX = paddle.x;

      paddle.move(0);

      expect(paddle.x).toBe(initialX);
    });

    it("should handle large movement values", () => {
      const initialX = paddle.x;
      const direction = 50;

      paddle.move(direction);

      expect(paddle.x).toBe(initialX + direction);
    });

    it("should handle fractional movement values", () => {
      const initialX = paddle.x;
      const direction = 2.5;

      paddle.move(direction);

      expect(paddle.x).toBe(initialX + direction);
    });
  });

  describe("positioning", () => {
    it("should allow paddle to be positioned anywhere on canvas", () => {
      paddle.x = 100;
      expect(paddle.x).toBe(100);

      paddle.x = 0;
      expect(paddle.x).toBe(0);

      paddle.x = canvas.width - paddle.width;
      expect(paddle.x).toBe(canvas.width - paddle.width);
    });

    it("should maintain position after drawing", () => {
      paddle.x = 150;
      const expectedX = paddle.x;

      paddle.draw();

      expect(paddle.x).toBe(expectedX);
    });
  });

  describe("boundary conditions", () => {
    it("should handle movement beyond canvas boundaries", () => {
      // Move paddle to far right
      paddle.x = canvas.width;
      paddle.move(10);
      expect(paddle.x).toBe(canvas.width + 10);

      // Move paddle to far left
      paddle.x = -50;
      paddle.move(-10);
      expect(paddle.x).toBe(-60);
    });

    it("should work with different canvas sizes", () => {
      const smallCanvas = { width: 200, height: 150 };
      const smallPaddle = new Breakout.Paddle(smallCanvas, ctx);

      expect(smallPaddle.x).toBe((smallCanvas.width - smallPaddle.width) / 2);

      const largeCanvas = { width: 1000, height: 600 };
      const largePaddle = new Breakout.Paddle(largeCanvas, ctx);

      expect(largePaddle.x).toBe((largeCanvas.width - largePaddle.width) / 2);
    });
  });

  describe("integration with canvas context", () => {
    it("should use provided canvas and context", () => {
      const customCanvas = { width: 600, height: 400 };
      const customCtx = {
        beginPath: jest.fn(),
        rect: jest.fn(),
        fill: jest.fn(),
        closePath: jest.fn(),
        fillStyle: "",
      };

      const customPaddle = new Breakout.Paddle(customCanvas, customCtx);
      customPaddle.draw();

      expect(customCtx.beginPath).toHaveBeenCalled();
      expect(customCtx.rect).toHaveBeenCalled();
      expect(customCtx.fill).toHaveBeenCalled();
      expect(customCtx.closePath).toHaveBeenCalled();
    });
  });
});
