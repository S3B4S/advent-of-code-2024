import { insertInArray, removeFromArray } from "../utils/list.ts";
import { isOdd } from "../utils/number.ts";

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

  while (freeSpacePointer < toMovePointer) {
    if (buffer[freeSpacePointer].amount < buffer[toMovePointer].amount) {
      // Free space will be entirely filled up
      buffer[freeSpacePointer].status = "occupied";
      buffer[freeSpacePointer].id = buffer[toMovePointer].id;

      buffer[toMovePointer].amount -= buffer[freeSpacePointer].amount;
    } else if (buffer[freeSpacePointer].amount > buffer[toMovePointer].amount) {
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

  let count = 0;
  let fullIndex = 0;
  for (let i = 0; i < buffer.length; i++) {
    if (buffer[i].status !== "occupied") break;

    for (let j = 0; j < buffer[i].amount; j++) {
      count += fullIndex * buffer[i].id!;
      fullIndex += 1;
    }
  }

  return count;
};

export const solvePart2 = (inputRaw: string) => {
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

  while (id > 0) {
    const toMoveIndex = buffer.findIndex((x) => x.id === id);
    const spaceNeeded = buffer[toMoveIndex].amount!;

    // Find first free space
    const freeSpaceIndex = buffer.findIndex(
      (x) => x.status === "free" && x.amount >= spaceNeeded
    );

    if (freeSpaceIndex === -1 || freeSpaceIndex >= toMoveIndex) {
      id--;
      continue;
    }

    // Split space into two
    const newFreeSpace = {
      status: "free",
      id: undefined,
      amount: buffer[freeSpaceIndex].amount - spaceNeeded,
    };

    const newOccupiedSpace = {
      status: "occupied",
      id: id,
      amount: spaceNeeded,
    };

    buffer[toMoveIndex].status = "free";
    buffer[toMoveIndex].id = undefined;

    removeFromArray(buffer, freeSpaceIndex);

    insertInArray(buffer, freeSpaceIndex, newFreeSpace);
    insertInArray(buffer, freeSpaceIndex, newOccupiedSpace);
    id--;
  }

  let fullIndex = 0;
  let count = 0;
  for (let i = 0; i < buffer.length; i++) {
    for (let j = 0; j < buffer[i].amount; j++) {
      if (buffer[i].status === "occupied") {
        count += fullIndex * buffer[i].id!;
      }
      fullIndex += 1;
    }
  }

  return count;
};
