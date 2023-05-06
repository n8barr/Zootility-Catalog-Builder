
function needsPriceRangeHelper (options) {
  // check if the min and max are the same
  const minPrice = this.minWholesalePrice;
  const maxPrice = this.maxWholesalePrice;
  if (minPrice === maxPrice) {
    return options.inverse(this);
  } else {
    return options.fn(this);;
  }
}

export { needsPriceRangeHelper };