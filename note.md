# map

## Start project

`!` in `.html` can get the html template

## website:

website: https://coronavirus.app/

## server package

`npm install http-server`

run the server with

npx http-server

- The command `npx`, it is a node package runner  
  resource:
  - https://stackoverflow.com/questions/50605219/difference-between-npx-and-npm
  - https://www.freecodecamp.org/news/npm-vs-npx-whats-the-difference/

## mapbox documentation for web

https://docs.mapbox.com/mapbox-gl-js/api/

https://docs.mapbox.com/help/how-mapbox-works/web-apps/#creating-a-web-app

Examples: https://docs.mapbox.com/mapbox-gl-js/examples/

draggable Marker: https://docs.mapbox.com/mapbox-gl-js/example/drag-a-marker/

## add popup to marker

use the function of `mapboxgl.Popup().setHTML(...)` or
`mapboxgl.Popup().setText(...)`

```javascript
// setHTML() and setText()
let popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
	getPopupContent(currentPlace)
)
new mapboxgl.Marker({
	color: getColorFromCount(currentPlace.infected)
})
	.setLngLat([currentPlace.longitude, currentPlace.latitude])
	.setPopup(popup)
	.addTo(map)
```
