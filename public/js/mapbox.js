const mapElement = document.getElementById('map');
const locations = mapElement ? JSON.parse(mapElement.dataset.locations || '[]') : [];
const accessToken = mapElement ? mapElement.dataset.mapboxToken : '';

if (mapElement && window.mapboxgl && accessToken && locations.length) {
	window.mapboxgl.accessToken = accessToken;

	const map = new window.mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/mapbox/streets-v12',
		scrollZoom: false,
	});

	const bounds = new window.mapboxgl.LngLatBounds();

    locations.forEach((loc) => {
        const el = document.createElement('div')
        el.className ='marker'

        // add marker
        new mapboxgl.Marker({
            element:el,
            anchor: 'bottom'
        })
        .setLngLat(loc.coordinates)
        .addTo(map)

        new window.mapboxgl.Popup({ offset: 30 })
			.setLngLat(loc.coordinates)
			.setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
			.addTo(map);

        bounds.extend(loc.coordinates);
    })
    
    // extend the map bound to include the currect location

    map.fitBounds(bounds, {
        padding: {
                top: 200,
                bottom: 200,
                left: 100,
                right: 100
            }
    })


	// locations.forEach((loc) => {
	// 	new window.mapboxgl.Marker({ color: '#55c57a' })
	// 		.setLngLat(loc.coordinates)
	// 		.addTo(map);

	// 	new window.mapboxgl.Popup({ offset: 30 })
	// 		.setLngLat(loc.coordinates)
	// 		.setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
	// 		.addTo(map);

	// 	bounds.extend(loc.coordinates);
	// });

	// map.fitBounds(bounds, {
	// 	padding: { top: 200, bottom: 150, left: 100, right: 100 },
	// });
}

