import Handlebars from 'handlebars';
import { 
  lifestyleBgColorHelper,
  productBgColorHelper
} from './helpers/backgroundColorHelper.js';
import './helpers/isNotZero.js';
import { isNotZero } from './helpers/isNotZero.js';
import { nameToClass } from './helpers/nameToClass.js';
import { priceRangeHelper } from './helpers/priceRangeHelper.js';

Handlebars.registerHelper('lifestyleBgColor', lifestyleBgColorHelper);
Handlebars.registerHelper('productBgColor', productBgColorHelper);
Handlebars.registerHelper('isNotZero', isNotZero);
Handlebars.registerHelper('nameToClass', nameToClass);
Handlebars.registerHelper('priceRange', priceRangeHelper);

// Define the HTML templates
const pageTemplate = `
<!doctype html>
<html>
<head>
  <link rel="stylesheet" type="text/css"  href="../css/pageContent.css">
  <link rel="stylesheet" type="text/css"  href="../css/productTemplate1.css">
  <link rel="stylesheet" type="text/css"  href="../css/productTemplate2.css">
  <link rel="stylesheet" type="text/css"  href="../css/productTemplate3.css">
  <link rel="stylesheet" type="text/css"  href="../css/productTemplate4.css">
  <link rel="stylesheet" type="text/css"  href="../css/imageContainer.css">
  <link rel="stylesheet" type="text/css"  href="../css/skuStyles.css">
  <link rel="stylesheet" type="text/css"  href="../css/cover.css">
  {{#if showBarcodes}}
    <script src="../../node_modules/jsbarcode/dist/JsBarcode.all.min.js"></script>
  {{/if}}

</head>
<body class="{{#if showBarcodes}}showBarcodes{{/if}} {{#if isDigital}} digital-catalog{{/if}} {{#if isPrint}} print-catalog{{/if}}">
  {{#each pages}}
    <div class="page">
      <div class="page-header">{{collectionName}}</div>
      <div class="page-content">{{{content}}}</div>
      <div class="page-footer">{{page}}</div>
    </div>
  {{/each}}

  {{#if showBarcodes}}
    <script type="text/javascript">
      JsBarcode(".barcode").init();
    </script>
  {{/if}}
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
    <div class="product-sales-data">
      <div class="prices">
        <div class="wholesale-price">Wholesale: {{priceRange "wholesale"}}</div>
        {{#isNotZero retailPrice}}<div class="retail-price">Retail: {{priceRange "retail"}}</div>{{/isNotZero}}
        {{#isNotZero minimumOrderQuantity}}<div class="min-qty">Min: {{minimumOrderQuantity}}</div>{{/isNotZero}}
      </div>
      <div class="product-barcode">
        {{#if showSkuInOverview}}
          <div class="sku">{{variants.0.sku}}</div>
          {{#if showBarcodes}}
            {{#if variants.0.barcode}}
              <div class="barcode-container">
                <svg class="barcode"
                  jsbarcode-format="upc"
                  jsbarcode-value="{{variants.0.barcode}}"
                  jsbarcode-textMargin="0"
                  jsbarcode-margin="0"
                  jsbarcode-fontOptions="bold"
                  jsbarcode-height="18"
                  jsbarcode-fontSize="0"
                  jsbarcode-displayValue="false">
                </svg>
              </div>
            {{/if}}
          {{/if}}
        {{/if}}
      </div>
    </div>
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
      <div class="sku">{{variants.0.option1Value}}</div>
      <div class="sku">{{variants.0.sku}}</div>
      {{#if showBarcodes}}
        {{#if barcode}}
          <div class="barcode-container">
            <svg class="barcode"
              jsbarcode-format="upc"
              jsbarcode-value="{{barcode}}"
              jsbarcode-textMargin="0"
              jsbarcode-margin="0"
              jsbarcode-fontOptions="bold"
              jsbarcode-height="18"
              jsbarcode-fontSize="0"
              jsbarcode-displayValue="false">
            </svg>
          </div>
        {{/if}}
      {{/if}}
    {{/unless}}
  </div>
`;

const productInfo2Template = `
<div class="product2-info">
  <h2 class="product-name">{{productName}}</h2>
  <div class="prices">
    <div class="wholesale-price">Wholesale: {{priceRange "wholesale"}}</div>
    {{#isNotZero retailPrice}}<div class="retail-price">Retail: {{priceRange "retail"}}</div>{{/isNotZero}}
    {{#isNotZero minimumOrderQuantity}}<div class="min-qty">Min: {{minimumOrderQuantity}}</div>{{/isNotZero}}
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
  {{#if showBarcodes}}
    {{#if barcode}}
      <div class="barcode-container">
        <svg class="barcode"
          jsbarcode-format="upc"
          jsbarcode-value="{{barcode}}"
          jsbarcode-textMargin="0"
          jsbarcode-margin="0"
          jsbarcode-fontOptions="bold"
          jsbarcode-height="18"
          jsbarcode-fontSize="0"
          jsbarcode-displayValue="false">
        </svg>
      </div>
    {{/if}}
  {{/if}}
</div>
`;

const variantTemplateWithPrice = `
<div class="variant variant-sku-{{sku}}">
  <div class="image-container">
    <img src="{{images.[0]}}" alt="{{sku}} - {{option1Value}}" />
  </div>
  <div class="sku">{{option1Value}}</br>{{sku}}</div>
  <div class="variant-price">
    <div class="wholesale-price">Cost: $ {{wholesalePrice}}</div>
  </div>
  {{#if showBarcodes}}
    {{#if barcode}}
      <div class="barcode-container">
        <svg class="barcode"
          jsbarcode-format="upc"
          jsbarcode-value="{{barcode}}"
          jsbarcode-textMargin="0"
          jsbarcode-margin="0"
          jsbarcode-fontOptions="bold"
          jsbarcode-height="18"
          jsbarcode-fontSize="0"
          jsbarcode-displayValue="false">
        </svg>
      </div>
    {{/if}}
  {{/if}}
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
<div class="collection-summary collection-name-{{#nameToClass}}{{collectionName}}{{/nameToClass}}" style="background-image: {{gradient}} url('{{cover}}')">
  {{#if logo}}
    <div class="collection-summary-logo" style="margin-top: {{margin}}"><img src="{{logo}}" /></div>
  {{else}}
    <div class="collection-summary-title" style="margin-top: {{margin}}">{{collectionName}}</div>
  {{/if}}
  {{#if blurb}}
    <div class="collection-tagline">{{{tagline}}}</div>
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
const compiledVariantTemplateWithPrice = Handlebars.compile(variantTemplateWithPrice);

const compiledProduct1ImageTemplate = Handlebars.compile(product1ImageTemplate);

const compiledSectionFillerTemplate = Handlebars.compile(sectionFillerTemplate);

const compiledCollectionSummaryTemplate = Handlebars.compile(collectionSummaryTemplate);

export { 
  compiledPageTemplate, 
  compiledProductLeftTemplates, 
  compiledProductRightTemplates, 
  compiledVariantTemplate, 
  compiledVariantTemplateWithPrice,
  compiledProduct1ImageTemplate, 
  compiledSectionFillerTemplate,
  compiledCollectionSummaryTemplate,
};