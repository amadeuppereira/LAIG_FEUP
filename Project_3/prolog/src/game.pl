/**
 * pente/[1,2]
 *   Entry points.
 */
pente :- 
	sanitize_options([], Options), !,
	main_menu(Options).

pente(Options) :-
	sanitize_options(Options, Sanitized), !,
	main_menu(Sanitized).

/**
 * other_player/2
 * other_player(?P1, ?P2).
 */
other_player(w, b).
other_player(b, w).

/**
 * is_player/1
 * is_player(?P).
 */
is_player(w).
is_player(b).

/**
 * game/5
 * game(+Board, +P, +[Wc,Bc], +Turn, +Options).
 *   A game of Pente.
 *   > The current Board is represented by a SizexSize matrix, consisting of
 *     characters c for empty slots, w for White's pieces and b for Black's pieces.
 *   > Wc and Bc are White's and Black's captures, respectively.
 *   > P is w or b, indicating whose turn it is to play.
 *   > Turn is the current game turn. When the board is empty, it is White to play
 *   and Turn is 0.
 *   > Options are the game options.
 */

/**
 * start_game/3
 * start_game(player, player, +Options)
 * start_game(player, bot, +Options)
 * start_game(bot, player, +Options)
 * start_game(bot, bot, +Options)
 *   Starts a pente game.
 */
start_game(player, player, Options) :-
	getopt(Options, board_size, Size),
	make_board(Size, Board),
	gloop_player_player(game(Board, w, [0,0], 0, Options)).

start_game(player, bot, Options) :-
	getopt(Options, board_size, Size),
	make_board(Size, Board),
	gloop_player_bot(game(Board, w, [0,0], 0, Options)).

start_game(bot, player, Options) :-
    getopt(Options, board_size, Size),
    make_board(Size, Board),
    gloop_bot_player(game(Board, w, [0,0], 0, Options)).

start_game(bot, bot, Options) :-
	getopt(Options, board_size, Size),
	make_board(Size, Board),
	gloop_bot_bot(game(Board, w, [0,0], 0, Options)).

cls :- repeat_call(nl, 50).

/**
 * gloop_player_player/1, gloop_player_bot/1, gloop_bot_player/1, gloop_bot_bot/1
 * gloop_*_*(+Game).
 *   Next iteration of the game.
 */
% PLAYER vs PLAYER
gloop_player_player(Game) :-
	Game = game(Board, _, _, Turn, Options), repeat_call(nl, 50), !,
    board_size(Board, Size), !,
    opt_tournament(Options, Tournament), !,
    display_game(Game), !,
    get_move(Size, Move),
	valid_move(Board, Turn, Tournament, Move), !,
	move(Move, Game, NewGame), !,
	game_loop_aux(gloop_player_player, NewGame), !.

% PLAYER vs BOT,  PLAYER's turn
gloop_player_bot(Game) :-
    Game = game(Board, w, _, Turn, Options), repeat_call(nl, 30), !,
    board_size(Board, Size), !,
    opt_tournament(Options, Tournament), !,
    display_game(Game), !,
    get_move(Size, Move),
    valid_move(Board, Turn, Tournament, Move), !,
    move(Move, Game, NewGame), !,
    game_loop_aux(gloop_player_bot, NewGame), !.

% PLAYER vs BOT,  BOT's turn
gloop_player_bot(Game) :-
    Game = game(_, b, _, _, Options), repeat_call(nl, 30), !,
    display_game(Game), !,
	analyze_tree(Game, Tree),
	choose_move(Tree, Move, Options),
	move(Move, Game, NewGame), !,
	game_loop_aux(gloop_player_bot, NewGame), !.

% BOT vs PLAYER,  BOT's turn
gloop_bot_player(Game) :-
    Game = game(_, w, _, _, Options), repeat_call(nl, 30), !,
    display_game(Game), !,
    analyze_tree(Game, Tree),
    choose_move(Tree, Move, Options),
    move(Move, Game, NewGame), !,
    game_loop_aux(gloop_bot_player, NewGame), !.

% BOT vs PLAYER,  PLAYER's turn
gloop_bot_player(Game) :-
    Game = game(Board, b, _, Turn, Options), repeat_call(nl, 30), !,
    board_size(Board, Size), !,
    opt_tournament(Options, Tournament), !,
    display_game(Game), !,
    get_move(Size, Move),
    valid_move(Board, Turn, Tournament, Move), !,
    move(Move, Game, NewGame), !,
    game_loop_aux(gloop_bot_player, NewGame), !.

% BOT vs BOT
gloop_bot_bot(Game) :-
    Game = game(_, _, _, _, Options), repeat_call(nl, 6), !,
    display_game(Game), !,
    analyze_tree(Game, Tree),
    choose_move(Tree, Move, Options),
    move(Move, Game, NewGame), !,
    game_loop_aux(gloop_bot_bot, NewGame).

/**
 * game_loop_aux/2
 * game_loop_aux(+Loop, +Game).
 *   Exit if game is over, otherwise reenter loop.
 */
game_loop_aux(Loop, Game) :-
    is_player(P),
	game_over(Game, P),
	cls,
    display_game(Game),
	victory(P), !;
    call(Loop, Game), !.

/**
 * victory/1
 * victory(+P)
 *   Displays a victory message for the player P (w or b)
 */
victory(w):- write('White player won!'), nl.
victory(b):- write('Black player won!'), nl.

/**
 * game_over/2
 * game_over(+Game, +P).
 *   Verifies if the game is over with winner P (w or b).
 */
game_over(Game, w) :-
    Game = game(Board, _, [Wc,_], _, _),
    (five_board(Board, w); Wc >= 10).

game_over(Game, b) :-
    Game = game(Board, _, [_,Bc], _, _),
    (five_board(Board, b); Bc >= 10).
