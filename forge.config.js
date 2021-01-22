const path = require('path');
const fs = require('fs');
const WebpackPlugin = require('@electron-forge/plugin-webpack').default;

module.exports = {
    packagerConfig: {
      icon: './build/osx/icon.icns'
    },
    makers: [
      {
        name: '@electron-forge/maker-squirrel',
        config: {
          name: 'SUMR',
          setupIcon: './build/win/icon.ico',
          //iconUrl: 'icon.ico',
          loadingGif: './build/win/installer.gif'
        }
      },
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
      },
      postMake: async(forgeConfig, options) => {
                
        if(fs.existsSync('./out/make/SUMR-1.0.0.dmg')){
          fs.rename('./out/make/SUMR-1.0.0.dmg', './dist/SUMR.dmg', (e)=>{
              console.log(e);
          });
        }else{
          console.log('Not exists dmg');
        }

        if(fs.existsSync('./out/make/squirrel.windows/x64/SUMR-1.0.0 Setup.exe')){
          fs.rename('./out/make/squirrel.windows/x64/SUMR-1.0.0 Setup.exe', './dist/SUMR_x64.exe', (e)=>{
              if(!e){
                  fs.rmdirSync('./out/make/', { recursive:true });
              }else{
                  console.log(e);
              }
          });
        }else{
          console.log('Not exists .exe');
        }

        fs.rmdirSync('./out/', { recursive:true });

      }
    }
  }