exports.printMsg = function() {
  console.log("Area under curve module.");
}

class Bounds {
    // Bounds class
    constructor (lowerBound, upperBound, stepSize) {
      this.lowerBound = lowerBound;
      this.upperBound = upperBound;
      this.stepSize = stepSize;
      if (this.stepSize <= 0) {
        throw new Error({ type: 'value', message: 'invalid step size' });
      }
      if (this.upperBound <= this.lowerBound) {
        throw new Error({ type: 'value', message: 'invalid bounds' });
      }
      this.fullRange = this.floatRange(lowerBound, upperBound, stepSize);
    }
    toString () {
      return `Bounds: [${this.lowerBound} - ${this.upperBound}], stepSize: ${this.stepSize}`;
    }
  
    floatRange (lowerBound, upperBound, stepSize) {
      const floatList = [];
      let current = lowerBound;
      floatList.push(current);
      // Final number should be almost equal to upper bound.
      // Adding fraction of stepSize offset to account for rounding errors.
      while (current + stepSize < (upperBound + (stepSize * .1))) {
        current += stepSize;
        floatList.push(current);
      }
      return floatList;
    }
  }
  
  
  function anyNonIntNumbers (collection) {
    // Returns true if any numbers in the collection are not integers
    const isint = element => Number.isInteger(Number(element));
    return !collection.every(isint);
  }
  function anyNegative (collection) {
    // Returns true if any numbers in the collection are < 0"""
    const neg = element => Number(element) < 0;
    return collection.some(neg);
  }
  
class Polynomial {
    // Single variable polynomial class supporting n degrees
    constructor (coefficientMap) {
      // The coefficient dict keys are the term orders, and the values are the coefficients
      // e.g
      // f(x) = 3x^2 would be expressed as {2:3}
      // f(x) = 9x^5 + 3 would be {5:9, 0:3}
  
      this.fractionalExponents = false;
  
      this.coefficientMap = coefficientMap;
  
      if (anyNegative([...coefficientMap.keys()])) {
        throw new Error({ type: 'value', message: 'only positive exponents supported' });
      }
      this.fractionalExponents = anyNonIntNumbers([...coefficientMap.keys()]);
    }
  
    formatTerm (degree, value) {
      // string format a single term
      let valueFormatted = value.toString();
      if (value === 1) {
        valueFormatted = '';
      }
      if (value === 0) {
        return null;
      }
      if (degree === 0) {
        return value.toString();
      }
      if (degree === 1) {
        return `${valueFormatted}x`;
      }
      return `${valueFormatted}x^${degree}`;
    }
  
    toString () {
      // string format the entire polynomial
      const terms = [];
      const degrees = this.coefficientMap.keys();
      // degrees = degrees; //sort?
      for (let degree of degrees) {
        let termFormatted = (this.formatTerm(degree, this.coefficientMap.get(degree)));
        if (termFormatted != null) {
          terms.push(termFormatted);
        }
      }
      if (!terms) {
        return 'f(x)=0';
      }
      const termString = `${terms.join(' + ')}`;
      return `f(x)= ${termString}`;
    }
  
    evaluate (value) {
      // Evaluate the polynomial at a given value
      let total = 0;
      for (let degree of this.coefficientMap.keys()) {
        var coefficient = this.coefficientMap.get(degree);
        if (this.fractionalExponents != null && value < 0) {
          throw new Error({type: 'value', message: 'Fractional exponents not supported for negative inputs.'});
        }
        var currentTerm = (value ** degree) * coefficient;
  
        total += currentTerm;
      }
      return total;
    }
  }
  
  // Algorithms and utilities
  
function midpoint (poly, lower, upper) {
    // Calculate midpoint slice from two polynomial evaluations and step size
    const value = poly.evaluate((upper + lower) / 2.0);
    return (upper - lower) * value;
  }
  
function trapezoid (poly, lower, upper) {
    // Calculate trapezoid slice from two polynomial evaluations and step size
    const lowerValue = poly.evaluate(lower);
    const upperValue = poly.evaluate(upper);
    return (upper - lower) * ((lowerValue + upperValue) / 2.0);
  }
  
function simpson (poly, lower, upper) {
    // Calculate parabola (Simpson) slice from two polynomial evaluations and step size
    const lowerValue = poly.evaluate(lower);
    const upperValue = poly.evaluate(upper);
    const midpointValue = poly.evaluate((lower + upper) / 2.0);
    return ((upper - lower) / 6.0) * (lowerValue + 4 * midpointValue + upperValue);
  }
  
function area_under_curve (poly, bounds, algorithm) {
    // Finds the area under a polynomial between the specified bounds
    // using a rectangle-sum (of width 1) approximation.
    const rangeUpperIndex = bounds.fullRange.length - 1;
    let totalArea = 0;
  
    for (let rangeIndex = 0; rangeIndex < bounds.fullRange.length; rangeIndex++) {
      const val = bounds.fullRange[rangeIndex];
      // Can't calculate trapezoid with only lower bound value, so we're done summing.
      if (rangeIndex === rangeUpperIndex) {
        return totalArea;
      }
      totalArea += algorithm(poly, val, bounds.fullRange[rangeIndex + 1]);
    }
    return totalArea;
  }
  

exports.area_under_curve = area_under_curve;
exports.Polynomial = Polynomial;
exports.Bounds = Bounds;
exports.simpson = simpson;
exports.midpoint = midpoint;
exports.trapezoid = trapezoid;  