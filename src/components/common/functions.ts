import electron from 'electron';
import { BrowserWindow } from 'electron';
import isDev from 'electron-is-dev';
import LocalSCut from 'electron-localshortcut';

import GetGlobal from './globals';
import { DataSet, DataGet } from './store';
import { setBar } from './menu';


type tpObject = {
    [key: string]: string|number|boolean|object
}

const session = { subdomain:'' };

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

var Mwin_Fail:boolean = false;
var Mwin_Try_Max:number = 0;
var Mwin_Try:number = 0;


export var MWin_Prev:any;
export var MWin_App:any;

const isDev_f = ()=>{
	return isDev;
}

if(isDev_f()){
	var log = require('electron-log');
	Mwin_Try_Max = 2;
}else{
	var log = null;
	Mwin_Try_Max = 5;
}


const isOnline = ()=>{
	
	if(MWin_App){
		var _o = MWin_App.webContents.send('_r_onl');
	}
	
	if(_o != false){
		return true;
	}else{
		return false;
	}		
	
}


export const isMac = ()=>{
	if(process.platform == 'darwin'){ return true; }else{ return false; }
}

export const createWindow_opt = (prev:boolean = false)=>{

	let data:tpObject = { 
		title:'SUMR',
		width:400, 
		height:500,
		frame:false,
		show:false,
		titleBarStyle:'hidden',
		backgroundColor: '#23243D',
		webPreferences: {
			contextIsolation: false,
			partition: "persist:main",
			nodeIntegration: true
		}
	};

	if(prev){ data.show = true; }
	if(!isMac()){ data.frame=true; }
	return data;

}


export const ShortCuts = ()=>{

	LocalSCut.register(MWin_App, 'Ctrl+0', () => {
		
		if(DataGet('menu_dvlp')=='ok'){
            DataSet('menu_dvlp', null); 
        }else{
        	DataSet('menu_dvlp', 'ok'); 
        }
		                
		setBar();
		
    });	

}

export const createWindow = (p:tpObject={})=>{	
	
	session.subdomain = DataGet('subdomain') ? DataGet('subdomain') : '';
	
	var _mreg = '', _url='', __op_prev = createWindow_opt(true), __op = createWindow_opt();

	if(DataGet('menu_dvlp_sv')=='ok'){ _mreg=_mreg+'&Sv=ok'; }
	
	if(!isN(session.subdomain) || (!isN(p) && !isN(p.main) && p.main == 'ok')){
		DataSet('menu_main_clients', 'ok');
		_url = 'https://'+session.subdomain+'.'+GetDomain()+'/?_dsktp=ok&__r='+Math.random()+_mreg;
	}else{
		DataSet('menu_main_clients', 'no');
		_url = GoToAccounts();
	}
	
	MWin_App = new BrowserWindow(__op);
	MWin_Prev = new BrowserWindow(__op_prev);

	//MWin_Prev.loadFile('index.html');
	MWin_Prev.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

	MWin_App.setTitle('SUMR');
	LoadContent({ u:_url });
	MWin_App.setMinimumSize(400, 500);

	if(!isMac()){
		MWin_App.setAutoHideMenuBar(true);
	}
  
	MWin_App.on('closed', function(){
        MWin_App = null;
    });

	MWin_App.on('resize', () => {
		let size = MWin_App.getSize();	
		DataSet('width', size[0]);
		DataSet('height', size[1]);
		DataSet('maximized', MWin_App.isMaximized());
	});

}

export const PreloadClose = ()=>{
	if(MWin_Prev){
		MWin_Prev.close();
	}
}

