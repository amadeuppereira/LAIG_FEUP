/**
 * Client
 * @constructor
 */
class Client{
    constructor(port){
        this.requestPort = port || 8081;
    }

    // getPrologRequest(requestString, onSuccess, onError){
    //     var request = new XMLHttpRequest();
    //     request.open('GET', 'http://localhost:'+this.requestPort+'/'+requestString, true);

    //     let self = this;

    //     request.onload = onSuccess || function(data){ self.getReply(data); this.data = data.target.response};
    //     request.onerror = onError || function(){console.log("Error waiting for response");};

    //     request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    //     request.send();
    // }

    makeRequest(requestString){
        let requestPort = this.requestPort;
        return new Promise(function(resolve, reject) {
            var request = new XMLHttpRequest();
            request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

            request.onload = function(data){
                if(this.status >= 200 && this.status < 300){
                    resolve(data.target.response);
                }
                else{
                    reject({
                        status: this.status,
                        statusText: request.statusText
                    });
                }
            };
            request.onerror = function(){
                reject({
                    status: this.status, 
                    statusText: request.statusText
                });
            };

            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            request.send();
        })
    }
}