$(document).ready(startApp);

function startApp() {
	// get palette to play with
	var palette = ['#002f81', '#eee001', '#a91900', '#ff4a00', '#006401', '#010101']; //generatecolors();
	var startpal = palette.slice();
	// choose horiz or vert lines 
	// for now: random
	var direction = Math.round(Math.random());
	
	// make some intermediary colors
	
	// generate pattern
	var pattern = generatepattern(palette, direction);
	
	$('#horiz').click(function() {
		// change to horizontal lines
		direction = 0;
		// regenerate
		palette = startpal.slice();
		pattern = generatepattern(palette, direction);
		render(pattern, palette);
	});
	
	$('#vert').click(function() {
		// change to vertical lines
		direction = 1;
		// regenerate
		palette = startpal.slice();
		pattern = generatepattern(palette, direction);
		render(pattern, palette);
	});
	
	$("#generate").click(function() {
		direction = Math.round(Math.random());
		palette = generatecolors();
		startpal = palette.slice();
		pattern = generatepattern(palette, direction);
	 	render(pattern, palette);
	});
	$("#newcolors").click(function() {
		palette = generatecolors();
		startpal = palette.slice();
		render(pattern, palette);
	});
	$("#newpattern").click(function() {
		direction = Math.round(Math.random());
		palette = startpal.slice();
		pattern = generatepattern(palette, direction);
		render(pattern, palette);
	});
	
	render(pattern, palette);
}

function render(pattern, palette)
{
	// given the layout and the palette, render the design
	var canvas = document.getElementById('pattern');
	if (canvas.getContext)
	{
	   	var ctx = canvas.getContext('2d');
	   	ctx.clearRect ( 0 , 0 , canvas.width, canvas.height );
	   	
	   	var bg = pattern.bg;
	   	var mg = pattern.midground;
	   	var fg = pattern.foreground;
	   	
	   	// render background
	   	for (var i=0; i<bg.length; i++)
	   	{
	   		if (bg[i].type == 'rect')
		   		drawRectangle(ctx, bg[i].x, bg[i].y, bg[i].width, bg[i].height, palette[bg[i].colorNum%palette.length]);
		   	else if (bg[i].type == 'circ')
		   		drawCircle(ctx, bg[i].x, bg[i].y, bg[i].width, palette[bg[i].colorNum%palette.length]);
	   	}
	   	
	   	// render midground & foreground, using z-indexing
	   	if (mg != null && fg !=null)
	   	{
	   		var mgElems=0;
	   		var fgElems=0;
	   		var z=0;
	   		while (mgElems<mg.length || fgElems<fg.length)
	   		{
	   			// draw all mg elems at current z-index
	   			for (i=0; i<mg.length; i++)
	   			{
	   				if (mg[i].z === z)
	   				{
	   					if (mg[i].type == 'rect')
	   						drawRectangle(ctx, mg[i].x, mg[i].y, mg[i].width, mg[i].height, palette[mg[i].colorNum%palette.length]);
	   					else if (mg[i].type == 'circ')
	   						drawCircle(ctx, mg[i].x, mg[i].y, mg[i].width, palette[mg[i].colorNum%palette.length]);
	   						
	   					mgElems++;
	   				}
	   			}
	   			// draw all fg elems at current z-index
	   			for (i=0; i<fg.length; i++)
	   			{
	   				if (fg[i].z === z)
	   				{
						if (fg[i].type == 'rect')
							drawRectangle(ctx, fg[i].x, fg[i].y, fg[i].width, fg[i].height, palette[fg[i].colorNum%palette.length]);
						else if (fg[i].type == 'circ')
							drawCircle(ctx, fg[i].x, fg[i].y, fg[i].width, palette[fg[i].colorNum%palette.length]);
	   				
	   					fgElems++;
	   				}
	   			}
	   			z++;
	   		}
	   	}
	 }	
	$('#generate').css("background-color", palette[0]);
	$('#horiz').css("background-color", palette[0]);
	$('#vert').css("background-color", palette[0]);
	$('#newpattern').css("background-color", palette[1]);
	$('#newcolors').css("background-color", palette[2]);

}

function generatecolors()
{
	//var color = rgb2hsv("8d484d");
	var palette = getPalette();
	
	return palette;
}

