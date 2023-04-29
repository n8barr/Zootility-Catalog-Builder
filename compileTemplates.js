import Handlebars from 'handlebars';
import { 
  lifestyleBgColorHelper,
  productBgColorHelper
  } from './helpers/backgroundColorHelper.js';

Handlebars.registerHelper('lifestyleBgColor', lifestyleBgColorHelper);
Handlebars.registerHelper('productBgColor', productBgColorHelper);

// Define the HTML templates
const pageTemplate = `
<!doctype html>
<html>
<head>
  <link rel="stylesheet" type="text/css"  href="views/css/pageContent.css">
  <link rel="stylesheet" type="text/css"  href="views/css/productTemplate1.css">
  <link rel="stylesheet" type="text/css"  href="views/css/productTemplate2.css">
  <link rel="stylesheet" type="text/css"  href="views/css/productTemplate3.css">
  <link rel="stylesheet" type="text/css"  href="views/css/productTemplate4.css">
  <link rel="stylesheet" type="text/css"  href="views/css/imageContainer.css">
  <link rel="stylesheet" type="text/css"  href="views/css/skuStyles.css">
  <link rel="stylesheet" type="text/css"  href="views/css/cover.css">
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
  <div class="product-image {{#if hasJpgImage}}image-jpg{{/if}}" style="{{#if hasLifestyleImage}}background-image: url('{{images.[0]}}'); background-color: {{lifestyleBgColor images.[0]}};{{else}} background-color: {{productBgColor variants.[0].images.[0]}}{{/if}}">
    <img src="{{variants.[0].images.[0]}}" alt="{{productName}}" />
  </div>
`;

const productInfo1Template = `
  <div class="product-info">
    <h2 class="product-name">{{productName}}</h2>
    <div class="prices">
      <div class="wholesale-price">Wholesale: $ {{wholesalePrice}}</div>
      {{#if retailPrice}}<div class="retail-price">Retail: $ {{retailPrice}}</div>{{/if}}
      <div class="min-qty">Min: {{minimumOrderQuantity}}</div>
    </div>
    <div class="sku">{{variants.0.sku}}</div>
    <div class="product-description">{{{productDescription}}}</div>
    <div class="product-variants {{#if use1x2Grid}}grid-1x2{{/if}}">
      {{#each imageTemplates}}
        {{{this}}}
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
<div class="product product-1-variant product-baseSku-{{baseSku}} content-block {{#if hasLifestyleImage}}imageType-lifestyle{{/if}}">
  ${productImage1Template}
  ${productInfo1Template}
</div>
`;

const productTemplateRight1 = `
<div class="product product-1-variant product-baseSku-{{baseSku}} content-block {{#if hasLifestyleImage}}imageType-lifestyle{{/if}}">
  ${productInfo1Template}
  ${productImage1Template}
</div>
`;

// Define the Product template for Products with 2-7 Variants
const productImage2Template = `
  <div class="product2-image {{#if hasJpgImage}}image-jpg{{/if}}" style="{{#if hasLifestyleImage}}background-image: url('{{images.[0]}}'); background-color: {{lifestyleBgColor images.[0]}};{{else}} background-color: {{productBgColor variants.[0].images.[0]}}{{/if}}">
    <div class="image-container">
    <img src="{{variants.[0].images.[0]}}" alt="{{productName}}" />
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
    {{#if retailPrice}}<div class="retail-price">Retail: $ {{retailPrice}}</div>{{/if}}
    <div class="min-qty">Min: {{minimumOrderQuantity}}</div>
  </div>
  <div class="product-description">{{{productDescription}}}</div>
  <div class="product2-variants {{#if use1x2Grid}}grid-1x2{{/if}}">
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
<div class="product product2 product-baseSku-{{baseSku}} {{#if hasLifestyleImage}}imageType-lifestyle{{/if}}">
  ${productImage2Template}
  ${productInfo2Template}
</div>
`;

const productTemplateRight2 = `
<div class="product product2 product-baseSku-{{baseSku}} {{#if hasLifestyleImage}}imageType-lifestyle{{/if}}">
  ${productInfo2Template}
  ${productImage2Template}
</div>
`;

const variantTemplate = `
<div class="variant variant-sku-{{sku}}">
  <div class="image-container">
    <img src="{{images.[0]}}" alt="{{sku}} - {{option1Value}}" />
  </div>
  <div class="sku">{{option1Value}}</br>{{sku}}</div>
</div>
`;

// Define the Product template for Products with 7-8 Variants
const productTemplate3 = `
<div class="product3-variants product-baseSku-{{baseSku}}">
  {{#each variants}}
    {{{variantTemplate}}}
  {{/each}}
</div>
`;

// Define the Product template for Products with 9+ Variants
const productTemplate4 = `
<div class="product4-variants">
  {{#each variants}}
    {{{variantTemplate}}}
  {{/each}}
</div>
`;

// Define the Filler Section template (show an image or leave a blank section)
const sectionFillerTemplate = `
<div class="product section-filler {{class}}" style="background-image: url('{{image}}');"></div>
`;

// Define the Collection Summary Template
const collectionSummaryTemplate = `
<div class="collection-summary" style="background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6) {{gradientStart}}%, transparent {{gradientEnd}}%), url('{{cover}}')">
  <div class="collection-summary-title">{{collectionName}}</div>
  {{#if blurb}}
    <div class="collection-blurb">{{{blurb}}}</div>
  {{else}}
    <ul class="collection-summary-products">
      {{#each products}}
        <li class="collection-summary-product-name">{{productName}}</li>
      {{/each}}
    </ul>
  {{/if}}
</div>
`;

// Compile the templates
const compiledPageTemplate = Handlebars.compile(pageTemplate);
const compiledProductLeftTemplates = [
  Handlebars.compile(productTemplateLeft1),
  Handlebars.compile(productTemplateLeft2),
  Handlebars.compile(productTemplate3),
  Handlebars.compile(productTemplate4),
];

const compiledProductRightTemplates = [
  Handlebars.compile(productTemplateRight1),
  Handlebars.compile(productTemplateRight2),
  Handlebars.compile(productTemplate3),
  Handlebars.compile(productTemplate4),
];

const compiledVariantTemplate = Handlebars.compile(variantTemplate);

const compiledProduct1ImageTemplate = Handlebars.compile(product1ImageTemplate);

const compiledSectionFillerTemplate = Handlebars.compile(sectionFillerTemplate);

const compiledCollectionSummaryTemplate = Handlebars.compile(collectionSummaryTemplate);

export { 
  compiledPageTemplate, 
  compiledProductLeftTemplates, 
  compiledProductRightTemplates, 
  compiledVariantTemplate, 
  compiledProduct1ImageTemplate, 
  compiledSectionFillerTemplate,
  compiledCollectionSummaryTemplate,
};