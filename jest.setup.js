// Mock canvas and 2D context for testing
const mockCanvas = {
  width: 480,
  height: 320,
  getContext: jest.fn(() => mockContext),
};

const mockContext = {
  beginPath: jest.fn(),
  arc: jest.fn(),
  rect: jest.fn(),
  fill: jest.fn(),
  closePath: jest.fn(),
  clearRect: jest.fn(),
  fillText: jest.fn(),
  fillStyle: "",
  font: "",
};

// Mock jQuery
global.$ = jest.fn((selector) => {
  if (typeof selector === "function") {
    // Document ready
    selector();
    return;
  }

  const mockJQuery = {
    keydown: jest.fn(),
    keyup: jest.fn(),
    mousemove: jest.fn(),
  };

  return mockJQuery;
});

global.$.fn = {};

// Mock document
global.document = {
  ...global.document,
  keydown: jest.fn(),
  keyup: jest.fn(),
  mousemove: jest.fn(),
};

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((callback) => {
  setTimeout(callback, 16);
});

// Mock Math.random for consistent testing
const mockMath = Object.create(global.Math);
mockMath.random = jest.fn(() => 0.5);
global.Math = mockMath;

// Mock Date.now for consistent testing
global.Date.now = jest.fn(() => 1000);

// Export mocks for use in tests
global.mockCanvas = mockCanvas;
global.mockContext = mockContext;
