import 'https://api.mapbox.com/mapbox-gl-js/v1.8.1/mapbox-gl.js'

const mapbox_token =
	'pk.eyJ1IjoiY29ubnlneSIsImEiOiJjazd2cTViYTQxamlyM2VvdTBseTQ2aHNtIn0.A6CkwfybrKCm4e2kWq_lpg'

mapboxgl.accessToken = mapbox_token

var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/dark-v10',
	zoom: 1.5,
	center: [0, 20]
})

const getColorFromCount = count => {
	if (count >= 100) {
		return 'red'
	}
	if (count >= 10) {
		return 'blue'
	}
	return 'gray'
}

const getPopupContent = currentPlace => {
	return `<Strong>${currentPlace.name}</Strong><br>
  infected: ${currentPlace.infected}<br>
  dead: ${currentPlace.dead}<br>
  sick: ${currentPlace.sick}<br>
  recovered: ${currentPlace.recovered}<br>
  updated at: ${currentPlace.lastUpdated}`
}

fetch('get-places.json')
	.then(response => response.json())
	.then(res => {
		return res.data
	})
	.then(data => {
		data.forEach(currentPlace => {
			let popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
				getPopupContent(currentPlace)
			)
			new mapboxgl.Marker({
				color: getColorFromCount(currentPlace.infected)
			})
				.setLngLat([currentPlace.longitude, currentPlace.latitude])
				.setPopup(popup)
				.addTo(map)
		})
	})
