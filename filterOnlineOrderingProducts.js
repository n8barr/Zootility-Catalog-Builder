function filterOnlineOrderingProducts(products) {
    return products.filter(product => product.onlineOrdering === true || product.onlineOrdering === 'true');
  }

export { filterOnlineOrderingProducts };