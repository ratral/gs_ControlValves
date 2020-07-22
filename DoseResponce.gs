/**
 * Dose-Response Models.
 *
 * @param {number} x valve position
 * @param {number} b steepness
 * @param {number} d upper value
 * @param {number} e the effective dose
 * @return {number} LL3.
 * @customfunction
 */
function Drm(x, b, d, e){
  var result = d / (1 + Math.exp(b * (Math.log(x) - Math.log(e))));
  return(result);
}

/**
 * Inverse Dose-Response Models with the Bisection method.
 * https://en.wikipedia.org/wiki/Bisection_method
 * @param {number} Kv_Kvs relativ Kv
 * @param {number} b steepness
 * @param {number} d upper value
 * @param {number} e the effective dose
 * @return {number} Derivative LL3.
 * @customfunction
 */
function Bisection(Kv_Kvs, b, d, e) {
  var xLo  = 0.0;
  var xHi  = 100;
  var eps  = 0.0001;
  var iter = 0;
  
  var fHi = Drm( xHi, b, d, e) - Kv_Kvs;
  var fLo = Drm( xLo, b, d, e) - Kv_Kvs;
  
  while ( (xHi - xLo) > eps) {
    ++iter;
    var xMid = (xLo + xHi) / 2 ;
    var fMid = Drm( xMid, b, d, e) - Kv_Kvs;
    
    if (fMid * fLo < 0) {
      xHi = xMid;
	  fHi = fMid;
	} 
    else {
      xLo = xMid;
      fLo = fMid;
	}
  }
  
  return xMid;
}
