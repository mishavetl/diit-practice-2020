const phi = (1 + Math.sqrt(5)) / 2

export class GoldenRatio {
  constructor(f, epsilon) {
    this.f = (x) => Math.abs(f(x))
    this.epsilon = epsilon
  }

  findMinimumValue(from, to, fx1, fx2) {
    const leftXs = []
    const leftYs = []
    const rightXs = []
    const rightYs = []
    while (to - from >= this.epsilon) {
      const t = (to - from) / phi
      const x1 = to - t
      const x2 = from + t
      leftXs.push(x1)
      leftYs.push(this.f(x1))
      rightXs.push(x2)
      rightYs.push(this.f(x2))
      fx1 = typeof fx1 === 'undefined' ? this.f(x1) : fx1
      fx2 = typeof fx2 === 'undefined' ? this.f(x2) : fx2
      if (fx1 >= fx2) {
        from = x1
        fx1 = fx2
        fx2 = undefined
      } else {
        to = x2
        fx2 = fx1
        fx1 = undefined
      }
    }
    const x = (to + from) / 2
    return { x, y: this.f(x), leftXs, leftYs, rightXs, rightYs }
  }
}
