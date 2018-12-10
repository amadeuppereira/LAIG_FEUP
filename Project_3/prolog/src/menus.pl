/**
	menu
	Displays the menus
*/

header :-
	write('\e[2J'),
	write('================================================================'),nl,
	write('=                             PENTE                            ='),nl,
	write('================================================================'),nl.

footer :-
	write('================================================================'),nl,
	write('= Amadeu Pereira                                Bruno Carvalho ='),nl,
	write('================================================================'),nl, nl.

help_menu :-
	header,
    write('='),nl,
	write('=  To start playing just call play.'),nl,
	write('=  It is possible to customize the game that you will play by'),nl,
	write('= selecting some values and arranging them in an options list.'),nl,
	write('=  You can implement these changes by starting the game as'),nl,
	write('= play(Options), where Options is the options list of compounds.'),nl,
    write('='),nl,
    write('=  * For help about a specific Option type help(Option).'),nl,
    write('='),nl,
	write('=  Supported options: '),nl,
    write('='),nl,
    help(board_size),
    write('='),nl,
    help(difficulty),
    write('='),nl,
    help(depth),
    write('='),nl,
    help(padding),
    write('='),nl,
    help(width),
    write('='),nl,
    help(flip_board),
    write('='),nl,
    help(tournament_rule),
    write('='),nl,
    write('= Example: play([size(13), difficulty(1), rule(false)]).'),nl,
    write('='),nl,
	write('= * If an option is not given the default value will be used.'),nl,
    write('='),nl,
	footer.

main_menu(Options) :- 
	header,
	write('\t\t1- Player (W) vs Player (B)'),nl,
	write('\t\t2- Player (W) vs BOT    (B)'),nl,
	write('\t\t3- BOT    (W) vs Player (B)'),nl,
	write('\t\t4- BOT    (W) vs BOT    (B)'),nl,nl,
	write('\t\t0- Exit'),nl,
    nl,
    write('\t\t5- To get a list of options, call: help.'),nl,
	footer,
	get_input(Input),
	handle_input(Input, Options).

get_input(Input) :-
	write('> Option: '), nl,
	read(Input).

handle_input(1, Options) :- !, start_game(player, player, Options).
handle_input(2, Options) :- !, start_game(player, bot, Options).
handle_input(3, Options) :- !, start_game(bot, player, Options).
handle_input(4, Options) :- !, start_game(bot, bot, Options).
handle_input(0, _) :- write('Exit').
handle_input(5, _) :- help_menu.
handle_input(_, Options) :-
	write('Invalid Input'), nl,
	get_input(Input),
	handle_input(Input, Options).