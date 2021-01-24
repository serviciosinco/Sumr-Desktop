import { nativeImage } from 'electron';
import { DataGet, DataSet} from './store';
import electron from 'electron';
import path from 'path';
import open from 'open';
import GetGlobal from './globals';
import { GoToAccounts, LoadContent, Refresh, ClearCache, isMac, MWin_App } from './functions';
import i18n from '../../translations/i18n';

let appIcon = null
const { app , Menu } = electron
const Tray = electron.Tray


let i_dvlp = nativeImage.createFromPath( GetGlobal('main_icon_dvlp_refresh') )

export const setBar = (p={})=>{
	
	type tpGlosary = {
		[key in string | number]: string | number | object | any;
	};

	var m:tpGlosary = [];
	
	m[0] = { 
		label: 'Menu',
        submenu:  [
            {
                label: i18n('about_app'),
                click:()=>{ open('http://sumr.in/'); }
            }
		]};
		
		/*
		m[0].submenu[3] = { type: 'separator'};
		m[0].submenu[4] = { label: i18n('new_window'),
		   					accelerator:process.platform == 'darwin' ? 'Command+Shift+N' : 'Ctrl+Shift+N',
			  				click:()=>{ createWindow({ main:'ok' }); }
	    				  };
	    */				  
	    				  
    if(DataGet('menu_main_clients')=='ok'){
	   	
	    m[0].submenu[5] = { type: 'separator'};
	    m[0].submenu[6] = { label: i18n('client_list'),
		   					accelerator:process.platform == 'darwin' ? 'Command+Shift+A' : 'Ctrl+Shift+A',
			  				click:()=>{ LoadContent({ u:GoToAccounts() }) }
	    				  };
	
	}
	    
	    m[0].submenu[7] = { type: 'separator'};
	    m[0].submenu[8] = { label: i18n('close_app'),
			  				click:()=>{ app.quit(); }
	    				  };				  
	    
	    
    
    
     m[1] = {
	    label: i18n('label_edit'),
		submenu: [
	        { label: i18n('edit_undo'), accelerator: "CmdOrCtrl+Z", selector: "undo:" },
	        { label: i18n('edit_redo'), accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
	        { type: "separator" },
	        { label: i18n('edit_cut'), accelerator: "CmdOrCtrl+X", selector: "cut:" },
	        { label: i18n('edit_copy'), accelerator: "CmdOrCtrl+C", selector: "copy:" },
	        { label: i18n('edit_paste'), accelerator: "CmdOrCtrl+V", selector: "paste:" },
	        { label: i18n('edit_slall'), accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
		]};
    
     
    m[2] = {
        label: i18n('label_language'),
        submenu: [
            {
                label: 'Español',
                click:()=>{ DataSet('lng', 'es'); }
            }, 
            { type: 'separator' }, 
            {
                label: 'English',
                click:()=>{ DataSet('lng', 'en'); }
            }, 
            { type: 'separator' }, 
            {
                label: 'Français',
                click:()=>{ DataSet('lng', 'fr'); }
            }
        ]};   
	
	if(DataGet('menu_dvlp')=='ok'){
		
		m[3] = {
	        label: i18n('label_developer'),
	        id:'mn-developer',
	        enabled:true,
	        submenu: [
	            {
	                label:i18n('developer_refresh'),
	                icon:i_dvlp,
	                click:()=>{ Refresh(); }
	            },
	            { type: 'separator' }, 
	            {
	                label:i18n('delete_cache'),
	                click:()=>{ ClearCache(); }
	            },
	            { type: 'separator' }, 
	            {
		            type:'checkbox',
	                label:i18n('developer_showsv'),
	                checked:(DataGet('menu_dvlp_sv')=='ok'?true:false),
	                click:()=>{ 
		                
		                if(DataGet('menu_dvlp_sv') == 'ok'){
			                DataSet('menu_dvlp_sv', null); 
			            }else{
		                	DataSet('menu_dvlp_sv', 'ok'); 
		                }
		                
		                Refresh({ dvlp:'ok' });
		                setBar();
		                
		            }
	            }, 
	            
	            
	            { type: 'separator' }, 
	            {
		            type:'checkbox',
	                label:i18n('developer_test'),
	                checked:(DataGet('menu_dvlp_test')=='ok'?true:false),
	                click:()=>{ 
		                
		                if(DataGet('menu_dvlp_test') == 'ok'){
			                DataSet('menu_dvlp_test', null); 
			            }else{
		                	DataSet('menu_dvlp_test', 'ok'); 
		                }
		                
		                Refresh({ dvlp:'ok' });
		                setBar();
		                
		            }
	            }, 
	            
	            
	            { type: 'separator' }, 
	            {
	                label:i18n('developer_tools'),
	                submenu:[
	                {
		            	label:i18n('developer_tools_free'),
						click:()=>{ MWin_App.webContents.openDevTools({ mode:'detach' }) }    
	                },
	                {
		            	label:i18n('developer_tools_right'),
						click:()=>{ MWin_App.webContents.openDevTools({ mode:'right' }) }    
	                },
	                {
		            	label:i18n('developer_tools_left'),
						click:()=>{ MWin_App.webContents.openDevTools({ mode:'left' }) }    
	                }]
	            }
	        ]};
	}
		
	const menuTemplate:any = m;
	
	var menu = Menu.buildFromTemplate(menuTemplate);
	Menu.setApplicationMenu(menu);
	
	return true;

}


export const barIcn = ()=>{
	
	const iconName = !isMac() ? '../assets/icons/png/16x16.png' : '../assets/icons/png/16x16.png'
	const iconPath = path.join(__dirname, '../'+iconName)
	
	appIcon = new Tray(iconPath);

	const contextMenu = Menu.buildFromTemplate([{
    	label: i18n('delete_cache'),
		click: function(){ ClearCache(); }
  	}])
  	
  	appIcon.setToolTip('SUMR in the tray.')
  	appIcon.setContextMenu(contextMenu)
  	
  	if(isMac()){
  		app.dock.bounce( 'informational' )
  	}
	
};