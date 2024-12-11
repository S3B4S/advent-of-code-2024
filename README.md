# Advent of Code 2024

A collection of coding puzzles and challenges implemented in TypeScript using Deno.

## Features

- 🏗️ Automated scaffolding for new challenges
- ✅ Test-driven development setup
- 🧪 GitHub Actions CI pipeline
- 🎨 Code formatting and linting
- 📝 Input file handling
- 🛠️ Utility functions for common operations

## Getting Started

### Prerequisites

- [Deno](https://deno.land/) v2.x

### Installation

1. Clone the repository

### Creating a New Puzzle

Use the scaffold command to create a new challenge directory with all necessary files:

```bash
# For todays puzzle
deno task sd
# For a specified puzzle
deno task sd -n "challenge-name" -d <day-number>
```

This will:

- Create a new directory with the format `DD_puzzle-name`
- Generate boilerplate solution and test files
- Download the puzzle input automatically
- Set up example test cases

## Project Structure

```
├── scripts/
│   ├── day-builder.ts    # Scaffolding script
│   └── templates.ts      # File templates
├── utils/
│   ├── board.ts          # Grid/board utilities
│   ├── hashSet.ts        # Custom HashSet implementation
│   └── misc.ts           # Misc helper functions
├── DD_puzzle-name/       # Puzzle solutions
│   ├── index.ts          # Solution implementation
│   ├── index.test.ts     # Tests
│   └── input.txt         # Puzzle input
└── deno.json             # Deno configuration
```

## Testing

Keep in mind that addiitonally you need to grant permissions when using Deno (`-A` to grant all permissions), `--watch` is also very useful when solving a puzzle.
Run all tests:

```bash
deno test
```

Run specific day's tests:

```bash
deno test DD_puzzle-name/
```

Run only example tests (used in CI):

```bash
deno run test:CICD
```

## Key Components

### Board Class

- Coordinate-based navigation
- Directional movement
- Neighbor detection
- Boundary checking

### HashSet

A custom Set implementation that allows complex object storage using custom hash functions.

## CI/CD

GitHub Actions workflow is configured to:

- Run linting
- Execute example tests
- Verify code quality
