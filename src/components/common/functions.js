const electron = require('electron')
const {app, BrowserWindow, globalShortcut} = electron
const Config = require('electron-store');
const config = new Config();
const { GetGlobal } = require('./globals');
const _ses={};

mWin = null;
var log = require('electron-log');

const isOnline = ()=>{
	
	if(mWin){
		var _o = mWin.webContents.send('_r_onl');
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

const createWindow = (p)=>{	
	
	_ses.subdomain = config.get('subdomain');
	
	var _mreg='',_url='';
	var __op={ 
		title:'SUMR',
		width:400, 
		height:500, 
		show:false,
		frame:false,
		titleBarStyle:'hidden',
		backgroundColor: '#23243D',
		webPreferences: {
			contextIsolation: false,
			partition: "persist:main",
			nodeIntegration: true
		}
	};
	
	if(!isMac()){
		__op.frame=true;
	}

	if(config.get('menu_dvlp_sv')=='ok'){ _mreg=_mreg+'&Sv=ok'; }
	
	if(!isN(_ses.subdomain) || (!isN(p) && !isN(p.main) && p.main == 'ok')){
		
		config.set('menu_main_clients', 'ok');
		_url = 'https://'+_ses.subdomain+'.'+GetDomain()+'/?_dsktp=ok&__r='+Math.random()+_mreg;
		
	}else{
		config.set('menu_main_clients', 'no');
		_url = GoToAccounts();
	}
	
	mWin = new BrowserWindow(__op);

	mWin.setTitle('SUMR');
	LoadContent({ u:_url });
	mWin.setMinimumSize(400, 500);

	if(!isMac()){
		mWin.setAutoHideMenuBar(true);
	}

	//mWin.show();
	
  
	mWin.on('closed', function(){
        mWin = null;
    });

	mWin.on('resize', () => {
		let size = mWin.getSize();	
		config.set('width', size[0]);
		config.set('height', size[1]);
		config.set('maximized', mWin.isMaximized());
	});

}

const LoadContent = (p)=>{
	
	if(!isN(p) && !isN(p.u) && isOnline()){
		
		
		
	    var webContents = mWin.webContents;
		
		/*
	    webContents.on('did-start-loading', function() {
	        log.info('did-start-loading:'+p.u);
	    });
	    
	    
	    webContents.on('did-stop-loading', function(e, status, newUrl) {
		    log.info(e);
			log.info(status);
	        log.info('did-stop-loading:'+p.u);
	    });
	    */
	    
	    webContents.on('did-finish-load', function(e, status, newUrl) {
	        log.info(status);
	        log.info('did-finish-load:'+p.u);
	        config.set('url_last', p.u);
	    }); 
		
		webContents.on('ready-to-show', () => {
			mWin.show()  
		});

		_lurl = encodeURI(p.u);
		
		mWin.loadURL(_lurl);
		//mWin.show();
	
	}else{
		
		log.info('No u var or not online');
		
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
		
		mWin.reload();
		
	}
}
	
const ClearCache = ()=>{
	/*event.sender.send('tray-removed')*/	
	
	var ses = mWin.webContents.session;
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
		
		const ses = mWin.webContents.session
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
	
	if(!isN(_w) && !isN(_h)){
		mWin.setSize(_w, _h);
	}else{
		/*mWin.maximize();*/	
	}
	
	if(_mx){
		mWin.maximize();
	}
	
	if(!isN(p) && !isN(p.minH) && !isN(p.minW)){
		
		if(isN(_w) && isN(_h)){
			
			mWin.setSize(p.minW, p.minH);
			
		}
		
		mWin.setMinimumSize(p.minW, p.minH);
	}
	
	mWin.center();
	mWin.focus();
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

module.exports = {
    createWindow,
	LoadContent,
	Refresh,
	isMac,
	isN,
	ClearCache,
	gotoAcc,
	RszeOn,
	GoToAccounts
};