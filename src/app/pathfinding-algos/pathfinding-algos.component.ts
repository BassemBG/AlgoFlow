import { Component, OnInit } from '@angular/core';
import { Node } from './models/node.model';
import { runDijkstra, sleep } from './algos-implementation/disjkstra';
//import { ComponentPortal } from '@angular/cdk/portal/index';

@Component({
  selector: 'app-pathfinding-algos',
  templateUrl: './pathfinding-algos.component.html',
  styleUrls: ['./pathfinding-algos.component.css'],
})
export class PathfindingAlgosComponent implements OnInit {
  //define grid and initialize its props; num of rows/cols
  grid: Node[][] = [];
  grid_copy: Node[][] = [];

  //initialise start and end nodes
  START_NODE_ROW: number = 1;
  START_NODE_COL: number = 1;
  END_NODE_ROW: number = 8;
  END_NODE_COL: number = 15;

  //speed control
  vizSpeed: number = 50;

  //algorithm choice
  selectedAlgorithm: String = 'Choose Algorithm';

  isPathfinding: boolean = false; //helps prevent the user from interrupting the visualization by spamming button

  //changing node type start and end
  toggleChangeStartNode: Boolean = false;
  toggleChangeEndNode: Boolean = false;
  startToggleDisabled: Boolean = false;
  endToggleDisabled: Boolean = false;

  sound: HTMLAudioElement;

  constructor() {
    this.sound = new Audio();
    this.sound.src = './assets/pathfinding-in-progress-sound.mp3';
    this.sound.loop = true;
    this.sound.preload = 'auto';

  }

  ngOnInit(): void {
    this.grid = this.generateGrid();
  }

  ngOnDestroy() {
    this.stopSound(); // Stop the sound when the component is destroyed
    this.sound.src = '';
    this.isPathfinding = false;
  }

  changeNodeType(node: Node) {
    if (this.toggleChangeStartNode) {
      this.changeStartNode(node);
    }

    if (this.toggleChangeEndNode) {
      this.changeEndNode(node);
    }
  }

  visualizeAlgo() {
    if (!this.isPathfinding) {
      if (this.selectedAlgorithm == 'Dijkstra') {
        //start sound of finding in progress
        this.playSound('./assets/pathfinding-in-progress-sound.mp3', 0.7);
        this.visualizeDijkstra();
      } else {
        this.openErrorDialog();
      }
    }
  }

  // Method to open the error dialog
  openErrorDialog() {
    window.alert('Please select an algorithm before visualizing.');
  }

  reset() {
    this.stopSound();
    this.grid = this.generateGrid();
  }

  async visualizeDijkstra() {
    //stop user from changing nodes nature during animation
    this.startToggleDisabled = true;
    this.endToggleDisabled = true;

    //tell the environment that a pathfinding visualization is happening
    this.isPathfinding = true;

    let startNode: Node = this.grid[this.START_NODE_ROW][this.START_NODE_COL];
    let endNode: Node = this.grid[this.END_NODE_ROW][this.END_NODE_COL];
    console.log(this.grid);

    await runDijkstra(this.grid, startNode, endNode, this.vizSpeed);

    // when we're out of the above function, finding is done so stop sound
    this.stopSound();

    // now play the sound of success
    this.playSound('./assets/finished-sorting-sound.mp3', 0.9);

    //tell the user that shortest path is found
    window.alert(
      'The shortest path is found with ' +
        this.selectedAlgorithm +
        ' and will be drawn now !'
    );

    await this.animateShortestPath(endNode);

    //gives him back the ability to change
    this.startToggleDisabled = false;
    this.endToggleDisabled = false;

    //tell the environment that the visualization is done
    this.isPathfinding = false;
  }

  playSound(soundSrc: string, soundVolume: number) {
    if (soundSrc != this.sound.src) {
      this.sound.src = soundSrc;
    }
    this.sound.currentTime = 0;
    this.sound.volume = soundVolume;
    this.sound.play();
  }

  stopSound() {
    this.sound.pause(); // Pause the sound
    this.sound.currentTime = 0; // Reset the current playback position to the beginning
  }

  async animateShortestPath(endNode: Node) {
    let shortestPath: Node[] = this.getShortestPath(endNode);
    for (let node of shortestPath) {
      await sleep(200);
      node.isPath = true;
    }
  }

