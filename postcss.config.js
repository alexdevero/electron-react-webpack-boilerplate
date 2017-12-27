module.exports = {
  plugins: {
    'postcss-cssnext': {
      browsers: [
        'Firefox >= 48',
        'Chrome >= 54',
        'ie >= 8',
        'last 4 versions',
        'Safari >= 8'
      ]
    },
    'postcss-import': {},
    'postcss-pxtorem': {
      rootValue: 16,
      unitPrecision: 5,
      propList: ['*'],
      selectorBlackList: ['html', 'body'],
      replace: true,
      mediaQuery: false,
      minPixelValue: 0
    },
    'postcss-nested': {}
  }
}
