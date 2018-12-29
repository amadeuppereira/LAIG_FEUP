class Pente{
    constructor(board, next, captures, turn, options, loaded, undo){
        this.client = new Client();

        this.undo = undo || null;
        
        this.board = board || undefined;
        this.next = next || "w";
        this.captures = captures || {w: "0", b: "0"};
        this.turn = turn || "0";
        this.options = options || {};

        this.loaded = loaded || false;

        if(!this.loaded)
            this.client.makeRequest("options([])")
            .then(r => {
                this.options = this.parseOptions(r);
                this.client.makeRequest("make_board(" + this.options.board_size + ")")
                .then(r => {
                    this.board = r;
                    this.loaded = true;
                }) 
            });
    }

    getOptions() {
        let ret = "[";
        Object.keys(this.options).forEach(k => {
            ret += k + "(" + this.options[k] + "),";
        });
        ret = ret.slice(0, -1);
        ret += "]";
        return ret;
    }

    toString() {
        return "game(" + this.board
                + "," + this.next
                + ",[" + this.captures.w + "," + this.captures.b + "]"
                + "," + this.turn
                + "," + this.getOptions() + ")";
    }

    updateGame(game) {
        this.undo = this.clone();
        let game_parsed = this.parseGameString(game);
        
        this.board = game_parsed.board;
        this.next = game_parsed.next;
        this.captures = game_parsed.captures;
        this.turn = game_parsed.turn;
        this.options = game_parsed.options;               
    }

    parseOptions(op) {
        let ret = {}
        let o = op.substr(1, op.length - 2);
        let re = /([a-z_]+\([\[\],a-z0-9]+\))/g;
        let m;
        while(m = re.exec(o)) {
            let a = m[0].toString().substr(0, m[0].length - 1).split('(');
            ret[a[0]] = a[1];
        }

        return ret;
    }

    parseGameString(game) {
        let board_re = /\[(\[([cwb][,]?)+\][,]?)+\]/;
        let board = board_re.exec(game)[0];
        game = game.slice(game.search("]],") + 3, game.length);
        let next = game[0];
        game = game.slice(2, game.length);
        let captures = {w: game[1], b: game[3]};
        game = game.slice(6, game.length);
        let turn = game[0];
        game = game.slice(2, game.length - 1);
        let options = this.parseOptions(game);

        return {board: board, next: next, captures: captures, turn: turn, options: options};
    }


    move(R, C) {
        if(this.loaded) {
            return this.client.makeRequest("move(" + this + ",[" + R + "," + C + "])")
            .then(r => {
                if(r !== "false") this.updateGame(r);
            }); 
        }
    }

    bot() {
        if(this.loaded) {
            return this.client.makeRequest("bot(" + this + ")")
            .then( r => {
                this.updateGame(r);
            }) 
        }
    }

    clone() {
        return new Pente(this.board, this.next, this.captures, this.turn, this.options, this.loaded, this.undo);
    }

    
}