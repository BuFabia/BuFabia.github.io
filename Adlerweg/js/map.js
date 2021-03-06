window.onload = function() {
// WMTS-Layer basemap.at - Quelle: http://www.basemap.at/wmts/1.0.0/WMTSCapabilities.xml
        var layers = {
            geolandbasemap: L.tileLayer("https://{s}.wien.gv.at/basemap/geolandbasemap/normal/google3857/{z}/{y}/{x}.png", {
                subdomains: ['maps', 'maps1', 'maps2', 'maps3', 'maps4'],
                attribution: 'Datenquelle: <a href="http://www.basemap.at/">basemap.at</a>'
            }),
            bmapgrau: L.tileLayer("https://{s}.wien.gv.at/basemap/bmapgrau/normal/google3857/{z}/{y}/{x}.png", {
                subdomains: ['maps', 'maps1', 'maps2', 'maps3', 'maps4'],
                attribution: 'Datenquelle: <a href="http://www.basemap.at/">basemap.at</a>'
            }),
            bmapoverlay: L.tileLayer("https://{s}.wien.gv.at/basemap/bmapoverlay/normal/google3857/{z}/{y}/{x}.png", {
                subdomains: ['maps', 'maps1', 'maps2', 'maps3', 'maps4'],
                attribution: 'Datenquelle: <a href="http://www.basemap.at/">basemap.at</a>'
            }),
            bmaphidpi: L.tileLayer("https://{s}.wien.gv.at/basemap/bmaphidpi/normal/google3857/{z}/{y}/{x}.jpeg", {
                subdomains: ['maps', 'maps1', 'maps2', 'maps3', 'maps4'],
                attribution: 'Datenquelle: <a href="http://www.basemap.at/">basemap.at</a>'
            }),
            bmaporthofoto30cm: L.tileLayer("https://{s}.wien.gv.at/basemap/bmaporthofoto30cm/normal/google3857/{z}/{y}/{x}.jpeg", {
                subdomains: ['maps', 'maps1', 'maps2', 'maps3', 'maps4'],
                attribution: 'Datenquelle: <a href="http://www.basemap.at/">basemap.at</a>'
            }),
            osm: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                subdomains: ['a', 'b', 'c'],
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            })
        };

        // Karte definieren
        var map = L.map('map', {
            layers: [layers.geolandbasemap],
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
		    position : 'topright',
		    theme : 'steelblue-theme'
	    });
	    profileControl.addTo(map);

		// Funktion zum Laden eines tracks
		function loadTrack(track){
			
			//Etappen Infos anzeigen
			console.log("etappeninfo: ", window.ETAPPENINFO);
			console.log("info: ", window.ETAPPENINFO[track]);
			console.log("Kurztext: ", window.ETAPPENINFO[track].Kurztext);
			document.getElementById("Kurztext").innerHTML = window.ETAPPENINFO[track].Kurztext;
			
			// bestehenden Track, farbige Linie mit Steigung und Profil löschen
			gpxTrackGroup.clearLayers();
			coloredLineGroup.clearLayers();
			profileControl.clear();
			};
		
		function loadTrack(track) {
		// GPX Track laden
	    gpxTrack = omnivore.gpx('Data/'+track).addTo(map);
		// nach erfolgreichem Laden Popup hinzufügen, Ausschnitt setzen und Höhenprofil erzeugen
	    gpxTrack.on('ready', function () {
	    // Popup hinzufügen
		var markup = '<h3>Adlerweg-Etappe 1: St. Johann - Gaudeamushütte</h3>';
	   markup += '<p>Die erste Etappe am Adlerweg führt vom St. Johanner Ortsteil Hinterkaiser zur Gaudeamushütte auf 1.263 Metern Seehöhe. Zei besondere Naturschauspiele entlang der Strecke sind der imposante Schleierwasserfall und die Höhle Diebsöfen.</p>'
	               markup += '<li>Ausgangspunkt: Rummlerhof</li>';
	               markup += '<li>Endpunkt: Gaudeamushütte</li>';
	               markup += '<li>Höhenmeter bergauf: 1060</li>';
	               markup += '<li>Höhenmeter bergab: 470</li>';
	               markup += '<li>Höchster Punkt: 1572</li>';
	               markup += '<li>Schwierigkeitsgrad: mittelschwierig</li>';
	               markup += '<li>Streckenlänge (in km): 9</li>';
	               markup += '<li>Gehzeit (in Stunden): 5,5</li>';
	               markup += '<li>Einkehrmöglichkeiten: Rummlerhof, Obere Regalm, Gaudeamushütte</li>';
	               markup += '<li><a href="http://www.tirol.at/reisefuehrer/sport/wandern/wandertouren/a-adlerweg-etappe-1-st-johann-gaudeamushuette">Weitere Infos</a></li>';
	               gpxTrack.bindPopup(markup, { maxWidth : 450 });
				
				 // Ausschnitt setzen
	               map.fitBounds(gpxTrack.getBounds());

	               // Höhenprofil erzeugen
				   profileControl.clear();
	               gpxTrack.eachLayer(function(layer) {
	                   profileControl.addData(layer.feature);
						//console.log(layer.feature.geometry.coordinates);
						var pts = layer.feature.geometry.coordinates;	
						
						for ( var i = 1; i < pts.length; i += 1){
							//console.log(pts[i]);	//aktueller Punkt
							//console.log(pts[i-1]);	// vorhergehender Punkt
							
							// Entfernung bestimmen 
							var dist = map.distance (
								[pts[i][1],pts[i][0]],
								[pts[i-1][1],pts[i-1][0]]
							).toFixed(0);
							//console.log(dist);
							
							var delta = pts[i][2] - pts[i-1][2];
							//console.log(delta,"Höhenmeter auf",dist,"m Strecke");
							
							var rad = Math.atan(delta/dist);
							var deg = (rad * (180 / Math.PI)).toFixed(1);
							//console.log(deg);
							
							//var rot = ["#ab2524", "#a02128", "#a1232b", "#8d1d2c", "#701f29", "#5e2028"];
							//var gruen = ["#42EB00", "#38C400", "#288F00", "#195700", "#0A2400"];
							
							//colorbrewer
							//rot ['#ffffb2','#fed976','#feb24c','#fd8d3c','#f03b20','#bd0026']
							// grün ['#ffffcc','#d9f0a3','#addd8e','#78c679','#31a354','#006837']
							
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
								//console.log(deg,farbe);
								
								
								// Linie zeichnen
								var pointA = new L.LatLng(pts[i][1],pts[i][0]);
								var pointB = new L.LatLng(pts[i-1][1],pts[i-1][0]);
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
			  } // end function loadTrack 
        

        // leaflet-hash aktivieren
        var hash = new L.Hash(map);
		
		// Etappe laden
		//console.log(window.etappe01);
		
		//var etappe = omnivore.gpx('Data/AdlerwegEtappe01.gpx').addTo(map);
		
		//var el = L.control.elevation();
		//el.addTo(map);
		//L.geoJSON(window.etappe01, {
			//onEachFeature: el.addData.bind(el)
		//}).addTo(map);
		
		// Icons von https://mapicons.mapsmarker.com/
		/*var huts = L.icon({
	   			iconUrl: 'icons/cabin-2.png',
	   			iconAnchor: [16, 37]		
	   		});
		L.featureGroup ([ 
			L.marker([47.549263, 12.324513000000024], { title: "Gaudeamushütte", icon: huts }),
			L.marker([47.546639, 12.344426999999996], { title: "Obere Regalm", icon: huts }),
			L.marker([47.5380297, 12.397733099999982], {title: "Rummlerhof", icon: huts })
		]);	*/
		var huts = L.icon({
	   			iconUrl: 'icons/cabin-2.png',
	   			iconAnchor: [16, 37]		
	   		});
	   		L.featureGroup([
	   			L.marker ([47.549263, 12.324513000000024], { title: "Gaudeamushütte", icon: huts } ),
	   			L.marker ([47.546639, 12.344426999999996], { title: "Obere Regalm", icon: huts} ),
				L.marker ([47.5380297, 12.397733099999982], { title: "Rummlerhof", icon: huts} )
	   		]).addTo(map);
			
		var start = L.icon({
	   			iconUrl: 'icons/hiking.png',
	   			iconAnchor: [16, 37]
	   		});
	   	L.marker([47.51988, 12.43071], { title: "Start Etappe 01", icon: start}).addTo(map);
			
		var end = L.icon({
	   			iconUrl: 'icons/finish.png',
	   			iconAnchor: [16, 37]
	   		});
	   	L.marker([47.54914, 12.32456], { title: "Ziel Etappe 01", icon: end}).addTo(map);	
			
		var hutsLayer = L.featureGroup();
		for (var i=0; i<huts.length; i++) {
			hutsLayer.addLayer(huts[i]);
		}
		//hutsLayer.addTo(map);
		map.on("zoomend", function() {
			if (map.getZoom() >= 15) {
				map.addLayer(hutsLayer);
			} else {
				map.removeLayer(hutsLayer);
			}
		});
		
		// WMTS-Layer Auswahl hinzufügen
        var layerControl = L.control.layers({
            "basemap.at - STANDARD": layers.geolandbasemap,
            "basemap.at - GRAU": layers.bmapgrau,
            "basemap.at - OVERLAY": layers.bmapoverlay,
            "basemap.at - HIGH-DPI": layers.bmaphidpi,
            "basemap.at - ORTHOFOTO": layers.bmaporthofoto30cm,
            "OpenStreetMap": layers.osm,
        }).addTo(map);
		
		// zwischen den einzelnen Etappen hin und her schalten
		var etappenSelektor = document.getElementById("etappen");
		//console.log("Selektor",etappenSelektor);
		etappenSelektor.onchange = function (evt) {
			console.log("Change event:", evt);
			console.log("GPX Track laden", etappenSelektor[etappenSelektor.selectedIndex].value);
			loadTrack(etappenSelektor[etappenSelektor.selectedIndex].value);
		}
		loadTrack("AdlerwegEtappe01.gpx");
};
				