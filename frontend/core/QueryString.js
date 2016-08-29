'use strict';

export default class QueryString{
    constructor(){
        let search = window.location.search.substring(1).split('&');//"?page=dashboard&name=1&age=2"
        let tempGroup = [];
        for(let p of search){
            tempGroup.push(p.split('='));
        }
        this.params = new Map(tempGroup);
    }
    
    getValue(name){
        return this.params.get(name);
    }
}
