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
	
	const isMac = process.platform === 'darwin'

	const template = [
	// { role: 'appMenu' }
	...(isMac ? [{
		label: app.name,
		submenu: [
		{ role: 'about' },
		{ type: 'separator' },
		{ role: 'services' },
		{ type: 'separator' },
		{ role: 'hide' },
		{ role: 'hideothers' },
		{ role: 'unhide' },
		{ type: 'separator' },
		{ role: 'quit' }
		]
	}] : []),
	// { role: 'fileMenu' }
	{
		label: 'File',
		submenu: [
		isMac ? { role: 'close' } : { role: 'quit' }
		]
	},
	// { role: 'editMenu' }
	{
		label: 'Edit',
		submenu: [
		{ role: 'undo' },
		{ role: 'redo' },
		{ type: 'separator' },
		{ role: 'cut' },
		{ role: 'copy' },
		{ role: 'paste' },
		...(isMac ? [
			{ role: 'pasteAndMatchStyle' },
			{ role: 'delete' },
			{ role: 'selectAll' },
			{ type: 'separator' },
			{
			label: 'Speech',
			submenu: [
				{ role: 'startSpeaking' },
				{ role: 'stopSpeaking' }
			]
			}
		] : [
			{ role: 'delete' },
			{ type: 'separator' },
			{ role: 'selectAll' }
		])
		]
	},
	// { role: 'viewMenu' }
	{
		label: 'View',
		submenu: [
		{ role: 'reload' },
		{ role: 'forceReload' },
		{ role: 'toggleDevTools' },
		{ type: 'separator' },
		{ role: 'resetZoom' },
		{ role: 'zoomIn' },
		{ role: 'zoomOut' },
		{ type: 'separator' },
		{ role: 'togglefullscreen' }
		]
	},
	// { role: 'windowMenu' }
	{
		label: 'Window',
		submenu: [
		{ role: 'minimize' },
		{ role: 'zoom' },
		...(isMac ? [
			{ type: 'separator' },
			{ role: 'front' },
			{ type: 'separator' },
			{ role: 'window' }
		] : [
			{ role: 'close' }
		])
		]
	},
	{
		role: 'help',
		submenu: [
		{
			label: 'Learn More',
			click: async () => {
			const { shell } = require('electron')
			await shell.openExternal('https://electronjs.org')
			}
		}
		]
	}
	]

	const menu = Menu.buildFromTemplate(template)
	Menu.setApplicationMenu(menu)

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