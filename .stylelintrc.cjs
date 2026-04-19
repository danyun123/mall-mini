module.exports = {
  extends: ['stylelint-config-standard-scss'],
  ignoreFiles: ['node_modules/**/*', 'miniprogram_npm/**/*'],
  rules: {
    'alpha-value-notation': null,
    'color-function-alias-notation': null,
    'color-function-notation': null,
    'color-hex-length': null,
    'custom-property-pattern': null,
    'property-no-vendor-prefix': null,
    'selector-class-pattern': null,
    'selector-type-no-unknown': [
      true,
      {
        ignoreTypes: ['page', 'scroll-view'],
      },
    ],
    'keyframes-name-pattern': null,
    'unit-no-unknown': [
      true,
      {
        ignoreUnits: ['rpx'],
      },
    ],
  },
};
