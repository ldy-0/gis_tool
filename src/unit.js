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
 * 经纬度转度分秒格式
 * Convert to degrees minutes seconds format
 * @param {Number|Array} degree
 * @return {String|Array}
*/
function DtoDMS(degree){
	if(Array.isArray(degree)){
		isLegal(degree, 0, false);
		return [DtoDMS(degree[0]), DtoDMS(degree[1])];
	}

	let minute = degree%1*60;
	return `${degree.toFixed(0)}°${Math.floor(minute)}'${minute%1*60}''`;
}


/**
 * 经纬度转千米
 * Convert to KM format
 * @param {Array} point 坐标点
 * @param {Number} [nub=0] 小数点后位数
 * @param {Boolean} [checkout=false] 是否进行检验经纬度位置并转换
 * @return {Array}
 */
function DtoKM(point, nub = 0, checkout = false){
	let p = DtoM(point, nub, checkout);
	return [p[0]/1000, p[1]/1000];
}


/**
 * 经纬度转米
 * Convert to meter format
 * @param {Array} point 坐标点
 * @param {Number} [nub=0] 小数点后位数
 * @param {Boolean} [checkout=false] 是否进行检验经纬度位置并转换
 * @return {Array}
 */
function DtoM(point, nub = 0, checkout = false){
	let last = arguments.length-1;
	if(last === 1 && typeof arguments[last] === 'boolean'){
		[nub, checkout] = [0, arguments[last]];
	}
	isLegal(point, nub, checkout);

	let [latitude, longitude] = point;
	//先通过纬度算经度
	longitude *= 111111.1111*cos(latitude);
	latitude *= 111111.1111;

	return [ Number(latitude.toFixed(nub)), Number(longitude.toFixed(nub)) ];
}


/**
 * 判断参数类型是否合法
 * @param {Array} point point[0]为纬度，point[1]为经度
 * @param {Number} digits
 * @param {Boolean} checkout 
 */
function isLegal(point, digits = 0, checkout){

	if(!Array.isArray(point) || typeof digits !== 'number'){
		throw new TypeError('argument type is not legal');
	}

	if(checkout && (point[0]>90 || point[0]<-90) && (point[1]<90 || point[1]>-90)){
		[point[1], point[0]] = [point[0], point[1]];
	}

	if(point[0]>90 || point[0]<-90 || point[1]>180 || point[1]<-180){
		throw new RangeError('点坐标值不合法');
	}

}

/**
 * 计算某度的cos值
 * 修复Math.cos(90*Math.PI/180)=6.123233995736766e-17;
 * Calculate degrees of cos value
 * @param {Number} degree 度数
 * @param {Number} digits 位数 
 * @return {Number}
 */
function cos(degree, digits = 6){
	if(isNaN(parseFloat(degree))){
		throw new TypeError('cos argument type must be Number');
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

