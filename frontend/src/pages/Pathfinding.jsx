import { useState, useEffect, useRef } from "react";

function Pathfinding() {
  const [grid, setGrid] = useState(
    Array(20).fill().map(() => Array(50).fill(null))
  );
  const [start, setStart] = useState([10, 5]);
  const [end, setEnd] = useState([10, 44]);
  const [explored, setExplored] = useState([]);
  const [pathFound, setPathFound] = useState(false);
  const prevNode = useRef({});
  const [path, setPath] = useState([]);
  const [mazeGenerating, setMazeGenerating] = useState(false);
  const [mazeSpeed, setMazeSpeed] = useState(1); // Adjust speed as needed

  const isValidCell = (i, j) => i >= 0 && j >= 0 && i < 20 && j < 50;
  const isEndCell = (i, j) => i === end[0] && j === end[1];
  const isStartCell = (i, j) => i === start[0] && j === start[1];

  const reconstructPath = () => {
    let path = [];
    let currentNode = end;
    while (currentNode) {
      path.unshift(currentNode);
      currentNode = prevNode.current[`${currentNode[0]}-${currentNode[1]}`];
    }
    setPath(path);
  };

  const heuristic = (i, j) => Math.abs(i - end[0]) + Math.abs(j - end[1]);

  const aStar = async () => {
    let openSet = [[...start, 0, heuristic(...start)]]; // [i, j, g_cost, f_cost]
    let gCosts = new Map();
    gCosts.set(`${start[0]}-${start[1]}`, 0);
    let visited = new Set();

    while (openSet.length > 0) {
      openSet.sort((a, b) => a[3] - b[3]); // Sort by f_cost
      const [i, j, gCost, _] = openSet.shift(); // Dequeue

      if (visited.has(`${i}-${j}`)) continue;
      visited.add(`${i}-${j}`);

      if (isEndCell(i, j)) {
        setPathFound(true);
        reconstructPath();
        return;
      }

      setExplored((prev) => [...prev, [i, j]]);
      await new Promise((resolve) => setTimeout(resolve, 20 / mazeSpeed));

      const neighbors = [
        [i + 1, j],
        [i - 1, j],
        [i, j + 1],
        [i, j - 1],
      ];

      for (const [ni, nj] of neighbors) {
        if (isValidCell(ni, nj) && grid[ni][nj] !== "obstacle") {
          const newGCost = gCost + 1;
          const existingGCost = gCosts.get(`${ni}-${nj}`);

          if (existingGCost === undefined || newGCost < existingGCost) {
            gCosts.set(`${ni}-${nj}`, newGCost);
            const fCost = newGCost + heuristic(ni, nj);
            openSet.push([ni, nj, newGCost, fCost]);
            prevNode.current[`${ni}-${nj}`] = [i, j];
          }
        }
      }
    }
  };

  const handleAStar = () => {
    setExplored([]);
    setPath([]);
    setPathFound(false);
    prevNode.current = {};
    aStar();
  };

  const recursiveDivision = async ({ row, col, height, width }) => {
    if (height <= 1 || width <= 1) return;

    const isHorizontal = height > width;
    if (isHorizontal) {
      await horizontalDivision({ row, col, height, width });
    } else {
      await verticalDivision({ row, col, height, width });
    }
  };

  const horizontalDivision = async ({ row, col, height, width }) => {
    const makeWallAt = row + getRandInt(0, Math.floor(height / 2)) * 2 + 1;
    const makePassageAt = col + getRandInt(0, width) * 2;

    for (let i = 0; i < width; i++) {
      if (makePassageAt !== col + i) {
        if (isValidCell(makeWallAt, col + i)) {
          grid[makeWallAt][col + i] = "obstacle";
        }
      }
    }

    setGrid([...grid]); // Trigger a re-render

    await new Promise((resolve) => setTimeout(resolve, 10 / mazeSpeed));

    await recursiveDivision({
      row,
      col,
      height: (makeWallAt - row) / 2,
      width,
    });
    await recursiveDivision({
      row: makeWallAt + 1,
      col,
      height: height - (makeWallAt - row) / 2 - 1,
      width,
    });
  };

  const verticalDivision = async ({ row, col, height, width }) => {
    const makeWallAt = col + getRandInt(0, Math.floor(width / 2)) * 2 + 1;
    const makePassageAt = row + getRandInt(0, height) * 2;

    for (let i = 0; i < height; i++) {
      if (makePassageAt !== row + i) {
        if (isValidCell(row + i, makeWallAt)) {
          grid[row + i][makeWallAt] = "obstacle";
        }
      }
    }

    setGrid([...grid]); // Trigger a re-render

    await new Promise((resolve) => setTimeout(resolve, 10 / mazeSpeed));

    await recursiveDivision({
      row,
      col,
      height,
      width: (makeWallAt - col) / 2,
    });
    await recursiveDivision({
      row,
      col: makeWallAt + 1,
      height,
      width: width - (makeWallAt - col) / 2 - 1,
    });
  };

  const getRandInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

  const createMaze = async () => {
    setMazeGenerating(true);
    const newGrid = Array(20).fill().map(() => Array(50).fill(null));
    await recursiveDivision({
      row: 0,
      col: 0,
      height: 20,
      width: 50,
    });
    setGrid(newGrid);
    setMazeGenerating(false);
  };

  const dijkstra = async () => {
    let pq = [[...start, 0]]; // [i, j, distance]
    let visited = new Set();
    let distances = Array(20).fill().map(() => Array(50).fill(Infinity));
    let pqMap = new Map();

    distances[start[0]][start[1]] = 0;
    pqMap.set(`${start[0]}-${start[1]}`, 0);

    while (pq.length > 0) {
      const [i, j, dist] = pq.shift(); // Dequeue

      if (visited.has(`${i}-${j}`)) continue;
      visited.add(`${i}-${j}`);

      if (isEndCell(i, j)) {
        setPathFound(true);
        reconstructPath();
        return;
      }

      setExplored((prev) => [...prev, [i, j]]);
      await new Promise((resolve) => setTimeout(resolve, 1));

      const neighbors = [
        [i + 1, j],
        [i - 1, j],
        [i, j + 1],
        [i, j - 1],
      ];

      for (const [ni, nj] of neighbors) {
        if (isValidCell(ni, nj) && grid[ni][nj] !== "obstacle") {
          const newDist = dist + 1;
          if (newDist < distances[ni][nj]) {
            distances[ni][nj] = newDist;
            pq.push([ni, nj, newDist]);
            pqMap.set(`${ni}-${nj}`, newDist);
            prevNode.current[`${ni}-${nj}`] = [i, j];
          }
        }
      }

      pq.sort((a, b) => a[2] - b[2]); // Sort the priority queue based on the distances
    }
  };

  const handleDijkstra = () => {
    setExplored([]);
    setPath([]);
    setPathFound(false);
    prevNode.current = {};
    dijkstra();
  };

  const handleCellClick = (rowIndex, cellIndex) => {
    if (!isStartCell(rowIndex, cellIndex) && !isEndCell(rowIndex, cellIndex)) {
      setGrid((prevGrid) => {
        const newGrid = prevGrid.map((row) => row.slice());
        newGrid[rowIndex][cellIndex] = newGrid[rowIndex][cellIndex] === "obstacle"
          ? null
          : "obstacle";
        return newGrid;
      });
    }
  };

  return (
    <div>
      <div className="card">
        <button onClick={handleDijkstra}>Dijkstra</button>
        <button onClick={handleAStar}>A*</button>
        <button onClick={createMaze} disabled={mazeGenerating}>Generate Maze</button>
      </div>
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: "flex" }}>
          {row.map((cell, cellIndex) => (
            <div
              key={cellIndex}
              onClick={() => handleCellClick(rowIndex, cellIndex)}
              style={{
                width: "30px",
                height: "30px",
                border: "1px solid white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor:
                  rowIndex === start[0] && cellIndex === start[1]
                    ? "green"
                    : rowIndex === end[0] && cellIndex === end[1]
                    ? "red"
                    : cell === "obstacle"
                    ? "white"
                    : path.some(
                        ([x, y]) => x === rowIndex && y === cellIndex
                      )
                    ? "yellow"
                    : explored.some(
                        ([x, y]) => x === rowIndex && y === cellIndex
                      )
                    ? "blue"
                    : "",
              }}
            >
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Pathfinding;
