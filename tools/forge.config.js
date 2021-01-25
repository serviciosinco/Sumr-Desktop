const path = require('path');
const fs = require('fs');
const AdmZip = require('adm-zip');

const { utils: { fromBuildIdentifier } } = require('@electron-forge/core');


if(process.env.IS_BETA){
  var envVersion = 'beta';
}else{
  var envVersion = 'prod';
}

const path_out = `./out/${envVersion}/`;

const pname = {
  assets:`${path_out}make/assets/`,
  path:{
    make:`${path_out}make/`,
    win:`${path_out}make/squirrel.windows/x64/SUMR-1.0.0 Setup.exe`,
    mac:`${path_out}make/SUMR-1.0.0.dmg`
  },
  zip:{
    win:`${path_out}SUMR_win_x64.zip`,
    mac:`${path_out}SUMR_mac_x64.zip`
  }
};

const DoZip = async (source, target)=>{

  if(source && target){

    await new Promise((resolve, reject) => {
        
      //var read = fs.createReadStream(source);
      //var write = fs.createWriteStream(target);
      //var stream = read.pipe(zip).pipe(write);

      try {
        const zip = new AdmZip();
        zip.addLocalFile(source);
        zip.writeZip(target);
        resolve();
      }catch(error){
        reject(err);
      }

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
          iconUrl: path.resolve(__dirname, `./../make/assets/icon.co`),
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
                path: path.resolve(__dirname, `./.${path_out}SUMR-darwin-x64/SUMR.app`)
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
          if(fs.existsSync(pname.zip.mac)){ 
            fs.rmdirSync(pname.zip.mac, { recursive:true });
          }
        }

        if(options.platform  && options.platform == 'win32'){
          if(fs.existsSync(pname.zip.win)){ fs.rmdirSync(pname.zip.win, { recursive:true }); }
        }

      },

      postMake: async(forgeConfig, options) => {

        if(fs.existsSync(pname.path.mac)){
          DoZip(pname.path.mac, pname.zip.mac)
          .then( ()=> {
            if(fs.existsSync(pname.zip.mac)){ 
             fs.rmdirSync(pname.path.make, { recursive:true }); 
             fs.rmdirSync(`${path_out}SUMR-darwin-x64/`, { recursive:true });
            }
          });
        }

        if(fs.existsSync(pname.path.win)){
          DoZip(pname.path.win, pname.zip.win)
          .then( ()=> { 
            if(fs.existsSync(pname.zip.win)){ 
              fs.rmdirSync(pname.path.make, { recursive:true });
              fs.rmdirSync(`${path_out}SUMR-win32-x64/`, { recursive:true }); 
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