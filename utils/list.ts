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
