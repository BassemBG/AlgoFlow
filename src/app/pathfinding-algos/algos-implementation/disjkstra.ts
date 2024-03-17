import { Node } from "../models/node.model";


export async function runDijkstra(grid: Node[][], startNode: Node, endNode: Node, vizSpeed: number){
    
    var latency = 350 - vizSpeed*3;

    // mark start node
    startNode.distance = 0;
    console.log("checking sent grid : ", grid);
    let unvisitedNodes : Node[] = grid.flat(); 
    
    let i: number = 0;
    //add it to a queue of sorted nodes based on smallest distance (it's only start node now: first iteration)
    while(unvisitedNodes.length > 0){

        i++;
        // Sort the unvisitedNodes based on distance
        unvisitedNodes = unvisitedNodes.sort((a, b) => a.distance - b.distance);
        //console.log(i, unvisitedNodes);
        
        //get the smallest distance node to explore (startNode in 1st iteration)
        const closestNode = unvisitedNodes.shift();
        //console.log(closestNode);

        //mark current node as visited
        await sleep(latency);
        closestNode!.isVisited = true;


        //check if this is endNode, stop if true
        if(closestNode == endNode) return;
        
        

        // check its neighbours and update relative distances based on current distance +1
        const neighbours: Node[] = [];
        let node: Node;
        if (closestNode!.row > 0 ) {
            node = grid[closestNode!.row - 1][closestNode!.col];
            if(!node.isVisited) neighbours.push(node) ;
        }
        
        if (closestNode!.row < grid.length - 1 ) {
            node = grid[closestNode!.row + 1][closestNode!.col];
            if(!node.isVisited) neighbours.push(node) ;
        }
        if (closestNode!.col > 0 ) {
            node = grid[closestNode!.row][closestNode!.col - 1];
            if(!node.isVisited) neighbours.push(node) ;
        }
        if (closestNode!.col < grid[0].length - 1 ) {
            node = grid[closestNode!.row][closestNode!.col + 1];
            if(!node.isVisited) neighbours.push(node) ;
        }

        //keep only unvisited
        //neighbours.filter(neighbour => !neighbour.isVisited);

        // update distance of neighbours, ONLY UNVISITED
        for (const neighbour of neighbours) {
            neighbour.distance = closestNode!.distance + 1;
            // previous node to be used in returning the path
            neighbour.previousNode = closestNode!;
        }//neighbours distance should be changed in unvisitedNodes

        console.log("("+ closestNode?.row + "," + closestNode?.col + ")" + "-->" , neighbours);
        

    }
    


}


export const sleep = (milliseconds: number) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }