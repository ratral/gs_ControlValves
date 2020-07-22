/**
 * Velocity in a pipe (m/s)
 *
 * @param {number} flow cubic meter per second (m³/s).
 * @param {number} dn diameter in meter (m).
 * @return {number} velocity in meter per second (m/s).
 * @customfunction
 */
function Velocity(flow, dn){
  var result = (4*flow)/(Math.PI*(dn**2));
  return(result);
}

/**
 * Reynolds number
 *
 * @param {number}flow cubic meter per second (m³/s).
 * @param {number}dn diameter in meter (m).
 * @param {number} temp The temperature is in Celcius.
 * @return {number} Reynolds Number dimensionless quantity
 * @customfunction
 */
function ReynoldsNumber(flow, dn, temp = 15.6){
  var result = (4*flow)/(Math.PI*dn*KinematicViscosity(temp)*1e-6);
  return(result);
}

/**
 * Colebrook–White equation (Darcy friction factor formula)
 *
 * @param {number} flow cubic meter per second (m³/s).
 * @param {number} dn diameter in meter (m).
 * @param {number} roughness roughness in (m).
 * @param {number} temp The temperature is in Celcius.
 * @return {number} Darcy friction factor dimensionless quantity
 * @customfunction
 */
function FrictionColebrook(flow, dn, roughness, temp = 15.6 ){
  var re = ReynoldsNumber(flow, dn, temp);
  var r_roughness = roughness/dn;
  
  if (re <= 2200 ) {
    var result = 64/re;
  } else {
    var result = (-2*Math.log10((r_roughness/3.7)-(5.02/re)*Math.log10(r_roughness-(5.02/re)*Math.log10(r_roughness/3.7+13/re))))**(-2);
  }
  return(result);
}

/**
 *  Darcy–Weisbach equation
 *
 * @param {number} flow cubic meter per second (m³/s).
 * @param {number} pipe_length length of pipe  (m).
 * @param {number} dn diameter in meter (m).
 * @param {number} roughness roughness in (m).
 * @param {number} temp The temperature is in Celcius.
 * @return {number} head loss (m).
 * @customfunction
 */
function DarcyWeisbach(flow, pipelength, dn, roughness, temp = 15.6){
  var friction = FrictionColebrook(flow, dn, roughness, temp);
  var v = Velocity(flow, dn);
  var result = friction*(pipelength/dn)*((v**2)/(2*9.807));
  return(result);
}

/**
 *  Bernoulli Equation (Energy Equation) for Fluid Flow
 *
 * @param {number} flow cubic meter per second (m³/s).
 * @param {number} dn1 Upstream Diameter in meter (m).
 * @param {number} dn2 Downstream Diameter in meter (m).
 * @param {number} dnv Valve Diameter in meter (m).
 * @param {number} L1 Upstream pipe_length length of pipe  (m).
 * @param {number} L2 Downstream pipe_length length of pipe  (m).
 * @param {number} Zup Zeta value upstream.
 * @param {number} Zdw Zeta value downstream.
 * @param {number} Zv Zeta value valve.
 * @param {number} roughness of the pipe material in (m).
 * @param {number} temp The temperature is in Celcius.
 * @return {number} head loss (m).
 * @customfunction
 */
function Bernoulli(flow, dn1, dn2, dnv, L1, L2, Zup, Zdw, Zv, roughness, temp){
  
  var f1 = DarcyWeisbach(flow, L1, dn1, roughness, temp);
  var f2 = DarcyWeisbach(flow, L2, dn2, roughness, temp);
  
  var reducer  = 0.5 * (1-(dnv/dn1)**2)**2;
  var diffuser = (1-(dnv/dn2)**2)**2;
   
  Zup = (Zup + reducer) * (Velocity(flow, dn1)**2) / ((2*9.807)); 
  Zdw = (Zdw + diffuser) * (Velocity(flow, dn2)**2) / ((2*9.807));
  Zv  = Zv  * (Velocity(flow, dnv)**2) / ((2*9.807));
  
  var result = Zup + f1 + Zv + Zdw + f2;

  return(result);
  
}


/**
 *  Maximum flow 
 *
 * @param {number} Dh Static dif. in m.
 * @param {number} flow cubic meter per second (m³/s).
 * @param {number} dn1 Upstream Diameter in meter (m).
 * @param {number} dn2 Downstream Diameter in meter (m).
 * @param {number} dnv Valve Diameter in meter (m).
 * @param {number} L1 Upstream pipe_length length of pipe  (m).
 * @param {number} L2 Downstream pipe_length length of pipe  (m).
 * @param {number} Zup Zeta value upstream.
 * @param {number} Zdw Zeta value downstream.
 * @param {number} Zv Zeta value valve.
 * @param {number} roughness of the pipe material in (m).
 * @param {number} temp The temperature is in Celcius.
 * @return {number} flow (m3/s).
 * @customfunction
 */
function maxFlow( Dh, flow, dn1, dn2, dnv, L1, L2, Zup, Zdw, Zv, roughness, temp ) {
  
  var xLo  = 0.00001;
  var xHi  = 20;
  var eps  = 0.00001;
  var iter = 0;
  
  var fHi = Bernoulli( xHi, dn1, dn2, dnv, L1, L2, Zup, Zdw, Zv, roughness, temp ) - Dh;
  var fLo = Bernoulli( xLo, dn1, dn2, dnv, L1, L2, Zup, Zdw, Zv, roughness, temp ) - Dh;

  while ( (xHi - xLo) > eps) {
    ++iter;
    var xMid = (xLo + xHi) / 2 ;
    var fMid = Bernoulli( xMid, dn1, dn2, dnv, L1, L2, Zup, Zdw, Zv, roughness, temp ) - Dh;
    
    if ( fMid * fLo < 0 ) {
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
