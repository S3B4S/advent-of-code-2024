export const solvePart1 = (input: string) => {
  const [ordering, books] = input.trim().split("\n\n");
  const orders = ordering.split("\n").map((x) => x.split("|"));

  const orderGroups: Record<string, Record<string, number>> = {};
  for (const order of orders) {
    const [first, second] = order;
    if (!orderGroups[first]) {
      orderGroups[first] = {};
    }

    orderGroups[first][second] = 1;
  }

  let count = 0;
  for (const book of books.split("\n")) {
    const bookNorm = book.split(",");

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
    count += Number(bookNorm[(bookNorm.length - 1) / 2]);
  }

  return count;
};

export const solvePart2 = (input: string) => {
  const [ordering, books] = input.trim().split("\n\n");
  const orders = ordering.split("\n").map((x) => x.split("|"));

  const orderGroups: Record<string, Record<string, number>> = {};
  for (const order of orders) {
    const [first, second] = order;
    if (!orderGroups[first]) {
      orderGroups[first] = {};
    }

    orderGroups[first][second] = 1;
  }

  const wrongBooks = [];
  for (const book of books.split("\n")) {
    const bookNorm = book.split(",");

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
      wrongBooks.push(bookNorm);
    }
  }

  const fixBook = (wrongBook: string[]) => {
    for (let i = wrongBook.length - 1; i > 0; i--) {
      for (let j = i - 1; j >= 0; j--) {
        if (!orderGroups[wrongBook[i]]) continue;
        if (orderGroups[wrongBook[i]][wrongBook[j]]) {
          // Found an incorrect order, swap
          const temp = wrongBook[i];
          wrongBook[i] = wrongBook[j];
          wrongBook[j] = temp;
          return fixBook(wrongBook);
        }
      }
    }

    // Fixed now!
    return wrongBook;
  };

  const fixedBooks = wrongBooks.map(fixBook);
  return fixedBooks.reduce((acc, curr) => {
    return acc + Number(curr[(curr.length - 1) / 2]);
  }, 0);
};
