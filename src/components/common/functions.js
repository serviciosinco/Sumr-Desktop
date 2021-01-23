const electron = require('electron')
const { BrowserWindow } = electron
const Config = require('electron-store');
const isDev = require('electron-is-dev');
const config = new Config();
const { GetGlobal } = require('./globals');
const _ses={};

MWin_Prev = null;
MWin_App = null;

const isDev_f = ()=>{
	return isDev;
}

if(isDev_f()){
	var log = require('electron-log');
}else{
	var log = null;
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


const isMac = ()=>{
	if(process.platform == 'darwin'){ return true; }else{ return false; }
}

const createWindow_opt = (prev)=>{

	let data  = { 
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

const createWindow = (p)=>{	
	
	_ses.subdomain = config.get('subdomain');
	
	var _mreg = '', _url='', __op_prev = createWindow_opt(true), __op = createWindow_opt();

	if(config.get('menu_dvlp_sv')=='ok'){ _mreg=_mreg+'&Sv=ok'; }
	
	if(!isN(_ses.subdomain) || (!isN(p) && !isN(p.main) && p.main == 'ok')){
		config.set('menu_main_clients', 'ok');
		_url = 'https://'+_ses.subdomain+'.'+GetDomain()+'/?_dsktp=ok&__r='+Math.random()+_mreg;
	}else{
		config.set('menu_main_clients', 'no');
		_url = GoToAccounts();
	}
	
	MWin_App = new BrowserWindow(__op);
	MWin_Prev = new BrowserWindow(__op_prev);

	MWin_Prev.loadFile('index.html');

	MWin_App.setTitle('SUMR');
	LoadContent({ u:_url });
	MWin_App.setMinimumSize(400, 500);

	if(!isMac()){
		MWin_App.setAutoHideMenuBar(true);
	}

	//MWin_App.show();
  
	MWin_App.on('closed', function(){
        MWin_App = null;
    });

	MWin_App.on('resize', () => {
		let size = MWin_App.getSize();	
		config.set('width', size[0]);
		config.set('height', size[1]);
		config.set('maximized', MWin_App.isMaximized());
	});

}

const LoadContent = (p)=>{
	
	if(!isN(p) && !isN(p.u) && isOnline()){
		
	    var webContents = MWin_App.webContents;
	    
	    webContents.on('did-finish-load', function(e, status, newUrl) {
	        LogShow(status);
	        LogShow('did-finish-load:'+p.u);
			config.set('url_last', p.u);
			
			RszeOn({ start:true, prev:true }); 

			setTimeout(()=>{
				MWin_Prev.close();
				MWin_App.show();
			}, 100);
			
	    }); 

		_lurl = encodeURI(p.u);
		
		MWin_App.loadURL(_lurl);
		//MWin_App.show();
	
	}else{
		
		LogShow('No u var or not online');
		
	}
}


const Refresh = (p)=>{
	
	if(!isN(p) && !isN(p.dvlp)){
		
		_mreg = '';
		url = config.get('url_last');
		
		
		if(config.get('menu_dvlp_sv')=='ok'){
			_mreg=_mreg+'&Sv=ok'; 
		}else{
			var url = url.replace('&Sv=ok', '');
		}
		
		
		if(config.get('menu_dvlp_test') == 'ok'){
			var url_f = url.replace( GetGlobal('domain_production'), GetGlobal('domain_tester'));
		}else{
			var url_f = url.replace( GetGlobal('domain_tester'), GetGlobal('domain_production') );
		}
		
		LoadContent({ u:url_f+_mreg });
			
	}else{
		
		MWin_App.reload();
		
	}
}
	
const ClearCache = ()=>{
	/*event.sender.send('tray-removed')*/	
	
	var ses = MWin_App.webContents.session;
	var vln = ses.getCacheSize(function(n){
		var cCheSze = n;
	});

	
	ses.clearCache(function(){
		Refresh();	
	});		
}

const isN = (p)=>{ 
	try{
		if(p==undefined || p==null || p==''){ return true;}else{return false;} 
	}catch(err) {
		console.log(err.message);
	}
}

const gotoAcc = (p)=>{
	
	if(!isN(p)){		
		
		const ses = MWin_App.webContents.session
		console.log(ses.getUserAgent())
  
		_mreg='';
		_mreg=_mreg+'&_dsktp=ok';
		
		config.set('menu_main_clients', 'ok');
		if(config.get('menu_dvlp_sv')=='ok'){ _mreg=_mreg+'&Sv=ok'; }
		
		LoadContent({ u:p.url+'?__r='+Math.random()+_mreg });
		
	}
}


const RszeOn = (p)=>{

	_w = config.get('width');
	_h = config.get('height');
	_mx = config.get('maximized');
	_win = p.prev ? MWin_App:MWin_Prev;

	if(p && p.start){
		if(process.platform == 'darwin'){
			_h=800;
			_w=1200;
		}else{
			_h=500;
			_w=800;
		}
	}
	
	if(!isN(_w) && !isN(_h)){
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

	if(config.get('menu_dvlp_test')=='ok'){
		dmn = GetGlobal('domain_tester');
	}else{
		dmn = GetGlobal('domain_production');
	}	
	
	return dmn;
}

const GoToAccounts = ()=>{
	let _u = 'https://account.'+GetDomain()+'/?_dsktp=ok&__r='+Math.random();
	return _u;	
}

const LogShow = (t)=>{
	if(isDev_f() && !isN(log)){
		log.info(t);
	}
}

module.exports = {
    createWindow,
	LoadContent,
	Refresh,
	isMac,
	isN,
	ClearCache,
	gotoAcc,
	RszeOn,
	GoToAccounts,
	LogShow
};