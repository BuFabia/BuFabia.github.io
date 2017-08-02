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
			
			/*document.getElementById("Titel").innerHTML = window.ETAPPENINFO[track].Titel;
			document.getElementById("Kurztext").innerHTML = window.ETAPPENINFO[track].Kurztext;
			document.getElementById("Streckenbeschreibung").innerHTML = window.ETAPPENINFO[track].Streckenbeschreibung;*/
			
			// nach erfolgreichem Laden Popup hinzufügen, Ausschnitt setzen und Höhenprofil erzeugen
			gpxTrack.on('ready', function () {
				// Popup hinzufügen
				var markup = '<h3>Transalp-Etappe 1: Innsbruck-Bozen</h3>';
				markup += '<p>Die erste Etappe der Transalp führt von der Innenstadt Innsbrucks über den Brennerpass nach Sterzing. Von dort geht es auf das 2211m hohe Penser Joch und abschließend die 50km lange Abfahrt in die Hauptstadt Südtirols Bozen. Besondere Highlights dieser Etappe sind die Befahrung des Penser Jochs von Norden und die anschließende über 50 km lange Abfahrt durch das Sarntal und die tunnelreiche Schlucht im unteren Teil hinunter nach Bozen.</p>'
				markup += '<li>Ausgangspunkt: Innsbruck-Innbrücke</li>';
				markup += '<li>Endpunkt: Bozen</li>';
				markup += '<li>Höhenmeter bergauf: 3472</li>';
				markup += '<li>Höhenmeter bergab: 3777</li>';
				markup += '<li>Höchster Punkt: 2211</li>';
				markup += '<li>Schwierigkeitsgrad: mittelschwierig</li>';
				markup += '<li>Streckenlänge (in km): 120</li>';
				markup += '<li>Gehzeit (in Stunden): 6</li>';
				markup += '<li>Einkehrmöglichkeiten: Sterzing, Penser Joch, Bozen</li>';
				;
				gpxTrack.bindPopup(markup, { maxWidth : 450 });

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



	//einzelne Etappen wählen
	var etappenSelektor = document.getElementById ("etappen");
		//console.log("Selektor", etappenSelektor);
		//etappenSelektor.onchange = function (evt) {
		//console.log("Change event: ", evt);
		//console.log("GPX Track laden: ", etappenSelektor[etappenSelektor.selectedIndex].value);
		//loadTrack(etappenSelektor[etappenSelektor.selectedIndex].value);
		//}
		loadTrack("Etappe2.gpx");
		
};
