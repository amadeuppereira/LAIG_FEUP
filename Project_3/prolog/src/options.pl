/**
 * Game options
 *
 *   board_size / size      --- Define board size, odd integer, default 19.
 *   difficulty             --- Bot difficulty, 1 to 5, default 3.
 *   depth                  --- Analysis tree depth, 0 or higher.
 *   padding                --- Board padding, 1 or higher.
 *   width                  --- Analysys tree width, a list with widths for each depth.
 *   flip_board / flip      --- Flip the board for player Black, default false.
 *   tournament_rule / rule --- Use the tournament rule, default true.
 */

/**
 * ===== ===== ===== ===== ======= ======= ===== ===== ===== ===== 
 * ===== ===== ===== ===== DEFAULT OPTIONS ===== ===== ===== =====
 * ===== ===== ===== ===== ======= ======= ===== ===== ===== =====
 */

/**
 * default/2
 * default(+Opt, -DefaultValue).
 *   Establishes the default values for all options.
 */
default(board_size, 19).
default(difficulty, 3).
default(flip_board, false).
default(tournament_rule, true).
default(traverse, false).

default(depth, Depth) :-
    default(difficulty, Diff), difficulty_set(Diff, Depth, _, _).

default(padding, Padding) :-
    default(difficulty, Diff), difficulty_set(Diff, _, Padding, _).

default(width, WidthList) :-
    default(difficulty, Diff), difficulty_set(Diff, _, _, WidthList).

/**
 * difficulty_set/4
 * difficulty_set(+Level, ?Depth, ?Padding, ?WidthList).
 *   Established the difficulty sets used.
 */
difficulty_set(1, 2, 1, [3,3]).
difficulty_set(2, 3, 2, [4,3,2]).
difficulty_set(3, 4, 2, [4,3,2]).
difficulty_set(4, 5, 2, [4,3,2]).
difficulty_set(5, 6, 2, [5,4,3,2]).

/**
 * ===== ===== ===== ===== ====  ==== ===== ===== ===== =====
 * ===== ===== ===== ===== SANITIZERS ===== ===== ===== =====
 * ===== ===== ===== ===== ====  ==== ===== ===== ===== =====
 */

/**
 * sanitize_options/2
 * sanitize_options(+Options, -NewOptions).
 *   Sanitizes a user given Options List.
 */
sanitize_options(Options, NewOptions) :- 
    sanitize_board_size(Options, Size), !,
    sanitize_difficulty(Options, DDepth, DPadding, DWidth), !,
    sanitize_depth(Options, DDepth, Depth), !,
    sanitize_padding(Options, DPadding, Padding), !,
    sanitize_width(Options, DWidth, Width), !,
    sanitize_flip_board(Options, Flip), !,
    sanitize_tournament_rule(Options, Rule), !,
    sanitize_traverse(Options, Traverse), !,
    NewOptions = [
        board_size(Size),
        depth(Depth),
        padding(Padding),
        width(Width),
        flip_board(Flip),
        tournament_rule(Rule),
        traverse(Traverse)
    ].

/**
 * sanitize_board_size/2
 * sanitize_board_size(+Options, -Size).
 *   Deduces option board_size(Size).
 */
sanitize_board_size(Options, Size) :-
    default(board_size, DefaultSize),
    getopt_alt(Options, [board_size, size], DefaultSize, Size),
    integer(Size), 1 is mod(Size, 2), Size >= 7;
    write('Invalid BOARD_SIZE option! (odd > 7)'), nl, fail.

/**
 * sanitize_difficulty/4
 * sanitize_difficulty(+Options, -DDepth, -DPadding, -DWidth).
 *   Deduces option difficulty into its 3 components (DDepth, DPadding, DWidth).
 */
sanitize_difficulty(Options, DDepth, DPadding, DWidth) :-
    default(difficulty, DefaultDifficulty),
    getopt(Options, difficulty, DefaultDifficulty, Difficulty),
    integer(Difficulty),
    difficulty_set(Difficulty, DDepth, DPadding, DWidth),
    format('Difficulty level ~d', Difficulty), nl;
    write('Invalid DIFFICULTY option! (1-5)'), nl, fail.

/**
 * sanitize_depth/3
 * sanitize_depth(+Options, +DDepth, -Depth).
 *   Deduces option depth(Depth), with default value that given by the difficulty.
 */
sanitize_depth(Options, DDepth, Depth) :-
    getopt(Options, depth, DDepth, Depth), !,
    integer(Depth), Depth >= 0;
    write('Invalid DEPTH option! (>= 0)'), nl, fail.

/**
 * sanitize_padding/3
 * sanitize_padding(+Options, +DPadding, -Padding).
 *   Deduces option padding(Padding), with default value that given by the difficulty.
 */
sanitize_padding(Options, DPadding, Padding) :-
    getopt(Options, padding, DPadding, Padding), !,
    integer(Padding), Padding > 0;
    write('Invalid PADDING option! (> 0)'), nl, fail.

/**
 * validate_widthlist/1
 * validate_widthlist(+Arg, -WidthList).
 */
validate_widthlist(WidthList, WidthList) :-
    proper_length(WidthList, Length), !, Length > 0,
    a_all_of(>, 0, WidthList).

validate_widthlist(Width, [Width]) :-
    integer(Width), !, Width > 0.

