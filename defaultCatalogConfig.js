// Define the default catalog configuration
const defaultConfig = {
  "name": "Catalog",
  "barcodes": false,
  collections: [
    "Zootility Tools",
    "Rift Collection",
    "WanderMade Wallets",
    "Peak and Port Bags",
    "TūLRY",
    "Timeless Terrain",
    "Definitively Stickers",
    "TekPets",
    "Loopets",
    "Backyard & Bar",
    "Name Drop",
    "State Goods",
    "Displays",
    "Display Packs"
  ]
};

const defaultPdfOptions = {
  compressed: {
    format: 'Ledger',
    width: '1000px'
  },
  digital: {
    format: 'Ledger',
    width: '1885px',
  },
  print: {
    format: 'Letter',
    width: '942px',
  }
};

export { defaultConfig, defaultPdfOptions };