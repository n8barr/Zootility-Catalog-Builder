function toCamelCase(str) {
    return str
      .replace(/\s*\([^)]*\)\s*/g, ' ') // Remove parentheses and their contents, and condense spaces to a single space
      .trim() // Remove leading and trailing spaces
      .toLowerCase() // Convert the entire string to lowercase
      .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
        if (+match === 0) return ''; // or if (/\s+/.test(match)) for white spaces
        return index === 0 ? match.toLowerCase() : match.toUpperCase();
      });
  }

  function renameProperties(obj) {
    for (const prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        const camelCasedProp = toCamelCase(prop);
        if (prop !== camelCasedProp) {
          obj[camelCasedProp] = obj[prop];
          delete obj[prop];
        }
      }
    }
    return obj;
  }

export { renameProperties };