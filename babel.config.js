const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)

const plugins = ['lodash']
if (IS_PROD) {
  // plugins.push('transform-remove-console')
}

module.exports = {
  // presets: [
  //   '@vue/cli-plugin-babel/preset'
  // ],
  // plugins
  presets: [
    '@vue/cli-plugin-babel/preset',
    ["@babel/preset-env", { "modules": false }]
  ],
  "plugins": [
    ...plugins,
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ],
    [
      "import",
      {
        "libraryName": "vxe-table",
        "style": true // 样式是否也按需加载
      }
    ]
  ]
}
