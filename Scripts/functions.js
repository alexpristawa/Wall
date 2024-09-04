/**
 * Gets the velocity an object pushes back with based on a distance
 * @param {number} x - Distance you want the velocity to be based off of
 * @returns {number} - Velocity to push back with
 */
let getVelocityAdjust = (x, max) => {
    let sum = Player.radiusTiles+Resource.radiusTiles;
    if(max == undefined) max = sum;
    x *= (sum/max);
    return (x/Math.abs(x))*(40/(Math.abs(x)+0.5) - 40/(sum+0.5)); //Beginning part is for direction
}