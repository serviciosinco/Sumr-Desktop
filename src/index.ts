import electron from 'electron';
import { StoreStart, DataGet, DataSet} from './components/common/store';
import { setBar, barIcn } from './components/common/menu';
import path from 'path';
import { isN, RszeOn, createWindow, LogShow, PreloadClose, ShortCuts, MWin_App, gotoAcc } from './components/common/functions';
const { app } = electron;

if(require('electron-squirrel-startup')){ app.quit(); }
StoreStart();

const _eGet = electron.ipcMain;
const _eSnd = electron.ipcRenderer;
const _ses:{ [key: string]: string } = {};

_eGet.on('_rSze', function(e, a){
	
	RszeOn({ start:true });
	
	_ses.clients = DataGet('clients'); 
	_ses.user = DataGet('user');
	_ses.account = DataGet('account');
	_ses.subdomain = DataGet('subdomain');
	
	if(!isN(_ses.clients) && !isN(_ses.user)){
		
		MWin_App.webContents.send('_r_set',{ 
			cl:_ses.clients, 
			us:_ses.user,
			acc:_ses.account, 
			sbd:_ses.subdomain
		});
		
	}

});

_eGet.on('_m_set', function(e, a) { 
	LogShow(a.g+' -> '+a.v);  
	DataSet(a.g, a.v);
});

_eGet.on('_m_clr', function(e, a) { 	  
	DataSet('clients', null);
	DataSet('user', null);
	DataSet('account', null);
	DataSet('subdomain', null);
	
	MWin_App.webContents.send(a.cl);
});

_eGet.on('_m_bdgtot', function(e, a) {  
	app.setBadgeCount(a.tot);
});


_eGet.on('_shw_cl', function(e, a) {  
	gotoAcc({ url:a.url });
});


_eGet.on('_rTry', function(e, a){
	PreloadClose();
	createWindow();
});

  
app.on('ready',()=>{
  	
  	const { session } = electron;

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
    if(process.platform != "darwin"){
        app.quit();
    }
});





module.exports = {
	electronPackagerConfig: {
    	icon: path.resolve(__dirname, '/build/icon.icns')
	}
}


process.on('uncaughtException', (err) => {
	console.log(err);
});