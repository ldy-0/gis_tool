const unit = require('../src/unit');
const assert = require('assert');

// API
const cos = unit.cos;

describe('#cos', ()=>{
  it('should return 1/2 when value is 60', ()=>assert.equal(cos(60), 1/2) );
  it('should return 0 when value is 90', ()=>assert.equal(cos(-90), 0) );
});
