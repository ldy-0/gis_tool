/**
 * @author Yuan
 * @module spacial analysis
 */
 
 'use strict'

/**
 *
 * 
 *
 * @param{String} input
 */
function w2(input){
	let sum = 0,
		weight_arr = [];
    
	readRow(input, row=>{
    
		weight_arr.push(row.split(','));
    
	}, ()=>{
		weight_arr.forEach((val, index, arr)=>{
			let row_sum = main.cumulate(val).sum;

			sum = val.reduce((p, v, i, a)=>{
				let column_sum = weight_arr.reduce((pre, va, ind, ar)=>{
					return pre+Number(va[i]);
				}, 0);
				return p+(row_sum+column_sum)**2;
			}, sum);

		});
		console.log(sum);
	});
}
 
/**
 *
 * 1/2∑i = 1n∑j = 1n(wij+ wji)2
 *
 * @param {String} input file path
 */
function w1(input){
	let sum = 0;
  
	readRow(input, row=>{
    
		sum = row.split(',').reduce((pre, val, index, arr)=>{
			return pre+Math.pow(Number(val)*2, 2);
		}, sum);
    
	}, ()=>{
		console.log(sum/2);
	});
  
}

/**
 *
 * Normalization matrix / 归一化矩阵（总和归一化）
 *
 * @param {String} input
 * @param {String} output
 */
function normalization(input, output){
	let arr = [],
      sum = 0,
      guiyi_arr = [],
      ws = fs.createWriteStream(output);
    
	readRow(input, row=>{
		arr.push(row.split(','));
	}, ()=>{
    
		arr.forEach((val, index, a)=>{
			sum = val.reduce((p, v, i, a)=>{
				return p+Number(v);
			}, sum);
		});
    
		guiyi_arr = arr.map((val, index, a)=>{
			let g_arr = val.map((v, i, a)=>{
				return (Number(v)/sum).toFixed(7);
			});
			ws.write(g_arr+os.EOL);
		});
    
	});
  
}

/**
 *
 * Create spacial weight matrix / 创建空间权重矩阵
 *
 * @param {String} input  file path
 * @param {String} output file path
 */
function SWM(input, output){
	let arr = [],
      weight_arr,
      ws = fs.createWriteStream(output);
    
	readRow(input, row => {
    
		if(row.match(/lon/)){
			return ;
		}
    
		arr.push(row.split(',').slice(0,3));
    
	}, ()=>{
    
		weight_arr = arr.map((val, index, a)=>{
			let p1 = unit.DtoM([Number(val[1]), Number(val[0])]);
      
			let w_arr = arr.map(function(v){
				let p2 = unit.DtoM([Number(v[1]), Number(v[0])]);
        
				return Number(Math.sqrt((p2[0]-p1[0])**2+(p2[1]-p1[1])**2).toFixed(0)) < 200000 ? 1 : 0 ;
			});
      
			ws.write(w_arr+os.EOL);
		});

	});
}
 
 /**
  *
  * Compute global Moran's I / 全局莫兰指数
  *
  * @param {Array} data_arr 样本数组
  * @param {Array} weight_matrix 权重矩阵
  * @return {Number}
  */
  function I_G(data_arr, weight_matrix){
	  if(data_arr.length !== weight_matrix.length || weight_matrix[0].length){
		 throw new Error('参数值不一致');
	  }
	 //TODO: average value
	 let average,
		//TODO: 离差
		deviation_arr,
		//TODO: 构建离差二维矩阵
		matrix,
		//TODO: 离差平方和
		deviation_square_sum,
		//TODO: 带权离差矩阵求和
		matrix_sum,
		//TODO: 权重矩阵求和
		weight_matrix_sum;
		
	 return data_arr.length*matrix_sum/(weight_matrix_sum*deviation_square_sum);
  }
  
  
/**
 * computer local Moran's
 * 局部莫兰指数
 * @param {Array} data_arr
 * @param {Array} weight_matrix
 * @return {Array}
 */
 function I_L(data_arr, weight_matrix){
	 return data_arr.map((val, index, arr)=>{
		let aver,//TODO: averageS
			deviation = val-aver,
			deviation_arr = data_arr.slice(0, index+1).map((v, i, a)=>v-aver),
			//TODO: 构建离差二维矩阵
			deviation_matrix ,
			//TODO: 带权离差矩阵求和
			matrix_sum,
			//TODO: 离差平方和
			deviation_square_sum = data_arr.slice(0, index+1)
											.map((v, i, a)=>(v-aver)**2);
			
		 return data_arr.length*deviation*matrix_sum/deviation_square_sum;
	 });
 }
 
 /**
  * export
  */
  module.exports = {
	 I_G,
  }