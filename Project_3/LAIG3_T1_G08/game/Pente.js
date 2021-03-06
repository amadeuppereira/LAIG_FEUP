/**
 * Pente
 * @constructor
 */
class Pente{
    constructor(board, next, captures, turn, options, loaded, previous){
        this.client = new Client();

        // game state
        this.active_game =  false;
        this.game_mode;
        this.player_turn = false;
        this.winner;
        this.timer = 0;
        this.maxTime = 10;
        this.film = false;

        // array with all moves 
        this.history = [];

        // previous game
        this.previous = previous || null;
        
        // game information required for server
        this.board = board || undefined;
        this.next = next || "w";
        this.captures = captures || {w: "0", b: "0"};
        this.turn = turn || "0";
        this.options = options || {};

        this.loaded = loaded || false;
        this.timeout = 2000;
    }

    /**
     * Initialize a pente game, with given options
     * mode(1 = player vs player, 2 = player vs bot,
     *      3 = bot vs player, 4 = bot vs bot)
     * @param {Integer} mode 
     * @param {String} options 
     */
    init(mode, options) {
        if(!this.active_game && !this.film) {
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

    /**
     * Convert the options object into server friendly options string
     */
    getOptions() {
        let ret = "[";
        Object.keys(this.options).forEach(k => {
            ret += k + "(" + this.options[k] + "),";
        });
        ret = ret.slice(0, -1);
        ret += "]";
        return ret;
    }

    /**
     * Convert the server options string into an object
     * @param {String} op 
     */
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

    /**
     * Update the current game with the server returned string
     * @param {String} game 
     */
    updateGame(game) {
        this.previous = this.clone();
        let game_parsed = this.parseGameString(game);
        
        this.board = game_parsed.board;
        this.next = game_parsed.next;
        this.captures = game_parsed.captures;
        this.turn = game_parsed.turn;
        this.options = game_parsed.options;    
        this.timer = 0;           
    }

    /**
     * Update the current game with the server returned string (replay mode)
     * @param {String} game 
     */
    updateGame_replay(game) {
        let game_parsed = this.parseGameString(game);
        
        this.board = game_parsed.board;
        this.next = game_parsed.next; 
        this.captures = game_parsed.captures;
    }

    /**
     * Convert server string into human friendly object
     * @param {String} game 
     */
    parseGameString(game) {
        let board_re = /\[(\[([cwb][,]?)+\][,]?)+\]/;
        let board = board_re.exec(game)[0];
        game = game.slice(game.search("]],") + 3, game.length);
        let next = game[0];
        game = game.slice(2, game.length);

        let captures = {w: game.substring(1, game.indexOf(',')),
                        b: game.substring(game.indexOf(',') + 1, game.indexOf(']'))};
        game = game.slice(game.indexOf(']') + 2, game.length);

        let turn = game.substring(0, game.indexOf(','));
        game = game.slice(game.indexOf(',') + 1, game.length - 1);

        let options = this.parseOptions(game);

        return {board: board, next: next, captures: captures, turn: turn, options: options};
    }

    /**
     * Make a player move at coords R, C
     * @param {Integer} R 
     * @param {Integer} C 
     */
    move(R, C) {
        return this.client.makeRequest("move(" + this + ",[" + R + "," + C + "])")
        .then(r => {
            if(this.active_game && r != "false") {
                this.updateGame(r);
                this.history.push({row: R, col:C});
            }
            else if(this.film) {
                this.updateGame_replay(r);
            }
        }); 
    }
    
    /**
     * Make a bot move
     */
    bot() {
        return this.client.makeRequest("bot(" + this + ")")
        .then( r => {
            if(this.active_game) {
                let previousBoard = this.board;
                this.updateGame(r);
                let currentBoard = this.board;
                this.history.push(this.botMoveCoord(previousBoard, currentBoard));
            }
            else if(this.film) {
                this.updateGame_replay(r);
            }
        }) 
    }

    /**
     * Return the bot move coords
     * @param {String} previousBoard 
     * @param {String} currentBoard 
     */
    botMoveCoord(previousBoard, currentBoard) {
        previousBoard = previousBoard.replace(/[,\[\]]/g, "");
        currentBoard = currentBoard.replace(/[,\[\]]/g, "");
        let coords;
        for(let i = 0; i < currentBoard.length; i++) {
            if(previousBoard[i] == "c" && currentBoard[i] != "c") {
                let c = Math.floor(i/this.options.board_size);
                coords =  {col: i - c * this.options.board_size + 1,
                            row: c + 1};
                return coords;
            }
        }
    }

    /**
     * Check if the game is finished
     */
    gameover() {
        return this.client.makeRequest("gameover(" + this + ")")
        .then( r => {
            if(r == "false") return false;
            else {
                if(this.active_game) {
                    this.active_game = false;
                    this.winner = r;
                    this.timer = 0;
                }
                return r;
            }
        }) 
    }
    
    /**
     * Reset the current game, updating the options if needed
     * @param {String} options 
     */
    reset(options) {
        this.active_game = false;
        this.game_mode = undefined;
        this.player_turn = false;
        this.previous = null;
        this.winner = undefined;
        this.timer = 0;
        this.history = [];
        this.film = false;
        
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

    /**
     * Undo the last move
     * When playing against a bot, undo the players move and the bot move
     */
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
    
    /**
     * Undo auxiliary function
     */
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
            this.timer       = 0;
            if(this.history.length > 0) this.history.pop();
        }
    }

    /**
     * Replay mode handler
     * The callback function will be called at each game iteration
     * @param {Function} callback 
     */
    replay(callback) {
        if(!this.active_game && this.winner) {
            this.film = true;
            let index = 0;

            let film = () => {
                setTimeout(callback, this.timeout, this.board, (this.timeout+2000));
                this.timeout += 2000;
                let move = this.history[index];
                index++;
                if(move) {
                    this.move(move.row, move.col)
                    .then(r => {film()});
                } 
            }
            this.client.makeRequest("make_board(" + this.options.board_size + ")")
            .then(r => {
                this.board = r;
                this.next= "w";
                this.captures = {w: "0", b: "0"}
                film();
            })
        }
    }

    /**
     * Convert the game info into server frindly string
     */
    toString() {
        return "game(" + this.board
                + "," + this.next
                + ",[" + this.captures.w + "," + this.captures.b + "]"
                + "," + this.turn
                + "," + this.getOptions() + ")";
    }

    /**
     * Clone the current game
     */
    clone() {
        return new Pente(this.board, this.next, this.captures,
                        this.turn, this.options, this.loaded,
                        this.previous);
    }

    /**
     * Update the game
     */
    update(deltaTime) {
        if(this.active_game) {
            let s = deltaTime / 1000;
            this.timer += s;
            if(this.timer >= this.maxTime) {
                this.active_game = false;
                this.winner = (this.next == "w") ? "b" : "w";
                this.timer = 0;
                return true;
            }
        }
        return false;
    }

}