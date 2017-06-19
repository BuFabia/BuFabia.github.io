window.onload = function () {
        
        var layers = {

            osm: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                subdomains: ['a', 'b', 'c'],
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }),
        };

        // Karte definieren
        var map = L.map('map', {
            layers: [layers.osm],
            center : [47.654, 13.370],
            zoom : 8
        });

        // Maßstab hinzufügen
        L.control.scale({
            maxWidth: 200,
            metric: true,
            imperial: false
        }).addTo(map);

		 // Höhenprofil control hinzufügen
        var profileControl = L.control.elevation({
            position : 'bottomright',
            theme : 'steelblue-theme',
			width: 300,
			height: 125,

        });
        profileControl.addTo(map);
		
		function loadTrack(track) {
			// GPX Track 
			console.log("etappeninfo: ", window.ETAPPENINFO);
			
			
			gpxTrack = omnivore.gpx('data/' + track).addTo(map);
			
			
			// nach erfolgreichem Laden Popup hinzufügen, Ausschnitt setzen und Höhenprofil erzeugen
			gpxTrack.on('ready', function () {
			

				// Ausschnitt setzen
				map.fitBounds(gpxTrack.getBounds());

				// Höhenprofil erzeugen und Koordinaten der Punkte holen
				profileControl.clear();
				gpxTrack.eachLayer(function (layer) {
					profileControl.addData(layer.feature);
					
					//console.log(layer.feature.geometry.coordinates)
					var pts = layer.feature.geometry.coordinates;
					
					for (var i = 1; i < pts.length; i += 1) {
						//console.log(pts[i]);   //aktueller Punkt
						//console.log(pts[i-1]);   //vorheriger Punkt
						
						//Entfernung bestimmen
						var dist = map.distance (
							[pts[i][1], pts[i][0]],
							[pts[i-1][1], pts[i-1][0]]
						).toFixed(0);    	// Kommastellen weg
						//console.log(dist);
						
						var delta = pts[i][2] - pts[i-1][2];
						//console.log(delta, "Höhenmeter auf",dist ,"m Strecke");    //Höhenunterschied
						
						var rad = Math.atan(delta/dist);
						var deg = (rad * (180 / Math.PI)).toFixed(1);
						//console.log(deg);
						
						//var rot = ['#ffffb2','#fed976','#feb24c','#fd8d3c','#f03b20','#bd0026']; // http://colorbrewer2.org/#type=sequential&scheme=Reds&n=6
						//var gruen = ['#ffffcc','#d9f0a3','#addd8e','#78c679','#31a354','#006837'];
						var farbe;
						switch(true) { // checks if condition is true, not for certain values of a variable
							case (deg >= 20) :  farbe = "#bd0026"; break;
							case (deg >= 15) :  farbe = "#f03b20"; break;
							case (deg >= 10) :  farbe = "#fd8d3c"; break;
							case (deg >= 5) :  farbe = "#feb24c"; break;
							case (deg >= 1) :  farbe = "#fed976"; break;
							case (deg >= -1) :  farbe = "yellow"; break;
							case (deg >= -5) :  farbe = "#d9f0a3"; break;
							case (deg >=-10) :  farbe = "#addd8e"; break;
							case (deg >=-15) :  farbe = "#78c679"; break;
							case (deg >= -20) :  farbe = "#31a354"; break;
							case (deg < -20) :  farbe = "#006837"; break;
							}
						
							//console.log(deg, farbe);
															
						var pointA = new L.LatLng(pts[i][1], pts[i][0]);
						var pointB = new L.LatLng(pts[i-1][1], pts[i-1][0]);
						var pointList = [pointA, pointB];
						var firstpolyline = new L.Polyline(pointList, {
						 color: farbe,
						 weight: 6,
						 opacity: 1.0,
						 smoothFactor: 1

						});
					
						firstpolyline.addTo(map);
					}
				});
			});
		
		} // end function
        // leaflet-hash aktivieren
        var hash = new L.Hash(map);
		

		var start = L.icon({
			iconUrl: 'icons/Etappe1.png',
			iconAnchor: [16, 37]
		});
		L.marker([47.267222, 11.392778], { title: "Start Etappe 1", icon: start}).addTo(map);
		
		var start = L.icon({
			iconUrl: 'icons/Etappe2.png',
			iconAnchor: [16, 37]
		});
		L.marker([46.49926, 11.35661], { title: "Start Etappe 2", icon: start}).addTo(map);
		
		var start = L.icon({
			iconUrl: 'icons/Etappe3.png',
			iconAnchor: [16, 37]
		});
		L.marker([46.465, 10.373056], { title: "Start Etappe 3", icon: start}).addTo(map);
		
		var start = L.icon({
			iconUrl: 'icons/Etappe4.png',
			iconAnchor: [16, 37]
		});
		L.marker([46.366667, 11.033333], { title: "Start Etappe 4", icon: start}).addTo(map);
		
		var end = L.icon({
			iconUrl: 'icons/Ziel.png',
			iconAnchor: [16, 37]
		});
		L.marker([45.883333, 10.85], { title: "Ziel Etappe 4", icon: end}).addTo(map);	
        // WMTS-Layer Auswahl hinzufügen



		loadTrack("Data/AlleEtappen.gpx");
		
};
