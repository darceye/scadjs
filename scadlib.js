var IS_NODE = false
if(typeof(module) !== 'undefined'){
	IS_NODE = true
}

var S = require('./scad.js')

function ring(r1, r2) {
	var c1 = S.circle(r1)
	var c2 = S.circle(r2)
	return r1>r2?S.minus(c1, c2):S.minus(c2,c1)
}


// old star
function star(r_in, r_out, distance, p_num){
	var v_in = S.getPointsOnCircle(r_in, p_num, 0)
	var vr_in_deg = S.distanceToDegOnCircle(distance, r_in)
	var vr_in = S.getPointsOnCircle(r_in, p_num, vr_in_deg/2)
	var vrr_in = S.getPointsOnCircle(r_in, p_num, -vr_in_deg/2)

	var v_out = S.getPointsOnCircle(r_out, p_num, 0)
	var vr_out_deg = S.distanceToDegOnCircle(distance, r_out)
	var vr_out = S.getPointsOnCircle(r_out, p_num, vr_out_deg/2)
	var vrr_out = S.getPointsOnCircle(r_out, p_num, -vr_out_deg/2)

	var pathA = []

	var points = vrr_in.concat(vrr_out).concat(vr_out).concat(vr_in)

	for(var i = 0; i < p_num; i++){
		pathA.push(i)
		pathA.push(i+p_num)
		pathA.push(i+p_num*2)
		pathA.push(i+p_num*3)
	}

	var paths = []

	paths.push(pathA)

	return S.polygon(points,paths)

}




if(IS_NODE){
	module.exports.ring=ring
	module.exports.star=star
}