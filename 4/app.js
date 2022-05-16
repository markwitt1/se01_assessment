const readline = require("node:readline/promises");
const { stdin: input, stdout: output } = require("process");

//board is an x*x matrix
const x = 4;

// prettier-ignore
const board = 
[
  1, 1, 0, 1,
  5, 1, 1, 5,
  0, 5, 3, 4,
  6, 7, 6, 1
];

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const getRow = (i) => board.slice(i * x, (i + 1) * x);
const getCol = (i) => [...Array(x).keys()].map((j) => board[i + j * x]);

const validateLine = (line) => {
  let longest = [];
  for (let i = 0; i < line.length; i++) {
    let temp = [i];
    if (line[i - 1] === line[i]) {
      temp = temp.concat(validateLineStep(line, i - 1, -1));
    }
    if (line[i + 1] === line[i]) {
      temp = temp.concat(validateLineStep(line, i + 1, +1));
    }
    if (temp.length > longest.length) longest = [...temp];
  }
  if (longest.length >= 3) {
    console.log(longest);
    return new Set(longest);
  }
  return false;
};

// tried to write a recursive function to get the rows (even when its 4 for example) but failed miserably
// I should have represented the board with an actual matrix (nested array). That would have simplified it a lot

const validateLine = (line) => {
  for (let i = 0; i < line.length; i++) {
    let temp = [];
    temp = [line[i]];
    temp = temp.concat(validateLineStep(line.slice(i + 1), line[i]));
    temp = temp.concat(validateLineStep(line.slice(0, i), line[i]));
  }
};

const validateLineStep = (line, n) => {};

const printBoard = () => {
  [0, 1, 2, 3].map(getRow).forEach((row) => console.log(row.join(" ")));
};

const validateBoard = () => {
  let placesToBeRemoved = new Set();
  for (let i = 0; i < x; i++) {
    const row = getRow(i);
    const col = getCol(i);

    const rowIndizes = validateLine(row);
    if (rowIndizes) {
      for (rowIndex in rowIndizes) {
        placesToBeRemoved.add(parseInt(rowIndex) + i * x);
      }
    }

    const colIndizes = validateLine(col);
    if (colIndizes) {
      for (colIndex in colIndizes) {
        placesToBeRemoved.add(i + parseInt(colIndex) * x);
      }
    }
  }
  console.log(placesToBeRemoved.size > 0 ? "VALID" : "INVALID");
  return placesToBeRemoved;
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
    const placesToBeRemoved = validateBoard();
    console.log(placesToBeRemoved);
  } else {
    console.log("INVALID: jewels have to be next to each other");
  }
};
runGame().then(() => rl.close());
