import Store from 'electron-store';

var StoreO:any;

const StoreStart = ()=>{
    StoreO = new Store({ 
                        defaults:{ 
                            menu_dvlp:'',
                            subdomain:'',
                            user:{},
                            
                        } 
                    });
}

const DataSet = ( key:string='', val:any )=>{
    if(key && val){
        return StoreO.set(key,val);
    }
}

const DataGet = ( key:string='' )=>{
    if(key){
        return StoreO.get(key);
    }
}

export { StoreStart, DataSet, DataGet };