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
        <a-input-number :step="0.1" v-model.number="from" style="width: 100%" />
      </a-form-item>
      <a-form-item
        :wrapper-col="{ span: 12 }"
        :label-col="{ span: 5, offset: 2 }"
        label="To"
      >
        <a-input-number :step="0.1" v-model.number="to" style="width: 100%" />
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
      <a-form-item
        :wrapper-col="{ span: 12 }"
        :label-col="{ span: 5, offset: 2 }"
        label="ε"
      >
        <a-input-number
          :step="0.1"
          v-model.number="epsilon"
          style="width: 100%"
        />
      </a-form-item>
      <a-form-item
        :wrapper-col="{ span: 12 }"
        :label-col="{ span: 5, offset: 2 }"
        v-show="method === 'gradientDescent'"
        label="Step"
      >
        <a-input-number :step="0.1" v-model.number="step" style="width: 100%" />
      </a-form-item>
      <a-form-item
        :wrapper-col="{ span: 12 }"
        :label-col="{ span: 5, offset: 2 }"
        v-show="method === 'gradientDescent'"
        label="Iterations"
      >
        <a-input v-model.number="iterations" />
      </a-form-item>
      <a-form-item
        :wrapper-col="{ span: 12 }"
        :label-col="{ span: 5, offset: 2 }"
        v-show="method === 'gradientDescent'"
        label="Max local iterations"
      >
        <a-input v-model.number="maxLocalIterations" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">
          <span
            v-html="
              method === 'gradientDescent'
                ? 'Find the minimum point'
                : 'Find zero point'
            "
          ></span>
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
import { GoldenRatio } from '@/assets/goldenratio.js'
import { GradientDescent } from '@/assets/gradientdescent.js'

const VuePlotly = () => import('@statnett/vue-plotly')

const math = create(all, {})

export default {
  components: {
    VuePlotly
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
      step: 0.1,
      epsilon: 0.000000001,
      iterations: 10,
      maxLocalIterations: 200,
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
      setTimeout(() => {
        this.data = this.getPlotData(this.func, this.from, this.to)
        try {
          const expr = math.compile(this.func)
          if (this.method === 'goldenRatio') {
            this.minimum = new GoldenRatio(
              (x) => expr.evaluate({ x }),
              this.epsilon
            ).findMinimumValue(this.from, this.to)
            this.data.push({
              x: [this.minimum.x],
              y: [this.minimum.y],
              name: 'Minimum',
              mode: 'markers',
              type: 'scatter'
            })

            this.data.push({
              x: this.minimum.leftXs,
              y: this.minimum.leftYs,
              name: 'Left',
              mode: 'markers',
              type: 'scatter'
            })
            this.data.push({
              x: this.minimum.rightXs,
              y: this.minimum.rightYs,
              name: 'Right',
              mode: 'markers',
              type: 'scatter'
            })
            if (this.minimum.y <= this.epsilon) {
              this.minimumFormula = `$$f(x) = 0, (x, y) = (${this.minimum.x}, ${this.minimum.y})$$`
            } else {
              this.minimumFormula = `$$f(x) = 0, x \\in \\emptyset$$`
            }
          } else if (this.method === 'gradientDescent') {
            this.minimum = new GradientDescent(
              (x) => expr.evaluate({ x }),
              this.epsilon,
              this.step
            ).findMinimumValue(
              this.from,
              this.to,
              this.iterations,
              this.maxLocalIterations
            )
            this.data.push({
              x: [this.minimum.x],
              y: [this.minimum.y],
              name: 'Minimum',
              mode: 'markers',
              type: 'scatter'
            })

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

            console.log('min Х =', this.minimum.x)
            console.log('min Y =', this.minimum.y)
          }
        } catch (err) {
          console.log(err)
        }
      })
    },
    getPlotData(expression, from, to) {
      try {
        const expr = math.compile(expression)

        this.funcValidate = {
          status: 'success',
          message: null
        }

        const xValues = math.range(from, to, 0.001).toArray()
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
