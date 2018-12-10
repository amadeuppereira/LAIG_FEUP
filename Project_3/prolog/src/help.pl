help(board_size) :-
    default(board_size, Size),
    write('=    - board_size(S) or size(S), S in {7,9,11,...}'),nl,
    write('=       Defines the board size (SxS), must be odd.'),nl,
    write('=      Default: '), write(Size),nl.

help(size) :- help(board_size).

help(difficulty) :-
    default(difficulty, Difficulty),
    write('=    - difficulty(D), D in {1,2,3,4,5}'),nl,
    write('=       Sets the bot difficulty (with 5 being the most'),nl,
    write('=      difficult) by selecting a set of predefined values'),nl,
    write('=      for depth, padding and width. If given values for'),nl,
    write('=      depth, padding and width, these override those selected'),nl,
    write('=      by the difficulty.'),nl,
    write('=      Default: '), write(Difficulty),nl.

help(depth) :-
    default(depth, Depth),
    write('=    - depth(D), D in {0,1,2,3,...}'),nl,
    write('=       Depth of the bot search tree.'),nl,
    write('=       Suggestion: Choose an even depth (2 or 4).'),nl,
    write('=      Default (difficulty 3): '), write(Depth),nl.

help(padding) :-
    default(padding, Padding),
    write('=    - padding(P), P in {0,1,2,3,...}'),nl,
    write('=       Padding of the active subboard used by the search tree.'),nl,
    write('=      Default (difficulty 3): '), write(Padding),nl.

help(width) :-
    default(width, WidthList),
    write('=    - width([W0,W1,...]), Wi in {1,2,3,...}'),nl,
    write('=       For each search node on depth i (top is depth 0)'),nl,
    write('=       recurse the search tree only for the Wi best moves.'),nl,
    write('=       If the width is not defined for all the depths, the'),nl,
    write('=       last width in the list will be used repeatedly.'),nl,
    write('=    - width(W), W in {1,2,3,...}'),nl,
    write('=       Use the width W for all depths.'),nl,
    write('=      Default (difficulty 3): '), write(WidthList),nl.

help(flip_board) :-
    default(flip_board, Flip),
    write('=    - flip_board(B) or flip(B), B is true or false'),nl,
    write('=       Flip the board print on the console for Blacks turn.'),nl,
    write('=      Default: '), write(Flip),nl.

help(flip) :- help(flip_board).

help(tournament_rule) :-
    default(tournament_rule, Rule),
    write('=    - tournament_rule(B) or rule(B), B is true or false'),nl,
    write('=       Use the tournament rule.'),nl,
    write('=      Default: '), write(Rule),nl.

help(rule) :- help(tournament_rule).

help(List) :- is_list(List), foreach(help, List).
