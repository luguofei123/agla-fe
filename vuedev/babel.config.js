module.exports = {
  presets: ['@vue/app'],
  plugins: [
    [
      "import",
      { 
        "libraryName": "ant-design-vue", 
        "libraryDirectory": "es", 
        "style": true 
      }
    ],
    ["component",
      {
        "libraryName": "mint-ui",
        "style": true
      },
    "mint-ui"],
    ["component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      },
      "element-ui"
    ]
  ]
}
