'use strict'

var IS_NODE = false
if(typeof(module) !== 'undefined'){
	IS_NODE = true
}

var PI = Math.PI

var scadStr = "\n"

if(IS_NODE) exports.str = scadStr

function deg2rad(deg){
	return deg / 360 * 2 * PI
}
if(IS_NODE) exports.deg2rad = deg2rad



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


/////////////// exports ////////////////////////////////////
if(IS_NODE){
	module.exports.deg2rad = deg2rad
	module.exports.rad2deg = rad2deg
	module.exports.getPointsOnCircle =getPointsOnCircle
	module.exports.distanceToDegOnCircle = distanceToDegOnCircle
	module.exports.a2v=a2v
	module.exports.polygon=polygon
	module.exports.circle=circle
	module.exports.square=square
	module.exports.rect=square
	module.exports.text=text
	module.exports.cube=cube
	module.exports.sphere=sphere
	module.exports.ball=sphere
	module.exports.cylinder=cylinder
	module.exports.polyhedron=polyhedron
	module.exports.difference=difference
	module.exports.minus=difference
	module.exports.union=union
	module.exports.add=union
	module.exports.intersection=intersection
	module.exports.shared=intersection
	module.exports.rotate=rotate
	module.exports.translate=translate
	module.exports.scale=scale
	module.exports.resize=resize
	module.exports.mirror=mirror
	module.exports.offset=offset
	module.exports.minkowski=minkowski
	module.exports.hull=hull
	module.exports.projection=projection
	module.exports.linear_extrude=linear_extrude
	module.exports.rotate_extrude=rotate_extrude
	module.exports.for=scadfor
	module.exports.color=color
	module.exports.module=scadmodule
	module.exports.children=children
	module.exports.save=save


}