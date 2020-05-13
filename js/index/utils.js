var utils = {};
utils.captureMouse = function (element) {
	var mouse = {x: 0, y: 0, edellinenX:0, edellinenY:0};
	element.addEventListener('mousemove', function (event) {
		var x, y, prevX, prevY;
		if (event.pageX || event.pageY) {
			x = event.pageX;
			y = event.pageY;
		} else {
			x = event.clientX + document.body.scrollLeft +
			document.documentElement.scrollLeft;
			y = event.clientY + document.body.scrollTop +
			document.documentElement.scrollTop;
		};
		x -= element.offsetLeft;
		y -= element.offsetTop;
		mouse.x = x;
		mouse.y = y;
	}, false);
	return mouse;
};

utils.colorToRGB = function (color, alpha) {
	//if string format, convert to number
	if (typeof color === 'string' && color[0] === '#') {
		color = window.parseInt(color.slice(1), 16);
	};
	alpha = (alpha === undefined) ? 1 : alpha;
	//extract component values
	var r = color >> 16 & 0xff,
	g = color >> 8 & 0xff,
	b = color & 0xff,
	a = (alpha < 0) ? 0 : ((alpha > 1) ? 1 : alpha); //check range
	//use 'rgba' if needed
	if (a === 1) {
		return "rgb("+ r +","+ g +","+ b +")";
	} else {
		return "rgba("+ r +","+ g +","+ b +","+ a +")";
	};
};

utils.parseColor = function (color, toNumber) {
	if (toNumber === true) {
		if (typeof color === 'number') {
			return (color | 0); //chop off decimal
		};
		if (typeof color === 'string' && color[0] === '#') {
			color = color.slice(1);
		};
		return window.parseInt(color, 16);
	} else {
		if (typeof color === 'number') {
			//make sure our hexadecimal number is padded out
			color = '#' + ('00000' + (color | 0).toString(16)).substr(-6);
		};
		return color;
	};
};

utils.componentToHex = function(c){
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
};
utils.hexToRgb = function(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};
utils.getRandomColor = function () {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    };
    return color;
};

utils.bezier = function(t, p0, p1, p2, p3){
	var cX = 3 * (p1.x - p0.x),
	bX = 3 * (p2.x - p1.x) - cX,
	aX = p3.x - p0.x - cX - bX;
	
	var cY = 3 * (p1.y - p0.y),
	bY = 3 * (p2.y - p1.y) - cY,
	aY = p3.y - p0.y - cY - bY;
	
	var x = (aX * Math.pow(t, 3)) + (bX * Math.pow(t, 2)) + (cX * t) + p0.x;
	var y = (aY * Math.pow(t, 3)) + (bY * Math.pow(t, 2)) + (cY * t) + p0.y;
	
	return {x: x, y: y};
}

utils.checkLineIntersection = function(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
	// if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
	var denominator, a, b, numerator1, numerator2, result = {
		x: null,
		y: null,
		onLine1: false,
		onLine2: false
	};
	denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
	if (denominator == 0) {
		return result;
	};
	a = line1StartY - line2StartY;
	b = line1StartX - line2StartX;
	numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
	numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
	a = numerator1 / denominator;
	b = numerator2 / denominator;

	// if we cast these lines infinitely in both directions, they intersect here:
	result.x = line1StartX + (a * (line1EndX - line1StartX));
	result.y = line1StartY + (a * (line1EndY - line1StartY));
	/*
		// it is worth noting that this should be the same as:
		x = line2StartX + (b * (line2EndX - line2StartX));
		y = line2StartX + (b * (line2EndY - line2StartY));
		*/
	// if line1 is a segment and line2 is infinite, they intersect if:
	if (a > 0 && a < 1) {
		result.onLine1 = true;
	};
	// if line2 is a segment and line1 is infinite, they intersect if:
	if (b > 0 && b < 1) {
		result.onLine2 = true;
	};
	// if line1 and line2 are segments, they intersect if both of the above are true
	return result;
};

utils.getDots = function(dots, start){
	var offY = -9;
	// Jos dots-array on alustamaton, luodaan kahden ensimm‰isen solun pisteet.
	// Oletuksena on, ett‰ solun ensimm‰inen piste on viimeisen kurvin toinen kontrollipiste.
	dots = dots ? dots : [{x:canvas.width * Math.random(), y:canvas.height * Math.random()},
						  {x:canvas.width * 0.5, 		   y:(canvas.height * 0.5 + offY)}];
		
	// Lasketaan uuden kurvin ensimm‰isen kontrollipisteen x- ja y-komponentti
	// viimeisen kurvin kahdesta viimeisest‰ pisteest‰.
	var dx = dots[1].x - dots[0].x;
	var dy = dots[1].y - dots[0].y;
		
	// Mik‰li viimeisen kurvin kaksi viimeist‰ pistett‰ sis‰lt‰v‰t samat koordinaatit, 
	// luodaan uusi ensimm‰inen piste.
	if(dx == 0 && dy == 0){
		dx = dots[1].x - canvas.width * Math.random();
		dy = dots[1].y - canvas.height * Math.random();
	};
	
	// Luodaan uuden kurvin ensimm‰inen piste vanhan kurvin toisesta pisteest‰.
	dots[0] = {x:dots[1].x, y:dots[1].y};
	
	// Etsit‰‰n uudelle kurville ensimm‰inen kontrollipiste.
	var dir = Math.atan2(dy,dx);
	var dis = Math.sqrt(dx*dx+dy*dy);
	dx = dots[0].x + dis * Math.cos(dir);
	dy = dots[0].y + dis * Math.sin(dir);
	// Tarkistetaan meneekˆ luotu piste kuvaruudun ulkopuolelle ja jos menee, lasketaan uusi piste
	if(dx < 0 || dx > canvas.width || dy < 0 || dy > canvas.height){
		// m‰‰ritell‰‰n kehykset
		var frames = [{a:0, b:0, c:canvas.width, d:0}, {a:0, b:0, c:0, d:canvas.height}, {a:canvas.width, b:0, c:canvas.width, d:canvas.height}, {a:0, b:canvas.height, c:canvas.width, d:canvas.height}];
		
		// tarkistetaan miss‰ kohtaa kehysten linjat kohtaavat kontrollipisteen linjan
		for(i=0; i < frames.length; i++){
		
			// testataan leikkauspiste
			result = utils.checkLineIntersection(frames[i].a, frames[i].b, frames[i].c, frames[i].d, dots[0].x, dots[0].y, dx, dy);
			
			// tarkistetaan lˆytyykˆ leikkauspiste ja jos lˆytyy,  
			// muutetaan se ensimm‰iseksi kontrollipisteeksi
			if(result.onLine1 && result.onLine2){
				// muutetaan uusi kontrollipiste kehykselt‰ ja lopetetaan looppi
				dx = result.x;
				dy = result.y;
				break;
			};
		};
	};
	// Luodaan uuden kurvin ensimm‰inen kontrollipiste.
	dots[1] = {x:dx, y:dy};
	
	// luodaan uuden kurvin toinen kontrollipiste ja kurvin p‰‰tepiste
	dots[2] = {x:canvas.width * Math.random(), y:canvas.height * Math.random()};
	if(start){dots[3] = {x:canvas.width * 0.5, y:(canvas.height * 0.5 + offY)};}
	else {dots[3] = {x:canvas.width * Math.random(), y:canvas.height * Math.random()};};
		
	// palautetaan valmiin kurvin pisteet
	return dots;
};

function trace(str)
{
	console.log(str);
};