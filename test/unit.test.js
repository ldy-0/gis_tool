const unit = require('../src/unit');
const assert = require('assert');

// API
const cos = unit.cos;
const DtoM = unit.DtoM;
const DtoKM = unit.DtoKM;
const DtoDMS = unit.DtoDMS;
const MtoD = unit.MtoD;
const DMStoD = unit.DMStoD;

describe('unit', ()=>{
	describe('#cos', ()=>{
	  it('should return 0 when value is 90', ()=>assert.equal(cos(-90), 0) );
	  it('should return 0.5 when value is 60,16', ()=>assert.equal(cos(60, 16), 1/2) );
	  it('should return 0.5 when value is 60,-1', ()=>assert.equal(cos(60, -1), 0.5) );
	});

	describe('#DtoM', ()=>{
		it('should return [0, 0] when value is [0, 0]', ()=>assert.deepEqual(DtoM([0, 0]), [0, 0]) );
		it('should return [3566666.67, 10457250.47] when value is [32.1, 111.1],2', ()=>assert.deepEqual(DtoM([32.1, 111.1], 2), [3566666.67, 10457250.47]) );
		it('should return when [3566667, 10457250] value is [32.1, 111.1]', ()=>assert.deepEqual(DtoM([111.1, 32.1], true), [3566667, 10457250]) );
	});

	describe('#DtoKM', ()=>{
		it('should return [0, 0] when value is [0, 0]', ()=>assert.deepEqual(DtoKM([0, 0]), [0, 0]) );
	});

	describe('#DtoDMS', ()=>{
		it('should return 32°6\'" when value is 32.1', ()=>assert.equal(DtoDMS(32.1), "32°6'0\"") );
		it('should return 32°16\'48" when value is 32.28', ()=>assert.equal(DtoDMS(32.28), "32°16'48\"") );
		it('should return [32°6\'36", 111°6\'36"] when value is [32.11, 111.11]', ()=>assert.deepEqual(DtoDMS([32.11, 111.11]), ['32°6\'36"', '111°6\'36"']) );
	});
	
	describe('#MtoD', ()=>{
		it('should return [32.1, 111.1] when value is [3566666.67, 10457250.47]', ()=>assert.deepEqual(MtoD([3566666.67, 10457250.47], 1), [32.1, 111.1]) );
	});
	
	describe('#DMStoD', ()=>{
		it('should return 32.1 when value is 32°6\'0" ', ()=>assert.equal(DMStoD("32°6'0\""), 32.1) );
		it('should return 32.28 when value is 32°16\'48" ', ()=>assert.equal(DMStoD('32°16\'48"'), 32.28) );
		it('should return [32.11, 111.11] when value is [32°6\'36", 111°6\'36"]', ()=>assert.deepEqual(DMStoD(['32°6\'36"', '111°6\'36"']), [32.11, 111.11]) );
	});
});


