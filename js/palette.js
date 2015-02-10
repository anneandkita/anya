function getPalette(color)
{
	var numColors = Math.ceil(Math.random()*5)+2;
	var baseColor;
	if (typeof color === "undefined")
		baseColor = pickColor();
	else {
		baseColor = color;
	}
	var schemes = ["mono", "an", "comp", "splitcomp"];
	var curScheme = schemes[Math.floor(Math.random()*4)];	
	var palette;
	
	switch (curScheme) {
		case "mono":
			palette = monochromatic(numColors, baseColor);
			break;
		case "an":
			palette = analogous(numColors, baseColor);
			break;
		case "comp":
			palette = complementary(numColors, baseColor);
			break;
		case "splitcomp":
			palette = splitcomplement(numColors, baseColor);
			break;
		default:
			palette = analogous(numColors, baseColor);
			break;
	}
	
	for (var i=0; i<numColors; i++)
	{
		palette[i] = hsv2rgb(palette[i]);
	}
	
	return palette;
}

function reset(query)
{
	// create number of divs for colors
	var numColors;
	if (query.numcolors === undefined)
		numColors = Math.ceil(Math.random()*4)+3;
	else 
		numColors = query.numcolors;
	
	makeDivs(numColors);
	// pick a random color
	
	var baseColor;
	if (query.base === undefined)
		baseColor = pickColor();
	else {
		baseColor = rgb2hsv(query.base);
	}
	
	$('.button').css("background-color", hsv2rgb(baseColor));
	
	var schemes = ["mono", "an", "comp", "splitcomp"];
	var curScheme;
	
	if (query.scheme === undefined)
	{
		curScheme = schemes[Math.floor(Math.random()*4)];	
	}
	else if (typeof query.scheme == "number")
	{
		curScheme = schemes[query.scheme];
	}
	else {
		curScheme = query.scheme;
	}
	
	var palette;
	
	switch (curScheme) {
		case "mono":
			palette = monochromatic(numColors, baseColor);
			break;
		case "an":
			palette = analogous(numColors, baseColor);
			break;
		case "comp":
			palette = complementary(numColors, baseColor);
			break;
		case "splitcomp":
			palette = splitcomplement(numColors, baseColor);
			break;
		default:
			palette = analogous(numColors, baseColor);
			break;
	}
	
	// color divs
	colorDivs(numColors, palette);	
}

function getQueryParams(qs) {
    qs = qs.split("+").join(" ");

    var params = {}, tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])]
            = decodeURIComponent(tokens[2]);
    }

    return params;
}

//var query = getQueryParams(document.location.search);
//alert(query.foo);

function makeDivs(numColors)
{
	$("#colors").html("");
	for (var i=0;i<numColors; i++)
	{
		//var randomColor = '#'+Math.random().toString(16).substr(-6);
		$("#colors").append('<div class="palette" id="pal'+ i +'">&nbsp;</div>');
		var width = document.documentElement.clientWidth;
		var percentage = ((width - (4*numColors))/width)*95;
		$('#pal'+i).css('width', percentage/numColors + "vw");
	}
}

function colorDivs(numColors, palette)
{
	for (var i=0; i<numColors; i++)
	{
		var rgb = hsv2rgb(palette[i]);
		$('#pal'+i).css('background-color', rgb);
	}
}

function pickColor()
{
	var color = {hue:0, sat:0, val:0};
	color.hue = Math.random();
	color.sat = Math.random()*.75+.25;
//	if (color.sat < .75)
		color.val = Math.random()*.1 + .9;
//	else 
//		color.val = Math.random()*.25+.75;
	return color;
}

function analogous(numColors, baseColor)
{
	var palette = [];
	palette.push(baseColor);
	var direction;
	
	if (Math.random()<.5)
		direction = 0;
	else {
		direction = 1;
	}
		
	for (var i=1; i<(numColors); i++)
	{
		var newColor = {hue:0, sat:0, val:0};
		var randAmount = (60/numColors)*i;
		var constAmount = (30/numColors)*i;
		
		if (direction)
		{
			newColor.hue = ((Math.random()*randAmount) + constAmount + baseColor.hue*360)/360;
			newColor.hue = newColor.hue - Math.floor(newColor.hue); // want a number between 1 & 0, get rid of anything in front of the decimal
		}
		else {
			newColor.hue = (baseColor.hue*360 - (Math.random()*randAmount + constAmount))/360;
			if (newColor.hue < 0)
				newColor.hue = 1 - Math.abs(newColor.hue);
		}
		//newColor.sat = Math.random()*.75 + .25;
		//newColor.val = Math.random()*.3 + .7;
		newColor.sat = Math.random();
		newColor.val = Math.random();
		palette.push(newColor);
	}
	return palette;
}

