/**
 * @author Yuan
 * @module unit
 */

'use strict';
//TODO:乘数为3、6、7会出现双精度问题

//FIXME: 坐标系转换标识
const CONVERT = {
	WGS84_TO_CGCS2000: 1,
}
if(Object.freeze)
	Object.freeze(CONVERT);

/**
 * 
 * @constructor GCS
 */
 function GCS({ name, origin, a, b, f}){
	 this.name = name;
	 this.origin = origin;
	 this.a = a;
	 this.b = b;
	 this.f = f;
 }
 const CGCS_2000 = new GCS({name: 'CGCS_2000', origin: '地球质点'});

/**
 * 创建坐标点
 * @constructor Coords
 * @param {Array} value
 * @param {String} [coordinateSystem='wgs84']
 */
 /* function CoordinatePoint(value, coordinateSystem = 'wgs84'){
	 [ this[0], this[1] ] = value;
	 this.coordinateSystem = coordinateSystem;
 }
 let point = new CoordinatePoint([32.1, 111.111], 'wgs84');
 console.log(point[0], point[1], point.coordinateSystem); */

/**
 * xx°xx'xx" convert to meter format
 * 度分秒转米
 * @param {Array} coords
 * @param {Number} digits
 * @return {Array}
 */
 function DMStoM(coords, digits = 0){
	 if(!Array.isArray(coords) && typeof digits !== 'number'){
		 throw new TypeError('argument value is illegal');
	 }
	 
	 return DtoM(DMStoD(coords), digits);
 }


/**
 * xx°xx'xx" convert to longitude and latitude format
 * 度分秒转度
 * @param {Array|string} coords
 * @return {Array}
 */
function DMStoD(coords){
	if(typeof coords === 'string'){
		let [degree, ms] = coords.split('°'),
			[minute, second] = ms.split('\'');
		return Number(degree)+(Number(minute)+parseInt(second)/60)/60;
	}

	return [DMStoD(coords[0]), DMStoD(coords[1])];
}

/**
 * Meter to longitude and latitude format
 * 米转经纬度
 * @param {Array} coords
 * @param {Number} digits
 * @return {Array}
 */
function MtoD(coords, digits = 0){
	let [latitude, longitude] = coords;

	latitude /= 111111.1111;
	longitude /= (111111.1111*cos(latitude));

	return [Number(latitude.toFixed(digits)), Number(longitude.toFixed(digits))];
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
	return `${Math.floor(degree)}°${Math.floor(minute)}'${Math.round(second)}"`;
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

	if(!Array.isArray(coords) || typeof digits !== 'number' || typeof coords[0] !== 'number' || typeof coords[1] !== 'nubmer'){
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
	MtoD,
	DMStoD,
};



