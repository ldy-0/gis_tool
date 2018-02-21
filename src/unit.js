/**
 * @module unit
 */

'use strict';


/**
 * 度分秒转度
 * @param {Array|string} point
 * @param {Number} nub
 * @return {Array}
 */
function DMStoD(point, nub = 0){
	if(typeof point === 'string'){
		let [d, ms] = point.split('°');
		return Number(d)+ms.split('\'');
	}

	let [latitude, longitude] = point;

	return [];
}

/**
 * @param {Array} point
 * @param {Number} nub
 * @return {Array}
 */
function MtoD(point, nub = 0){
	let [latitude, longitude] = point;

	latitude /= 111111.1111;
	longitude /= (111111.1111*cos(latitude));

	return [Number(latitude.toFixed(nub)), Number(longitude.toFixed(nub))];
}


/**
 * Coords convert to xx°xx'xx" format
 * 经纬度转度分秒格式
 * @param {Number|Array} degree
 * @return {String|Array}
*/
function DtoDMS(degree){
	if(Array.isArray(degree)){
		isLegal(degree, 0, false);
		return [DtoDMS(degree[0]), DtoDMS(degree[1])];
	}

	let str = degree.toString().split('.')[1];
	let minute = Number(str)/(10**(str.length-1))*6;
	str = minute.toFixed(15).split('.')[1];
	let second = Number(str)/(10**(str.length-1))*6;
	return `${Math.floor(degree)}°${Math.floor(minute)}'${Math.floor(second)}"`;
}


/**
 * Coords convert to KM format
 * 经纬度转千米
 * @param {Array} coords 坐标点
 * @param {Number} [digits=0] 小数点后位数
 * @param {Boolean} [checkout=false] 是否进行检验经纬度位置并转换
 * @return {Array}
 */
function DtoKM(coords, digits = 0, checkout = false){
	let p = DtoM(coords, digits, checkout);
	return [p[0]/1000, p[1]/1000];
}


/**
 * Coords convert to meter format
 * 经纬度转米
 * @param {Array} coords 坐标点
 * @param {Number} [digits=0] 小数点后位数
 * @param {Boolean} [checkout=false] 是否进行检验经纬度位置并转换
 * @return {Array}
 */
function DtoM(coords, digits = 0, checkout = false){
	let last = arguments.length-1;
	if(last === 1 && typeof arguments[last] === 'boolean'){
		[digits, checkout] = [0, arguments[last]];
	}
	isLegal(coords, digits, checkout);

	let [latitude, longitude] = coords;
	//先通过纬度算经度
	longitude *= 111111.1111*cos(latitude);
	latitude *= 111111.1111;

	return [ Number(latitude.toFixed(digits)), Number(longitude.toFixed(digits)) ];
}


/**
 * To determine the legality of the parameter type
 * 判断参数类型是否合法
 * @param {Array} coords coords[0]为纬度，coords[1]为经度
 * @param {Number} digits
 * @param {Boolean} checkout 
 * @inner
 */
function isLegal(coords, digits = 0, checkout){

	if(!Array.isArray(coords) || typeof digits !== 'number'){
		throw new TypeError('argument type is illegal');
	}

	if(checkout && (coords[0]>90 || coords[0]<-90) && (coords[1]<90 || coords[1]>-90)){
		[coords[1], coords[0]] = [coords[0], coords[1]];
	}

	if(coords[0]>90 || coords[0]<-90 || coords[1]>180 || coords[1]<-180){
		throw new RangeError('coordinate values out of bounds');
	}

}

/**
 * Calculate degrees of cos value
 * 计算某度的cos值
 * 修复Math.cos(90*Math.PI/180)=6.123233995736766e-17;
 * @param {Number} degree 度数
 * @param {Number} digits 位数 
 * @return {Number}
 */
function cos(degree, digits = 6){
	if(isNaN(parseFloat(degree))){
		throw new TypeError('argument type must be a Number');
	}
	//16位不精确
	if(digits < 0 || digits > 15 ){
	  digits = 15;
	}

	return degree%90 === 0 ? 0 : Number(Math.cos(degree*Math.PI/180).toFixed(digits)) ;
}




/**
 * export
 */
module.exports = {
	cos,
	DtoM,
	DtoKM,
	DtoDMS,
};

// console.log(DtoM([32.138073545, 114.0362319061], false));
// console.log(DtoDMS([ 32.138073545, 114.0362319061]), '---');
// console.log(MtoD(DtoM([32.136056165, 114.0420735061]), 9));

