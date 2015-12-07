'use strict';
let idProvider = 1;

const Route = function (_method, _path, _responseCode, _responseContent){

    const method = _method;
    const path = _path;
    let responseCode = _responseCode;
    let responseContent = _responseContent;
    const id = idProvider++;

    const handler = function (request, reply){

        reply(responseContent)/*.code(responseCode)*/;
    };

    this.getRoute = function (){

        return {
            method: method,
            path: path,
            handler: handler
        };
    };

    this.setResponseCode = function (newResponseCode){

        responseCode = newResponseCode;
    };

    this.setResponseContent = function (newResponseContent){

        responseContent = newResponseContent;
    };
    this.getId = function (){
        return id;
    };
    this.print = function (){

        return {
            id: id,
            method: method,
            path: path,
            responseCode: responseCode,
            responseContent: responseContent
        };
    };
};

module.exports = Route;
