<template>
  <div class="sInput">
    <div v-if="staticStatus" class="staticInput">
      <div class="staticInputWrapper">
        <div class="staticScroll">
          <div ref="staticInputInner" class="staticInputInner" @click="handleStaticStatusChange">{{ thousandsProcessor(value) }}</div>
        </div>
      </div>
    </div>
    <iInput v-else ref="input" type="text" v-bind="$props" v-on="{ ...$listeners, input: handleInput }" v-model="value" @blur.native.capture="handleBlur"/>
  </div>  
</template>

<script>
import { iInput } from "rise"

const numberProcessor = function(val, precision = 2, negative) {
  let result = ""
  if (+precision > 0) {
    if (negative) {
      result = (val + "").replace(/[^\d.-]/g, "")
        .replace(/(?<=(-|[^-]+))-/, "")
        .replace(/^(-?)\.*/g, "$1")
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".")
        .replace(/^(-?)0+([0-9].*)/, "$1$2")
        .replace(new RegExp(`^(.+\\.\\d{0,${ precision }})\\d*$`), "$1")
    } else {
      result = (val + "").replace(/[^\d.]/g, "")
      .replace(/^\.*/g, "")
      .replace(".", "$#$")
      .replace(/\./g, "")
      .replace("$#$", ".")
      .replace(/^0+([0-9].*)/, "$1")
      .replace(new RegExp(`^(.+\\.\\d{0,${ precision }})\\d*$`), "$1")
    }
  } else {
    if (negative) {
      result = (val + "").replace(/[^\d-]/g, "")
        .replace(/(?<=(-|[^-]+))-/, "")
        .replace(/^(-?)0+([0-9])/, "$1$2")
    } else {
      result = (val + "").replace(/\D/g, "")
      .replace(/^0+([0-9])/, "$1")
    }
  }
  return result
}

export default {
  components: { iInput },
  model: {
    prop: "value",
    event: "input"
  },
  props: {
    value: {
      type: String || Number,
      default: ""
    },
    thousandSeparator: {
      type: Boolean,
      default: false
    },
    number: {
      type: Boolean,
      default: false
    },
    numberOptions: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      staticStatus: true,
    }
  },
  computed: {
    numberOptionsComputed() {
      return _.assign({ negative: false, decimals: 2}, this.numberOptions)
    }
  },
  methods: {
    thousandsProcessor(value) {
      if(this.thousandSeparator && value) return Number.isFinite(+value) ? value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") : value
      return value
    },
    handleStaticStatusChange() {
      this.staticStatus = false
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    handleInput(value) {
      if (this.number) {
        const result = numberProcessor(value, this.numberOptionsComputed.decimals, this.numberOptionsComputed.negative)
        this.value = result
        this.$emit("input", result)
      } else {
        this.value = value
        this.$emit("input", value)
      }
    },
    handleBlur(e) {
      this.staticStatus = true
      this.$emit("blur", e)
    }
  }
}
</script>

<style lang="scss" scoped>
.sInput {
  .staticInput {
    margin: 2px 0;
    width: 100%;

    .staticInputWrapper {
      width: 97%;
      height: 30px;
      -webkit-appearance: none;
      background-color: #FFFFFF;
      background-image: none;
      border-radius: 0.25rem;
      border: 1px solid #E0E6ED;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      color: #4D4F5C;
      display: inline-block;
      font-size: inherit;
      outline: none;
      padding: 0 15px;
      -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      box-shadow: 0 0 4px rgb(0 38 98 / 15%);
      border-color: transparent;
      overflow: hidden;
      vertical-align: middle;

      .staticScroll {
        width: 100%;
        overflow-x: scroll;
      }
    }

    .staticInputInner {
      width: auto;
      margin: 0 auto;
      font-size: 12px;
      text-align: left;
      word-break: keep-all;
      height: 30px;
      line-height: 28px;
      letter-spacing: normal;
      vertical-align: middle;
    }
  }
}
</style>