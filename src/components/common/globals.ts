type tpGlosary = {
    [key: string]: string
}

const global: tpGlosary = {
	'domain_production':'sumr.co',
	'domain_tester':'sumrdev.com',
	'main_icon_dvlp_refresh':'/build/svg/m_refresh.svg'
};

const GetGlobal = (key:string)=>{
	return global[key];
}

export default GetGlobal;