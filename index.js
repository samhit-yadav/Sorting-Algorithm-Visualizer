// DOM Elements
const algorithmSelect = document.getElementById('algorithm');
const speedSelect = document.getElementById('speed');
const sizeInput = document.getElementById('size');
const sizeValue = document.getElementById('size-value');
const randomizeBtn = document.getElementById('randomize');
const sortBtn = document.getElementById('sort');
const stopBtn = document.getElementById('stop');
const arrayContainer = document.getElementById('array-container');

// Variables
let array = [];
let arrayBars = [];
let animationSpeed = 50; // Default medium speed
let animationInProgress = false;
let animationPaused = false;
let animationTimeouts = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  // Set up event listeners
  sizeInput.addEventListener('input', updateSizeValue);
  randomizeBtn.addEventListener('click', randomizeArray);
  sortBtn.addEventListener('click', startSorting);
  stopBtn.addEventListener('click', stopSorting);
  speedSelect.addEventListener('change', updateSpeed);
  
  // Generate initial array
  updateSizeValue();
  randomizeArray();
});

// Update the displayed size value and regenerate array
function updateSizeValue() {
  const size = sizeInput.value;
  sizeValue.textContent = size;
  generateArray(size);
}

// Update the animation speed based on selection
function updateSpeed() {
  const speedOption = speedSelect.value;
  switch(speedOption) {
    case 'fast':
      animationSpeed = 10;
      break;
    case 'medium':
      animationSpeed = 50;
      break;
    case 'slow':
      animationSpeed = 150;
      break;
  }
}

// Generate a new array of given size
function generateArray(size) {
  array = [];
  for (let i = 0; i < size; i++) {
    array.push(Math.floor(Math.random() * 100) + 1);
  }
  renderArray();
}

// Randomize the current array
function randomizeArray() {
  if (animationInProgress) return;
  const size = sizeInput.value;
  generateArray(size);
}

// Render the array as bars
function renderArray() {
  arrayContainer.innerHTML = '';
  arrayBars = [];
  
  const maxValue = Math.max(...array);
  const barWidth = Math.max(2, Math.floor(arrayContainer.clientWidth / array.length) - 2);
  
  // Create a container with relative positioning
  const barsContainer = document.createElement('div');
  barsContainer.classList.add('bars-container');
  barsContainer.style.position = 'relative';
  barsContainer.style.height = '100%';
  barsContainer.style.width = '100%';
  arrayContainer.appendChild(barsContainer);
  
  for (let i = 0; i < array.length; i++) {
    // Create bar container (to hold both the bar and the value label)
    const barContainer = document.createElement('div');
    barContainer.classList.add('bar-container');
    barContainer.style.position = 'absolute';
    barContainer.style.bottom = '0';
    barContainer.style.left = `${i * (barWidth + 2)}px`;
    barContainer.style.width = `${barWidth}px`;
    barContainer.style.height = '100%';
    
    // Create the bar
    const bar = document.createElement('div');
    bar.classList.add('array-bar');
    const height = (array[i] / maxValue) * 95; // Use 95% to leave room for number
    bar.style.height = `${height}%`;
    bar.style.width = '100%';
    bar.style.position = 'absolute';
    bar.style.bottom = '0';
    
    // Create the value label
    const valueLabel = document.createElement('div');
    valueLabel.classList.add('value-label');
    valueLabel.textContent = array[i];
    valueLabel.style.position = 'absolute';
    valueLabel.style.top = '0';
    valueLabel.style.width = '100%';
    valueLabel.style.textAlign = 'center';
    valueLabel.style.fontSize = `${Math.max(8, Math.min(12, barWidth - 2))}px`;
    valueLabel.style.color = '#333';
    valueLabel.style.fontWeight = 'bold';
    valueLabel.style.padding = '2px 0';
    valueLabel.style.transition = 'background-color 0.2s, color 0.2s';
    
    // Add bar and label to the container
    barContainer.appendChild(bar);
    barContainer.appendChild(valueLabel);
    barsContainer.appendChild(barContainer);
    
    // Store reference to the bar element
    arrayBars.push({
      container: barContainer,
      bar: bar,
      label: valueLabel
    });
  }
}

