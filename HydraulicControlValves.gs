/**
 * Valve flow coefficient Kv
 *
 * @param {number} p1  Inlet Absolute pressure (bar).
 * @param {number} p2  Outlet Absolute pressure (bar).
 * @param {number} flow in (m³/h).
 * @param {number} temp temperature is in Celcius.
 * @return {number} kv Flow coefficient in (m³/h).
 * @customfunction
 */
function Kv(p1, p2, flow, temp = 15.6){
  var r_density =  WaterDensity(temp)/WaterDensity(15.6);
  var result = flow*Math.sqrt(r_density/(p1-p2));
  return(result);
}

/**
 * flow in function of the flow coefficient Kv
 *
 * @param {number} p1  Inlet Absolute pressure (bar).
 * @param {number} p2  Outlet Absolute pressure (bar).
 * @param {number} kv Flow coefficient in (m³/h).
 * @param {number} temp temperature is in Celcius.
 * @return {number} flow in (m³/h).
 * @customfunction
 */
function flow_Kv(p1, p2, Kv, temp = 15.6){
  var r_density =  WaterDensity(temp)/WaterDensity(15.6);
  var result = Kv / Math.sqrt(r_density/(p1-p2));
  return(result);
}



/**
 * Flow coefficient Kv Value in function of the Zeta  Value
 *
 * @param {number} dn diameter in meter (m).
 * @param {number} zeta Resistance Dimensionless.
 * @return {number} kv Flow coefficient in (m³/h).
 * @customfunction
 */
function KvValue(dn, zeta){
  var result = ((dn*1000)**2)/Math.sqrt(626.3*zeta);
  return(result);
}

/**
 * Resistance Coefficient Zeta in function of Kv
 *
 * @param {number} dn diameter in meter (m).
 * @param {number} kv Flow coefficient in (m³/h).
 * @return {number} Zeta Value.
 * @customfunction
 */
function ZetaVaule(dn, kv) {
  var result = (1/626.3)*((dn*1000)**2/kv)**2;
  return(result);
}

/**
 * Resistance coefficients of all fittings attached to the control valve
 * The algebraic sum of all effective resistance coefficients of 
 * all fittings attached to the control valve.
 *
 * @param {number} dn valve diameter (m).
 * @param {number} DN1 downstream pipe diameter (m).
 * @param {number} DN2 upstream pipe diameter (m).
 * @return {number} Resistance coefficient.
 * @customfunction
 */
function ResistanceCoefficient(dn, DN1, DN2){
  var reducer  = (0.5 * (1-(dn/DN1)**2)**2) + (1 - ((dn/DN1)**4));
  var diffuser =  ((1-(dn/DN2)**2)**2) + (1 - ((dn/DN2)**4));
  var result = reducer + diffuser;
  return(result)
}

/**
 * Fp Piping geometry factor
 * 
 * @param {number} kv Flow coefficient value in (m3/h).
 * @param {number} dn valve diameter (m).
 * @param {number} DN1 downstream pipe diameter (m).
 * @param {number} DN2 upstream pipe diameter (m).
 * @return {number} Fp Piping geometry factor.
 * @customfunction
 */
function Fp(kv, dn, DN1, DN2){
  var rc = ResistanceCoefficient(dn, DN1, DN2);
  var result =  1 / Math.sqrt( 1 + (rc*( kv/dn**2)**2) / 0.0016);
  return(result);
}

/**
 * Flp Combined liquid pressure recovery factor and piping geometry factor with attached fittings.
 * @param {number} Fl liquid pressure recovery factor
 * @param {number} kv Flow coefficient value in (m3/h).
 * @param {number} dn valve diameter (m).
 * @param {number} DN1 downstream pipe diameter (m).
 * @param {number} DN2 upstream pipe diameter (m).
 * @return {number} Flp 
 * @customfunction
 */
function Flp(Fl, kv, dn, DN1, DN2){
  var rc = ResistanceCoefficient(dn, DN1, DN2);
  var result =  Fl / Math.sqrt( 1 + (rc*( kv/dn**2)**2)* (Fl / 0.0016));
  return(result);
}

/**
 * Ff Liquid critical pressure ratio factor
 *
 * @param {number} temp The temperature is in Celcius.
 * @return Ff Liquid critical pressure ratio factor.
 * @customfunction
 */
function Ff(temp){
  var pv = VapourPressure(temp);
  // Für Wasser beträgt dieser Wert pc = 221,2 bar
  var result = 0.96 - 0.28 * Math.sqrt( pv / 221.2);
  return(result);
}

/**
 * DPmax Differential pressure maximun between upstream and downstream pressure 
 * @param {number} P1 upstream pressure
 * @param {number} Fl liquid pressure recovery factor
 * @param {number} kv Flow coefficient value in (m3/h).
 * @param {number} dn valve diameter (m).
 * @param {number} DN1 downstream pipe diameter (m).
 * @param {number} DN2 upstream pipe diameter (m).
 * @param {number} temp The temperature is in Celcius.
 * @return {number} DPmax (bar)
 * @customfunction
 */
function DPmax(P1, Fl, kv, dn, DN1, DN2, temp ){
  var result = ((  Flp(Fl, kv, dn, DN1, DN2) / Fp(kv, dn, DN1, DN2) )**2) * ( P1 - Ff(temp) *  VapourPressure(temp));
  return(result);
}

/**
 * Qmax maximun flow 
 * @param {number} P1 upstream pressure
 * @param {number} Fl liquid pressure recovery factor
 * @param {number} kv Flow coefficient value in (m3/h).
 * @param {number} dn valve diameter (m).
 * @param {number} DN1 downstream pipe diameter (m).
 * @param {number} DN2 upstream pipe diameter (m).
 * @param {number} temp The temperature is in Celcius.
 * @return {number} Qmax maximun flow (m3/h)
 * @customfunction
 */
function Qmax(P1, Fl, kv, dn, DN1, DN2, temp){
  var r_density =  WaterDensity(temp)/WaterDensity(15.6);
  var result = kv * Flp(Fl, kv, dn, DN1, DN2) * Math.sqrt(( P1 - Ff(temp) *  VapourPressure(temp))/r_density);
  return(result);
}
