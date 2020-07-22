/**
 * Calculate the Vapour Pressure of  water in (kPa) 
 *
 * @param {number} temp The temperature is in Celcius.
 * @return The Vapour pressure of water in (kPa).
 * @customfunction
 */
function VapourPressure(temp){
  var result = 0.61121 * Math.exp((18.678-temp/234.5)*(temp/(257.14+temp)));
  return result;
}

/**
 * Barometric formula (Atm. Pressure)
 *
 * @param {number} masl metres above sea level [m].
 * @return {number} Atmospheric pressure in (bar).
 * @customfunction
 */
function AtmPressure(masl){
  var result = 101.325 * Math.exp(-0.000118547*masl)*0.01;
  return result;
}

/**
 * Calculate Saturated water Density in (kg/m³)
 *
 * @param {number} temp The temperature is in Celcius.
 * @return {number} Density of water in (kg/m³)
 * @customfunction
 */
function WaterDensity(temp = 15.6){
  var a = 0.14395;
  var b = 0.0112;
  var c = 649.727;
  var d = 0.05107;
  temp = temp + 273.15;
  var result = a/(b**(1+(1-temp/c)**d));
  return(result);
 }

/**
 * Water Dynamic Viscosity
 *
 * @param {number} temp The temperature is in Celcius.
 * @return {number} Dynamic Viscosity (mPa*s)
 * @customfunction
 */
function DynamicViscosity(temp = 15.6){
  var a = 1.856e-11;
  var b = 4209;
  var c = 0.04527;
  var d = -3.376e-5;
  temp = temp + 273.15;  
  var result =  a*Math.exp((b/temp)+(c*temp)+d*(temp**2));
  return(result);
}

/**
 * Water Kinematic Viscosity
 *
 * @param {number} temp The temperature is in Celcius.
 * @return {number} Kinematic Viscosity in (m2/s)*1e-6
 * @customfunction
 */
function  KinematicViscosity(temp = 15.6){
  var result =  DynamicViscosity(temp)/(WaterDensity(temp)/1000);
  return(result);
}