/**
 * sanitize_width/3
 * sanitize_width(+Options, +DWidth, -WidthList).
 *   Deduces option width(Width), with default value that given by the difficulty.
 */
sanitize_width(Options, DWidth, WidthList) :-
    getopt(Options, width, DWidth, Opt), !,
    validate_widthlist(Opt, WidthList);
    write('Invalid WIDTH option! (list with widths > 0)'), nl, fail.

/**
 * sanitize_flip_board/3
 * sanitize_flip_board(+Options, -Flip),
 *   Deduce option flip_board(Flip).
 */
sanitize_flip_board(Options, Flip) :-
    default(flip_board, DefaultFlip),
    getopt_alt(Options, [flip_board, flip], DefaultFlip, Flip), !,
    memberchk(Flip, [false,true]);
    write('Invalid FLIP option! (true or false)'), nl, fail.

/**
 * sanitize_tournament_rule/2
 * sanitize_tournament_rule(+Options, -Rule).
 *   Deduce the tournament_rule option.
 */
sanitize_tournament_rule(Options, Rule) :-
    default(tournament_rule, DefaultRule),
    getopt_alt(Options, [tournament_rule, rule, tournament], DefaultRule, Rule), !,
    memberchk(Rule, [false,true]);
    write('Invalid TOURNAMENT RULE option! (true or false)'), nl, fail.

/**
 * sanitize_traverse/2
 * sanitize_traverse(+Options, -Rule).
 *   Deduce the traverse option.
 */
sanitize_traverse(Options, Traverse) :-
    default(traverse, DefaultTraverse),
    getopt_alt(Options, [traverse, traversal], DefaultTraverse, Traverse), !,
    memberchk(Traverse, [false,true]);
    write('Invalid TRAVERSE option! (true or false)'), nl, fail.

/**
 * ===== ===== ===== ===== ======  ====== ===== ===== ===== =====
 * ===== ===== ===== ===== TREE UTILITIES ===== ===== ===== =====
 * ===== ===== ===== ===== ======  ====== ===== ===== ===== =====
 */

/**
 * tree_parseopt/3
 * tree_parseopt(+Options, +Turn, -NewOptions).
 *   Constructs an options list appropriate for the tree analysis module.
 */
tree_parseopt(Options, Turn, NewOptions) :-
    opt_totaldepth(Options, TotalDepth),
    opt_padding(Options, Padding),
    opt_widthlist(Options, WidthList),
    opt_tournament(Options, Tournament),
    NewOptions = [
        turn(Turn),
        current(0),
        depth(TotalDepth),
        padding(Padding),
        width(WidthList),
        tournament(Tournament)
    ], !.

/**
 * depth_width/3
 * depth_width(+WidthList, +Depth, -Width).
 *   Gets width at a given depth from a width list.
 */
depth_width(WidthList, Depth, Width) :-
    length(WidthList, Length),
    Depth >= Length, !,
    last(WidthList, Width);
    nth0(Depth, WidthList, Width), !.

/**
 * next_depth/2
 * next_depth(+Options, -NewOptions).
 */
next_depth(Options, NewOptions) :-
    opt_turn(Options, Turn),
    opt_depth(Options, Depth),
    opt_totaldepth(Options, TotalDepth),
    opt_padding(Options, Padding),
    opt_widthlist(Options, WidthList),
    opt_tournament(Options, Tournament),
    D is Depth + 1,
    T is Turn + 1,
    NewOptions = [
        turn(T),
        current(D),
        depth(TotalDepth),
        padding(Padding),
        width(WidthList),
        tournament(Tournament)
    ], !.

/**
 * ===== ===== ===== ===== ==== ==== ===== ===== ===== =====
 * ===== ===== ===== ===== ACCESSORS ===== ===== ===== =====
 * ===== ===== ===== ===== ==== ==== ===== ===== ===== =====
 */

/**
 * Shorthands for calls to getopt/3 or getopt_alt/3.
 */

opt_board_size(Options, Size) :-
    getopt_alt(Options, [board_size, size], Size).

opt_size(Options, Size) :-
    getopt_alt(Options, [board_size, size], Size).

opt_turn(Options, Turn) :-
    getopt(Options, turn, Turn).

opt_depth(Options, Depth) :-
    getopt(Options, current, Depth).

opt_totaldepth(Options, TotalDepth) :-
    getopt(Options, depth, TotalDepth).

opt_padding(Options, Padding) :-
    getopt(Options, padding, Padding).

opt_widthlist(Options, WidthList) :-
    getopt(Options, width, WidthList).

opt_flip_board(Options, Flip) :-
    getopt_alt(Options, [flip_board, flip], Flip).

opt_flip(Options, Flip) :-
    getopt_alt(Options, [flip_board, flip], Flip).

opt_tournament_rule(Options, Rule) :-
    getopt_alt(Options, [tournament_rule, rule, tournament], Rule).

opt_rule(Options, Rule) :-
    getopt_alt(Options, [tournament_rule, rule, tournament], Rule).

opt_tournament(Options, Rule) :-
    getopt_alt(Options, [tournament_rule, rule, tournament], Rule).

opt_traverse(Options, Traverse) :-
    getopt_alt(Options, [traverse, traversal], Traverse).

opt_width(Options, Width) :-
    opt_depth(Options, Depth),
    opt_widthlist(Options, WidthList),
    depth_width(WidthList, Depth, Width).
