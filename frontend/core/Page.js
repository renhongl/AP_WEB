'use strict';

import QueryString from './QueryString'
import Ajax from './Ajax'
import Constant from './Constant'

export default class Page{
    constructor({ config }){
        this.config = config;
        this._loadTitle();
        this._loadDialogs();
    }

    _loadTitle(){
        $('title').html(this.config.id);
    }

    _loadDialogs(){
        let dialogs = this.config.dialogs;
        for(let dialog of dialogs){
            this._loadDialog(dialog);
        }
    }

    _loadDialog(dialog){
        let dialogPath = Constant.BASE_SERVER + 'modules/dialog/';
        let dialogController = dialogPath + 'controller';
        let dialogModel = dialogPath + 'model';
        let dialogView = dialogPath + 'view.html';
        let dialogStyle = dialogPath + 'style.css';

        Ajax.loadHTML($('body'), dialogView, (result) => {
            let $container = $(result);
            this._loadStyle(dialogStyle);
            this._loadController(dialogController, dialog, $container);
            this._loadModel(dialogModel);
        });
    }

    _loadModule(module){
        
    }

    _loadController(controllerPath, obj, $container){
        System.import(controllerPath).then( ({ Controller }) => {
            new Controller(obj, $container);
        });
    }

    _loadStyle(stylePath){
        $('head').append(`<link rel='stylesheet' href=${ stylePath } />`);
    }

    _loadModel(modelPath){
        System.import(modelPath).then( ({ Model }) => {
            new Model();
        });
    }

}