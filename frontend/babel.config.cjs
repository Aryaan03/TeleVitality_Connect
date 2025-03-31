module.exports = {
  presets: [
    '@babel/preset-env', // Transforms modern JavaScript
    ['@babel/preset-react', { runtime: 'automatic' }], // Transforms JSX
  ],
};
