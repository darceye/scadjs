/* scad.js
* version: 1.1.0
* date: 2017-3-12
* copyright: Jacques Yang
* License: MIT
*/

(function(){


var IS_NODE = false
if(typeof(module) !== 'undefined'){
	IS_NODE = true
}

var PI = Math.PI

var scadStr = "\n"


function deg2rad(deg){
	return deg / 360 * 2 * PI
}

function rad2deg(rad){
	return rad / 2 / PI * 360
}

function getPointsOnCircle(r, n, startDeg){
	var ret = new Array()
	var startRadius = startDeg/360*2*PI 
	var radPerPoint = 2*PI/n
	for(var i = 0; i < n; i++){
		ret.push([Math.cos(startRadius + radPerPoint * i ) * r, Math.sin(startRadius + radPerPoint * i ) * r ] )
	}	
	return ret
}

function distanceToDegOnCircle(d, r){
	return rad2deg( 2 * Math.asin(d / 2 / r) )
}

//array to vector string
function a2v(a){
	return JSON.stringify(a)
}

///// 2d 
function polygon(aPoints, aPaths){
	var param = ""
	if(typeof(aPaths) != "undefined"){
		param += ", " + a2v(aPaths)
	}

	var s = `polygon(${a2v(aPoints)}${param});\n`
	// scadStr += s
	return s
}

function circle(r, fn){
	var param = ""
	if(typeof(fn) != 'undefined') {
		param = ",$fn="+fn
	}
	return `circle(r=${r}${param});\n`
}

function square(width, height, isCenter){
	var param = ""
	if(typeof(height) == 'undefined'){
		param = width
	}else{
		param = `[${width},${height}]`
	}

	if(typeof(isCenter) !="undefined"){
		isCenter ? isCenter = true : isCenter = false
		param += `,center=${isCenter}`
	}
	return `square(${param});\n`
}

function text(str ,size){
	var param = ""
	if(typeof(size) != "undefined"){
		param = ",size=" + size
	}
	return `text(text=\"${str}\"${param});\n`
}

///// 3d
function cube(x, y, z, isCenter){
	var param = ""
	if(typeof(y) == 'undefined'){
		param = x
	}else{
		param = `[${x},${y},${z}]`
	}

	if(typeof(isCenter) !="undefined"){
		isCenter ? isCenter = true : isCenter = false
		param += `,center=${isCenter}`
	}
	return `cube(${param});\n`
}

function sphere(r, fn){
	var param = ""
	if(typeof(fn) != 'undefined') {
		param = ",$fn="+fn
	}
	return `sphere(r=${r}${param});\n`
}
var ball = sphere

function cylinder(height, r1, r2, isCenter, fn){
	var param = ""
	if(typeof(r2) == 'undefined'){
		var r2 = r1
	}

	if(typeof(isCenter) !="undefined"){
		isCenter ? isCenter = true : isCenter = false
		param += `,center=${isCenter}`
	}	
	if(typeof(fn) != 'undefined') {
		param += ",$fn="+fn
	}
	return `cylinder(h=${height}, r1=${r1}, r2=${r2}${param});\n`
}


function polyhedron(aPoints, aFaces){
	var param = ""
	if(typeof(aFaces) != "undefined"){
		param += ",faces=" + a2v(aFaces)
	}
	return "polyhedron(points=${a2v(aPoints)}${param});\n"
}

///// calc //////////////////////////////////////////
function difference(a,b){
	return  "difference(){\n" + a + b + "}\n"
}

var minus = difference

function union(){
	var ret = "union(){\n"
	for(var i = 0; i < arguments.length; i++){
		ret += arguments[i]
	}
	return ret + "}\n"
}

var add = union

function intersection(){
	var ret = "intersection(){\n"
	for(var i = 0; i < arguments.length; i++){
		ret += arguments[i]
	}
	return ret + "}\n"
}

var shared = intersection

////// reform
function rotate(item, xDeg, yDeg, zDeg){
	return `rotate([${xDeg},${yDeg},${zDeg}]) {\n` + item + "}\n"
}

function translate(item, x, y, z){
	return `translate([${x},${y},${z}]) {\n` + item + "}\n"
}

function scale(item, x, y, z){
	return `scale([${x},${y},${z}]) {\n` + item + "}\n"
}

function resize(item, x, y, z){
	return `resize([${x},${y},${z}]) {\n` + item + "}\n"
}

function mirror(item, x, y, z){
	return `mirror([${x},${y},${z}]) {\n` + item + "}\n"
}

function offset(item, r, delta, isChamfer){
	var param = ""
	if(typeof(r) != "undefined"){
		param += "r=" + r
	}else if(typeof(delta) != undefined){
		param += "delta=" + delta
		if(typeof(isChamfer) != "undefined"){
		isChamfer ? isChamfer = true : isChamfer = false
		param += `,chamfer=${isChamfer}`
		} 
	}
	return `offset(${param}) {\n` + item + "}\n"

}

function minkowski(item){
	return `minkowski() {\n` + item + "}\n"
}

function hull(item){
	return `hull() {\n` + item + "}\n"
}

////// 3d-> 2d
function projection(item, isCut){
	var param = ""
	if(typeof(isCut) != "undefined"){
		if(isCut){
			param += "cut=true"
		}else{
			param += "cut=false"
		}
	}
	return `projection(${param}) {\n` + item + "}\n"
}

////// 2d -> 3d
function linear_extrude(items, height, twistDeg, scale, slices, isCenter, convexity, fn){
	var param = ""
	if(typeof(twistDeg) != "undefined"){
		param += ",twist=" + twistDeg
	}
	if (typeof(scale) != "undefined"){
		if(typeof(scale) == "number"){
			param += ",scale=" + scale
		}else{
			param += ",scale=" + a2v(scale)
		}
	}
	if (typeof(slices) != "undefined"){
		param += ",slices=" + slices
	}
	if(typeof(isCenter) !="undefined"){
		isCenter ? isCenter = true : isCenter = false
		param += `,center=${isCenter}`
	}
	if(typeof(convexity) !="undefined"){
		
		param += `,convexity=${convexity}`
	}else{
		param += `,convexity=10`
	}
	if(typeof(fn) != 'undefined') {
		param += ",$fn="+fn
	}
	
	return `linear_extrude(height=${height}${param}) {` + items + "}\n"

}
function rotate_extrude(items, deg, convexity, fn){
	var param = ""
	if(typeof(convexity) !="undefined"){
		
		param += `,convexity=${convexity}`
	}else{
		param += `,convexity=10`
	}	
	if(typeof(fn) != 'undefined') {
		param += ",$fn="+fn
	}
	
	return `rotate_extrude(angle=${deg}${param}) {` + items + "}\n"

}
/////// logic
function scadfor(str_i, start, end, item){
	return `for(${str_i}=[${start}:${end}]){\n${item}\n}`
}


//////// others
function color(r,g,b,a){
	return `color([${r/255},${g/255},${b/255},${a}) {\n` + item + "}\n"
}

// same name with node module
function scadmodule(name, params){
	//tbd
}

function children(){
	//tbd
}

if(IS_NODE){
	var fs = require('fs')
	var path = require('path')
}
function save(content, fn){
	if(typeof(fn) != 'undefined'){
		var filename = path.basename(fn,'.js') + '.scad'
	}else{
		var filename = "output.scad"
	}
	console.log("save to ",filename)
	fs.writeFileSync(filename, content)

}


function Scad(str){
	if(typeof(str) == 'undefined'){
		this.str = ""
	}else{
		this.str = str.toString()
	}
}

Scad.prototype = {
	toString: function() {return this.str},
	// deg2rad : deg2rad,
	// rad2deg : rad2deg,
	// getPointsOnCircle :getPointsOnCircle,
	// distanceToDegOnCircle : distanceToDegOnCircle,
	// a2v:a2v,
	// polygon:polygon,
	// circle:circle,
	// square:square,
	// rect:square,
	// text:text,
	// cube:cube,
	// sphere:sphere,
	// ball:sphere,
	// cylinder:cylinder,
	// polyhedron:polyhedron,
	difference: function(b){this.str = difference(this, b); return this},
	minus: this.difference,
	union: function(){this.str = union.apply(this,[this.str ,...arguments]); return this}, 
	add: this.union,
	// intersection:intersection,
	// shared:intersection,
	rotate:function(x,y,z) {this.str = rotate(this.str, x,y,z); return this},
	translate:function(x,y,z) {this.str = translate(this.str, x,y,z); return this},
	scale: function(x,y,z) {this.str = scale(this.str, x,y,z); return this},
	resize:function(x,y,z) {this.str = resize(this.str, x,y,z); return this},
	mirror:function(x,y,z) {this.str = mirror(this.str, x,y,z); return this},
	offset:function(r, delta, isChamfer) {this.str = offset(this.str, r, delta, isChamfer); return this},
	minkowski: function(){ this.str = minkowski(this.str); return this },
	hull: function(){this.str = hull(this.str); return this } ,
	projection: function(isCut){this.str = projection(this.str, isCut); return this},
	linear_extrude: function(height, twistDeg, scale, slices, isCenter, convexity, fn){ this.str = linear_extrude(this.str, height, twistDeg, scale, slices, isCenter, convexity, fn);return this },
	rotate_extrude: function(deg, convexity, fn){ this.str =  rotate_extrude(this.str, deg, convexity, fn); return this},
	for: function(str_i, start, end){ this.str = scadfor(str_i, start, end, this.str); return this},
	// color:color,
	// module:scadmodule,
	// children:children,
	// save:save,
	tranparent: function(){this.str = "#"+this.str; return this},
	_: function(){this.str = "#"+this.str; return this},
}
Scad.deg2rad = deg2rad
Scad.rad2deg = rad2deg
Scad.getPointsOnCircle =getPointsOnCircle
Scad.distanceToDegOnCircle = distanceToDegOnCircle
Scad.a2v=a2v
Scad.polygon=polygon
Scad.circle=circle
Scad.square=square
Scad.rect=square
Scad.text=text
Scad.cube=cube
Scad.sphere=sphere
Scad.ball=sphere
Scad.cylinder=cylinder
Scad.polyhedron=polyhedron
Scad.difference=difference
Scad.minus=difference
Scad.union=union
Scad.add=union
Scad.intersection=intersection
Scad.shared=intersection
Scad.rotate=rotate
Scad.translate=translate
Scad.scale=scale
Scad.resize=resize
Scad.mirror=mirror
Scad.offset=offset
Scad.minkowski=minkowski
Scad.hull=hull
Scad.projection=projection
Scad.linear_extrude=linear_extrude
Scad.rotate_extrude=rotate_extrude
Scad.for=scadfor
Scad.color=color
Scad.module=scadmodule
Scad.children=children
Scad.save=save
/////////////// exports ////////////////////////////////////
if(IS_NODE){
	module.exports = Scad
}


})()