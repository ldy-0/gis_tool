const unit = require('../src/unit');
const assert = require('assert');

// API
const cos = unit.cos;
const DtoM = unit.DtoM;
const DtoKM = unit.DtoKM;

describe('#cos', ()=>{
  it('should return 0 when value is 90', ()=>assert.equal(cos(-90), 0) );
  it('should return 0.5 when value is 60,16', ()=>assert.equal(cos(60, 16), 1/2) );
  it('should return 0.5 when value is 60,-1', ()=>assert.equal(cos(60, -1), 0.5) );
});

describe('#DtoM', ()=>{
	it('should return [0, 0] when value is [0, 0]', ()=>assert.deepEqual(DtoM([0, 0]), [0, 0]) );
	it('should return [3566666.67, 10457250.47] when value is [32.1, 111.1]', ()=>assert.deepEqual(DtoM([32.1, 111.1], 2), [3566666.67, 10457250.47]) );
	it('should return when [3566667, 10457250] value is [32.1, 111.1]', ()=>assert.deepEqual(DtoM([111.1, 32.1], true), [3566667, 10457250]) );
});

describe('#DtoKM', ()=>{
	it('should return [0, 0] when value is [0, 0]', ()=>assert.deepEqual(DtoKM([0, 0]), [0, 0]) );
});

