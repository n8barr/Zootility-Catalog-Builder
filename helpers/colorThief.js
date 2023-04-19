import colorThief from 'colorthief';

async function useColorThief(imagePath) {
  try {
    const [ red, green, blue ] = await colorThief.getColor(imagePath);
    return `rgba(${red}, ${green}, ${blue}, 0.45)`;
  } catch(err) {
    return '';
  }
}

export {useColorThief };