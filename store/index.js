export const state = () => ({
  func: 'sin(x ^ 3)',
  from: -5,
  to: 5
  // func: '(x + 5) ^ 2'
})

export const mutations = {
  setFunc(state, func) {
    state.func = func
  },
  setFrom(state, from) {
    state.from = from
  },
  setTo(state, to) {
    state.to = to
  }
}
