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
  const secrets = input
    .trim()
    .split("\n")
    .map((x) => BigInt(x));

  const changes = [] as number[][];

  const counts = {} as Record<string, Record<number, number>>;

  for (let i = 0; i < secrets.length; i++) {
    changes[i] = [];
    for (let c = 0; c < 2000; c++) {
      const newSecret = transformSecret(secrets[i]);
      const currentChange = Number((newSecret % 10n) - (secrets[i] % 10n));

      if (c > 3) {
        // Look at prev 4 changes
        const prev4Changes = changes[i].slice(-4);
        const key = prev4Changes.join(",");

        if (!counts[key]) {
          counts[key] = {};
          if (!counts[key][i]) counts[key][i] = Number(secrets[i] % 10n);
        }

        if (counts[key] && !counts[key][i])
          counts[key][i] = Number(secrets[i] % 10n);
      }

      changes[i].push(currentChange);
      secrets[i] = newSecret;
    }
  }

  const calcVal = (obj: Record<number, number>) => {
    return Object.values(obj).reduce((acc, curr) => acc + curr, 0);
  };

  // Find max value
  const maxValue = Object.values(counts).reduce((acc, curr) => {
    return calcVal(acc) > calcVal(curr) ? acc : curr;
  });

  return calcVal(maxValue);
};
