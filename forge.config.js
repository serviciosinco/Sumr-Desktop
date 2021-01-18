const path = require('path');
const WebpackPlugin = require('@electron-forge/plugin-webpack').default;

module.exports = {
    packagerConfig: {
      icon: './build/osx/icon.icns'
    },
    makers: [
      /*{
        name: '@electron-forge/maker-zip',
        platforms: ['darwin', 'linux'],
        config: {
            // Config here
        }
      },*/
      {
        name: '@electron-forge/maker-dmg',
        config: {
          icon: './build/osx/icon.icns',
          background: './build/osx/background.png',
          format: 'ULFO',
          additionalDMGOptions: {
            'background-color': '#1a1a1a',
            window:{
              size:{
                width:540,
                height:380
              }
            }
          },
          contents: [
              {
                x: 380,
                y: 220,
                type: 'link',
                path: '/Applications'
              },
              {
                x: 160,
                y: 220,
                type: 'file',
                path: path.resolve(__dirname, 'out/SUMR-darwin-x64/SUMR.app')
              },
              {
                x: 2000,
                y: 2000,
                type: 'position',
                path: '.background'
              },
              {
                x: 2000,
                y: 2000,
                type: 'position',
                path: '.VolumeIcon.icns'
              }
          ]
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