import { join } from "path";
import { app as _app, remote } from 'electron';
import { existsSync, readFileSync } from 'fs';
import Text from './text';

let app = _app ? _app : remote.app;

const i18n = (phrase:string='')=>{

     var lng = 'es'; //var lng = app.getLocale();
     let texts:any = Text[lng];
     
     if(phrase){
          let translation = texts[phrase];
          if(translation === undefined) {
               translation = phrase
          }
          return translation
     }else{
          return '';
     }
}



export default i18n;