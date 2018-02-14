const unit = require('../src/unit');
const assert = require('assert');

// API
const cos = unit.cos;

describe('#cos', ()=>{
  it('should return 0 when value is 90', ()=>assert.equal(cos(-90), 0) );
  it('should return 0.5 when value is 60,16', ()=>assert.equal(cos(60, 16), 1/2) );
  it('should return 0.5 when value is 60,-1', ()=>assert.equal(cos(60, -1), 0.5) );
});