// Start the sorting animation
function startSorting() {
  if (animationInProgress) return;
  
  animationInProgress = true;
  animationPaused = false;
  sortBtn.disabled = true;
  randomizeBtn.disabled = true;
  sizeInput.disabled = true;
  
  const algorithm = algorithmSelect.value;
  
  // Reset all bars to default color
  arrayBars.forEach(item => {
    item.bar.className = 'array-bar';
    item.label.style.backgroundColor = '';
    item.label.style.color = '#333';
  });
  
  switch(algorithm) {
    case 'bubble':
      bubbleSort();
      break;
    case 'quick':
      const animations = [];
      quickSort(array.slice(), 0, array.length - 1, animations);
      animateQuickSort(animations);
      break;
    case 'merge':
      const mergeAnimations = [];
      mergeSort(array.slice(), 0, array.length - 1, mergeAnimations);
      animateMergeSort(mergeAnimations);
      break;
  }
}

// Stop the sorting animation
function stopSorting() {
  animationPaused = true;
  animationInProgress = false;
  
  // Clear all timeouts
  for (let i = 0; i < animationTimeouts.length; i++) {
    clearTimeout(animationTimeouts[i]);
  }
  animationTimeouts = [];
  
  // Enable controls
  sortBtn.disabled = false;
  randomizeBtn.disabled = false;
  sizeInput.disabled = false;
  
  // Reset bar colors
  arrayBars.forEach(item => {
    item.bar.className = 'array-bar';
    item.label.style.backgroundColor = '';
    item.label.style.color = '#333';
  });
}

// Animation completion
function finishAnimation() {
  // Mark all bars as sorted
  arrayBars.forEach(item => {
    item.bar.className = 'array-bar sorted';
    // Make the labels green to match sorted bars
    item.label.style.backgroundColor = '#4caf50';
    item.label.style.color = 'white';
  });
  
  // Enable controls
  setTimeout(() => {
    sortBtn.disabled = false;
    randomizeBtn.disabled = false;
    sizeInput.disabled = false;
    animationInProgress = false;
  }, 500);
}

// Add comparing style to labels
function addComparingStyle(index) {
  arrayBars[index].bar.classList.add('comparing');
  arrayBars[index].label.style.backgroundColor = '#3498db'; // Blue background
  arrayBars[index].label.style.color = 'white'; // White text
}

// Remove comparing style from labels
function removeComparingStyle(index) {
  arrayBars[index].bar.classList.remove('comparing');
  arrayBars[index].label.style.backgroundColor = '';
  arrayBars[index].label.style.color = '#333';
}

// Add swapping style to labels
function addSwappingStyle(index) {
  arrayBars[index].bar.classList.add('swapping');
  arrayBars[index].label.style.backgroundColor = '#e74c3c'; // Red background
  arrayBars[index].label.style.color = 'white'; // White text
}

// Remove swapping style from labels
function removeSwappingStyle(index) {
  arrayBars[index].bar.classList.remove('swapping');
  arrayBars[index].label.style.backgroundColor = '';
  arrayBars[index].label.style.color = '#333';
}

// Add pivot style to labels
function addPivotStyle(index) {
  arrayBars[index].bar.classList.add('pivot');
  arrayBars[index].label.style.backgroundColor = '#9b59b6'; // Purple background
  arrayBars[index].label.style.color = 'white'; // White text
}

// Remove pivot style from labels
function removePivotStyle(index) {
  arrayBars[index].bar.classList.remove('pivot');
  arrayBars[index].label.style.backgroundColor = '';
  arrayBars[index].label.style.color = '#333';
}

// Add sorted style to labels
function addSortedStyle(index) {
  arrayBars[index].bar.classList.add('sorted');
  arrayBars[index].label.style.backgroundColor = '#4caf50'; // Green background
  arrayBars[index].label.style.color = 'white'; // White text
}

