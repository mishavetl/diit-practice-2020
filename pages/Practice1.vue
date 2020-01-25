<template>
  <div>
    <a-form @submit="handleSubmit">
      <a-form-item
        :wrapper-col="{ span: 12 }"
        :label-col="{ span: 5, offset: 2 }"
        :validate-status="funcValidate.status"
        :help="funcValidate.message"
        label="Function"
      >
        <a-input v-model="func" />
      </a-form-item>
      <a-form-item
        :label-col="{ span: 5, offset: 2 }"
        :wrapper-col="{ span: 12 }"
        :validate-status="methodValidate.status"
        :help="methodValidate.message"
        label="Method"
      >
        <a-select
          v-model="method"
          @change="handleMethodChange"
          placeholder="Select a option and change input text above"
        >
          <a-select-option value="goldenRatio">
            Golden Ratio
          </a-select-option>
          <a-select-option value="gradientDescent">
            Gradient Descent
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">
          Find the minimum point
        </a-button>
      </a-form-item>
    </a-form>
    <client-only>
      <vue-mathjax :formula="funcFormula"></vue-mathjax>
      <vue-mathjax :formula="minimumFormula"></vue-mathjax>
      <vue-plotly :data="data" :layout="layout" :options="options" />
    </client-only>
  </div>
</template>

<script>
import { create, all } from 'mathjs'
import _ from 'lodash'
// import goldenratio from 'goldenratio'
import { GradientDescent } from '@/assets/gradientdescent.js'

const math = create(all, {})

export default {
  components: {
    VuePlotly: () => import('@statnett/vue-plotly')
  },
  data() {
    return {
      formLayout: 'horizontal',
      funcValidate: {
        status: 'success',
        message: null
      },
      methodValidate: {
        status: 'success',
        message: null
      },
      func: this.$store.state.func,
      method: 'gradientDescent',
      data: this.getPlotData(this.$store.state.func),
      layout: {},
      options: {},
      minimum: {},
      funcFormula: this.getFuncFormula(this.$store.state.func),
      minimumFormula: ''
    }
  },
  watch: {
    func: _.debounce(function() {
      this.$store.commit('setFunc', this.func)
      this.data = this.getPlotData(this.func)
      this.funcFormula = this.getFuncFormula(this.func)
    }, 500)
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      if (this.method !== null) {
        this.findMinimumValue()
      } else {
        this.methodValidate = {
          status: 'error',
          message: 'Please select a method'
        }
      }
    },
    handleMethodChange() {
      this.methodValidate = {
        status: 'success',
        message: null
      }
    },
    getFuncFormula(func) {
      return `$$f(x) = ${math.parse(func).toTex()}$$`
    },
    findMinimumValue() {
      if (this.method === 'goldenRatio') {
        //
      } else if (this.method === 'gradientDescent') {
        const expr = math.compile(this.func)
        try {
          this.minimum = GradientDescent.findMinimumValue((x) =>
            expr.evaluate({ x })
          )

          this.minimumFormula = `$$min f(x) = (${this.minimum.x}, ${this.minimum.y})$$`

          console.log(this.minimum.xs)
          console.log('min Х =', this.minimum.x)
          console.log('min Y =', this.minimum.y)
        } catch (err) {
          console.log(err)
        }
      }
    },
    getPlotData(expression) {
      try {
        const expr = math.compile(expression)

        this.funcValidate = {
          status: 'success',
          message: null
        }

        const xValues = math.range(-20, 20, 0.1).toArray()
        const yValues = xValues.map(function(x) {
          return expr.evaluate({ x })
        })

        const trace1 = {
          x: xValues,
          y: yValues,
          type: 'scatter',
          line: {
            smoothing: 1,
            shape: 'spline'
          }
        }
        return [trace1]
      } catch (err) {
        this.funcValidate = {
          status: 'error',
          message: err.toString()
        }
        return []
      }
    }
  }
}
</script>
