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
export const removeFromArray = (array: any[], index: number) => {
  array.splice(index, 1);
};

/**
 * Mutating
 * @param array
 * @param index
 * @param item
 * @returns
 */
export const insertInArray = (array: any[], index: number, item: any) => {
  array.splice(index, 0, item);
};
