function nameToClass(options) {
  const name = options.fn(this);
  return name.replace(/[^a-z0-9]/gi, '-').toLowerCase();
};

export { nameToClass };