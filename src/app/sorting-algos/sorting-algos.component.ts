import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sorting-algos',
  templateUrl: './sorting-algos.component.html',
  styleUrls: ['./sorting-algos.component.css'],
})
export class SortingAlgosComponent implements OnInit {
  NUMBER_OF_BARS: number = 10; //get number from user input
  bar_width: number = 0;
  bars_array_before_sorting: number[] = []; // this is used to save old copy of array to use it to reset -> always need to asign it before any sorting
  bars_height_array: number[] = []; //this is only filled manually for testing purposes
  swappingIndexes: number[] = []; //keeps at a time the 2 indexes of the blocks who are getting swapped
  sortedIndexes: number[] = []; //keeps all the blocks who are sorted, this helps to visualize them in green
  isSorting: boolean = false; //helps prevent the user from interrupting the visualization by accident
  selectedAlgorithm: String = 'Choose Algorithm';
  vizSpeed: number = 50;
  sound: HTMLAudioElement;
  constructor() {
    this.sound = new Audio();
    this.sound.src = './assets/success-sound.mp3';
    this.sound.volume = 0.8;
  }

  ngOnInit(): void {
    this.generateArray();
  }

  ngOnDestroy() {
    this.isSorting = false;
    this.stopSound();
    this.sound.src = '';
  }

  sort() {
    if (!this.isSorting) {
      if (this.selectedAlgorithm == 'BubbleSort') {
        this.bubbleSort();
      } else {
        window.alert('Please select an algorithm before visualizing.');
      }
    }
  }

  /*  
    - pause array animation only when sorting, can't pause if not sorting
    - active when array is sorting: stops sorting and cleans green bars
    - only visible when sorting
  */
  pause() {
    if (this.isSorting) {
      this.isSorting = false;

      //this was used in case of reset
      //this.bars_height_array = this.bars_array_before_sorting;
    }
    //This was used in case of reset : when a new array is generated, we need to reset sortedIndexes or bars will stay green
    //this.sortedIndexes = [];
  }

  generateArray() {
    //if there is a visualization happening, block this action
    if (!this.isSorting) {
      this.bars_height_array = [];
      for (let index = 0; index < this.NUMBER_OF_BARS; index++) {
        var bar_height = Math.floor(Math.random() * 350) + 1; //random max value based on height of viz container

        this.bars_height_array.push(bar_height);
      }
      this.bars_array_before_sorting = [...this.bars_height_array];
    }

    //when a new array is generated, we need to reset sortedIndexes or bars will stay green
    this.sortedIndexes = [];
  }

  //check if the block is under the operation of swapping; if true : change color to purple, else keep the default color
  checkSwapping(index: number): boolean {
    return this.swappingIndexes.includes(index);
  }

  //check if the block is already bubbled to the top; if true : change color to green, else keep the default color
  checkSorted(index: number): boolean {
    return this.sortedIndexes.includes(index);
  }

  /*
  Blocks 
  unsorted blocks are in blue (default color)
  compared / swapping blocks are in purple
  sorted blocks are in green
  */

  async bubbleSort() {
    //tell the environment that a sorting visualization is happening
    this.isSorting = true;

    const n = this.bars_height_array.length;

    //this is added to stop sorting from sorting already green bars(sorted) in case of pause and unpause
    const sortedLimit = this.sortedIndexes.length + 1;

    if (this.isSorting) {
      for (let i = 0; i < n - sortedLimit; i++) {
        for (let j = 0; j < n - i - sortedLimit; j++) {
          if (this.isSorting) {
            //add indexes of blocks who are being compared to swappingIndexes to trigger the change of their color
            this.swappingIndexes = [j, j + 1];

            // Simulate a delay to visualize the sorting process
            await this.delay(350 - this.vizSpeed * 3);

            // Swap if the element found is greater than the next element
            if (this.bars_height_array[j] > this.bars_height_array[j + 1]) {
              this.swap(j, j + 1);
              await this.delay(350 - this.vizSpeed * 3);
            }

            // Clear swapping indexes after sorting is complete
            this.swappingIndexes = [];
          } else {
            break;
          }
        }

        if (this.isSorting) {
          //n-i-1 is always the index that i need to mark as sorted / add to the sortedIndexes list

          this.playSound('./assets/success-sound.mp3', 0.8);
          this.sortedIndexes.push(n - i - sortedLimit);
        } else {
          break;
        }
      }

      if (this.isSorting) {
        //if we're out of for loops, the algo is all done and array is sorted so push the first element to mark all array as sorted
        this.sortedIndexes.push(0);
        this.playSound('./assets/finished-sorting-sound.mp3', 1);
        window.alert(
          'Sorting is Done ! \nFeel Free to regenerate another Graph .'
        );
        this.isSorting = false;
      }
    }
  }

  async insertionSort() {
    for (let i = 0; i < this.bars_height_array.length; i++) {
      const tmp = this.bars_height_array[i];
      let j = i - 1;
      // Iterate while J is out of place.
      while (j >= 0 && this.bars_height_array[j] > tmp) {
        this.bars_height_array[j + 1] = this.bars_height_array[j];
        j--;
      }
      // Assign the correct location of i where j stops.
      this.bars_height_array[j + 1] = tmp;
    }
  }

  swap(i: number, j: number) {
    const temp = this.bars_height_array[i];
    this.bars_height_array[i] = this.bars_height_array[j];
    this.bars_height_array[j] = temp;
  }

  //utility function for delay, purpose is visualizing the sorting process
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  //play sound
  playSound(soundSrc: string, soundVolume: number) {
    if (soundSrc != this.sound.src) {
      this.sound.src = soundSrc;
    }
    this.sound.currentTime = 0;
    if (soundVolume != this.sound.volume) {
      this.sound.volume = soundVolume;
    }
    this.sound.play();
  }

  stopSound(){
    this.sound.pause();
    this.sound.currentTime = 0;
  }
}
