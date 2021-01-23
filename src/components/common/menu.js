const nativeImage = require('electron').nativeImage
const Config = require('electron-store');
const config = new Config();

let appIcon = null
var log = require('electron-log');

const electron = require('electron')
const {app, Menu, globalShortcut} = electron
const path = require('path')
const Tray = electron.Tray
const open = require('open');
const { GoToAccounts, LoadContent, Refresh, ClearCache, isMac } = require('./functions');
const { GetGlobal } = require('./globals');
var i18n = new(require('../../translations/i18n'));

let i_dvlp = nativeImage.createFromPath( GetGlobal('main_icon_dvlp_refresh') )

const setBar = (p)=>{
	
	var m = [];
	
	m[0] = { 
		label: 'Menu',
        submenu: [
            {
                label: i18n.__('about_app'),
                click:()=>{ open('http://sumr.in/'); }
            }
		]};
		
		/*
		m[0].submenu[3] = { type: 'separator'};
		m[0].submenu[4] = { label: i18n.__('new_window'),
		   					accelerator:process.platform == 'darwin' ? 'Command+Shift+N' : 'Ctrl+Shift+N',
			  				click:()=>{ createWindow({ main:'ok' }); }
	    				  };
	    */				  
	    				  
    if(config.get('menu_main_clients')=='ok'){
	   	
	    m[0].submenu[5] = { type: 'separator'};
	    m[0].submenu[6] = { label: i18n.__('client_list'),
		   					accelerator:process.platform == 'darwin' ? 'Command+Shift+A' : 'Ctrl+Shift+A',
			  				click:()=>{ LoadContent({ u:GoToAccounts() }) }
	    				  };
	
	}
	    
	    m[0].submenu[7] = { type: 'separator'};
	    m[0].submenu[8] = { label: i18n.__('close_app'),
			  				click:()=>{ app.quit(); }
	    				  };				  
	    
	    
    
    
     m[1] = {
	    label: i18n.__('label_edit'),
		submenu: [
	        { label: i18n.__('edit_undo'), accelerator: "CmdOrCtrl+Z", selector: "undo:" },
	        { label: i18n.__('edit_redo'), accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
	        { type: "separator" },
	        { label: i18n.__('edit_cut'), accelerator: "CmdOrCtrl+X", selector: "cut:" },
	        { label: i18n.__('edit_copy'), accelerator: "CmdOrCtrl+C", selector: "copy:" },
	        { label: i18n.__('edit_paste'), accelerator: "CmdOrCtrl+V", selector: "paste:" },
	        { label: i18n.__('edit_slall'), accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
		]};
    
     
    m[2] = {
        label: i18n.__('label_language'),
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
	        label: i18n.__('label_developer'),
	        id:'mn-developer',
	        enabled:true,
	        submenu: [
	            {
	                label:i18n.__('developer_refresh'),
	                icon:i_dvlp,
	                click:()=>{ Refresh(); }
	            },
	            { type: 'separator' }, 
	            {
	                label:i18n.__('delete_cache'),
	                click:()=>{ ClearCache(); }
	            },
	            { type: 'separator' }, 
	            {
		            type:'checkbox',
	                label:i18n.__('developer_showsv'),
	                checked:(config.get('menu_dvlp_sv')=='ok'?true:false),
	                click:()=>{ 
		                
		                if(config.get('menu_dvlp_sv') == 'ok'){
			                config.set('menu_dvlp_sv', null); 
			            }else{
		                	config.set('menu_dvlp_sv', 'ok'); 
		                }
		                
		                Refresh({ dvlp:'ok' });
		                setBar();
		                
		            }
	            }, 
	            
	            
	            { type: 'separator' }, 
	            {
		            type:'checkbox',
	                label:i18n.__('developer_test'),
	                checked:(config.get('menu_dvlp_test')=='ok'?true:false),
	                click:()=>{ 
		                
		                if(config.get('menu_dvlp_test') == 'ok'){
			                config.set('menu_dvlp_test', null); 
			            }else{
		                	config.set('menu_dvlp_test', 'ok'); 
		                }
		                
		                Refresh({ dvlp:'ok' });
		                setBar();
		                
		            }
	            }, 
	            
	            
	            { type: 'separator' }, 
	            {
	                label:i18n.__('developer_tools'),
	                submenu:[
	                {
		            	label:i18n.__('developer_tools_free'),
						click:()=>{ mWin.webContents.openDevTools({ mode:'detach' }) }    
	                },
	                {
		            	label:i18n.__('developer_tools_right'),
						click:()=>{ mWin.webContents.openDevTools({ mode:'right' }) }    
	                },
	                {
		            	label:i18n.__('developer_tools_left'),
						click:()=>{ mWin.webContents.openDevTools({ mode:'left' }) }    
	                }]
	            }
	        ]};
	}
		
	const menuTemplate = m;
	
	var menu = Menu.buildFromTemplate(menuTemplate)
	Menu.setApplicationMenu(menu)
	
	return true;

}


const barIcn = ()=>{
	
	const iconName = !isMac() ? '../assets/icons/png/16x16.png' : '../assets/icons/png/16x16.png'
	const iconPath = path.join(__dirname, '../'+iconName)
	
	appIcon = new Tray(iconPath)
	const contextMenu = Menu.buildFromTemplate([{
    	label: i18n.__('delete_cache'),
		click: function(){ ClearCache(); }
  	}])
  	
  	appIcon.setToolTip('SUMR in the tray.')
  	appIcon.setContextMenu(contextMenu)
  	
  	if(isMac()){
  		app.dock.bounce( 'informational' )
  	}
	
};


module.exports = {
    setBar,
    barIcn,
};