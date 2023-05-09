import fs from 'fs';

class ConfigReader {
  constructor(configFilePath, defaultConfig) {
    this.configFilePath = configFilePath;
    this.defaultConfig = defaultConfig;
  }

  readConfigFile() {
    try {
      const data = fs.readFileSync(this.configFilePath, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.error(`Error reading config file: ${err.message}`);
      return null;
    }
  }

  applyDefaultConfig(configArray) {
    return configArray.map(config => {
      return {...this.defaultConfig, ...config};
    });
  }

  getConfigurations() {
    const configArray = this.readConfigFile();
    if (!configArray) {
      return null;
    }

    return this.applyDefaultConfig(configArray);
  }
}

export { ConfigReader };
