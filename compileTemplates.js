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
const productImage1Template = `
  <div class="product-image">
    <div class="image-container">
      <img src="{{#if images}}{{images.[0]}}{{else}}{{variants.[0].images.[0]}}{{/if}}" alt="{{productName}}" />
    </div>
  </div>
`;

const productInfo1Template = `
  <div class="product-info">
    <h2 class="product-name">{{productName}}</h2>
    <div class="prices">
      <div class="wholesale-price">Wholesale: $ {{wholesalePrice}}</div>
      <div class="retail-price">Retail: $ {{retailPrice}}</div>
      <div class="min-qty">Min: {{minimumOrderQuantity}}</div>
    </div>
    <div class="sku">{{sku}}</div>
    <div class="product-description">{{{productDescription}}}</div>
    <div class="product-variants">
      {{#each images}}
        {{#if @index}}
          {{{product1ImageTemplate}}}
        {{/if}}
      {{/each}}
    </div>
  </div>
`;

const product1ImageTemplate = `
<div class="variant">
  <div class="image-container">
    <img src="{{this}}" alt="Product Image" />
  </div>
</div>
`;

const productTemplateLeft1 = `
<div class="product product-1-variant content-block {{#if hasLifestyleImage}}imageType-lifestyle{{/if}}">
  ${productImage1Template}
  ${productInfo1Template}
</div>
`;

const productTemplateRight1 = `
<div class="product product-1-variant content-block {{#if hasLifestyleImage}}imageType-lifestyle{{/if}}">
  ${productInfo1Template}
  ${productImage1Template}
</div>
`;

// Define the Product template for Products with 2-7 Variants
const productImage2Template = `
  <div class="product2-image">
    <div class="image-container">
    <img src="{{#if images}}{{images.[0]}}{{else}}{{variants.[0].images.[0]}}{{/if}}" alt="{{productName}}" />
    </div>
    {{#unless hasLifestyleImage}}
      <div class="sku">{{variants.0.option1Value}}</br>{{variants.0.sku}}</div>
    {{/unless}}
  </div>
`;

const productInfo2Template = `
<div class="product2-info">
    <h2 class="product-name">{{productName}}</h2>
    <div class="prices">
      <div class="wholesale-price">Wholesale: $ {{wholesalePrice}}</div>
      <div class="retail-price">Retail: $ {{retailPrice}}</div>
      <div class="min-qty">Min: {{minimumOrderQuantity}}</div>
    </div>
    <div class="product-description">{{{productDescription}}}</div>
    <div class="product2-variants">
    {{#if hasLifestyleImage}}
      {{#each variants}}
          {{{variantTemplate}}}
      {{/each}}
    {{else}}
      {{#each variants}}
        {{#if @index}}
          {{{variantTemplate}}}
        {{/if}}
      {{/each}}
    {{/if}}
    </div>
  </div>
`;

const productTemplateLeft2 = `
<div class="product product2 {{#if hasLifestyleImage}}imageType-lifestyle{{/if}}">
  ${productImage2Template}
  ${productInfo2Template}
</div>
`;

const productTemplateRight2 = `
<div class="product product2 {{#if hasLifestyleImage}}imageType-lifestyle{{/if}}">
  ${productInfo2Template}
  ${productImage2Template}
</div>
`;

const variantTemplate = `
<div class="variant">
  <div class="image-container">
    <img src="{{images.[0]}}" alt="{{sku}} - {{optionValue1}}" />
  </div>
  <div class="sku">{{option1Value}}</br>{{sku}}</div>
</div>
`;

const productTemplateLeft3 = `...`; // Define the Product template for Products with 10+ Variants
const productTemplateRight3 = `...`;

// Compile the templates
const compiledPageTemplate = Handlebars.compile(pageTemplate);
const compiledProductLeftTemplates = [
  Handlebars.compile(productTemplateLeft1),
  Handlebars.compile(productTemplateLeft2),
  Handlebars.compile(productTemplateLeft3),
];

const compiledProductRightTemplates = [
  Handlebars.compile(productTemplateRight1),
  Handlebars.compile(productTemplateRight2),
  Handlebars.compile(productTemplateRight3),
];

const compiledVariantTemplate = Handlebars.compile(variantTemplate);
//const compiledProduct1ImageTemplate = Handlebars.compile(product1ImageTemplate);

export { compiledPageTemplate, compiledProductLeftTemplates, compiledProductRightTemplates, compiledVariantTemplate };