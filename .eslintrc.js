module.exports = {
  "root": true,
  "extends": "airbnb",
  "installedESLint": true,
  "plugins": [
    "react",
  ],
  "rules": {
    "import/no-extraneous-dependencies": ["error", {
      "devDependencies": ["build/**/*.js", "config/**/*.js"],
    }],
    "react/jsx-filename-extension": [2, {
      extensions: ['.js', '.jsx']
    }],
    "func-names": [0],
    "new-cap": [2, {
      newIsCap: true,
      capIsNew: true,
      capIsNewExceptions: ['List', 'Map'],
    }],
    "linebreak-style": [0],
    "no-console": [0],
  },
  "env": {
    "browser": true,
    "node": true,
  }
};