function monochromatic(numColors, baseColor)
{
	var palette = [];
	
	palette.push(baseColor);
	
	var direction;
	
	if (Math.random()<.5)
		direction = 0;
	else {
		direction = 1;
	}
	
	for (var i=1; i<(numColors); i++)
	{
		var newColor = {hue:0, sat:0, val:0};
		
		if (direction)
		{
			newColor.hue = (Math.random()*15 + baseColor.hue*360)/360;
			newColor.hue = newColor.hue - Math.floor(newColor.hue);
		}
		else {
			newColor.hue = (baseColor.hue*360 - Math.random()*15)/360;
			if (newColor.hue < 0)
				newColor.hue = 1 - Math.abs(newColor.hue);
		}
		newColor.sat = Math.random();
		newColor.val = Math.random();
		palette.push(newColor);
	}
	
	return palette;
}

function complementary(numColors, baseColor)
{
	var palette = [];
	
	palette.push(baseColor);
	
	var direction;
	
	if (Math.random()<.5)
		direction = 0;
	else {
		direction = 1;
	}
	
	for (var i=1; i<Math.floor(numColors/2); i++)
	{
		// pick colors near the original color
		var newColor = {hue:0, sat:0, val:0};
		var randAmount = 15/numColors/2 * i;
		var constAmount = 15/numColors/2 * i;

		if (direction)
		{
			newColor.hue = (Math.random()*randAmount + constAmount + baseColor.hue*360)/360;
			newColor.hue = newColor.hue - Math.floor(newColor.hue);
		}
		else {
			newColor.hue = (baseColor.hue*360 - (Math.random()*randAmount + constAmount))/360;
			if (newColor.hue < 0)
				newColor.hue = 1 - Math.abs(newColor.hue);
		}
		//newColor.sat = Math.random()*.75 + .25;
		//newColor.val = Math.random()*.2 + .8;
		newColor.sat = Math.random();
		newColor.val = Math.random();
		palette.push(newColor);
	}

	if (Math.random()<.5)
		direction = 0;
	else {
		direction = 1;
	}

	// get complementary color	
	var newBase = {hue:((baseColor.hue*360)+170)/360, sat:baseColor.sat, val:baseColor.val};
	newBase.hue = newBase.hue - Math.floor(newBase.hue);
	
	for (var i=Math.floor(numColors/2); i<numColors; i++)
	{
		// pick complementary colors near each other
		var newColor = {hue:0, sat:0, val:0};
		var randAmount = 15/numColors/2 * i;
		var constAmount = 15/numColors/2 * i;
		
		if (direction)
		{
			newColor.hue = (Math.random()*randAmount + constAmount + newBase.hue*360)/360;
			newColor.hue = newColor.hue - Math.floor(newColor.hue);
		}
		else {
			newColor.hue = (newBase.hue*360 - (Math.random()*randAmount + constAmount))/360;
			if (newColor.hue < 0)
				newColor.hue = 1 - Math.abs(newColor.hue);
		}
		//newColor.sat = Math.random()*.75 + .25;
		//newColor.val = Math.random()*.2 + .8;
		newColor.sat = Math.random();
		newColor.val = Math.random();
		palette.push(newColor);
	}
	
	return palette;
}

