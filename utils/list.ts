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
