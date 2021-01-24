const path = require('path');
const fs = require('fs');
const zlib = require('zlib');
const zip = zlib.createGzip();
const { utils: { fromBuildIdentifier } } = require('@electron-forge/core');


if(process.env.IS_BETA){
  var envVersion = 'beta';
}else{
  var envVersion = 'prod';
}

const pname = {
  assets:`./out/${envVersion}/make/assets/`,
  path:{
    win:`./out/${envVersion}/make/squirrel.windows/x64/SUMR-1.0.0 Setup.exe`,
    mac:`./out/${envVersion}/make/SUMR-1.0.0.dmg`
  },
  dist:{
    win:`./out/${envVersion}/SUMR_win_x64.exe.zip`,
    mac:`./out/${envVersion}/SUMR_mac_x64.dmg.zip`
  }
};
//const WebpackPlugin = require('@electron-forge/plugin-webpack').default;

const DoZip = async (source, target)=>{

  if(source && target){

    await new Promise((resolve, reject) => {
        
      var read = fs.createReadStream(source);
      var write = fs.createWriteStream(target);
      var stream = read.pipe(zip).pipe(write);

      stream.on('error', (err) => {
          reject(err);
      });

      stream.on('finish', ()=>{
        resolve();
      });

    });

  }
  
}

module.exports = {
    buildIdentifier: envVersion,
    packagerConfig: {
      appBundleId: fromBuildIdentifier({ beta: 'com.sumr-beta.desktop', prod: 'com.sumr.desktop' }),
      icon: `${pname.assets}icon.icns`,
      prune: true,
      junk: true,
      overwrite:true,
      /*ignore:[
        'assets/',
        'build/', 
        'forge.config.js',
        '.nvmrc',
        '.gitignore',
        'README.md'
      ]*/
    },
    makers: [
      {
        name: '@electron-forge/maker-squirrel',
        config: {
          name: 'SUMR',
          setupIcon: `${pname.assets}icon.ico`,
          //iconUrl: 'icon.ico',
          loadingGif: `${pname.assets}installer.gif`
        }
      },
      {
        name: '@electron-forge/maker-dmg',
        config: {
          icon: `${pname.assets}icon.icns`,
          background: `${pname.assets}background.png`,
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
                path: path.resolve(__dirname, `./../out/${envVersion}/SUMR-darwin-x64/SUMR.app`)
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

      generateAssets: async () => {

        if (!fs.existsSync( pname.assets )) {
          fs.mkdirSync( pname.assets , {
            recursive: true
          });
        }

        if(process.platform == 'darwin'){
          fs.copyFile('./build/osx/icon.icns', `${pname.assets}icon.icns`, (err)=>{});
          fs.copyFile('./build/osx/background.png', `${pname.assets}background.png`, (err)=>{});
        }

        if(process.platform == 'win32'){
          fs.copyFile('./build/win/icon.ico', `${pname.assets}icon.ico`, (err)=>{});
          fs.copyFile('./build/win/installer.gif', `${pname.assets}installer.gif`, (err)=>{});
        }

      },
      postPackage: async (forgeConfig, options) => {

        if(options.spinner){
          options.spinner.info(`Completed packaging for ${options.platform} / ${options.arch} at ${options.outputPaths[0]}`);
        }
        
        if(options.platform && options.platform == 'darwin'){
          if(fs.existsSync(pname.dist.mac)){ 
            fs.rmdirSync(pname.dist.mac, { recursive:true });
          }
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
             fs.rmdirSync(`./out/${envVersion}/make/`, { recursive:true }); 
             fs.rmdirSync(`./out/${envVersion}/SUMR-darwin-x64/`, { recursive:true }); 
            }
          });
        }

        if(fs.existsSync(pname.path.win)){
          DoZip(pname.path.win, pname.dist.win)
          .then( ()=> { 
            if(fs.existsSync(pname.dist.win)){ 
              fs.rmdirSync(`./out/${envVersion}/make/`, { recursive:true });
              fs.rmdirSync(`./out/${envVersion}/SUMR-win32-x64/`, { recursive:true }); 
            }
          });
        }

      }

    },

    
    plugins: [
      ['@electron-forge/plugin-webpack', {
        mainConfig: './tools/main/webpack.config.js',
        renderer: {
          config: './tools/render/webpack.config.js',
          entryPoints: [{
            html: './src/index.html',
            js: './src/renderer.ts',
            name: 'main_window'
          }]
        }
      }]
    ]

  }