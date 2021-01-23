var log = require('electron-log');
const electron = require('electron')
const LocalSCut = require('electron-localshortcut');
const Config = require('electron-store');
const config = new Config();
const {app, BrowserWindow, globalShortcut} = electron;
const _eGet = electron.ipcMain
const _eSnd = electron.ipcRenderer;
const path = require('path')
const url = require('url')
const { setBar, barIcn } = require('./components/common/menu');
const { isN, isMac, RszeOn, createWindow } = require('./components/common/functions');
const _ses={};
 

if(require('electron-squirrel-startup')){
	app.quit();
}

const ShortCuts = ()=>{

	LocalSCut.register(mWin, 'Ctrl+0', () => {
		
		if(config.get('menu_dvlp')=='ok'){
            config.set('menu_dvlp', null); 
        }else{
        	config.set('menu_dvlp', 'ok'); 
        }
		                
        setBar();
    });	

}
  


_eGet.on('_rSze', function(e, a) {   
	
	if(process.platform == 'darwin'){
		RszeOn({ minH:800, minW:1200 }); 
	}else{
		RszeOn({ minH:500, minW:800 });
	}
	
	_ses.clients = config.get('clients'); 
	_ses.user = config.get('user');
	_ses.account = config.get('account');
	_ses.subdomain = config.get('subdomain');
	
	if(!isN(_ses.clients) && !isN(_ses.user)){
		
		mWin.webContents.send('_r_set',{ 
			cl:_ses.clients, 
			us:_ses.user,
			acc:_ses.account, 
			sbd:_ses.subdomain
		});
		
	}

});




_eGet.on('_m_set', function(e, a) { 
	log.info(a.g+' -> '+a.v);  
	config.set(a.g, a.v);
});

_eGet.on('_m_clr', function(e, a) { 	  
	config.set('clients', null);
	config.set('user', null);
	config.set('account', null);
	config.set('subdomain', null);
	
	mWin.webContents.send(a.cl);
});

_eGet.on('_m_bdgtot', function(e, a) {  
	app.setBadgeCount(a.tot);
});


_eGet.on('_shw_cl', function(e, a) {  
	gotoAcc({ url:a.url });
});


  
app.on('ready',()=>{
  	
  	const session = require('electron').session;

	createWindow();
	ShortCuts();
	
	//if(isMac()){
		setBar();
		barIcn();
	//}
    
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