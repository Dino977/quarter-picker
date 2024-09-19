![alt 使用示例](https://cdn.jsdelivr.net/gh/Dino977/image-hosting@main/QuarterPicker%E6%93%8D%E4%BD%9C%E7%A4%BA%E4%BE%8B.gif)

> The Quarter Picker based on Vue-2.x and Element-UI

## 前置要求

如果你针对 Element-UI 使用了 [按需引入](https://element.eleme.cn/2.14/#/en-US/component/quickstart#on-demand) , 确保下述组件已注册:

- Input
- Icon
- Popover

## 安装

```bash
npm install @heydino/quarter-picker
```

## 注册

你可以通过 全局 或 局部 的方式引入`QuarterPicker`

注意：样式文件需要单独引入

### 全局注册

在 main.js：

```js
import Vue from 'vue';
import App from './App.vue';
import QuarterPicker from '@heydino/quarter-picker';
import '@heydino/quarter-picker/lib/style/index.css';

Vue.use(QuarterPicker);

new Vue({
  el: '#app',
  render: h => h(App)
});
```

### 局部注册

在任意组件：

```html
<script>
import QuarterPicker from '@heydino/quarter-picker';

export default {
  components: { QuarterPicker },
};
</script>

<style>
@import '@heydino/quarter-picker/lib/style/index.css'
</style>
```

## 快速开始

```html
<quarter-picker v-model="quarter" placeholder="please input" />
```

## 日期格式

使用 `format` 指定输入框的格式；使用 `value-format` 指定绑定值的格式

以下为常用的格式化字符串，以 **UTC 2024年9月1日 00:00:00** 为例：

请注意大小写；下述 含义 中标注星号，表示与 [Element-UI 日期格式](https://link.juejin.cn?target=https%3A%2F%2Felement.eleme.cn%2F%23%2Fzh-CN%2Fcomponent%2Fdate-picker%23ri-qi-ge-shi) 使用方式有差异

| 占位符 | 含义             | 备注                                        | 举例          |
| ------ | ---------------- | ------------------------------------------- | ------------- |
| YY     | 年*              | 简称，两位数                                | 24            |
| YYYY   | 年*              | 全称                                        | 2024          |
| M      | 月               | —                                           | 9             |
| MM     | 月               | 补零                                        | 09            |
| D      | 日*              | —                                           | 1             |
| DD     | 日*              | 补零                                        | 01            |
| Q      | 季度             | 数值格式                                    | 3             |
| H      | 小时             | —                                           | 0             |
| HH     | 小时             | 补零，24小时制                              | 00            |
| m      | 分钟             | —                                           | 0             |
| mm     | 分钟             | 补零                                        | 00            |
| s      | 秒               | —                                           | 0             |
| ss     | 秒               | 补零                                        | 00            |
| h      | 小时             | 12小时制                                    | 12            |
| hh     | 小时             | 补零，12小时制                              | 12            |
| A      | AM/PM            | 大写，仅 `format` 可用                      | AM            |
| a      | am/pm            | 小写，仅 `format` 可用                      | am            |
| x      | 时间戳*          | —                                           | 1725120000000 |
| [XXX]  | 无需格式化的字符 | 避免被错误解析，例如 [Q] 可避免被解析为季度 | XXX           |

## Attributes

| 名称           | 说明                                 | 类型    | 可选值                | 默认值               |
| -------------- | ------------------------------------ | ------- | --------------------- | -------------------- |
| value/v-model  | 绑定值，默认返回 所选季度 的初始日期 | String  | —                     | —                    |
| readonly       | 只读                                 | Boolean | —                     | false                |
| disabled       | 禁用                                 | Boolean | —                     | false                |
| editable       | 支持手动输入                         | Boolean | —                     | true                 |
| clearable      | 支持一键清空                         | Boolean | —                     | true                 |
| width          | 输入框宽度                           | String  | —                     | 220px                |
| size           | 输入框高度                           | String  | medium / small / mini | —                    |
| placeholder    | 占位内容                             | String  | —                     | —                    |
| format         | 显示值格式                           | String  | 见上方 日期格式       | YYYY-[Q]Q            |
| value-format   | 绑定值格式                           | String  | 见上方 日期格式       | YYYY-MM-DD           |
| popper-class   | 弹出框类名                           | String  | —                     | —                    |
| picker-options | 特殊配置项，详见下表                 |         |                       |                      |
| name           | 输入框元素属性                       | String  | —                     | —                    |
| prefix-icon    | 自定义头部图标的名称                 | String  | —                     | el-icon-date         |
| clear-icon     | 自定义清空图标的名称                 | String  | —                     | el-icon-circle-close |
| validate-event | 绑定值发生变化时，是否触发表单的校验 | Boolean | —                     | true                 |

## Picker Options

| 名称          | 说明                                              | 类型                             | 可选值 | 默认值 |
| ------------- | ------------------------------------------------- | -------------------------------- | ------ | ------ |
| disabledDate  | 设置禁用状态，禁用则返回 `true`，反之返回 `false` | Function({ startTime, endTime }) | —      | —      |
| cellClassName | 设置单个季度DOM的类名                             | Function({ startTime, endTime }) | —      | —      |

## Events

| 名称   | 说明                    | 参数           |
| ------ | ----------------------- | -------------- |
| change | 选定值被确定时触发      | 绑定值 `value` |
| blur   | 当 input 失去焦点时触发 | 组件实例       |
| focus  | 当 input 获得焦点时触发 | 组件实例       |

## Methods

| 名称  | 说明              | 参数 |
| ----- | ----------------- | ---- |
| focus | 使 input 获取焦点 | —    |
