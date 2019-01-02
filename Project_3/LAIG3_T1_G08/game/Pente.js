class Pente{
    constructor(board, next, captures, turn, options, loaded, previous){
        this.client = new Client();
        this.active_game =  false;
        this.game_mode;
        this.player_turn = false;
        this.winner;

        this.previous = previous || null;
        
        this.board = board || undefined;
        this.next = next || "w";
        this.captures = captures || {w: "0", b: "0"};
        this.turn = turn || "0";
        this.options = options || {};

        this.loaded = loaded || false;
    }

    init(mode, options) {
        if(!this.active_game) {
            return this.reset(options).then(() => {
                this.game_mode = mode;
                this.active_game = true;
                if(mode == 1 || mode == 2) {
                    this.player_turn = true;
                    return null;
                }
                else {
                    return this.bot().then(() => this.player_turn = true);
                }
            });
        }
        return null;
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

    updateGame(game) {
        this.previous = this.clone();
        let game_parsed = this.parseGameString(game);
        
        this.board = game_parsed.board;
        this.next = game_parsed.next;
        this.captures = game_parsed.captures;
        this.turn = game_parsed.turn;
        this.options = game_parsed.options;               
    }

    parseGameString(game) {
        let board_re = /\[(\[([cwb][,]?)+\][,]?)+\]/;
        let board = board_re.exec(game)[0];
        game = game.slice(game.search("]],") + 3, game.length);
        let next = game[0];
        game = game.slice(2, game.length);
        let captures;
        if(game[2] == ",") {
            captures = {w: game[1], b: game[3]};
            game = game.slice(6, game.length);
        } else {
            captures = {w: game.substr(1, 2), b: game[4]};
            game = game.slice(7, game.length);
        }
        let turn = game[0];
        game = game.slice(2, game.length - 1);
        let options = this.parseOptions(game);

        return {board: board, next: next, captures: captures, turn: turn, options: options};
    }

    move(R, C) {
        return this.client.makeRequest("move(" + this + ",[" + R + "," + C + "])")
        .then(r => {
            if(this.active_game && r != "false") this.updateGame(r);
        }); 
    }

    bot() {
        return this.client.makeRequest("bot(" + this + ")")
        .then( r => {
            if(this.active_game) this.updateGame(r);
        }) 
    }

    gameover() {
        return this.client.makeRequest("gameover(" + this + ")")
        .then( r => {
            if(r == "false") return false;
            else {
                if(this.active_game) {
                    this.active_game = false;
                    this.winner = r;
                }
                return r;
            }
        }) 
    }
    
    reset(options) {
        this.active_game = false;
        this.game_mode = undefined;
        this.player_turn = false;
        this.previous = null;
        this.winner = undefined;
        
        this.next = "w";
        this.captures = {w: "0", b: "0"};
        this.turn = "0";

        this.loaded = false;

        let aux = (r) => {
            this.options = this.parseOptions(r);
            return this.client.makeRequest("make_board(" + this.options.board_size + ")")
            .then(r => {
                this.board = r;
                this.loaded = true;
            })
        }
        if(options)
            return this.client.makeRequest("options(" + options + ")")
            .then(r => aux(r)); 
        else
            return this.client.makeRequest("options([])")
            .then(r => aux(r));
    }

    undo() {
        if(this.player_turn && this.active_game) {
            if(this.game_mode == 1) {
                this.undo_aux();
            }
            else if(this.game_mode == 2) {
                this.undo_aux();
                this.undo_aux();
            }
            else if(this.game_mode == 3) {
                if(this.turn != "1") {
                    this.undo_aux();
                    this.undo_aux();
                }
            } 
            return true;
        }
        return false;
    }
    
    undo_aux() {
        if(this.previous) {
            this.board       = this.previous.board;
            this.next        = this.previous.next;
            this.captures    = this.previous.captures;
            this.turn        = this.previous.turn;
            this.options     = this.previous.options; 
            this.previous    = this.previous.previous;
            this.active_game = true;
            this.winner      = undefined;
        } 
    }

    toString() {
        return "game(" + this.board
                + "," + this.next
                + ",[" + this.captures.w + "," + this.captures.b + "]"
                + "," + this.turn
                + "," + this.getOptions() + ")";
    }

    clone() {
        return new Pente(this.board, this.next, this.captures,
                        this.turn, this.options, this.loaded,
                        this.previous);
    }

}