export const LoadContent = (p:{ u:string })=>{
	
	if(!isN(p) && !isN(p.u) && isOnline()){
		
		var webContents = MWin_App.webContents,
			_lurl = encodeURI( p.u );
	    
	    webContents.on('did-finish-load', ()=>{

	        LogShow('did-finish-load:'+p.u);
			DataSet('url_last', p.u);

			console.log(Mwin_Fail);
			console.log(Mwin_Try);

			if(!Mwin_Fail){

				RszeOn({ start:true, prev:true }); 

				setTimeout(()=>{
					PreloadClose();
					MWin_App.show();
				}, 100);
				
			}else{

				Mwin_Try++;
				Mwin_Fail = false;

				if(Mwin_Try < Mwin_Try_Max){
					setTimeout(()=>{
						MWin_App.loadURL(_lurl);
					}, 20000);
				}else{

					Mwin_Try=0;
					let code = `let body = document.body;
								body.classList.add('retry');`;
					
					MWin_Prev.webContents.executeJavaScript(code);

				}

			}

		}); 

		webContents.on('did-fail-load', (e:object, errorCode:number|string)=>{
			Mwin_Fail = true;
		}); 

		MWin_App.loadURL(_lurl);
		//MWin_App.show();
	
	}else{
		
		LogShow('No u var or not online');
		
	}
}

export const Refresh = (p:tpObject={})=>{
	
	if(!isN(p) && !isN(p.dvlp)){
		
		var _mreg = '';
		var url:string = DataGet('url_last');
		
		if(DataGet('menu_dvlp_sv')=='ok'){
			_mreg=_mreg+'&Sv=ok'; 
		}else{
			var url = url.replace('&Sv=ok', '');
		}
		
		
		if(DataGet('menu_dvlp_test') == 'ok'){
			var url_f = url.replace( GetGlobal('domain_production'), GetGlobal('domain_tester'));
		}else{
			var url_f = url.replace( GetGlobal('domain_tester'), GetGlobal('domain_production') );
		}
		
		LoadContent({ u:url_f+_mreg });
			
	}else{
		
		MWin_App.reload();
		
	}
}
	
export const ClearCache = ()=>{
	/*event.sender.send('tray-removed')*/	
	
	var ses = MWin_App.webContents.session;
	var vln = ses.getCacheSize(function(n:string|number){
		var cCheSze = n;
	});

	
	ses.clearCache(function(){
		Refresh();	
	});		
}

export const isN = (p:any)=>{ 
	try{
		if(p==undefined || p==null || p==''){ return true;}else{return false;} 
	}catch(err) {
		console.log(err.message);
	}
}

export const gotoAcc = (p:tpObject)=>{
	
	if(!isN(p)){		
		
		const ses = MWin_App.webContents.session;
		var _mreg:string = '' ;

		console.log(ses.getUserAgent());
		
		_mreg=_mreg+'&_dsktp=ok';
		
		DataSet('menu_main_clients', 'ok');
		if(DataGet('menu_dvlp_sv')=='ok'){ _mreg=_mreg+'&Sv=ok'; }
		
		LoadContent({ u:p.url+'?__r='+Math.random()+_mreg });
		
	}
}


export const RszeOn = (p:tpObject)=>{

	var _w:number = DataGet('width'),
		_h:number = DataGet('height'),
		_mx:boolean = DataGet('maximized'),
		_win:any = p.prev ? MWin_App:MWin_Prev;

	if(p && p.start){
		if(process.platform == 'darwin'){
			_h=800;
			_w=1200;
		}else{
			_h=500;
			_w=800;
		}
	}
	
	if(_w && _h){
		_win.setSize(_w, _h);
	}else{
		/*_win.maximize();*/	
	}
	
	if(_mx){
		_win.maximize();
	}
	
	if(!isN(p) && !isN(p.minH) && !isN(p.minW)){
		
		if(isN(_w) && isN(_h)){
			_win.setSize(p.minW, p.minH);
		}
		
		_win.setMinimumSize(p.minW, p.minH);
	}
	
	_win.center();
	_win.focus();

}

const GetDomain = ()=>{

	var dmn = '';

	if(DataGet('menu_dvlp_test')=='ok'){
		dmn = GetGlobal('domain_tester');
	}else{
		dmn = GetGlobal('domain_production');
	}	
	
	return dmn;
}

export const GoToAccounts = ()=>{
	let _u = 'https://account.'+GetDomain()+'/?_dsktp=ok&__r='+Math.random();
	return _u;	
}

export const LogShow = ( t: string | object )=>{
	if(isDev_f() && !isN(log)){
		log.info(t);
	}
}