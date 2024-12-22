const mix = (value: bigint, secret: bigint) => {
  return value ^ secret;
};

const prune = (secret: bigint) => {
  return secret % 16777216n;
};

const transformSecret = (secret: bigint) => {
  const step1 = prune(mix(64n * secret, secret));
  const step2 = prune(mix(step1 / 32n, step1));
  const step3 = prune(mix(step2 * 2048n, step2));
  return step3;
};

export const solvePart1 = (input: string) => {
  const secrets = input
    .trim()
    .split("\n")
    .map((x) => BigInt(x));

  for (let i = 0; i < secrets.length; i++) {
    for (let c = 0; c < 2000; c++) {
      secrets[i] = transformSecret(secrets[i]);
    }
  }

  return secrets.reduce((acc, curr) => acc + curr, 0n);
};

export const solvePart2 = (input: string) => {
  return 0;
};
