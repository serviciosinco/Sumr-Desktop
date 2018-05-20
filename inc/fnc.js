var _g = require('./glbl');


const electron = require('electron')
const {app, BrowserWindow, globalShortcut} = electron


const Config = require('electron-config');
const config = new Config();
const _ses={};

var log = require('electron-log');



function __Onl(){
	
	var _o = win.webContents.send('_r_onl');
	
	if(_o != false){
		return true;
	}else{
		return false;
	}		
	
}


function isMac(){
	if(process.platform == 'darwin'){ return true; }else{ return false; }
}

function _createWindow(p){	
	
	_ses.subdomain = config.get('subdomain');
	
	var __op={ 
		title:'SUMR',
		width:400, 
		height:500, 
		show:false,
		titleBarStyle:'hidden',
		backgroundColor: '#23243D',
		webPreferences: {
			partition: "persist:main"
		}
	};
	
	if(isMac()){
		__op['frame']=false	
	}else{
		__op['frame']=false	
	}
	
	_mreg='';
	
	if(config.get('menu_dvlp_sv')=='ok'){ _mreg=_mreg+'&Sv=ok'; }
	
	if(!isN(_ses.subdomain) || (!isN(p) && !isN(p.main) && p.main == 'ok')){
		
		config.set('menu_main_clients', 'ok');
		_url = 'https://'+_ses.subdomain+'.'+_dmn()+'/?_dsktp=ok&__r='+Math.random()+_mreg;
		
	}else{
		config.set('menu_main_clients', 'no');
		_url = _cl_url();
	}
	
	win = new BrowserWindow(__op);
	win.setTitle('SUMR');
	_ldCnt({ u:_url });
	win.setMinimumSize(400, 500);
	win.show()
	
  
	win.on('closed', function(){
        win = null;
    });

	win.on('resize', () => {
		let size = win.getSize();	
		config.set('width', size[0]);
		config.set('height', size[1]);
		config.set('maximized', win.isMaximized());
	});

}

function _ldCnt(p){
	
	if(!isN(p) && !isN(p.u) && __Onl()){
		
		config.set('url_last', p.u);
		
	    var webContents = win.webContents;
	
	    webContents.on('did-start-loading', function() {
	        log.info('did-start-loading');
	    });
	    
	    webContents.on('did-stop-loading', function() {
	        log.info('did-stop-loading');
	    });
	    
	    webContents.on('did-finish-load', function() {
	        log.info('did-finish-load');
	    });
    
		win.loadURL(p.u);
	
	}
}


function _Rfrsh(p){
	
	if(!isN(p) && !isN(p.dvlp)){
		
		_mreg = '';
		url = config.get('url_last');
		
		
		if(config.get('menu_dvlp_sv')=='ok'){
			_mreg=_mreg+'&Sv=ok'; 
		}else{
			var url = url.replace('&Sv=ok', '');
		}
		
		
		if(config.get('menu_dvlp_test') == 'ok'){
			var url_f = url.replace(_g.domain_production, _g.domain_tester);
		}else{
			var url_f = url.replace(_g.domain_tester, _g.domain_production);
		}
		
		_ldCnt({ u:url_f+_mreg });
			
	}else{
		
		win.reload();
		
	}
}
	
function _Cche_clr(){
	/*event.sender.send('tray-removed')*/
	
	
	var ses = win.webContents.session;
	var vln = ses.getCacheSize(function(n){
		var cCheSze = n;
	});

	
	ses.clearCache(function(){
		_Rfrsh();	
	});		
}

function isN(p){ 
	try{
		if(p==undefined || p==null || p==''){ return true;}else{return false;} 
	}catch(err) {
		console.log(err.message);
	}
}

function _gotoAcc(p){
	
	if(!isN(p)){		
		
		const ses = win.webContents.session
		console.log(ses.getUserAgent())
  
		_mreg='';
		_mreg=_mreg+'&_dsktp=ok';
		
		config.set('menu_main_clients', 'ok');
		if(config.get('menu_dvlp_sv')=='ok'){ _mreg=_mreg+'&Sv=ok'; }
		
		_ldCnt({ u:p.url+'?__r='+Math.random()+_mreg });
		
	}
}


function _RszeOn(p){
	
	_w = config.get('width');
	_h = config.get('height');
	_mx = config.get('maximized');
	
	if(!isN(_w) && !isN(_h)){
		win.setSize(_w, _h);
	}else{
		/*win.maximize();*/	
	}
	
	if(_mx){
		win.maximize();
	}
	
	if(!isN(p) && !isN(p.minH) && !isN(p.minW)){
		
		if(isN(_w) && isN(_h)){
			
			win.setSize(p.minW, p.minH);
			
		}
		
		win.setMinimumSize(p.minW, p.minH);
	}
	
	win.center();
	win.focus();
}

function _dmn(){
	if(config.get('menu_dvlp_test')=='ok'){
		dmn = _g.domain_tester;
	}else{
		dmn = _g.domain_production;
	}	
	
	return dmn;
}

function _cl_url(){

	var _u = 'https://account.'+_dmn()+'/?_dsktp=ok&__r='+Math.random();
	
	return _u;	
}


exports._createWindow = _createWindow
exports._ldCnt = _ldCnt

exports._Rfrsh = _Rfrsh;
exports.isMac = isMac;
exports.isN = isN;
exports._Cche_clr = _Cche_clr;
exports._gotoAcc = _gotoAcc;
exports._RszeOn = _RszeOn;

exports._dmn = _dmn;
exports._cl_url = _cl_url;
