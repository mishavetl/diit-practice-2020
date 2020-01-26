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
        :wrapper-col="{ span: 12 }"
        :label-col="{ span: 5, offset: 2 }"
        label="From"
      >
        <a-input v-model="from" />
      </a-form-item>
      <a-form-item
        :wrapper-col="{ span: 12 }"
        :label-col="{ span: 5, offset: 2 }"
        label="To"
      >
        <a-input v-model="to" />
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
          placeholder="Select an option"
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
      <a-row type="flex" justify="center">
        <vue-mathjax :formula="funcFormula"></vue-mathjax>
      </a-row>
      <a-row type="flex" justify="center">
        <vue-mathjax :formula="minimumFormula"></vue-mathjax>
      </a-row>
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
      from: this.$store.state.from,
      to: this.$store.state.to,
      method: 'gradientDescent',
      data: this.getPlotData(
        this.$store.state.func,
        this.$store.state.from,
        this.$store.state.to
      ),
      layout: {},
      options: {},
      minimum: {},
      funcFormula: this.getFuncFormula(
        this.$store.state.func,
        this.$store.state.from,
        this.$store.state.to
      ),
      minimumFormula: ''
    }
  },
  watch: {
    func: _.debounce(function() {
      this.$store.commit('setFunc', this.func)
      this.data = this.getPlotData(this.func, this.from, this.to)
      this.funcFormula = this.getFuncFormula(this.func, this.from, this.to)
    }, 500),
    from: _.debounce(function() {
      this.$store.commit('setFrom', this.from)
      this.data = this.getPlotData(this.func, this.from, this.to)
      this.funcFormula = this.getFuncFormula(this.func, this.from, this.to)
    }, 500),
    to: _.debounce(function() {
      this.$store.commit('setTo', this.to)
      this.data = this.getPlotData(this.func, this.from, this.to)
      this.funcFormula = this.getFuncFormula(this.func, this.from, this.to)
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
    getFuncFormula(func, from, to) {
      return `$$f(x) = ${math.parse(func).toTex()}, x \\in (${from}, ${to})$$`
    },
    findMinimumValue() {
      if (this.method === 'goldenRatio') {
        //
      } else if (this.method === 'gradientDescent') {
        const expr = math.compile(this.func)
        try {
          const step = 0.1
          const epsilon = 1e-8
          this.minimum = new GradientDescent(
            (x) => expr.evaluate({ x }),
            epsilon,
            step
          ).findMinimumValue(this.from, this.to, 1)

          this.data.push({
            x: this.minimum.localXs,
            y: this.minimum.localYs,
            mode: 'markers',
            type: 'scatter'
          })

          this.minimum.localIters.forEach((iteration) => {
            this.data.push({
              x: iteration.xs,
              y: iteration.ys,
              mode: 'markers',
              type: 'scatter'
            })
          })

          this.minimumFormula = `$$min f(x) = (${this.minimum.x}, ${this.minimum.y})$$`

          console.log(this.minimum.xs)
          console.log('min Х =', this.minimum.x)
          console.log('min Y =', this.minimum.y)
        } catch (err) {
          console.log(err)
        }
      }
    },
    getPlotData(expression, from, to) {
      try {
        const expr = math.compile(expression)

        this.funcValidate = {
          status: 'success',
          message: null
        }

        const xValues = math.range(from, to, 0.1).toArray()
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