// ---- BUBBLE SORT ----
function bubbleSort() {
  let steps = 0;
  let timeoutId;
  
  function bubbleStep(i, j, endIndex) {
    if (animationPaused) return;
    
    if (endIndex <= 0) {
      finishAnimation();
      return;
    }
    
    // Reset previous bars
    if (j > 0) {
      removeComparingStyle(j-1);
      removeComparingStyle(j);
    }
    
    if (j < endIndex) {
      // Comparing
      addComparingStyle(j);
      addComparingStyle(j+1);
      
      if (array[j] > array[j+1]) {
        // Swapping
        addSwappingStyle(j);
        addSwappingStyle(j+1);
        
        // Swap in array
        [array[j], array[j+1]] = [array[j+1], array[j]];
        
        // Update heights and labels
        const tempHeight = arrayBars[j].bar.style.height;
        arrayBars[j].bar.style.height = arrayBars[j+1].bar.style.height;
        arrayBars[j+1].bar.style.height = tempHeight;
        
        // Update labels
        arrayBars[j].label.textContent = array[j];
        arrayBars[j+1].label.textContent = array[j+1];
        
        // Remove swapping class after animation
        setTimeout(() => {
          if (!animationPaused) {
            removeSwappingStyle(j);
            removeSwappingStyle(j+1);
          }
        }, animationSpeed / 2);
      }
      
      // Next comparison
      timeoutId = setTimeout(() => {
        bubbleStep(i, j+1, endIndex);
      }, animationSpeed);
      animationTimeouts.push(timeoutId);
    } else {
      // Mark the last item as sorted
      addSortedStyle(endIndex);
      
      // Next pass
      timeoutId = setTimeout(() => {
        bubbleStep(i+1, 0, endIndex-1);
      }, animationSpeed);
      animationTimeouts.push(timeoutId);
    }
  }
  
  // Start with the first pass
  bubbleStep(0, 0, array.length - 1);
}

// ---- QUICK SORT ----
function quickSort(arr, left, right, animations) {
  if (left < right) {
    const pivotIndex = partition(arr, left, right, animations);
    quickSort(arr, left, pivotIndex - 1, animations);
    quickSort(arr, pivotIndex + 1, right, animations);
  } else if (left === right) {
    // Single element is sorted
    animations.push(['sorted', left]);
  }
}

