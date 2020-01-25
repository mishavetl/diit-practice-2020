import { GradientDescent } from '@/assets/gradientdescent.js'

test('finds minimum value of sinx, which is -1', () => {
  expect(GradientDescent.findMinimumValue((x) => Math.sin(x))).toBe(-1)
})
