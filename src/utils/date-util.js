import dayjs from "dayjs";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs
  .extend(quarterOfYear)
  .extend(advancedFormat) // 增补format方法支持的模板Q
  .extend(customParseFormat); // 自定义解析时对于的模板

export default dayjs;

/**
 * @description 由日期字符串获取dayjs对象
 * @param {String} value 日期字符串
 * @param {String} template 字符串模板
 * @param {Function} verify 自定义校验函数
 * @returns {dayjs} dayjs对象
 */
export function getValidDate(value, template, verify) {
  const date = dayjs(value, template, true);
  const customValid = verify ? verify(date) : true;

  if (date.isValid() && customValid) {
    return date;
  } else {
    throw new Error();
  }
}

/**
 * @description 转化日期格式
 * @param {String} value 日期字符串
 * @param {String} initialTemplate 初始模板（与value应是匹配的）
 * @param {String} targetTemplate 目标模板
 * @param {Function} verify 自定义校验函数
 * @returns {String} 转化后的日期字符串
 * @argument 默认格式化占位符 详见：https://day.js.org/docs/zh-CN/durations/format#docsNav
 *           扩展格式化占位符 详见：https://day.js.org/docs/zh-CN/plugin/advanced-format
 */
export function covertDateFormat(
  value,
  initialTemplate,
  targetTemplate,
  verify
) {
  if (!value) return null;

  const date = getValidDate(value, initialTemplate, verify);

  return date.format(targetTemplate);
}

/**
 * @description 判断日期是否合法
 * @param {String} value 日期字符串
 * @param {String} template 日期模板
 * @param {Function} verify 自定义校验函数
 */
export function isValidDate(value, template, verify) {
  try {
    getValidDate(value, template, verify);
    return true;
  } catch (error) {
    return false;
  }
}
