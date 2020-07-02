float a = 1;
float b = 1;
float m = 7;
float n = 2;

float error = 0.3;

PImage buffer;

import com.hamoid.*;
VideoExport videoExport;

float zoff;
void setup() {
  size(640, 480);
  stroke(255);
  strokeWeight(1);
  background(0);

  buffer = createImage(width, height, RGB);
  videoExport = new VideoExport(this, "myVideo3.mp4");
  videoExport.setFrameRate(30);  
  videoExport.startMovie();
}
boolean isPoint(float x, float y, float err) {
  for (float i=-1; i<2; i+=0.2) {
    for (float j=-1; j<2; j+=0.2) {//better at 0.1
      
      //The mapping is the major slow down
      //float pointX = map(x+i, 0, width, -1, 1);
      //float pointY = map(y+j, 0, height, -1, 1);
      float pointX = (x+i)/width*2-1;
      float pointY = (y+j)/width*2-1;
      double point = (a*(Math.sin(Math.PI*n*pointX)*Math.sin(Math.PI*m*pointY))) +
                     (b*(Math.sin(Math.PI*m*pointX)*Math.sin(Math.PI*n*pointY)));
      if (Math.abs(point)<err) {
        return true;
      }
    }
  }
  return false;
}
void draw() {
  buffer.loadPixels();
  zoff += 0.1;
  for ( int x = 0; x < width; x++ ) {
    for ( int y = 0; y < height; y++ ) {
      float xoff = x * 0.01;
      float yoff = y * 0.01;

      float c = noise(xoff, yoff, zoff)*255;
      int index = x + y * width;

      //float pointX = map(x, 0, width, -1, 1);
      //float pointY = map(y, 0, height, -1, 1);
      //double point = (a*(Math.sin(Math.PI*n*pointX)*Math.sin(Math.PI*m*pointY))) + (b*(Math.sin(Math.PI*m*pointX)*Math.sin(Math.PI*n*pointY)));
      
      if ( isPoint(x, y, 0.01)) {
        buffer.pixels[index] = color(c, 0, 255-c,80);
      } else {
        buffer.pixels[index] = color(0);
      }
    }
  }
  buffer.updatePixels();

  image(buffer, 0, 0);

  m -= 0.025;
  n += 0.025;
  videoExport.saveFrame();
}
void keyPressed() {
  if (key == 'q') {
    videoExport.endMovie();
    exit();
  }
}
