module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-nested': {},
    'postcss-preset-env': {},
    'postcss-pxtorem': {
      rootValue: 16,
      unitPrecision: 5,
      propList: ['*'],
      selectorBlackList: ['html', 'body'],
      replace: true,
      mediaQuery: false,
      minPixelValue: 0
    }
  }
}
