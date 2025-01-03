export const count = <T extends PropertyKey>(list: T[]): Record<T, number> => {
  return list.reduce((acc, curr) => {
    if (!acc[curr]) {
      return {
        ...acc,
        [curr]: 1,
      };
    }

    return {
      ...acc,
      [curr]: acc[curr] + 1,
    };
  }, {} as Record<T, number>);
};

export const forEachPair = <T>(callback: (a: T, b: T) => void, list: T[]) => {
  for (let i = 0; i < list.length - 1; i++) {
    for (let j = i + 1; j < list.length; j++) {
      callback(list[i], list[j]);
    }
  }
};

/**
 * This will make a shallow copy of the array, remove the item at the given index, and return the updated array.
 * @param array - The array to remove the item from
 * @param index - The index of the item to remove
 * @returns updated array
 */
export const removeFromArray = (array: unknown[], index: number) => {
  array.splice(index, 1);
};

/**
 * Mutating
 * @param array
 * @param index
 * @param item
 * @returns
 */
export const insertInArray = (
  array: unknown[],
  index: number,
  item: unknown
) => {
  array.splice(index, 0, item);
};

/**
 * Detects amount of gaps in a list of numbers
 * @param list Sorted list of numbers, 0 and positive only
 * @returns
 */
export const detectAmountOfGaps = (list: number[]) => {
  if (list.length <= 1) return 0;
  if (list[list.length - 1] - list[0] === list.length - 1) return 0;

  // There must be gaps, so we try to find the amount of gaps
  let prev = list[0];
  let gaps = 0;

  for (let i = 1; i < list.length; i++) {
    if (prev + 1 !== list[i]) {
      gaps++;
    }

    prev = list[i];
  }

  return gaps;
};

export const zip = <A, B>(a: A[], b: B[]) => {
  return a.map((_, i) => [a[i], b[i]]);
};

/**
 * Checks if elements in the list are grouped together
 * ["A", "A", "B", "C", "D"] -> true
 * ["A", "B", "C", "D", "A"] -> false
 * @param list
 */
export const properlyGrouped = (list: string[]) => {
  const known = new Set();

  let current = list[0];
  known.add(current);

  for (const item of list.slice(1)) {
    if (item === current) {
      continue;
    }

    if (item !== current && !known.has(item)) {
      known.add(item);
      current = item;
      continue;
    }

    if (item !== current && known.has(item)) {
      return false;
    }
  }

  return true;
};

export const partition = <T>(predicate: (item: T) => boolean, list: T[]) => {
  return [list.filter(predicate), list.filter((item) => !predicate(item))];
};