function generatebackground(pattern, palette, direction)
{
	var background = [];
	var canvas = document.getElementById('pattern');
	var width = canvas.width;
	var height = canvas.height;
	var maxSize = (direction)?width:height;
	
	// generate random stripes with jitter for now
	var numStripes = Math.floor(Math.random()*4+3);
	var sizeLeft = maxSize;
	var oldColor = -1;
	
	for (var i=0; i<numStripes; i++)
	{
		var color = Math.floor(Math.random()*palette.length);
		while (color === oldColor)
			color = Math.floor(Math.random()*palette.length);
			
		oldColor = color;
		var curLocation = maxSize - sizeLeft;

		if (i+1 != numStripes)
		{
			var averageSize = Math.round(maxSize/numStripes);
			var size = averageSize + Math.floor((Math.random()*(2*averageSize)-averageSize)+15);
			// adding the -10 to keep from having tiny slivers at the end of the design
			if (size > (sizeLeft-10))
				size = sizeLeft;
			
			if (direction === 0)
				background[i] = {type:'rect', x:0, y:curLocation, width:width, height:size, colorNum:color};
			else
				background[i] = {type:'rect', x:curLocation, y:0, width:size, height:height, colorNum:color};
			
			sizeLeft = sizeLeft-size;
			if (sizeLeft === 0)
			{
				numStripes = i+1;
				break;
			}
			
		}	
		else {
			if (direction === 0)
				background[i] = {type:'rect', x:0, y:curLocation, width:width, height:sizeLeft, colorNum:color};
			else
				background[i] = {type:'rect', x:curLocation, y:0, width:sizeLeft, height:height, colorNum:color};
		}
	}
	pattern.bg = background;
}

function getMidtone(color1, color2)
{
	var bigint = parseInt(color1.split('#')[1], 16);
   	var r1 = (bigint >> 16) & 255;
   	var g1 = (bigint >> 8) & 255;
   	var b1 = bigint & 255;
   	
   	bigint = parseInt(color2.split('#')[1], 16);
   	var r2 = (bigint >> 16) & 255;
   	var g2 = (bigint >> 8) & 255;
   	var b2 = bigint & 255;

	var r3 = Math.round((r1 + r2)/2);
	var g3 = Math.round((g1 + g2)/2);
	var b3 = Math.round((b1 + b2)/2);
	
	var retstr = "#" + ((1<<24) + (r3 << 16) + (g3 << 8) + b3).toString(16).slice(1);	
	
	return retstr;
}

function generatemidtones(pattern, palette, direction)
{
	var numStripes = pattern.bg.length;
	var bg = pattern.bg;
	// pick 4-8 stripes at random
	var numMid = Math.ceil(Math.random()*4 + 4);
	
	//if (numMid > numStripes)
		//numMid = numStripes;
		
	// add small midtone bars between it and a neighboring stripe
	for (var i=0; i<numMid; i++)
	{
		numStripes = bg.length;
		var stripe1 = Math.floor(Math.random()*numStripes);
		var stripe2 = 0;
		
		if (direction === 0)
		{
			while (bg[stripe1].height < 30)
				stripe1 = Math.floor(Math.random()*numStripes);
		} else {
			while (bg[stripe1].width < 30)
				stripe1 = Math.floor(Math.random()*numStripes);
		}		
		if (stripe1 < (numStripes-1))
			stripe2 = stripe1+1;
		else {
			stripe2 = stripe1;
			stripe1 = stripe1-1;
		}
		
		// find midtone
		var color = getMidtone(palette[bg[stripe1].colorNum], palette[bg[stripe2].colorNum]);
		var colorNum = palette.length;
		palette.push(color);
		
		// make stripe of midtone color 10-30 pixels in size
		var size = Math.round(Math.random()*20+10);
		var stripeChange = stripe1;
		
		// insert into pattern
		if (direction === 0)
		{
			if (bg[stripe2].height > bg[stripe1].height)
				stripeChange = stripe2;
		
			bg[stripeChange].height = bg[stripeChange].height - size;
			var y = bg[stripe1].y + bg[stripe1].height;
			var width = bg[stripe1].width;
			bg[stripe2].y = y + size;
			
			bg.splice(stripe2, 0, {type:'rect', x:0, y:y, width:width, height:size, colorNum:colorNum});			
		}
		else {		
			if (bg[stripe2].width > bg[stripe1].width)
				stripeChange = stripe2;
			
			bg[stripeChange].width = bg[stripeChange].width - size;
			var x = bg[stripe1].x + bg[stripe1].width;
			var height = bg[stripe1].height;
			bg[stripe2].x = x + size;
			
			bg.splice(stripe2, 0, {type:'rect', x:x, y:0, width:size, height:height, colorNum:colorNum});
		} 
		
	} 
	pattern.bg = bg;
}

