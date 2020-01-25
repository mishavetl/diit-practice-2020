import _ from 'lodash'

function derivative(f, x, dx) {
  return (f(x + dx) - f(x)) / dx
}

export class GradientDescent {
  static findMinimumValue(f) {
    let xnPrev = -1000
    let xn = -0.4
    let yn = f(xn)

    const Y = {}
    Y[xn] = yn

    const step = 0.1
    const epsilon = 1e-8

    while (
      Math.abs(f(xnPrev) - f(xn)) > epsilon ||
      Math.abs(xnPrev - xn) > epsilon
    ) {
      xnPrev = xn
      xn = xn - step * derivative(f, xn, epsilon)
      console.log(xn, xnPrev, derivative(f, xn, epsilon))
      yn = f(xn)
      Y[xn] = yn
    }

    const X = _.invert(Y)
    const ymin = _.min(_.keys(X))

    return { xs: X, x: X[ymin], y: ymin }
  }
}
