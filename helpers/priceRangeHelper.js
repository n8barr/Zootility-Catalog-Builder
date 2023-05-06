// Desc: Helper function to get price range for a product
//       check the min and max price for the product and return a string
// Params: priceType - string - 'retail' or 'wholesale'
function priceRangeHelper(priceType) {
  priceType = priceType.charAt(0).toUpperCase() + priceType.slice(1);
  const minPrice = this[`min${priceType}Price`];
  const maxPrice = this[`max${priceType}Price`];
  if (minPrice === maxPrice) {
    return `$ ${minPrice}`;
  }
  return `$ ${minPrice} - ${maxPrice}`;
}

export { priceRangeHelper };