function generatepattern(palette, direction)
{
	var pattern = {bg:null, midground:null, foreground:null};
	
	// generate background elements
	generatebackground(pattern, palette, direction);

	// add some midtones to background
	generatemidtones(pattern, palette, direction);
	
	// generate midground elements
	generatemidground(pattern, palette, direction);
	
	// generate foreground elements
	generateforeground(pattern, palette);
	//generateForegroundSquares(pattern, palette, direction, numStripes);
		
	/*
	var mainColor=Math.floor(Math.random()*palette.length);
	
	for (var col=-1; col<height; col++)
	{
		for (var row=0; row<width; row++)
		{
			generateuptriangle(pattern, palette, mainColor, col*size, (row+1)*size, size, 0);
			generatedowntriangle(pattern, palette, mainColor, col*size+size/2, row*size, size, 0);
		}
	}
	*/
	
	return pattern;
}

function generatemidground(pattern, palette, direction)
{
	// generate large elements that blend into the striped background
	// pick X & Y along a border boundary
	// get color of stripe behind it
	// save element to pattern
	
	var mg = [];
	
	// when drawing groupings, go left/up or right/down from starting circle (values: 1, -1)
	var drawdir = 1;
		
	// add 10-20
	var numElems = Math.floor(Math.random()*10+10);
	var elemsLeft = numElems;
	var stripesUsed = [];
	// make group of 3-5 elements)
	while (elemsLeft > 0)
	{
		var groupSize = Math.round(Math.random()*2+3);
		if (groupSize > elemsLeft)
			groupSize = elemsLeft;
	
		var size = Math.floor(Math.random()*25 + 15);
		// pick a stripe
		var stripe = Math.floor(Math.random()*pattern.bg.length);
		
		// try not to put everything on the same stripe
		while (stripesUsed.length < pattern.bg.length && stripesUsed.indexOf(stripe) > -1)
		{
			stripe = Math.floor(Math.random()*pattern.bg.length);
		}
		stripesUsed.push(stripe);
		
		var color=pattern.bg[stripe].colorNum;
		var startx=pattern.bg[stripe].x;
		var starty=pattern.bg[stripe].y;
		var side = Math.round(Math.random());
		
		if (direction === 0) // horizontal
		{
			// move along the x, stick to y
			startx += Math.floor(Math.random()*pattern.bg[stripe].width);
			if ((stripe === 0 || side === 0) && stripe !== (pattern.bg.length-1))
				starty += pattern.bg[stripe].height;
				
			if ((pattern.bg[stripe].height+15) < size*2)
				starty = pattern.bg[stripe].y + pattern.bg[stripe].height/2;	
			if (startx > pattern.bg[stripe].width/2)
				drawdir = -1;	
		}
		else {
			// move along the y, stick to x
			if ((stripe === 0 || side === 0) && stripe !== (pattern.bg.length-1))
				startx += pattern.bg[stripe].width;
			
			if ((pattern.bg[stripe].width+15) < size*2)
				startx = pattern.bg[stripe].x + pattern.bg[stripe].width/2;	
				
			starty += Math.floor(Math.random()*pattern.bg[stripe].height);
			if (starty > pattern.bg[stripe].height/2)
				drawdir = -1;
		}
		
		var padding = Math.floor(Math.random()*10);
		
		for (var i=0; i<groupSize; i++)
		{
			var x = startx;
			var y = starty;
			var elem = mg.length;
			if (direction === 0)
				x += size*2*i*drawdir + padding*i*drawdir;
			else 
				y += size*2*i*drawdir + padding*i*drawdir;
				
			mg[elem] = {type:'circ', x:x, y:y, z:stripe, width:size, height:size, colorNum:color};
			
			elemsLeft--;
		}
	}	
	pattern.midground = mg;
}

