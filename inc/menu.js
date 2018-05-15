var _f = require('./fnc');
var _g = require('./glbl');
var _t = require('./lng/es');

const nativeImage = require('electron').nativeImage
const Config = require('electron-config');
const config = new Config();
let appIcon = null

const electron = require('electron')
const {app, Menu, globalShortcut} = electron
const path = require('path')
const Tray = electron.Tray
const open = require('open');

let i_dvlp = nativeImage.createFromPath(_g.main_icon_dvlp_refresh)




function _setBar(p){
	
	
	var m = [];
	
	m[0] = { 
		label: 'Menu',
        submenu: [
            {
                label: _t.about_app,
                click:()=>{ open('http://sumr.in/'); }
            }
		]};
		
		/*
		m[0].submenu[3] = { type: 'separator'};
		m[0].submenu[4] = { label: _t.new_window,
		   					accelerator:process.platform == 'darwin' ? 'Command+Shift+N' : 'Ctrl+Shift+N',
			  				click:()=>{ _f._createWindow({ main:'ok' }); }
	    				  };
	    */				  
	    				  
    if(config.get('menu_main_clients')=='ok'){
	   	
	    m[0].submenu[5] = { type: 'separator'};
	    m[0].submenu[6] = { label: _t.client_list,
		   					accelerator:process.platform == 'darwin' ? 'Command+Shift+A' : 'Ctrl+Shift+A',
			  				click:()=>{ _f._ldCnt({ u:_f._cl_url() }) }
	    				  };
	
	}
	    
	    m[0].submenu[7] = { type: 'separator'};
	    m[0].submenu[8] = { label: _t.close_app,
			  				click:()=>{ app.quit(); }
	    				  };				  
	    
	    
    
    
     m[1] = {
	    label: _t.label_edit,
		submenu: [
	        { label: _t.edit_undo, accelerator: "CmdOrCtrl+Z", selector: "undo:" },
	        { label: _t.edit_redo, accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
	        { type: "separator" },
	        { label: _t.edit_cut, accelerator: "CmdOrCtrl+X", selector: "cut:" },
	        { label: _t.edit_copy, accelerator: "CmdOrCtrl+C", selector: "copy:" },
	        { label: _t.edit_paste, accelerator: "CmdOrCtrl+V", selector: "paste:" },
	        { label: _t.edit_slall, accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
		]};
    
     
    m[2] = {
        label: _t.label_language,
        submenu: [
            {
                label: 'Español',
                click:()=>{ config.set('lng', 'es'); }
            }, 
            { type: 'separator' }, 
            {
                label: 'English',
                click:()=>{ config.set('lng', 'en'); }
            }, 
            { type: 'separator' }, 
            {
                label: 'Français',
                click:()=>{ config.set('lng', 'fr'); }
            }
        ]};   
	
	if(config.get('menu_dvlp')=='ok'){
		
		m[3] = {
	        label: _t.label_developer,
	        id:'mn-developer',
	        enabled:true,
	        submenu: [
	            {
	                label:_t.developer_refresh,
	                icon:i_dvlp,
	                click:()=>{ _f._Rfrsh(); }
	            },
	            { type: 'separator' }, 
	            {
	                label:_t.delete_cache,
	                click:()=>{ _f._Cche_clr(); }
	            },
	            { type: 'separator' }, 
	            {
		            type:'checkbox',
	                label:_t.developer_showsv,
	                checked:(config.get('menu_dvlp_sv')=='ok'?true:false),
	                click:()=>{ 
		                
		                if(config.get('menu_dvlp_sv') == 'ok'){
			                config.set('menu_dvlp_sv', null); 
			            }else{
		                	config.set('menu_dvlp_sv', 'ok'); 
		                }
		                
		                _f._Rfrsh({ dvlp:'ok' });
		                _setBar();
		                
		            }
	            }, 
	            
	            
	            { type: 'separator' }, 
	            {
		            type:'checkbox',
	                label:_t.developer_test,
	                checked:(config.get('menu_dvlp_test')=='ok'?true:false),
	                click:()=>{ 
		                
		                if(config.get('menu_dvlp_test') == 'ok'){
			                config.set('menu_dvlp_test', null); 
			            }else{
		                	config.set('menu_dvlp_test', 'ok'); 
		                }
		                
		                _f._Rfrsh({ dvlp:'ok' });
		                _setBar();
		                
		            }
	            }, 
	            
	            
	            { type: 'separator' }, 
	            {
	                label:_t.developer_tools,
	                submenu:[
	                {
		            	label:_t.developer_tools_free,
						click:()=>{ win.webContents.openDevTools({ mode:'detach' }) }    
	                },
	                {
		            	label:_t.developer_tools_right,
						click:()=>{ win.webContents.openDevTools({ mode:'right' }) }    
	                },
	                {
		            	label:_t.developer_tools_left,
						click:()=>{ win.webContents.openDevTools({ mode:'left' }) }    
	                }]
	            }
	        ]};
	}
		
	const menuTemplate = m;
	
	var menu = Menu.buildFromTemplate(menuTemplate)
	Menu.setApplicationMenu(menu)
	
	
	
}


function _barIcn(){
	
	const iconName = !_f.isMac() ? 'assets/icons/png/16x16.png' : 'assets/icons/png/16x16.png'
	const iconPath = path.join(__dirname, '../'+iconName)
	
	appIcon = new Tray(iconPath)
	const contextMenu = Menu.buildFromTemplate([{
    	label: _t.delete_cache,
		click: function(){ _f._Cche_clr(); }
  	}])
  	
  	appIcon.setToolTip('SUMR in the tray.')
  	appIcon.setContextMenu(contextMenu)
  	
  	if(_f.isMac()){
  		app.dock.bounce( 'informational' )
  	}
	
}


exports._setBar = _setBar;
exports._barIcn = _barIcn;