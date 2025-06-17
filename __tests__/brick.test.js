// Load the Brick class
require("../lib/brick.js");

describe("Brick", () => {
  let canvas, ctx, brick;

  beforeEach(() => {
    canvas = mockCanvas;
    ctx = mockContext;
    brick = new Breakout.Brick(canvas, ctx);

    // Reset mocks
    jest.clearAllMocks();
  });

  describe("constructor", () => {
    it("should initialize with default values", () => {
      expect(brick.canvas).toBe(canvas);
      expect(brick.ctx).toBe(ctx);
      expect(brick.color).toBe("#f01313");
      expect(brick.x).toBe(0);
      expect(brick.y).toBe(0);
      expect(brick.width).toBe(75);
      expect(brick.height).toBe(20);
      expect(brick.status).toBe(1);
    });

    it("should initialize with custom options", () => {
      const options = {
        color: "#00ff00",
        x: 100,
        y: 50,
        width: 60,
        height: 15,
        status: 2, // Use 2 instead of 0 since 0 is falsy and defaults to 1
      };
      const customBrick = new Breakout.Brick(canvas, ctx, options);

      expect(customBrick.color).toBe("#00ff00");
      expect(customBrick.x).toBe(100);
      expect(customBrick.y).toBe(50);
      expect(customBrick.width).toBe(60);
      expect(customBrick.height).toBe(15);
      expect(customBrick.status).toBe(2);
    });

    it("should handle partial options", () => {
      const options = {
        x: 200,
        color: "#blue",
      };
      const partialBrick = new Breakout.Brick(canvas, ctx, options);

      expect(partialBrick.x).toBe(200);
      expect(partialBrick.color).toBe("#blue");
      expect(partialBrick.y).toBe(0); // default
      expect(partialBrick.width).toBe(75); // default
      expect(partialBrick.height).toBe(20); // default
      expect(partialBrick.status).toBe(1); // default
    });

    it("should handle empty options object", () => {
      const emptyBrick = new Breakout.Brick(canvas, ctx, {});

      expect(emptyBrick.color).toBe("#f01313");
      expect(emptyBrick.x).toBe(0);
      expect(emptyBrick.y).toBe(0);
      expect(emptyBrick.width).toBe(75);
      expect(emptyBrick.height).toBe(20);
      expect(emptyBrick.status).toBe(1);
    });
  });

  describe("draw", () => {
    it("should draw the brick when status is 1", () => {
      brick.status = 1;
      brick.draw();

      expect(ctx.beginPath).toHaveBeenCalled();
      expect(ctx.rect).toHaveBeenCalledWith(
        brick.x,
        brick.y,
        brick.width,
        brick.height
      );
      expect(ctx.fillStyle).toBe(brick.color);
      expect(ctx.fill).toHaveBeenCalled();
      expect(ctx.closePath).toHaveBeenCalled();
    });

    it("should not draw the brick when status is 0", () => {
      brick.status = 0;
      brick.draw();

      expect(ctx.beginPath).not.toHaveBeenCalled();
      expect(ctx.rect).not.toHaveBeenCalled();
      expect(ctx.fill).not.toHaveBeenCalled();
      expect(ctx.closePath).not.toHaveBeenCalled();
    });

    it("should draw with custom color", () => {
      brick.color = "#123456";
      brick.status = 1;
      brick.draw();

      expect(ctx.fillStyle).toBe("#123456");
    });

    it("should draw at custom position", () => {
      brick.x = 150;
      brick.y = 75;
      brick.status = 1;
      brick.draw();

      expect(ctx.rect).toHaveBeenCalledWith(150, 75, brick.width, brick.height);
    });

    it("should draw with custom dimensions", () => {
      brick.width = 100;
      brick.height = 25;
      brick.status = 1;
      brick.draw();

      expect(ctx.rect).toHaveBeenCalledWith(brick.x, brick.y, 100, 25);
    });
  });

  describe("status management", () => {
    it("should be visible by default", () => {
      expect(brick.status).toBe(1);
    });

    it("should allow status to be changed", () => {
      brick.status = 0;
      expect(brick.status).toBe(0);

      brick.status = 1;
      expect(brick.status).toBe(1);
    });

    it("should handle different status values", () => {
      // Test various status values
      brick.status = 2;
      brick.draw();
      expect(ctx.beginPath).not.toHaveBeenCalled();

      brick.status = -1;
      brick.draw();
      expect(ctx.beginPath).not.toHaveBeenCalled();

      brick.status = 1;
      brick.draw();
      expect(ctx.beginPath).toHaveBeenCalled();
    });
  });

  describe("positioning and dimensions", () => {
    it("should handle negative positions", () => {
      brick.x = -10;
      brick.y = -5;
      brick.status = 1;
      brick.draw();

      expect(ctx.rect).toHaveBeenCalledWith(-10, -5, brick.width, brick.height);
    });

    it("should handle zero dimensions", () => {
      brick.width = 0;
      brick.height = 0;
      brick.status = 1;
      brick.draw();

      expect(ctx.rect).toHaveBeenCalledWith(brick.x, brick.y, 0, 0);
    });

    it("should handle large dimensions", () => {
      brick.width = 1000;
      brick.height = 500;
      brick.status = 1;
      brick.draw();

      expect(ctx.rect).toHaveBeenCalledWith(brick.x, brick.y, 1000, 500);
    });

    it("should handle fractional positions and dimensions", () => {
      brick.x = 10.5;
      brick.y = 20.7;
      brick.width = 75.3;
      brick.height = 20.8;
      brick.status = 1;
      brick.draw();

      expect(ctx.rect).toHaveBeenCalledWith(10.5, 20.7, 75.3, 20.8);
    });
  });

  describe("color handling", () => {
    it("should handle different color formats", () => {
      const colors = [
        "#ff0000",
        "#FF0000",
        "red",
        "rgb(255, 0, 0)",
        "rgba(255, 0, 0, 0.5)",
        "hsl(0, 100%, 50%)",
      ];

      colors.forEach((color) => {
        brick.color = color;
        brick.status = 1;
        brick.draw();
        expect(ctx.fillStyle).toBe(color);
        jest.clearAllMocks();
      });
    });

    it("should handle empty color string", () => {
      brick.color = "";
      brick.status = 1;
      brick.draw();

      expect(ctx.fillStyle).toBe("");
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

      const customBrick = new Breakout.Brick(customCanvas, customCtx);
      customBrick.draw();

      expect(customCtx.beginPath).toHaveBeenCalled();
      expect(customCtx.rect).toHaveBeenCalled();
      expect(customCtx.fill).toHaveBeenCalled();
      expect(customCtx.closePath).toHaveBeenCalled();
    });

    it("should maintain reference to canvas and context", () => {
      expect(brick.canvas).toBe(canvas);
      expect(brick.ctx).toBe(ctx);
    });
  });

  describe("brick lifecycle", () => {
    it("should simulate brick being destroyed", () => {
      // Initially visible
      expect(brick.status).toBe(1);
      brick.draw();
      expect(ctx.beginPath).toHaveBeenCalled();

      jest.clearAllMocks();

      // Destroy brick
      brick.status = 0;
      brick.draw();
      expect(ctx.beginPath).not.toHaveBeenCalled();
    });

    it("should allow brick to be restored", () => {
      brick.status = 0;
      brick.draw();
      expect(ctx.beginPath).not.toHaveBeenCalled();

      jest.clearAllMocks();

      brick.status = 1;
      brick.draw();
      expect(ctx.beginPath).toHaveBeenCalled();
    });
  });
});
