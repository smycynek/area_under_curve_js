# area-under-curve
Area under curve in JavaScript

Work in Progress

Just a fun port of the Python
https://github.com/smycynek/area_under_curve package.

npm: https://www.npmjs.com/package/area-under-curve

Try it out:
`node ./node_modules/area-under-curve/area -h`

`node ./node_modules/area-under-curve/area -l 0 -u 3 -s .1 -p "[[3,1],]" -a trapezoid`

Sample Output:
`Area under f(x)= x^3 with bounds Bounds: [0 - 3], stepSize: 0.1 with algorithm trapezoid is 20.272500000000036`

Or, use as a library:

```javascript
const area = require('./area_lib.js');
const algo = require('./algorithm.js');

const poly = new area.Polynomial(new Map([[3, 1]]));
poly.evaluate(3);
area.areaUnderCurve(poly, new area.Bounds(0,3, 0.1),algorithm=algo.simpson);
```

Better module packaging/tests coming soon...
