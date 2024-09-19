import Component from "../package/index.js";

const install = function (Vue) {
  Vue.component(Component.name, Component);
};

// Automatically register this component for direct use in the browser
if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default {
  install,
};
