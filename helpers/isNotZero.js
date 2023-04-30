function isNotZero(value, options) {
  const numValue = Number(value);
  if (numValue !== 0) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
};

export { isNotZero };