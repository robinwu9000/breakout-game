// Load the BrickPattern class
require("../lib/brick.js");
require("../lib/brick_pattern.js");

describe("BrickPattern", () => {
  let canvas, ctx, brickPattern;

  beforeEach(() => {
    canvas = mockCanvas;
    ctx = mockContext;
    brickPattern = new Breakout.BrickPattern(canvas, ctx);

    // Reset mocks
    jest.clearAllMocks();
    // Reset Math.random mock
    Math.random.mockReturnValue(0.5);
  });

  describe("constructor", () => {
    it("should initialize with default values", () => {
      expect(brickPattern.canvas).toBe(canvas);
      expect(brickPattern.ctx).toBe(ctx);
      expect(brickPattern.colBricks).toBe(8);
      expect(brickPattern.rowBricks).toBe(4);
      expect(brickPattern.brickWidth).toBe(50);
      expect(brickPattern.brickHeight).toBe(11);
      expect(brickPattern.padding).toBe(6);
      expect(brickPattern.offsetTop).toBe(30);
      expect(brickPattern.offsetLeft).toBe(20);
      expect(brickPattern.bricks).toEqual([]);
      expect(brickPattern.numBricks).toBe(0);
    });

    it("should initialize with custom options", () => {
      const options = {
        colBricks: 10,
        rowBricks: 6,
        brickWidth: 60,
        brickHeight: 15,
        padding: 8,
      };
      const customPattern = new Breakout.BrickPattern(canvas, ctx, options);

      expect(customPattern.colBricks).toBe(10);
      expect(customPattern.rowBricks).toBe(6);
      expect(customPattern.brickWidth).toBe(60);
      expect(customPattern.brickHeight).toBe(15);
      expect(customPattern.padding).toBe(8);
      expect(customPattern.offsetTop).toBe(30);
      expect(customPattern.offsetLeft).toBe(20);
    });
  });

  describe("addBricks", () => {
    it("should create correct number of bricks", () => {
      const bricks = brickPattern.addBricks();

      expect(bricks.length).toBe(brickPattern.rowBricks);
      expect(bricks[0].length).toBe(brickPattern.colBricks);
      expect(brickPattern.numBricks).toBe(
        brickPattern.rowBricks * brickPattern.colBricks
      );
    });

    it("should create bricks with correct positions", () => {
      const bricks = brickPattern.addBricks();

      // Check first brick position
      const firstBrick = bricks[0][0];
      expect(firstBrick.x).toBe(brickPattern.offsetLeft);
      expect(firstBrick.y).toBe(brickPattern.offsetTop);

      // Check second brick in first row
      const secondBrick = bricks[0][1];
      const expectedX =
        1 * (brickPattern.brickWidth + brickPattern.padding) +
        brickPattern.offsetLeft;
      expect(secondBrick.x).toBe(expectedX);
      expect(secondBrick.y).toBe(brickPattern.offsetTop);
    });

    it("should create bricks with correct dimensions", () => {
      const bricks = brickPattern.addBricks();

      bricks.forEach((row) => {
        row.forEach((brick) => {
          expect(brick.width).toBe(brickPattern.brickWidth);
          expect(brick.height).toBe(brickPattern.brickHeight);
        });
      });
    });

    it("should create Brick instances", () => {
      const bricks = brickPattern.addBricks();

      bricks.forEach((row) => {
        row.forEach((brick) => {
          expect(brick).toBeInstanceOf(Breakout.Brick);
          expect(brick.canvas).toBe(canvas);
          expect(brick.ctx).toBe(ctx);
        });
      });
    });

    it("should assign colors to rows", () => {
      const bricks = brickPattern.addBricks();

      // All bricks in the same row should have the same color
      bricks.forEach((row) => {
        const rowColor = row[0].color;
        row.forEach((brick) => {
          expect(brick.color).toBe(rowColor);
        });
      });
    });

    it("should create bricks with status 1", () => {
      const bricks = brickPattern.addBricks();

      bricks.forEach((row) => {
        row.forEach((brick) => {
          expect(brick.status).toBe(1);
        });
      });
    });
  });

  describe("numStartBricks", () => {
    it("should return the total number of bricks", () => {
      brickPattern.addBricks();
      const numBricks = brickPattern.numStartBricks();

      expect(numBricks).toBe(brickPattern.numBricks);
      expect(numBricks).toBe(brickPattern.rowBricks * brickPattern.colBricks);
    });

    it("should return 0 before bricks are added", () => {
      const numBricks = brickPattern.numStartBricks();
      expect(numBricks).toBe(0);
    });

    it("should work with custom dimensions", () => {
      const customPattern = new Breakout.BrickPattern(canvas, ctx, {
        colBricks: 5,
        rowBricks: 3,
      });

      customPattern.addBricks();
      const numBricks = customPattern.numStartBricks();

      expect(numBricks).toBe(15);
    });
  });

  describe("color assignment", () => {
    it("should use predefined colors", () => {
      const expectedColors = [
        "#3dd517",
        "#f01313",
        "#2521cb",
        "#d6d410",
        "#8d1bd2",
        "#e68d17",
      ];

      const bricks = brickPattern.addBricks();

      // Collect all unique colors used
      const usedColors = new Set();
      bricks.forEach((row) => {
        if (row.length > 0) {
          usedColors.add(row[0].color);
        }
      });

      // All used colors should be from the expected set
      usedColors.forEach((color) => {
        expect(expectedColors).toContain(color);
      });
    });
  });

  describe("positioning calculations", () => {
    it("should calculate positions correctly with different padding", () => {
      const pattern = new Breakout.BrickPattern(canvas, ctx, {
        colBricks: 3,
        rowBricks: 2,
        brickWidth: 50,
        brickHeight: 20,
        padding: 10,
      });

      const bricks = pattern.addBricks();

      // First row positions
      expect(bricks[0][0].x).toBe(20); // offsetLeft
      expect(bricks[0][1].x).toBe(80); // 20 + 50 + 10
      expect(bricks[0][2].x).toBe(140); // 20 + (50 + 10) * 2

      // Second row positions
      expect(bricks[1][0].y).toBe(60); // 30 + 20 + 10
      expect(bricks[1][1].y).toBe(60);
      expect(bricks[1][2].y).toBe(60);
    });
  });
});
