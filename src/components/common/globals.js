const Config = require('electron-store');

const global = {
	'domain_production':'sumr.co',
	'domain_tester':'sumrdev.com',
	'main_icon_dvlp_refresh':'/build/svg/m_refresh.svg'
};

const GetGlobal = (key)=>{
	return global[key];
}

module.exports = { GetGlobal };