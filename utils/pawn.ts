import {
  addCoordinates,
  Board,
  Coordinate,
  Direction,
  relativeCoords,
} from "./board.ts";

/**
 * A pawn is something you can place on a board and move around
 */
export class Pawn {
  private _board: Board<PropertyKey, number>;
  currentPosition: Coordinate;
  currentDirection: Direction;
  lastPosition: Coordinate | undefined;

  constructor(
    board: Board<PropertyKey, number>,
    startingPosition: Coordinate,
    currentDirection: Direction = Direction.N
  ) {
    this._board = board;
    this.currentPosition = startingPosition;
    this.currentDirection = currentDirection;
    this.lastPosition = undefined;
  }

  step(direction: Direction, n: number = 1) {
    for (let i = 0; i < n; i++) {
      this.currentPosition = addCoordinates(
        this.currentPosition,
        relativeCoords[direction]
      );
    }
  }

  /**
   * Peek ahead and based on the value of the upcoming tile, you can change directions
   * @param callback coord is the next position the pawn goes to
   * @param direction
   * @param n
   * @returns true if a step was taken, false if not (due to out of bounds for example)
   */
  conditionalNextStep(
    callback: (coord: Coordinate, value: PropertyKey) => Direction,
    direction: Direction,
    n: number = 1
  ) {
    const peekNextStep = this.predictPosition(direction, n);
    if (!this._board.isWithinBounds(peekNextStep)) {
      return false;
    }
    const nextDirection = callback(
      peekNextStep,
      this._board.getCell(peekNextStep)!
    );
    // Only move if we still go the same direciton.
    if (direction === nextDirection) {
      this.step(nextDirection, n);
    }
    // If direction has changed, then turn to the new direction first

    // Turning is also a "step"
    return true;
  }

  /**
   * Peek ahead and based on the value of the upcoming tile, you can change directions
   * @param callback coord is the next position the pawn goes to
   * @param direction
   * @param n
   * @returns true if a step was taken, false if not (due to out of bounds for example)
   */
  conditionalNextStepV2(
    callback: (args: {
      currentCoordinate: Coordinate;
      currentDirection: Direction;
      potentialCoordinates: { coord: Coordinate; value: string | undefined }[];
    }) => {
      newDirection: Direction;
      newPosition: Coordinate;
    },
    determineNewPosCallback: (args: {
      currentPos: Coordinate;
      currentDir: Direction;
    }) => Coordinate[]
  ) {
    const potentialCoordinates = determineNewPosCallback({
      currentPos: this.currentPosition,
      currentDir: this.currentDirection,
    }).map((coord) => ({
      coord,
      value: this._board.safeGetCell(coord) as string,
    }));

    const res = callback({
      currentCoordinate: this.currentPosition,
      currentDirection: this.currentDirection,
      potentialCoordinates,
    });

    this.currentPosition = res.newPosition;
    this.currentDirection = res.newDirection;

    return res;
  }

  setCurrentPosition(coord: Coordinate) {
    this.lastPosition = this.currentPosition;
    this.currentPosition = coord;
  }

  /**
   *
   * @param direction
   * @param n
   */
  predictPosition(direction: Direction, n: number = 1) {
    let result = this.currentPosition;
    for (let i = 0; i < n; i++) {
      result = addCoordinates(result, relativeCoords[direction]);
    }
    return result;
  }
}
