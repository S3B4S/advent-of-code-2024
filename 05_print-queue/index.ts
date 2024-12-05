export const solvePart1 = (input: string) => {
  const [ordering, books] = input.trim().split("\n\n");
  const orders = ordering
    .split("\n")
    .map((x) => x.split("|").map((y) => Number(y)));

  const orderGroups: Record<number, Record<number, number>> = {};
  for (const order of orders) {
    const [first, second] = order;
    if (!orderGroups[first]) {
      orderGroups[first] = {};
    }

    orderGroups[first][second] = 1;
  }

  let count = 0;
  for (const book of books.split("\n")) {
    const bookNorm = book.split(",").map((x) => Number(x));

    let invalid = false;
    for (let i = bookNorm.length - 1; i > 0; i--) {
      for (let j = i - 1; j >= 0; j--) {
        if (!orderGroups[bookNorm[i]]) continue;
        if (orderGroups[bookNorm[i]][bookNorm[j]]) {
          invalid = true;
        }
      }
    }
    if (invalid) {
      continue;
    }

    // Now we know that the current bookNorm is correct
    count += bookNorm[(bookNorm.length - 1) / 2];
  }

  return count;
};

export const solvePart2 = (input: string) => {
  return 0;
};
