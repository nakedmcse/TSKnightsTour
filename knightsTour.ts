// Implementation of the Knights Tour algorithm using Heuristics

// Classes for knight movement and heuristics
class Vector {
    public constructor(public x: number|null = null, public y:number|null = null) {}
}

class KnightMoves {
    public constructor(public up_left: number|null = null, public up_right: number|null = null,
                       public down_left: number|null = null, public down_right: number|null = null,
                       public left_up: number|null = null, public left_down: number|null = null,
                       public right_up: number|null = null, public right_down: number|null = null) {}

    private inRange(value: number): boolean {
        return 0<=value && value<=7;
    }

    private calculateMoves(x: number, y: number, currentBoard: number[][]): number {
        let total = 0;
        // ups
        total += this.inRange(x-1) && this.inRange(y+2) && currentBoard[x-1][y+2] === 0 ? 1 : 0;
        total += this.inRange(x+1) && this.inRange(y+2) && currentBoard[x+1][y+2] === 0 ? 1 : 0;
        // downs
        total += this.inRange(x-1) && this.inRange(y-2) && currentBoard[x-1][y-2] === 0 ? 1 : 0;
        total += this.inRange(x+1) && this.inRange(y-2) && currentBoard[x+1][y-2] === 0 ? 1 : 0;
        // lefts
        total += this.inRange(x-2) && this.inRange(y-1) && currentBoard[x-2][y-1] === 0 ? 1 : 0;
        total += this.inRange(x-2) && this.inRange(y+1) && currentBoard[x-2][y+1] === 0 ? 1 : 0;
        // rights
        total += this.inRange(x+2) && this.inRange(y-1) && currentBoard[x+2][y-1] === 0 ? 1 : 0;
        total += this.inRange(x+2) && this.inRange(y+1) && currentBoard[x+2][y+1] === 0 ? 1 : 0;
        return total;
    }

    public update(x: number, y: number, currentBoard: number[][]): void {
        this.up_left = this.inRange(x-1) && this.inRange(y+2) && currentBoard[x-1][y+2] === 0
            ? this.calculateMoves(x-1, y+2, currentBoard) : null;
        this.up_right = this.inRange(x+1) && this.inRange(y+2) && currentBoard[x+1][y+2] === 0
            ? this.calculateMoves(x+1, y+2, currentBoard) : null;
        this.down_left = this.inRange(x-1) && this.inRange(y-2) && currentBoard[x-1][y-2] === 0
            ? this.calculateMoves(x-1, y-2, currentBoard) : null;
        this.down_right = this.inRange(x+1) && this.inRange(y-2) && currentBoard[x+1][y-2] === 0
            ? this.calculateMoves(x+1, y-2, currentBoard) : null;
        this.left_up = this.inRange(x-2) && this.inRange(y+1) && currentBoard[x-2][y+1] === 0
            ? this.calculateMoves(x-2, y+1, currentBoard) : null;
        this.left_down = this.inRange(x-2) && this.inRange(y-1) && currentBoard[x-2][y-1] === 0
            ? this.calculateMoves(x-2, y-1, currentBoard) : null;
        this.right_up = this.inRange(x+2) && this.inRange(y+1) && currentBoard[x+2][y-1] === 0
            ? this.calculateMoves(x+2, y-1, currentBoard) : null;
        this.right_down = this.inRange(x+2) && this.inRange(y-1) && currentBoard[x+2][y+1] === 0
            ? this.calculateMoves(x+2, y+1, currentBoard) : null;
    }

    public getMoves(isFirst:boolean): Vector[]|null {
        const moves: [number|null, Vector][] = [
            [this.up_left, new Vector(-1,2)], [this.up_right, new Vector(1,2)],
            [this.down_left, new Vector(-1,-2)], [this.down_right, new Vector(1,-2)],
            [this.left_up, new Vector(-2,1)], [this.left_down, new Vector(-2,-1)],
            [this.right_up, new Vector(2,1)], [this.right_down, new Vector(2,-1)]
        ];

        // Here 0 (0 forward steps) and null (not available) mean different things, so must check for not null
        const validMoves = moves.filter(x => x[0] !== null);
        if(validMoves.length === 0) {
            return null;
        }

        validMoves.sort((a,b) => (a[0]??0) - (b[0]??0));
        const minMoves: number = validMoves[0][0] ?? 0;
        return isFirst ? validMoves.map(x => x[1]) :
            validMoves.filter(x => (x[0]??0) === minMoves).map(x => x[1])
    }
}

// Recursively walk the board
function walkBoard(currentBoard:number[][], path: Vector[], winningPaths: Vector[][]): void {
    // Record move
    const x: number = path[path.length - 1].x ?? 0;
    const y: number = path[path.length - 1].y ?? 0;
    const newBoard: number[][] = JSON.parse(JSON.stringify(currentBoard));
    const newPath: Vector[] = JSON.parse(JSON.stringify(path));
    newBoard[x][y] = 1;
    const availableMoves: KnightMoves = new KnightMoves();
    availableMoves.update(x, y, newBoard);
    const nextMoves = availableMoves.getMoves(newPath.length === 1);

    // Exit condition
    if(!nextMoves) {
        if(!newBoard.some(x => x.includes(0))) {
            winningPaths.push(newPath);
        }
        return;
    }

    // Search paths
    for(const chosenMove of nextMoves) {
        newPath.push(new Vector(x + (chosenMove.x??0), y + (chosenMove.y??0)));
        walkBoard(newBoard, newPath, winningPaths);
    }
}

const board: number[][] = [
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0]
];

const initialPath: Vector[] = [new Vector(1, 0)];
const winningTours: Vector[][] = [];
walkBoard(board, initialPath, winningTours);

console.log(`Found ${winningTours.length} winning tours`);