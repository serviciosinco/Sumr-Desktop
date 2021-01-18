module.exports = {
    packagerConfig: {},
    makers: [
      {
        name: '@electron-forge/maker-zip',
        platforms: ['darwin', 'linux'],
        config: {
            // Config here
        }
      },
      {
        name: '@electron-forge/maker-dmg',
        config: {
          background: './build/background.png',
          format: 'ULFO'
        }
      }
    ],
    hooks: {
      postPackage: async (forgeConfig, options) => {
        if (options.spinner) {
          options.spinner.info(`Completed packaging for ${options.platform} / ${options.arch} at ${options.outputPaths[0]}`);
        }
      }
    }
  }