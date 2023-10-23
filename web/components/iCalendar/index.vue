<template>
  <div class="i-calendar">
    <v-date-picker
      :masks="masks"
      show-iso-weeknumbers
      :attributes="holiday"
      v-model="value"
      :disabled-dates="disabledDates"
      @dayclick="handleDayClick"
      @dayfocusout="handleDayFocusOut"
      @update:to-page="handleToPage"
      @update:from-page="handleFromPage"
      @popoverWillShow="handlePopoverWillShow"
    >
      <template v-slot="{ inputValue, togglePopover }">
        <input class="bg-white border px-2 py-1 rounded" :value="inputValue" v-on:click="togglePopover" />
      </template>
    </v-date-picker>
  </div>
</template>

<script>
import { DatePicker as VDatePicker } from 'v-calendar'
import { queryCalendar } from './api.js'
export default {
  components: {
    VDatePicker
  },
  props: {
    /**
     * @description: 节假日，日历控件上标灰
     * @param {*}
     * @return {*}
     */

    holiday: {
      type: Array,
      default: () => {
        return []
      }
    },
    /**
     * @description: 不可点击的日期（sprint13日历组件没有这个需求，事先暴露以便后面使用）
     * @param {*}
     * @return {*}
     */

    disabledDates: {
      type: Array,
      default: () => {
        return []
      }
    },
    /**
     * @description: 日期格式： 默认YYYY-MM-DD
     * @param {*}
     * @return {*}
     */

    masks: {
      type: Object,
      default: () => {
        return {
          input: 'YYYY-MM-DD'
        }
      }
    }
  },
  data() {
    return {
      days: 365
    }
  },
  methods: {
    /* 日历控件显示：调用获取周末及法定节假日数据（按年获取） */
    handlePopoverWillShow() {
      const currentHolidayFirstItem = this.holiday.length && this.holiday[0].dates
      const currentHolidayYear = /\d{4}/g.exec(currentHolidayFirstItem) && /\d{4}/g.exec(currentHolidayFirstItem)[0]
      const year = new Date().getFullYear()
      if (!this.holiday.length || year != currentHolidayYear) {
        // holiday为[]或者当前年与日历年不同的时候获取数据
        this.getHoliday(year)
      }
    },
    async getHoliday(year) {
      this.checkYear(year) //判断闰年，闰年 this.days = 365 负数向前 正数向后
      const result_1 = await queryCalendar({
        queryDayNum: this.days,
        queryType: 2, //2：法定节假日
        startDay: `${year}-01-01`
      })
      const result_2 = await queryCalendar({
        queryDayNum: this.days,
        queryType: 3, //3：非法定假期（自定义假期）
        startDay: `${year}-01-01`
      })
      if (result_1.code === '200' && result_2.code === '200') {
        let data_1 = result_1.data || []
        let data_2 = result_2.data || []
        data_1 = data_1.map(item => {
          const date =
            /\d{4}-\d{1,2}-\d{1,2}/g.exec(item.dateContent) && /\d{4}-\d{1,2}-\d{1,2}/g.exec(item.dateContent)[0]
          return {
            dates: date,
            highlight: { fillMode: 'light', color: 'gray' }
          }
        })
        data_2 = data_2.map(item => {
          const date =
            /\d{4}-\d{1,2}-\d{1,2}/g.exec(item.dateContent) && /\d{4}-\d{1,2}-\d{1,2}/g.exec(item.dateContent)[0]
          return {
            dates: date,
            highlight: { fillMode: 'light', color: 'gray' }
          }
        })
        const all = data_1.concat(data_2)
        this.holiday = all
      }
    },
    checkYear(year) {
      if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
        this.days = 366
      } else {
        this.days = 365
      }
    },
    handleToPage(page) {
      const currentYear = new Date().getFullYear()
      if (page.year !== currentYear) {
        this.getHoliday(page.year)
      }
    },
    handleDayClick(day) {
      /* 选择日期绑定v-model（value input） */
      this.$emit('input', day.id)
    }
  }
}
</script>

<style lang="scss">
.i-calendar {
  input {
    border-radius: none;
    border: 1px solid #dcdfe6;
    height: 40px;
    line-height: 40px;
  }
  input:focus-visible {
    outline: 0;
  }
  input:focus {
    border-color: #409eff;
    outline: none;
  }
}
</style>
