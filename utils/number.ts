export const isOdd = (x: number) => {
  return x % 2 !== 0;
};

export const isEven = (x: number) => {
  return x % 2 === 0;
};

/**
 * Convert a decimal number to a binary string
 * @param dec - The decimal number to convert
 * @returns The binary string
 */
export const dec2bin = (dec: number) => {
  return (dec >>> 0).toString(2);
};
