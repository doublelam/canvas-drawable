# Get start
A package that let the specified canvas elememnt turns to drawable, it can be used to draw things or erase  
```
  npm install canvas-drawable --save
```

## Usage

``` pug
html(lang="en")
  head
    meta(charset="UTF-8")
    meta(name="viewport", content="width=device-width, initial-scale=1.0")
    meta(http-equiv="X-UA-Compatible", content="ie=edge")
    title canvas
  body
    canvas#canvas(style="margin: 30px;border: 50px solid #eee" width="300px" height="200px")
    button#erase erase
    button#draw draw
    button#getimage getimg
    button#clearall clear all
```

``` ts
import { CanvasDrawable } from "canvas-drawable";
const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('canvas');
const erase = document.getElementById('erase');
const draw = document.getElementById('draw');
const getImage = document.getElementById('getimage');
const clearAll = document.getElementById('clearall');
const drawable = new CanvasDrawable(canvas.getContext('2d'));
erase.onclick = e => {
  drawable.enerase();
}
draw.onclick = e => {
  drawable.endraw();
}
getImage.onclick = e => {
  console.log(drawable.getCanvasBase64())
}
clearAll.onclick = e => {
  drawable.cleanAll();
}
```

## Methods

### new CanvasDrawable(canvasContext, style?: {color: string, width: number})

### endraw()
let the canvas element be drawable

### enerase(thick?:number)
change the mode into erase besides change the thick of erase

### setStyle(style: {color?: string, width?: number})
set the style of stroke

### cleanAll()
clean the whole area of the canvas element

### getCanvasBase64(...args);
returns canvasContext.canvas.toDataURL(...args);

### getCanvasBlob(...args);
returns a promise that will return the blob of the canvas image

### nativeContext()
return the convasContext

