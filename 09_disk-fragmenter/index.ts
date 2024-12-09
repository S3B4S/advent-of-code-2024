import { insertInArray, removeFromArray } from "../utils/list.ts";
import { isEven, isOdd } from "../utils/number.ts";

export const solvePart1 = (inputRaw: string) => {
  const input = inputRaw.trim();
  const buffer = [];

  let id = 0;
  for (let i = 0; i < input.length; i++) {
    buffer.push({
      status: isOdd(i) ? "free" : "occupied",
      id: isOdd(i) ? undefined : id,
      amount: Number(input[i]),
    });

    if (isOdd(i)) {
      id++;
    }
  }

  let freeSpacePointer = 1;
  let toMovePointer = buffer.findLastIndex((x) => x.status === "occupied");

  // console.log(buffer);
  while (freeSpacePointer < toMovePointer) {
    if (buffer[freeSpacePointer].amount < buffer[toMovePointer].amount) {
      // Free space will be entirely filled up
      buffer[freeSpacePointer].status = "occupied";
      buffer[freeSpacePointer].id = buffer[toMovePointer].id;

      buffer[toMovePointer].amount -= buffer[freeSpacePointer].amount;
    } else if (buffer[freeSpacePointer].amount > buffer[toMovePointer].amount) {
      // console.log(buffer);
      // We needd to "split" the current free space into two

      // First, the newly occupied space
      const newOccupiedSpace = {
        status: "occupied",
        id: buffer[toMovePointer].id,
        amount: buffer[toMovePointer].amount,
      };

      // Then, the remaining free space
      const newFreeSpace = {
        status: "free",
        id: undefined,
        amount: buffer[freeSpacePointer].amount - buffer[toMovePointer].amount,
      };

      buffer[toMovePointer].status = "free";
      buffer[toMovePointer].id = undefined;

      removeFromArray(buffer, freeSpacePointer);

      // Spawn new free space
      insertInArray(buffer, freeSpacePointer, newFreeSpace);
      insertInArray(buffer, freeSpacePointer, newOccupiedSpace);
    } else if (
      buffer[freeSpacePointer].amount === buffer[toMovePointer].amount
    ) {
      buffer[freeSpacePointer].id = buffer[toMovePointer].id;
      buffer[freeSpacePointer].status = "occupied";

      buffer[toMovePointer].status = "free";
      buffer[toMovePointer].id = undefined;
    }

    // Move pointer to next free space
    for (let i = freeSpacePointer; i < buffer.length; i++) {
      if (buffer[i].status === "free") {
        freeSpacePointer = i;
        break;
      }
    }

    // Move pointer to previous "to move" space
    for (let i = toMovePointer; i > 0; i--) {
      if (buffer[i].status === "occupied") {
        toMovePointer = i;
        break;
      }
    }
  }
  // console.log(buffer);

  let count = 0;
  let fullIndex = 0;
  for (let i = 0; i < buffer.length; i++) {
    if (buffer[i].status !== "occupied") break;

    for (let j = 0; j < buffer[i].amount; j++) {
      // console.log(fullIndex, buffer[i].id);
      count += fullIndex * buffer[i].id!;
      fullIndex += 1;
    }
  }

  return count;
};

export const solvePart2 = (input: string) => {
  return 0;
};