function splitcomplement(numColors, baseColor)
{
	var palette = [];
	var direction = 0;
	
	palette.push(baseColor);
	
	if (Math.random()<.5)
		direction = 0;
	else {
		direction = 1;
	}
	
	for (var i=1; i<Math.floor(numColors/3); i++)
	{
		// pick colors near the original color
		var newColor = {hue:0, sat:0, val:0};
		var randAmount = 15/numColors/3 * i;
		var constAmount = 15/numColors/3 * i;
		
		if (direction)
		{
			newColor.hue = (Math.random()*randAmount + constAmount + baseColor.hue*360)/360;
			newColor.hue = newColor.hue - Math.floor(newColor.hue);
		}
		else {
			newColor.hue = (baseColor.hue*360 - (Math.random()*randAmount + constAmount))/360;
			if (newColor.hue < 0)
				newColor.hue = 1 - Math.abs(newColor.hue);
		}
		//newColor.sat = Math.random()*.75 + .25;
		//newColor.val = Math.random()*.1 + .9;
		newColor.sat = Math.random();
		newColor.val = Math.random();
		palette.push(newColor);
	}

	// get complementary color	
	var newBase = {hue:((baseColor.hue*360)+140)/360, sat:baseColor.sat, val:baseColor.val};
	newBase.hue = newBase.hue - Math.floor(newBase.hue);
	
	if (Math.random()<.5)
		direction = 0;
	else {
		direction = 1;
	}
	
	for (var i=Math.floor(numColors/3); i<Math.floor(2*numColors/3); i++)
	{
		// pick complementary colors near each other
		var newColor = {hue:0, sat:0, val:0};
		var randAmount = 15/numColors/3 * i;
		var constAmount = 15/numColors/3 * i;
		
		if (direction)
		{
			newColor.hue = (Math.random()*randAmount + constAmount + newBase.hue*360)/360;
			newColor.hue = newColor.hue - Math.floor(newColor.hue);
		}
		else {
			newColor.hue = (newBase.hue*360 - (Math.random()*randAmount + constAmount))/360;
			if (newColor.hue < 0)
				newColor.hue = 1 - Math.abs(newColor.hue);
		}
		//newColor.sat = Math.random()*.75 + .25;
		//newColor.val = Math.random()*.1 + .9;
		newColor.sat = Math.random();
		newColor.val = Math.random();
		palette.push(newColor);
	}

	newBase = {hue:((baseColor.hue*360)+200)/360, sat:baseColor.sat, val:baseColor.val};
	newBase.hue = newBase.hue - Math.floor(newBase.hue);
	
	if (Math.random()<.5)
		direction = 0;
	else {
		direction = 1;
	}
	
	for (var i=Math.floor(2*numColors/3); i<numColors; i++)
	{
		// pick complementary colors near each other
		var newColor = {hue:0, sat:0, val:0};
		var randAmount = 15/numColors/3 * i;
		var constAmount = 15/numColors/3 * i;
		
		if (direction)
		{
			newColor.hue = (Math.random()*randAmount + constAmount + newBase.hue*360)/360;
			newColor.hue = newColor.hue - Math.floor(newColor.hue);
		}
		else {
			newColor.hue = (newBase.hue*360 - (Math.random()*randAmount + constAmount))/360;
			if (newColor.hue < 0)
				newColor.hue = 1 - Math.abs(newColor.hue);
		}
//		newColor.sat = Math.random()*.75 + .25;
//		newColor.val = Math.random()*.1 + .9;
		newColor.sat = Math.random();
		newColor.val = Math.random();
		palette.push(newColor);
	}
	
	return palette;
}

function rgb2hsv(color)
{
	var bigint = parseInt(color, 16);
	var red = ((bigint >> 16) & 255) / 255;
	var grn = ((bigint >> 8) & 255) / 255;
	var blue = (bigint & 255) / 255;
	var rr, gg, bb;	
	var hsv = {hue:0, sat:0, val:0};
	hsv.val = Math.max(red, grn, blue);
	var diff = hsv.val - Math.min(red, grn, blue);
	var diffc = function(c){
		return (hsv.val-c) / 6 / diff + 1 / 2;
		};
	
	if (diff == 0) {
	   hsv.hue = hsv.sat = 0;
	} else {
	   hsv.sat = diff / hsv.val;
	   rr = diffc(red);
	   gg = diffc(grn);
	   bb = diffc(blue);
	
	   if (red === hsv.val) {
	      hsv.hue = bb - gg;
	   }else if (grn === hsv.val) {
	      hsv.hue = (1 / 3) + rr - bb;
	   }else if (blue === hsv.val) {
	      hsv.hue = (2 / 3) + gg - rr;
	   }
	   if (hsv.hue < 0) {
	      hsv.hue += 1;
	   }else if (hsv.hue > 1) {
	      hsv.hue -= 1;
	   }
	}
	return hsv; 
}

function hsv2rgb(color)
{
	var red, grn, blue, i, f, p, q, t;
	
	i = Math.floor(color.hue * 6);
	f = color.hue * 6 - i;
	p = color.val * (1 - color.sat);
	q = color.val * (1 - f * color.sat);
	t = color.val * (1 - (1 - f) * color.sat);
	switch (i % 6) {
	    case 0: red = color.val, grn = t, blue = p; break;
	    case 1: red = q, grn = color.val, blue = p; break;
	    case 2: red = p, grn = color.val, blue = t; break;
	    case 3: red = p, grn = q, blue = color.val; break;
	    case 4: red = t, grn = p, blue = color.val; break;
	    case 5: red = color.val, grn = p, blue = q; break;
	}
	red = Math.floor(red*255);
	grn = Math.floor(grn*255);
	blue = Math.floor(blue*255);
	
	return "#" + ((1 << 24) + (red << 16) + (grn << 8) + blue).toString(16).slice(1);	
}