export interface Node {
    row: number,
    col: number,
    distance: number,
    previousNode?: Node,
    isStart: boolean,
    isEnd: boolean,
    isVisited: boolean,
    isPath: boolean
}