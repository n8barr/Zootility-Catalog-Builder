function filterOnlineOrderingProducts(products) {
  // return products.filter(product => product.onlineOrdering === true || product.onlineOrdering === 'true');
  let prevProdTitle = null;
  let prodInCatalog = null;

  return products.filter((product, index) => {
    if (product.status === "Active") {
      if (prevProdTitle !== product.title) {
        prevProdTitle = product.title;
        prodInCatalog = product["metafield:Custom.In_catalog[Boolean]"];
      }
      if (prodInCatalog !== "false") {
        return (
          product["variantMetafield:Custom.In_catalog[Boolean]"] !== "false"
        );
      }
    }
    return false;
  });
}

export { filterOnlineOrderingProducts };
