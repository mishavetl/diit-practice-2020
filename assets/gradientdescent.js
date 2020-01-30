import _ from 'lodash'
import { Chance } from 'chance'

function derivative(f, x, dx) {
  return (f(x + dx) - f(x)) / dx
}

export class GradientDescent {
  constructor(f, epsilon, step) {
    this.f = f
    this.epsilon = epsilon
    this.step = step
  }

  findLocalMinimum(x0, from, to, maxIterations) {
    let xPrev = x0
    let x = xPrev
    let grad
    let count = 0

    const xs = [x0]
    const ys = [this.f(x0)]

    do {
      grad = derivative(this.f, x, this.epsilon)
      do {
        xs.push(x)
        ys.push(this.f(x))
        x = xPrev - this.step * grad
        x = _.min([x, to])
        x = _.max([x, from])
        // console.log(x, xPrev, grad, this.f(x), this.f(xPrev))
        xPrev = x
        ++count
      } while (
        count < maxIterations &&
        this.f(x) < this.f(xPrev) &&
        Math.abs(this.step * grad) >= this.epsilon
      )
    } while (
      count < maxIterations &&
      Math.abs(this.step * grad) >= this.epsilon
    )

    const yObject = _.minBy(
      ys.map((y, index) => ({
        y,
        index
      })),
      'y'
    )
    return { xs, ys, x: xs[yObject.index], y: yObject.y, count }
  }

  findMinimumValue(from, to, iterations, maxLocalIterations) {
    const chance = new Chance()
    const localXs = []
    const localYs = []
    const localIters = []

    let count = 0

    for (let i = 0; i < iterations; ++i) {
      const x0 = chance.floating({ min: from, max: to })
      console.log(x0)
      const iteration = this.findLocalMinimum(x0, from, to, maxLocalIterations)
      localXs.push(iteration.x)
      localYs.push(iteration.y)
      localIters.push(iteration)
      count += iteration.count
    }

    console.log(count)

    const yObject = _.minBy(
      localYs.map((y, index) => ({
        y,
        index
      })),
      'y'
    )
    // console.log(yObject)
    return {
      localXs,
      localYs,
      localIters,
      x: localXs[yObject.index],
      y: yObject.y
    }
  }
}
