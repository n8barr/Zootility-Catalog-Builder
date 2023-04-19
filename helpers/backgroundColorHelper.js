function isJpg(imagePath) {

    // check if the image is a jpg format
    const jpgRegex = /\.(jpg|jpeg)$/i;

    return jpgRegex.test(imagePath);
}

const lightColors = [
    'honeydew',
    'mistyrose',
    'linen',
    'ivolavenderblushry',
    'aliceblue',
    'lightcyan'
];

const brightColors = [
    'powderblue',
    'lightsteelblue',
    'paleturquoise',
    'aquamarine',
    'lightsalmon',
    'burlywood',
    'peachpuff'
];

function hash(imagePath, colorOptions) {
    // Use the imagePath to create a consistent random index for the colorOptions array
    const hash = imagePath.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colorIndex = hash % colorOptions.length;
    const color = colorOptions[colorIndex];
    return color;
}

function lifestyleBgColorHelper(imagePath) {
    let colorOptions = brightColors;
    if (isJpg(imagePath)) {
        colorOptions = lightColors;
    } 

    const color = hash(imagePath, colorOptions);
  
    return color;
}

function productBgColorHelper(imagePath) {
    if (typeof imagePath === 'undefined') {
        return 'none';
    }
    let colorOptions = brightColors;
    if (isJpg(imagePath)) {
        colorOptions = ['white'];
    } 
  
    const color = hash(imagePath, colorOptions);
  
    return color;
}

  export { lifestyleBgColorHelper, productBgColorHelper };