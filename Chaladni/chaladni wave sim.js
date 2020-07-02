// Speed constant. Describes speed of waves.
let SPEED = 1.0;

// Amplitude.
let amplitude = 5.0;
let amplitude_slider;

// Frequency.
let frequency = 1 / 300;
let frequency_slider;

// Phase.
let phase = 0;

// Damping.
let damping = 1.0;
let damping_slider;

// Matricies.
let position_matrix = null;
let velocity_matrix = null;
let temp_matrix = null;

// Mode.
// 1 = position.
// 0 = velocity.
let mode = 1;
// Mode button.
let mode_button;

// Return a 2 Dimentional array.
function createTwoDArray(width, height) {
  let arr = [];
  for (let r = 0; r < height; r++) {
    let row = [];
    for (let c = 0; c < width; c++) {
      row.push(0);
    }
    arr.push(row);
  }
  return arr;
}

function changeMode(){
  if (mode == 1){
    mode = 0;
    mode_button.html("Velocity");
  } else{
    mode = 1;
    mode_button.html("Position");
  }
}

function nextFrame() {
  // Change edges to input phase.
  let val = amplitude * Math.sin(phase);
  for (let i = 0; i < width; i++) {
    if(position_matrix[0][width - 1] == val){break;}
    position_matrix[0][i] = val;
    position_matrix[height - 1][i] = val;
  }
  for (let i = 1; i < height - 1; i++) {
    if(position_matrix[i][height - 2] == val){break;}
    position_matrix[i][0] = val;
    position_matrix[i][width - 1] = val;
  }

  phase += 2 * Math.PI * frequency;
  // Normalise between 0 and 2*PI.
  phase %= 2 * Math.PI;

  // Wave equation.
  // Change wave based on neighboring values.
  for (let row = 1; row < height - 1; row++) {// Start and finsh away from edges.
    for (let col = 1; col < width - 1; col++) {
      let sum_of_neighbors = position_matrix[row - 1][col] + position_matrix[row + 1][col] +
                             position_matrix[row][col - 1] + position_matrix[row][col + 1];

      let d = position_matrix[row][col] - sum_of_neighbors / 4.0;
      temp_matrix[row][col] = velocity_matrix[row][col] - SPEED * d;
    }
  }
  // Update the real velocity matrix.
  velocity_matrix = temp_matrix;

  loadPixels();
  for (let row = 1; row < height - 1; row++) {
    for (let col = 1; col < width - 1; col++) {
      // Damp the velocity for each point.
      velocity_matrix[row][col] *= damping;

      // Update position for each point.
      position_matrix[row][col] += velocity_matrix[row][col];

      // Update the pixel values.
      let brightness = 0;
      if (mode == 1) {
        // V = D / T
        // V = C / P = 2πA / P
        // A = VP/2π
        let a = velocity_matrix[row][col] / (2 * Math.PI * Math.max(frequency, Number.MIN_VALUE)); // Stop division by 0.
        brightness = 255 - (position_matrix[row][col] ** 2 + a ** 2); // 255 - How much is changing + How fast it is changing
      }
      else{
        brightness = Math.floor(position_matrix[row][col] * 20);// Floor to stop sine errors.
      }
      set(row,col,color(brightness))
    }
  }
  updatePixels();
}

function setup() {
  createCanvas(380, 380);
  background(0);
  
  position_matrix = createTwoDArray(width,height);
  velocity_matrix = createTwoDArray(width,height);
  temp_matrix = createTwoDArray(width,height);

  amplitude_slider = createSlider(0, 10, 5);
  amplitude_slider.position(10, 10);
  amplitude_slider.style('width', '100px');

  frequency_slider = createSlider(1/10000, 1/100, 1/300,1/1000); // Make this 10^-x
  frequency_slider.position(110, 10);
  frequency_slider.style('width', '100px');

  damping_slider = createSlider(0.996, 1.0, 1.0,0.001); // Make this 10^-x
  damping_slider.position(210, 10);
  damping_slider.style('width', '100px');

  mode_button = createButton('Position');
  mode_button.position(320, 10);
  mode_button.mousePressed(changeMode);
}

function draw() {
  damping = damping_slider.value();//0.996-1
  frequency = frequency_slider.value();
  amplitude = amplitude_slider.value();
  nextFrame();
}
