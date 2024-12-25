const parseMap = (map: string) => {
  const lines = map.trim().split("\n");
  const isLock = lines[0].startsWith("#".repeat(lines[0].length));

  const countFillPerCol = {} as Record<number, number>;

  for (let col = 0; col < lines[0].length; col++) {
    let count = 0;
    for (let row = 0; row < lines.length; row++) {
      if (lines[row][col] === "#") {
        count++;
      }
    }
    countFillPerCol[col] = count;
  }

  return { isLock, countFillPerCol };
};

const calcCounterPart = (
  countFillPerCol: Record<number, number>,
  maxColLength: number
) => {
  const counterPart = {} as Record<number, number>;
  for (let col = 0; col < Object.keys(countFillPerCol).length; col++) {
    counterPart[col] = maxColLength - countFillPerCol[col];
  }
  return counterPart;
};

export const solvePart1 = (input: string) => {
  // Record<stringified countFillPerCol, isLock>
  const memLocks = {} as Record<string, Record<number, number>>;
  // Record<stringified countFillPerCol, isKey>
  const memKeys = {} as Record<string, Record<number, number>>;
  const maps = input.trim().split("\n\n");

  const amountCols = maps[0].split("\n")[0].length;
  const maxColLength = maps[0].split("\n").length;

  for (const map of maps) {
    const { isLock, countFillPerCol } = parseMap(map);
    if (isLock)
      memLocks[Object.values(countFillPerCol).join(",")] = countFillPerCol;
    if (!isLock)
      memKeys[Object.values(countFillPerCol).join(",")] = countFillPerCol;
  }

  let count = 0;

  for (const key of Object.values(memKeys)) {
    for (const lock of Object.values(memLocks)) {
      let invalidFlag = false;
      for (let colI = 0; colI < amountCols; colI++) {
        if (key[colI] + lock[colI] > maxColLength) {
          invalidFlag = true;
          break;
        }
      }
      if (!invalidFlag) {
        count++;
      }
    }
  }

  return count;
};

export const solvePart2 = (input: string) => {
  return 0;
};
