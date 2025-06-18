# Breakout Game - Jest Testing Suite

This repository now includes a comprehensive Jest testing suite that provides robust test coverage for all game functionality.

## Test Coverage Summary

- **108 tests passing** across 5 test suites
- **84.29% overall code coverage**
- Individual component coverage:
  - Ball: 100% coverage
  - Brick: 100% coverage
  - Paddle: 100% coverage
  - BrickPattern: 97.5% coverage
  - Game: 64.42% coverage (main game loop not fully testable in unit tests)

## Test Structure

### Test Files

- `__tests__/ball.test.js` - Tests for Ball class (18 tests)
- `__tests__/paddle.test.js` - Tests for Paddle class (15 tests)
- `__tests__/brick.test.js` - Tests for Brick class (20 tests)
- `__tests__/game.test.js` - Tests for Game class (42 tests)
- `__tests__/brick_pattern.test.js` - Tests for BrickPattern class

### Test Categories

#### Ball Tests

- Constructor initialization with default and custom options
- Drawing functionality
- Movement mechanics
- Velocity changes and speed limits
- Wall collision detection
- Paddle collision detection
- Brick collision detection (including corner cases)
- Speed increase functionality
- Reset functionality

#### Paddle Tests

- Constructor initialization
- Drawing functionality
- Movement in all directions
- Boundary handling
- Canvas integration

#### Brick Tests

- Constructor with various options
- Drawing based on status
- Status management (visible/destroyed)
- Color handling
- Position and dimension handling
- Lifecycle management

#### Game Tests

- Component initialization
- Game state management
- Event handlers (keyboard and mouse)
- Collision detection system
- Scoring system
- Lives management
- Game over conditions
- Win conditions
- Drawing functions (score, lives, game over)
- Paddle movement logic

#### BrickPattern Tests

- Constructor initialization
- Brick creation and positioning
- Grid layout generation
- Brick counting

## Running Tests

### Basic Test Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Configuration

The Jest configuration is set up in `package.json`:

- **Environment**: jsdom (for browser-like testing)
- **Setup**: `jest.setup.js` provides mocks for canvas, jQuery, and browser APIs
- **Coverage**: Collects coverage from all `lib/**/*.js` files
- **Reports**: Text, LCOV, and HTML coverage reports

## Mock Setup

The `jest.setup.js` file provides:

- Canvas and 2D context mocks
- jQuery mocks for event handling
- Browser API mocks (requestAnimationFrame, Date.now, Math.random)
- Consistent test environment setup

## Test Philosophy

The test suite focuses on:

1. **Unit Testing**: Each class is tested in isolation
2. **Functionality Coverage**: All public methods and key behaviors
3. **Edge Cases**: Boundary conditions and error scenarios
4. **Integration Points**: How components interact
5. **Game Logic**: Core game mechanics and rules

## Key Testing Features

- **Comprehensive Mocking**: All external dependencies are mocked
- **Deterministic Tests**: Random functions are mocked for consistent results
- **Isolated Testing**: Each test is independent and can run in any order
- **Clear Descriptions**: Test names clearly describe what is being tested
- **Grouped Organization**: Tests are logically grouped by functionality

## Benefits

This testing suite provides:

- **Confidence**: Changes can be made knowing tests will catch regressions
- **Documentation**: Tests serve as living documentation of expected behavior
- **Refactoring Safety**: Code can be refactored with confidence
- **Bug Prevention**: Edge cases and error conditions are tested
- **Code Quality**: High test coverage ensures robust implementation

The test suite successfully validates all core game functionality and provides a solid foundation for future development and maintenance.
