module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    "multiline-conditions": "off", // Ensure this rule is off
    "brace-style": ["error", "1tbs", { allowSingleLine: true }], // Ensure braces can be on the same line
    "max-len": ["error", { code: 80, ignorePattern: "if\\s*\\(.*?\\)" }], // Ignore line length for if statements
  },
};
