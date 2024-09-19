<template>
  <el-popover
    ref="popover"
    class="quarter-panel"
    trigger="manual"
    placement="bottom-start"
    transition="el-zoom-in-top"
    :arrow-offset="35"
    :popper-class="displayPopperClass"
    :value="popoverVisible"
    v-bind="$attrs"
  >
    <div class="quarter-panel__header">
      <button
        type="button"
        aria-label="上一年"
        class="quarter-panel__icon-btn quarter-panel__prev-btn el-icon-d-arrow-left"
        @click="prevYear"
      />
      <span class="quarter-panel__header-label">{{ yearLabel }}</span>
      <button
        type="button"
        aria-label="下一年"
        class="quarter-panel__icon-btn quarter-panel__next-btn el-icon-d-arrow-right"
        @click="nextYear"
      />
    </div>
    <div class="quarter-panel__content">
      <table
        cellspacing="0"
        cellpadding="0"
        class="quarter-table"
        @click="handlePick"
      >
        <tbody>
          <tr
            v-for="(row, rowIndex) in rows"
            :key="rowIndex"
            class="quarter-table__row"
          >
            <td v-for="(cell, cellIndex) in row" :key="cellIndex">
              <div class="cell" :class="getCellClass(cell)">
                {{ cell.text }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </el-popover>
</template>

<script>
import dayjs from '@/utils/date-util';

export default {
  props: {
    value: [String, Object],
    valueFormat: String,
    visible: {
      type: Boolean,
      default: false,
    },
    popperClass: String,
    disabledDate: Function,
    cellClassName: Function,
  },
  data() {
    return {
      popoverVisible: this.visible,
      today: dayjs(),
      currentInfo: {
        year: undefined,
      },
    };
  },
  computed: {
    displayPopperClass() {
      return `quarter-popper ${this.popperClass ?? ''}`;
    },
    todayInfo() {
      return {
        year: this.today.get('year'),
        quarter: this.today.get('quarter'),
      };
    },
    pickedDate() {
      return this.value && dayjs(this.value, this.valueFormat, true);
    },
    yearLabel() {
      return `${this.currentInfo.year} 年`;
    },
    rows() {
      const numOneRow = 4;
      const result = [];

      for (let i = 0; i < 4; i++) {
        const row = Math.floor(i / numOneRow);
        const column = i % numOneRow;
        // 创建空数组
        column === 0 && (result[row] = new Array(numOneRow));

        const { year: currentYear } = this.currentInfo;
        const { year: todayYear, quarter: todayQuarter } = this.todayInfo;
        const quarter = column + 1;

        const startDate = this.getDate(currentYear, quarter);
        const endDate = startDate.endOf('quarter');
        const startTime = startDate.toDate();
        const endTime = endDate.toDate();

        result[row][column] = {
          quarter,
          text: `Q${quarter}`,
          today: todayYear === currentYear && todayQuarter === quarter,
          picked:
            this.pickedDate &&
            this.pickedDate.get('year') === currentYear &&
            this.pickedDate.get('quarter') === quarter,
          disabled:
            typeof this.disabledDate === 'function' &&
            this.disabledDate({ startTime, endTime }),
          customeClass:
            typeof this.cellClassName === 'function' &&
            this.cellClassName({ startTime, endTime }),
        };
      }

      return result;
    },
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler() {
        this.currentInfo.year = this.value
          ? this.pickedDate.get('year')
          : new Date().getFullYear();
      },
    },
    visible(val) {
      this.popoverVisible = val;
    },
  },
  methods: {
    getDate(year, quarter) {
      return dayjs(`${year}-Q${quarter}`, 'YYYY-[Q]Q', true);
    },
    getCellClass(cell) {
      const { today, picked, disabled, customClass } = cell;

      return [{ today, picked, disabled }, customClass];
    },
    prevYear() {
      this.currentInfo.year > 1000 && this.currentInfo.year--;
    },
    nextYear() {
      this.currentInfo.year < 9999 && this.currentInfo.year++;
    },
    handlePick(event) {
      let target = event.target;
      if (target.tagName === 'DIV') {
        target = target.parentNode;
      }

      if (target.tagName !== 'TD') return;

      const row = target.parentNode.rowIndex;
      const column = target.cellIndex;
      const cell = this.rows[row][column];

      if (cell.disabled) return;

      const newValue = this.getDate(this.currentInfo.year, cell.quarter).format(
        this.valueFormat
      );
      this.$emit('pick', newValue);
    },
  },
};
</script>
