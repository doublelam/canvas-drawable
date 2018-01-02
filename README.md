# Get start
A package that let the specific canvas elememnt turns to drawable, it can be used to draw things or erase  
```
  npm install canvas-drawable --save
```

## Usage
``` ts
import { CanvasDrawable } from "canvas-drawable";
const ctx = document.getElementById("canvas").getContext("2d");
const canDraw = new CanvasDrawable(ctx);
```

