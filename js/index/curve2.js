function Curve(){
	this.dots;
	this.line = [];
	this.lineLength = 0;
	this.step = 0.1;
	this.currentStep = 0;
	this.name;
	this.lineWidth = 1;
	this.color;
	this.linesCount = 0;
	this.linesCountTotal = 0;
	this.piilossa = false;
	this.linesCountSpace = 0;
	this.offsetX = 0;
	this.offsetY = 0;
};
Curve.prototype.reset = function(){
	var start = false;
	if(this.dots && this.dots.length >= 4){
		if(this.linesCount >= this.linesCountSpace){
			start = true;
			this.linesCount = 0;
			this.linesCountSpace = Math.round(this.linesCountTotal - 1 * Math.random() + 1);
			this.step = Math.round(100*((Math.random() * 3 + 3)/300)) / 100;
		}
		this.dots = utils.getDots([{x:this.dots[2].x, y:this.dots[2].y},
								   {x:this.dots[3].x, y:this.dots[3].y}], start);
	} else {
		if(this.linesCount >= this.linesCountSpace){
			start = true;
			this.linesCount = 0;
			this.linesCountSpace = Math.round(this.linesCountTotal - 1 * Math.random() + 1);
			this.step = Math.round(100*((Math.random() * 3 + 3)/300)) / 100;
		}
		this.dots = utils.getDots(null, start);
	};
	this.linesCount++;
};

Curve.prototype.draw = function(context){
	var red;
	var green;
	var blue;
	var length = this.line.length;
	var multipler;
	var rgb = utils.hexToRgb(this.color);
	for(var i=1; i < length; i++){
		context.beginPath();
		context.moveTo(this.line[i-1].x + this.offsetX, this.line[i-1].y + this.offsetY);
		context.lineTo(this.line[i].x + this.offsetX, this.line[i].y + this.offsetY);
		multipler = i / length;
		context.strokeStyle = "rgba("+rgb.r+", "+rgb.g+", "+rgb.b+", "+multipler+")";
		context.lineWidth = multipler * this.lineWidth;
		if(i==length-1) {context.lineCap = "round"; } else {context.lineCap = "butt";};
		context.stroke();
	};
};