function generateforeground(pattern, palette)
{
	// generate smaller elements that pop out into the foreground
	// should be over other squares
	// find color that is not in use if possible
	var foreground = [];
	var color = unusedColor(pattern.bg, palette);
	// TODO: if all colors used, get colors of stripes behind it (and don't use that color)
	if (color === -1)
		color = Math.floor(Math.random(palette.length));
	// pick X & Y along border boundary
	var numElems = Math.floor(Math.random()*3 + 5);
	var size = Math.floor(Math.random()*5 + 10);
	
	// draw square
	for (var i=0; i<numElems; i++)
	{
		// pick a midground element
		var nummgElems = pattern.midground.length;
		var elem = Math.floor(Math.random()*(nummgElems));
		
		// center within background square
		var x=pattern.midground[elem].x;// + pattern[square].width/2;// - size/2;
		var y=pattern.midground[elem].y;// + pattern[square].height/2;// - size/2;
		var z=pattern.midground[elem].z;

		foreground[i] = {type:'circ', x:x, y:y, z:z, width:size, height:size, colorNum:color};
		
	}
	pattern.foreground = foreground;
	
}

function unusedColor(pattern, palette)
{
	var colors = [];
	for (var i=0; i<palette.length;i++)
	{
		var found = false;
		for (var j=0; j<pattern.length; j++)
		{
			if (pattern[j].colorNum == i)
			{
				found = true;
				break;
			}
		}
		if (!found)
			colors.push(i);
	}
	if (colors.length > 0)
		return colors[Math.floor(Math.random()*colors.length)];
	else {
		return -1;
	}
}

function generateuptriangle(pattern, palette, mainColor, x, y, size, level)
{
	if ((level < 1) && Math.round(Math.random()) || ((level < 2) && Math.floor(Math.random()*4) < 1))
	{
		generateuptriangle(pattern, palette, mainColor, x+size/4, y-size/2, size/2, level+1);
		generateuptriangle(pattern, palette, mainColor, x, y, size/2, level+1);
		generatedowntriangle(pattern, palette, mainColor, x+size/4, y-size/2, size/2, level+1);
		generateuptriangle(pattern, palette, mainColor, x+size/2, y, size/2, level+1);
	}
	else
	{
		var colorNum;
		if (Math.floor(Math.random()) > 0) {
			colorNum = mainColor;
		} else {
			colorNum = Math.floor(Math.random()*palette.length);
		}
		pattern.push({x: x, y:y, size: size, direction: 0, colorNum: colorNum});
	}
}

function generatedowntriangle(pattern, palette, mainColor, x, y, size, level)
{
	if ((level < 1) && Math.round(Math.random()) || ((level < 2) && Math.floor(Math.random()*4) < 1))
	{
		generatedowntriangle(pattern, palette, mainColor, x, y, size/2, level+1);
		generateuptriangle(pattern, palette, mainColor, x+size/4, y+size/2, size/2, level+1);
		generatedowntriangle(pattern, palette, mainColor, x+size/2, y, size/2, level+1);
		generatedowntriangle(pattern, palette, mainColor, x+size/4, y+size/2, size/2, level+1);
	}
	else
	{
		var colorNum;
		if (Math.floor(Math.random()*2) === 0) {
			colorNum = mainColor;
		} else {
			colorNum = Math.floor(Math.random()*palette.length);
		}
		pattern.push({x: x, y:y, size: size, direction: 1, colorNum: colorNum});		
	}
}
function drawCircle(ctx, x, y, radius, color)
{
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, 2*Math.PI, false);
	ctx.fillStyle = color;
	ctx.fill(); 
}

function drawRectangle(ctx, x, y, width, height, color)
{
	ctx.fillStyle=color;
	ctx.fillRect(x, y, width, height);
}

function drawTriangle(ctx, x, y, size, direction, color)
{
	ctx.beginPath();
	ctx.fillStyle=color;
	ctx.moveTo(x, y);
	if (direction === 0)
		ctx.lineTo(x + size/2, y - size);
	else {
		ctx.lineTo(x + size/2, y + size);
	}
	ctx.lineTo(x + size, y);
	ctx.fill();
}
