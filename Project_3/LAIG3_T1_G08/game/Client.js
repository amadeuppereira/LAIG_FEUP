/**
 * Client
 * @constructor
 */
class Client{
    constructor(port){
        this.requestPort = port || 8081;
    }

    getPrologRequest(requestString, onSuccess, onError){
        var request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:'+this.requestPort+'/'+requestString, true);

        request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
        request.onerror = onError || function(){console.log("Error waiting for response");};

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }

    makeRequest(requestString){
        this.getPrologRequest(requestString, this.getReply);
    }

    getReply(data){
        console.log(data.target.response);
        return data.target.response;
    }
}