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

  findLocalMinimum(x0) {
    let xPrev = x0
    let x = xPrev
    let grad
    let count = 0

    const xs = []
    const ys = []

    do {
      grad = derivative(this.f, x, this.epsilon)
      do {
        xs.push(x)
        ys.push(this.f(x))
        x = xPrev - this.step * grad
        console.log(x, xPrev, grad, this.f(x), this.f(xPrev))
        xPrev = x
        ++count
      } while (this.f(x) < this.f(xPrev))
    } while (Math.abs(grad) >= this.epsilon)

    return { xs, ys, x, y: this.f(x), count }
  }

  findMinimumValue(from, to, iterations) {
    const chance = new Chance()
    const localXs = []
    const localYs = []
    const localIters = []

    let count = 0

    for (let i = 0; i < iterations; ++i) {
      const x0 = chance.floating({ min: from, max: to })
      console.log(x0)
      const iteration = this.findLocalMinimum(x0)
      localXs.push(iteration.x)
      localYs.push(iteration.y)
      localIters.push(iteration)
      count += iteration.count
    }

    console.log(count)

    const x = _.min(localXs)
    return { localXs, localYs, localIters, x, y: this.f(x) }
  }
}
