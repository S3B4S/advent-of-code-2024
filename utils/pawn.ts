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

  constructor(board: Board<PropertyKey, number>, startingPosition: Coordinate) {
    this._board = board;
    this.currentPosition = startingPosition;
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
    const peekNextStep = this.peekStep(direction, n);
    if (!this._board.isWithinBounds(peekNextStep)) return false;
    const nextDirection = callback(
      peekNextStep,
      this._board.getCell(peekNextStep)!
    );
    // Only move if we still go the same direciton.
    // If direction has changed, first only turn around
    if (direction === nextDirection) {
      this.step(nextDirection, n);
    }
    // Turning around is also a "step"
    return true;
  }

  /**
   *
   * @param direction
   * @param n
   */
  peekStep(direction: Direction, n: number = 1) {
    let result = this.currentPosition;
    for (let i = 0; i < n; i++) {
      result = addCoordinates(result, relativeCoords[direction]);
    }
    return result;
  }
}
