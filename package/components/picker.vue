<template>
  <div
    v-clickoutside="handleClose"
    class="quarter-picker"
    :style="{ '--width': width }"
  >
    <el-input
      ref="reference"
      class="quarter-editor"
      :value="displayValue"
      :readonly="readonly || !editable"
      :disabled="pickerDisabled"
      :size="pickerSize"
      :placeholder="placeholder"
      :name="name"
      :validate-event="false"
      @input="(value) => (userInput = value)"
      @change="handleChange"
      @focus="handleFocus"
      @mouseenter.native="handleMouseEnter"
      @mouseleave.native="closeIconVisible = false"
      @keydown.native="handleKeydown"
    >
      <i
        slot="prefix"
        :class="['el-input__icon', prefixIcon]"
        @click="handleFocus"
      />
      <i
        slot="suffix"
        :class="['el-input__icon', { [clearIcon]: closeIconVisible }]"
        @click="handleCloseIconClick"
      />
    </el-input>

    <!-- 设置为true时，在v-clickoutside的作用，会致使 点击popover导致其关闭
          el-date-picker中，是将弹出框直接appendChild到输入框内部 -->
    <quarter-panel
      :value="value"
      :value-format="actualValueFormat"
      :append-to-body="false"
      :popper-class="popperClass"
      :visible.sync="panelVisible"
      :reference="mountPanel ? $refs.reference.$el : undefined"
      v-bind="pickerOptions"
      @pick="handlePick"
    />
  </div>
</template>

<script>
import { covertDateFormat, isValidDate } from "@/utils/date-util";
import QuarterPanel from "./panel/quarter.vue";
import Emitter from "element-ui/src/mixins/emitter";
import Clickoutside from "element-ui/src/utils/clickoutside";

const valueEquals = function (a, b) {
  const aIsDate = a instanceof Date;
  const bIsDate = b instanceof Date;
  if (aIsDate && bIsDate) {
    return a.getTime() === b.getTime();
  }
  if (!aIsDate && !bIsDate) {
    return a === b;
  }
  return false;
};

/* 校正格式，避免使用了 未引入插件 所涉及的 模板占位符 及 其他不建议使用内容 */
const formatRevise = function (format) {
  const reg =
    /(YYYY|YYY|YY|Y|S|SS|SSS|Z|ZZ|kk|k|X|ww|w|WW|W|wo|GGGG|gggg|zzz|z)/g;
  return format.replace(reg, (match) => {
    switch (match) {
      case "YYYY":
      case "YY":
        return match;
      default:
        return `[${match}]`;
    }
  });
};

export default {
  name: "QuarterPicker",
  components: { QuarterPanel },
  directives: { Clickoutside },
  mixins: [Emitter],
  inject: {
    // 用于同步表单的禁用状态
    elForm: {
      default: "",
    },
    elFormItem: {
      default: "",
    },
  },
  props: {
    value: [String, Object],
    readonly: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    editable: {
      type: Boolean,
      default: true,
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    width: {
      type: String,
      default: "220px",
    },
    size: String, // 高度尺寸
    placeholder: String,
    format: {
      type: String,
      default: "YYYY-[Q]Q",
    },
    valueFormat: {
      type: String,
      default: "YYYY-MM-DD",
    },
    popperClass: String,
    pickerOptions: {
      type: Object,
      default: () => ({}),
    },
    name: String,
    prefixIcon: {
      type: String,
      default: "el-icon-date",
    },
    clearIcon: {
      type: String,
      default: "el-icon-circle-close",
    },
    validateEvent: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      userInput: null,
      closeIconVisible: false,
      mountPanel: false,
      panelVisible: false,
    };
  },
  computed: {
    displayValue() {
      if (this.userInput !== null) {
        return this.userInput;
      } else {
        return this.formatDate(this.value);
      }
    },
    actualFormat() {
      return formatRevise(this.format);
    },
    actualValueFormat() {
      return formatRevise(this.valueFormat);
    },
    pickerDisabled() {
      return this.disabled || (this.elForm || {}).disabled;
    },
    pickerSize() {
      return (
        this.size ||
        (this.elFormItem || {}).elFormItemSize ||
        (this.$ELEMENT || {}).size
      );
    },
  },
  watch: {
    value(val, oldVal) {
      if (!valueEquals(val, oldVal) && this.validateEvent) {
        this.dispatch("ElFormItem", "el.form.change", val);
      }
    },
    panelVisible(value) {
      if (!value) {
        this.$emit("blur", this);
        this.blur();

        this.$nextTick(() => {
          // 避免先于 handleChange 操作前执行下方内容
          this.userInput = null; // 避免emit值，被错误设定为null
          this.validateEvent && this.dispatch("ElFormItem", "el.form.blur"); // 避免以旧值就校验操作
        });
      }
    },
  },
  methods: {
    focus() {
      this.$refs.reference.focus();
    },
    blur() {
      this.$refs.reference.blur();
    },
    dateVerify(startDate) {
      const disabledDate = this.pickerOptions.disabledDate;
      const isDisabled =
        disabledDate &&
        disabledDate({
          startTime: startDate.toDate(),
          endTime: startDate.endOf("quarter").toDate(),
        });

      return !isDisabled;
    },
    // 由 绑定值 转化为 展示值
    formatDate(value) {
      return covertDateFormat(value, this.actualValueFormat, this.actualFormat);
    },
    // 由 展示值 转化为 绑定值
    parseDate(value) {
      return covertDateFormat(
        value,
        this.actualFormat,
        this.actualValueFormat,
        this.dateVerify
      );
    },
    emitChange(value) {
      if (!valueEquals(value, this.value)) {
        this.$emit("change", value);

        this.validateEvent &&
          this.dispatch("ElFormItem", "el.form.change", value);
      }
    },
    emitInput(value) {
      if (!valueEquals(value, this.value)) {
        this.$emit("input", value);
      }
    },
    handleChange() {
      if (this.userInput) {
        try {
          const formatted = this.parseDate(this.userInput);
          this.emitInput(formatted);
          this.emitChange(formatted);
        } catch (err) {
          return;
        }
      } else {
        this.emitInput(null);
        this.emitChange(null);
      }
    },
    handleFocus() {
      this.$emit("focus", this);
      // 初始化面板
      if (!this.mountPanel) {
        this.mountPanel = true;
      }
      this.panelVisible = true;
    },
    handleMouseEnter() {
      if (this.readonly || this.pickerDisabled) return;
      if (this.displayValue && this.clearable) {
        this.closeIconVisible = true;
      }
    },
    handleKeydown(event) {
      const keyCode = event.keyCode;

      switch (keyCode) {
        // ESC
        case 27:
          this.panelVisible = false;
          event.stopPropagation();
          return;
        // Enter
        case 13:
          if (
            this.userInput === "" ||
            isValidDate(this.displayValue, this.actualFormat, this.dateVerify)
          ) {
            this.panelVisible = false;
          }
          event.stopPropagation();
          return;
      }
    },
    handleCloseIconClick() {
      if (this.readonly || this.pickerDisabled) return;

      if (this.closeIconVisible) {
        this.emitInput(null);
        this.emitChange(null);
        this.panelVisible = false;
        this.closeIconVisible = false;
      } else {
        this.panelVisible = !this.panelVisible;
      }
    },
    handleClose() {
      if (!this.panelVisible) return;
      this.panelVisible = false;
    },
    handlePick(value) {
      this.emitInput(value);
      this.emitChange(value);
      this.panelVisible = false;
    },
  },
};
</script>
