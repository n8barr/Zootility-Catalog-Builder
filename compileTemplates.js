import Handlebars from 'handlebars';

// Define the HTML templates
const pageTemplate = `
<!doctype html>
<html>
<head>
  <link rel="stylesheet" type="text/css"  href="views/css/pageContent.css">
  <link rel="stylesheet" type="text/css"  href="views/css/productTemplate1.css">
  <link rel="stylesheet" type="text/css"  href="views/css/productTemplate2.css">
  <link rel="stylesheet" type="text/css"  href="views/css/imageContainer.css">
  <style>
    /* CSS styles go here */
  </style>
</head>
<body>
  {{#each pages}}
    <div class="page">
      <div class="page-header">{{collectionName}}</div>
      <div class="page-content">{{{content}}}</div>
      <div class="page-footer">{{page}}</div>
    </div>
  {{/each}}
</body>
</html>
`;

// Define the Product template for Products with 1 Variant
const productTemplate1 = `
<div class="product product-1-variant content-block">
  <div class="product-image">
    <div class="image-container">
      <img src="{{imagePath1}}" alt="{{productName}}" />
    </div>
  </div>
  <div class="product-info">
    <h2 class="product-name">{{productName}}</h2>
    <div class="prices">
      <div class="wholesale-price">WSP: $ {{wholesalePrice}}</div>
      <div class="retail-price">MSRP: $ {{retailPrice}}</div>
      <div class="min-qty">Min: {{minimumOrderQuantity}}</div>
    </div>
    <div class="sku">{{sku}}</div>
    <div class="product-description">{{{productDescription}}}</div>
  </div>
</div>
`;

const productTemplate2 = `
<div class="product product2 imageType-{{imageType}}">
  <div class="product2-image">
    <div class="image-container">
      <img src="{{imagePath1}}" alt="{{productName}}" />
    </div>
    <div class="sku">{{variants.0.option1Value}}</br>{{variants.0.sku}}</div>
  </div>
  <div class="product2-info">
    <h2 class="product-name">{{productName}}</h2>
    <div class="prices">
      <div class="wholesale-price">WSP: $ {{wholesalePrice}}</div>
      <div class="retail-price">MSRP: $ {{retailPrice}}</div>
      <div class="min-qty">Min: {{minimumOrderQuantity}}</div>
    </div>
    <div class="product-description">{{{productDescription}}}</div>
    <div class="product2-variants">
      {{#each variants}}
        {{#if @index}}
          {{{variantTemplate}}}
        {{/if}}
      {{/each}}
    </div>
  </div>
</div>
`;

const productLifestyleTemplate2 = `
<div class="product product2 imageType-{{imageType}}">
  <div class="product2-image">
    <div class="image-container">
      <img src="{{imagePath1}}" alt="{{productName}}" />
    </div>
  </div>
  <div class="product2-info">
    <h2 class="product-name">{{productName}}</h2>
    <div class="prices">
      <div class="wholesale-price">WSP: $ {{wholesalePrice}}</div>
      <div class="retail-price">MSRP: $ {{retailPrice}}</div>
      <div class="min-qty">Min: {{minimumOrderQuantity}}</div>
    </div>
    <div class="product-description">{{{productDescription}}}</div>
    <div class="product2-variants">
      {{#each variants}}
          {{{variantTemplate}}}
      {{/each}}
    </div>
  </div>
</div>
`;

const variantTemplate = `
<div class="variant">
  <div class="image-container">
    <img src="{{imagePath1}}" alt="{{sku}} - {{optionValue1}}" />
  </div>
  <div class="sku">{{option1Value}}</br>{{sku}}</div>
</div>
`;

const productTemplate3 = `...`; // Define the Product template for Products with 10+ Variants

// Compile the templates
const compiledPageTemplate = Handlebars.compile(pageTemplate);
const compiledProductTemplates = [
  Handlebars.compile(productTemplate1),
  Handlebars.compile(productTemplate2),
  Handlebars.compile(productTemplate3),
];

const compiledProductLifestyleTemplates = [
  '...', //TODO
  Handlebars.compile(productLifestyleTemplate2),
  '...', //TODO
];

const compiledVariantTemplate = Handlebars.compile(variantTemplate);

export { compiledPageTemplate, compiledProductTemplates, compiledProductLifestyleTemplates, compiledVariantTemplate };