const fs = require('fs');
const path = require('path');

const appEntities = fs.readdirSync('./app')
  .filter(dir => fs.statSync(path.join('./app', dir)).isDirectory());

const boundaries = [
  ...appEntities.map(entity => ({
    type: entity,
    pattern: `app/${entity}/*`,
  })),
  ...appEntities.map(entity => ({
    type: `components-${entity}`,
    pattern: `components/${entity}/*`,
  })),
];

const rules = appEntities.map(entity => ({
  from: [entity],
  allow: [`components-${entity}`],
}));

module.exports = {
  extends: ['next/core-web-vitals', 'plugin:import/recommended'],
  plugins: ['import', 'boundaries'],
  rules: {
    'boundaries/element-types': [2, {
      default: 'disallow',
      rules,
    }],
  },
  settings: {
    boundaries,
  },
};
