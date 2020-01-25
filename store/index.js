export const state = () => ({
  func: '(x + 5) ^ 2'
})

export const mutations = {
  setFunc(state, func) {
    state.func = func
  }
}
