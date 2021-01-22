const path = require('path');
const fs = require('fs');
const zlib = require('zlib');
const zip = zlib.createGzip();
const pname = {
  path:{
    win:'./out/make/squirrel.windows/x64/SUMR-1.0.0 Setup.exe',
    mac:'./out/make/SUMR-1.0.0.dmg'
  },
  dist:{
    win:'./dist/SUMR_win_x64.exe.gz',
    mac:'./dist/SUMR_mac_x64.dmg.gz'
  }
};
//const WebpackPlugin = require('@electron-forge/plugin-webpack').default;

const DoZip = async (source, target)=>{

  if(source && target){

    await new Promise((resolve, reject) => {
        
      var read = fs.createReadStream(source);
      var write = fs.createWriteStream(target);
      var stream = read.pipe(zip).pipe(write);	

      stream.on("error", (err) => {
          reject(err);
      });

      stream.on('finish', ()=>{
        resolve();
      });

    });

  }
  
}

module.exports = {
    packagerConfig: {
      icon: './build/osx/icon.icns',
      prune: true,
      junk: true,
      overwrite:true,
      ignore:[
        'dist/',
        //'assets/',
        'build/',
        //'forge.config.js',
        '.nvmrc',
        '.gitignore',
        //'package.json',
        'README.md'
      ]
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

        if(options.spinner){
          options.spinner.info(`Completed packaging for ${options.platform} / ${options.arch} at ${options.outputPaths[0]}`);
        }
        
        if(options.platform && options.platform == 'darwin'){
          if(fs.existsSync(pname.dist.mac)){ fs.rmdirSync(pname.dist.mac, { recursive:true }); }
        }

        if(options.platform  && options.platform == 'win32'){
          if(fs.existsSync(pname.dist.win)){ fs.rmdirSync(pname.dist.win, { recursive:true }); }
        }

      },

      postMake: async(forgeConfig, options) => {

        if(fs.existsSync(pname.path.mac)){
          DoZip(pname.path.mac, pname.dist.mac)
          .then( ()=> { 
            if(fs.existsSync(pname.dist.mac)){ 
              fs.rmdirSync('./out/', { recursive:true }); 
            }
          });
        }

        if(fs.existsSync(pname.path.win)){
          DoZip(pname.path.win, pname.dist.win)
          .then( ()=> { 
            if(fs.existsSync(pname.dist.win)){ 
              fs.rmdirSync('./out/', { recursive:true }); 
            }
          });
        }

      }

    },

    /*plugins: [
      ['@electron-forge/plugin-auto-unpack-natives']
    ]*/

  }