  getShortestPath(endNode: Node): Node[] {
    let currentNode: Node | null = endNode;
    let shortestPath: Node[] = [];
    while (currentNode) {
      shortestPath.unshift(currentNode);
      console.log(currentNode);

      currentNode = currentNode.previousNode!;
    }
    console.log(shortestPath);
    return shortestPath;
  }

  generateGrid(): Node[][] {
    //get screen size
    let screenWidth = window.innerWidth;
    console.log(screenWidth);

    let number_of_rows: number;
    let number_of_columns: number;

    // Determine the number of rows and columns based on the screen width
    switch (true) {
      case screenWidth < 576: // Extra small devices (phones)
        number_of_rows = 15;
        number_of_columns = 8;
        break;

      case screenWidth >= 576 && screenWidth < 768: // Small devices (tablets)
        number_of_rows = 17;
        number_of_columns = 12;
        break;

      case screenWidth >= 768 && screenWidth < 992: // Medium devices (desktops, laptops)
        number_of_rows = 17;
        number_of_columns = 15;
        break;

      case screenWidth >= 992 && screenWidth < 1200: // Large devices (desktops, laptops)
        number_of_rows = 21;
        number_of_columns = 18;
        break;

      default: // Extra large devices (large desktops, high-resolution monitors)
        number_of_rows = 23;
        number_of_columns = 23;
    }

    //generated relative start/end nodes coords
    this.generateEndAndStartNodes(number_of_rows, number_of_columns);

    //if there is a visualization happening, block this action
    let grid: Node[][] = [];
    for (let row = 0; row < number_of_rows; row++) {
      let node_row = [];
      for (let col = 0; col < number_of_columns; col++) {
        node_row.push(this.createNode(row, col));
      }
      grid.push(node_row);
    }
    console.log(grid);

    return grid;
  }

  // this function generates end and start nodes cols/rows based on rendered grid (based off screen size)
  generateEndAndStartNodes(maxRows: number, maxCols: number) {
    // Generate random row and column numbers for start node
    let startRow = Math.floor(Math.random() * maxRows);
    let startCol = Math.floor(Math.random() * maxCols);

    // Generate random row and column numbers for end node
    let endRow, endCol;
    do {
      endRow = Math.floor(Math.random() * maxRows);
      endCol = Math.floor(Math.random() * maxCols);
    } while (endRow === startRow && endCol === startCol); // Ensure end node is not the same as start node

    // Set start node
    this.START_NODE_ROW = startRow;
    this.START_NODE_COL = startCol;

    // Set end node
    this.END_NODE_ROW = endRow;
    this.END_NODE_COL = endCol;
  }

  //This serves to create the node struct
  //as a better code structure, i can make a seperate file to define a node class
  createNode(row: number, col: number): Node {
    return {
      row: row,
      col: col,
      distance: Infinity,
      isStart: row == this.START_NODE_ROW && col == this.START_NODE_COL,
      isEnd: row == this.END_NODE_ROW && col == this.END_NODE_COL,
      isVisited: false,
      isPath: false,
    };
  }

  //made to help display infinity symbol
  isInfinity(distance: number): boolean {
    return distance === Infinity;
  }

  changeStartNode(node: Node) {
    //change previous start node
    this.grid[this.START_NODE_ROW][this.START_NODE_COL].isStart = false;

    //set the clicked one
    this.grid[node.row][node.col].isStart = true;

    //save the new start node infos
    this.START_NODE_ROW = node.row;
    this.START_NODE_COL = node.col;
  }

  changeEndNode(node: Node) {
    //change previous end node
    this.grid[this.END_NODE_ROW][this.END_NODE_COL].isEnd = false;

    //set the clicked one
    this.grid[node.row][node.col].isEnd = true;

    //save the new end node infos
    this.END_NODE_ROW = node.row;
    this.END_NODE_COL = node.col;
  }

  toggleStartNode() {
    if (!this.startToggleDisabled) {
      this.toggleChangeStartNode = !this.toggleChangeStartNode;

      if (this.toggleChangeStartNode) {
        this.endToggleDisabled = true;
      } else {
        this.endToggleDisabled = false;
      }
    }
  }

  toggleEndNode() {
    if (!this.endToggleDisabled) {
      this.toggleChangeEndNode = !this.toggleChangeEndNode;

      if (this.toggleChangeEndNode) {
        this.startToggleDisabled = true;
      } else {
        this.startToggleDisabled = false;
      }
    }
  }
}
