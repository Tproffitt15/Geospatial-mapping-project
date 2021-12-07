var mapURL ="https://www.mapquestapi.com/directions/v2/route";
var keyMap="cpzCmtyAMRZD5AXjU7kMvgt8ChZ0Whe9";
var restAPI ="http://proffitz.aws.csi.miamioh.edu/final.php";
var chartURL="http://open.mapquestapi.com/elevation/v1/chart";

function getDirections() {
	var from = 	$('#fromAddress').val();
	var to = $('#toAddress').val();
	a=$.ajax({
		url: mapURL + '?key=' + keyMap + '&from=' + from + '&to=' + to,
		method: "POST"
	}) .done(function(data) {
		var ulLng = data.route.boundingBox.ul.lng;
		var ulLat = data.route.boundingBox.ul.lat;
		var lrLng = data.route.boundingBox.lr.lng;
		var lrLat = data.route.boundingBox.lr.lat;
		
		$("#tableBody").html("");
		manLength = data.route.legs[0].maneuvers.length;
		for (i=0; i < manLength -1; i++) {
			$("#tableBody").append("<tr><td>" + data.route.legs[0].maneuvers[i].narrative + "</td>"
				+ "<td>" + data.route.legs[0].maneuvers[i].distance + "</td>"
				+ "<td>" + data.route.legs[0].maneuvers[i].time + "</td>" 
				+ "<td><iframe class='iframes' src='" + data.route.legs[0].maneuvers[i].mapUrl + "'</iframe></td></tr>" 
			);
		}
		$("#tableBody").append("<tr><td>" + data.route.legs[0].maneuvers[manLength -1].narrative + "</td>"
				+ "<td>" + data.route.legs[0].maneuvers[manLength -1].distance + "</td>"
				+ "<td>" + data.route.legs[0].maneuvers[manLength -1].time + "</td>");
		var varElevationURL = chartURL + '?key=' + keyMap + '&shapeFormat=raw&width=400&height=300&latLngCollection=' + ulLat + "," +
		ulLng + "," + lrLat + "," + lrLng;
		
		$("#tableBody").append("<tr><td>" + "<img src='" + varElevationURL + "'</td></tr>");
		
		setLookUp(from, to, manLength, data.route.legs[0].maneuvers, varElevationURL);
	
	}).fail(function(error) {
		
  });
}

function getHistory() {
	var date = 	$('#date').val();
	var maxLines = $('#maxLines').val();
	a=$.ajax({
		url: restAPI,
		data: {
			method: "getLookup",
			date: date
		},
		method: "POST"
	}) .done(function(data) {
		$("#tableBody").html("");
		len = data.result.length;
		
		if (len < maxLines) {
			maxLines = len;
		}
		
		for (i=0; i < maxLines; i++) {
			var parsed = JSON.parse(data.result[i].value);
			var dateTime = data.result[i].date.split(" ");
			var date = dateTime[0];
			var time = dateTime[1];
			var arrLen = parsed.manArray.length;
			
			$("#tableBody").append("<tr><td>" + date + "</td>"
				+ "<td>" + time + "</td>"
				+ "<td>" + parsed.from + "</td>" 
				+ "<td>" + parsed.to + "</td>" 
				+ "<td>" + parsed.manLength + "</td></tr>" 
				+ "<td colspan='5'><button class='btn btn-primary' data-toggle='collapse' data-target='#detailDiv" + i + "' aria-expanded='false' aria-controls='details'>Show/Hide</button>"
				+ "<div class='collapse' id='detailDiv" + i + "'><div id='detailBody" + i + "' class='card card-body'></td>"
			);
			$("#detailBody" + i).append("<table id='detailTable' class='table'><thead><tr><th>Narrative</th><th>Distance</th><th>Time</th><th>Thumbnail</th></tr></thead><tbody id='detailTableBody" + i + "'>"
			);	
			for (j=0; j < arrLen - 1; j++) {
				$("#detailTableBody" + i).append("<tr><td>" + parsed.manArray[j].narrative + "</td>"
						+ "<td>" +  parsed.manArray[j].distance + "</td>"
						+ "<td>" +  parsed.manArray[j].time + "</td>" 
						+ "<td><iframe class='iframes' src='" +  parsed.manArray[j].mapUrl + "'</iframe></td></tr>" 
				);
			}
			$("#detailTableBody" + i).append("<tr><td>" + parsed.manArray[arrLen -1].narrative + "</td>"
						+ "<td>" + parsed.manArray[arrLen -1].distance + "</td>"
						+ "<td>" + parsed.manArray[arrLen -1].time + "</td>"
						+ "</tr>" + "</tbody></table>"
				);
			$("#tableBody").append("</div></div></tr>");
		}
	}).fail(function(error) {
    
  });
}

function setLookUp(from, to, manLength, manArray, chartURL) {
	var valueObject = {
		from: from,
		to: to,
		manLength: manLength,
		manArray: manArray,
		chartURL: chartURL
	}
	
	value = JSON.stringify(valueObject);

	a=$.ajax({
		url: restAPI,
		data: {
			method : "setLookUp",
			location: "45056",
			sensor: "web",
			value : value		
		},
		method: "POST"
	}) .done(function(data) {
	}).fail(function(error) {
  });
} 