function partition(arr, left, right, animations) {
  const pivotIndex = right;
  const pivotValue = arr[pivotIndex];
  animations.push(['pivot', pivotIndex]);
  
  let i = left - 1;
  
  for (let j = left; j < right; j++) {
    animations.push(['compare', j, pivotIndex]);
    
    if (arr[j] <= pivotValue) {
      i++;
      animations.push(['swap', i, j]);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  animations.push(['swap', i + 1, right]);
  [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
  
  // Mark pivot in its final position
  animations.push(['sorted', i + 1]);
  
  return i + 1;
}

function animateQuickSort(animations) {
  for (let i = 0; i < animations.length; i++) {
    const timeoutId = setTimeout(() => {
      if (animationPaused) return;
      
      const [action, ...indices] = animations[i];
      
      switch(action) {
        case 'compare':
          addComparingStyle(indices[0]);
          addComparingStyle(indices[1]);
          
          setTimeout(() => {
            if (!animationPaused) {
              removeComparingStyle(indices[0]);
              removeComparingStyle(indices[1]);
            }
          }, animationSpeed - 5);
          break;
          
        case 'swap':
          addSwappingStyle(indices[0]);
          addSwappingStyle(indices[1]);
          
          // Swap heights
          const tempHeight = arrayBars[indices[0]].bar.style.height;
          arrayBars[indices[0]].bar.style.height = arrayBars[indices[1]].bar.style.height;
          arrayBars[indices[1]].bar.style.height = tempHeight;
          
          // Also swap in our array copy
          [array[indices[0]], array[indices[1]]] = [array[indices[1]], array[indices[0]]];
          
          // Update labels
          arrayBars[indices[0]].label.textContent = array[indices[0]];
          arrayBars[indices[1]].label.textContent = array[indices[1]];
          
          setTimeout(() => {
            if (!animationPaused) {
              removeSwappingStyle(indices[0]);
              removeSwappingStyle(indices[1]);
            }
          }, animationSpeed - 5);
          break;
          
        case 'pivot':
          addPivotStyle(indices[0]);
          setTimeout(() => {
            if (!animationPaused) {
              removePivotStyle(indices[0]);
            }
          }, animationSpeed - 5);
          break;
          
        case 'sorted':
          addSortedStyle(indices[0]);
          break;
      }
      
      // Check if it's the last animation
      if (i === animations.length - 1) {
        setTimeout(() => {
          finishAnimation();
        }, animationSpeed);
      }
    }, i * animationSpeed);
    
    animationTimeouts.push(timeoutId);
  }
}

// ---- MERGE SORT ----
function mergeSort(arr, left, right, animations) {
  if (left < right) {
    const mid = Math.floor((left + right) / 2);
    mergeSort(arr, left, mid, animations);
    mergeSort(arr, mid + 1, right, animations);
    merge(arr, left, mid, right, animations);
  }
}

function merge(arr, left, mid, right, animations) {
  const n1 = mid - left + 1;
  const n2 = right - mid;
  
  // Create temp arrays
  const L = new Array(n1);
  const R = new Array(n2);
  
  // Copy data to temp arrays
  for (let i = 0; i < n1; i++) {
    L[i] = arr[left + i];
  }
  for (let j = 0; j < n2; j++) {
    R[j] = arr[mid + 1 + j];
  }
  
  // Merge the temp arrays back
  let i = 0;
  let j = 0;
  let k = left;
  
  while (i < n1 && j < n2) {
    // Compare elements
    animations.push(['compare', left + i, mid + 1 + j]);
    
    if (L[i] <= R[j]) {
      animations.push(['overwrite', k, L[i]]);
      arr[k] = L[i];
      i++;
    } else {
      animations.push(['overwrite', k, R[j]]);
      arr[k] = R[j];
      j++;
    }
    k++;
  }
  
  // Copy remaining elements
  while (i < n1) {
    animations.push(['overwrite', k, L[i]]);
    arr[k] = L[i];
    i++;
    k++;
  }
  
  while (j < n2) {
    animations.push(['overwrite', k, R[j]]);
    arr[k] = R[j];
    j++;
    k++;
  }
  
  // Mark the range as sorted
  for (let i = left; i <= right; i++) {
    animations.push(['sorted', i]);
  }
}

function animateMergeSort(animations) {
  for (let i = 0; i < animations.length; i++) {
    const timeoutId = setTimeout(() => {
      if (animationPaused) return;
      
      const [action, ...args] = animations[i];
      
      switch(action) {
        case 'compare':
          addComparingStyle(args[0]);
          addComparingStyle(args[1]);
          
          setTimeout(() => {
            if (!animationPaused) {
              removeComparingStyle(args[0]);
              removeComparingStyle(args[1]);
            }
          }, animationSpeed - 5);
          break;
          
        case 'overwrite':
          addSwappingStyle(args[0]);
          
          // Update the array
          array[args[0]] = args[1];
          
          // Update the height based on max value
          const maxValue = Math.max(...array);
          const height = (args[1] / maxValue) * 95; // 95% to leave room for number
          arrayBars[args[0]].bar.style.height = `${height}%`;
          
          // Update the label
          arrayBars[args[0]].label.textContent = args[1];
          
          setTimeout(() => {
            if (!animationPaused) {
              removeSwappingStyle(args[0]);
            }
          }, animationSpeed - 5);
          break;
          
        case 'sorted':
          addSortedStyle(args[0]);
          break;
      }
      
      // Check if it's the last animation
      if (i === animations.length - 1) {
        setTimeout(() => {
          finishAnimation();
        }, animationSpeed);
      }
    }, i * animationSpeed);
    
    animationTimeouts.push(timeoutId);
  }
}

// Handle window resize
window.addEventListener('resize', function() {
  renderArray();
});