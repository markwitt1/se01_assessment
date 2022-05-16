const readline = require("node:readline/promises");
const { stdin: input, stdout: output } = require("process");

//board is an x*x matrix
const x = 4;

// prettier-ignore
const board = 
[
  2, 1, 2, 3,
  5, 4, 4, 5,
  0, 5, 3, 4,
  6, 7, 6, 1
];

const getRow = (i) => board.slice(i * x, (i + 1) * x);
const getCol = (i) => [...Array(x).keys()].map((j) => board[i + j * x]);

const validateLine = (line) => {
  for (let i = 0; i < line.length; i++) {
    if (line[i] === line[i - 1] && line[i] == line[i + 1]) {
      return [i - 1, i, i + 1];
    }
  }
  return false;
};

const detectBomb = () => {
  for (let i = 0; i < x; i++) {
    for (let j = 0; j < x; j++) {
      axisPos = i + x * j;
      //check if there is a col going down
      if (
        board[axisPos] === board[axisPos + x] &&
        board[axisPos] === board[axisPos + 2 * x]
      ) {
        const row = getRow(j);
        if (validateLine(row)?.includes?.(i)) {
          console.log("BOMB");
        }
      }
    }
  }
};

const printBoard = () => {
  [0, 1, 2, 3].map(getRow).forEach((row) => console.log(row.join(" ")));
};

const validateBoard = () => {
  for (let i = 0; i < 4; i++) {
    const row = getRow(i);
    const col = getCol(i);

    if (validateLine(row) || validateLine(col)) {
      return console.log("VALID");
    }
  }
  return console.log("INVALID");
};

const between0And15 = (n) => !isNaN(n) && n >= 0 && n <= 15;

const isDir = (s) => ["l", "u", "r", "d"].includes(s);
const dirToN = {
  l: -1,
  u: -4,
  r: +1,
  d: +4,
};

const rl = readline.createInterface({ input, output });

const runGame = async () => {
  console.log("Current Board State:");
  printBoard();

  let first;

  while (!between0And15(first)) {
    const str = await rl.question("Enter the position of the first jewel:");
    first = parseInt(str);
  }

  let second;

  while (!between0And15(second)) {
    const str = await rl.question(
      "Enter the position of the second jewel or a direction (l | u | r | d):"
    );
    second = parseInt(str);
    if (isNaN(second) && isDir(str)) {
      second = first + dirToN[str];
    }
  }

  const diff = first - second;

  if (Object.values(dirToN).includes(diff)) {
    [board[first], board[second]] = [board[second], board[first]];
    printBoard();
    detectBomb();
    validateBoard();
  } else {
    console.log("INVALID: jewels have to be next to each other");
  }
};
runGame().then(() => rl.close());
