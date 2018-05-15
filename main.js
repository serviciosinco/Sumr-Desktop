var menu = require('./inc/menu');
var _f = require('./inc/fnc');
var _g = require('./inc/glbl');
var log = require('electron-log');


const electron = require('electron')
const LocalSCut = require('electron-localshortcut');


const Config = require('electron-config');

const config = new Config();


const {app, BrowserWindow, globalShortcut} = electron
const _eGet = electron.ipcMain
const _eSnd = electron.ipcRenderer;


const path = require('path')
const url = require('url')
const _ses={};
 

function _ShortCuts(){

	LocalSCut.register(win, 'Ctrl+0', () => {
		
		if(config.get('menu_dvlp')=='ok'){
            config.set('menu_dvlp', null); 
        }else{
        	config.set('menu_dvlp', 'ok'); 
        }
		                
        menu._setBar();
    });	

}
  


_eGet.on('_rSze', function(e, a) {   
	
	_f._RszeOn({ minH:800, minW:1200 }); 
	
	_ses.clients = config.get('clients');
	_ses.user = config.get('user');
	_ses.account = config.get('account');
	_ses.subdomain = config.get('subdomain');
	
	if(!_f.isN(_ses.clients) && !_f.isN(_ses.user)){ 
		win.webContents.send('_r_set',{ 
			cl:_ses.clients, 
			us:_ses.user,
			acc:_ses.account, 
			sbd:_ses.subdomain
		});
	}
		
});




_eGet.on('_m_set', function(e, a) {   
	config.set(a.g, a.v);
});

_eGet.on('_m_clr', function(e, a) { 	  
	config.set('clients', null);
	config.set('user', null);
	config.set('account', null);
	config.set('subdomain', null);
	
	win.webContents.send(a.cl);
});

_eGet.on('_m_bdgtot', function(e, a) {  
	app.setBadgeCount(a.tot);
});


_eGet.on('_shw_cl', function(e, a) {  
	_f._gotoAcc({ url:a.url });
});


  
app.on('ready',()=>{
  	
  	const session = require('electron').session;

	menu._setBar();
	menu._barIcn();
	
	_f._createWindow();
	_ShortCuts();
    
});

app.on('will-quit', function(){ 
	if (process.platform != 'darwin'){ app.quit(); }
});

app.on("window-all-closed", function(){ 
    if(process.platform == "darwin"){
        app.quit();
    }
});




module.exports = {
	electronPackagerConfig: {
    	icon: path.resolve(__dirname, '/build/icon.icns')
	}
}