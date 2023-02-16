## Setup
Download [Node.js](https://nodejs.org/en/download/).
Run this followed commands:

``` bash
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:8080
npm run dev

# Build for production in the dist/ directory
npm run build
```
# Programmed with the help of Bruno Simon's Three.js Journey online courses

TODO:

-Limit camera zoom out and zoom in. The planet gets half rendered if zoomed in or zoomed out too much.\r\n
-?Choice of different texture patterns instead of colors for planet surfaces.\r\n
-Directly upload the .glb file to Mozilla Hubs instead of downloading it and doing the upload manually.\r\n
-?Option to have a text on the planet surface: If the user types in a text, the text and the material color should be made into a texture, and this texture must be applied. If not, I could not think of another way.\r\n
-Belt can be made of metoroids for aestethic.\r\n