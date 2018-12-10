/**
 * ===== ===== ===== BOARD ===== ===== =====
 */

/**
 * UNICODE BOX DRAWING
 * http://jrgraphix.net/r/Unicode/2500-257F
 *
 * ● White circle      u+25cf     '\x25cf\'
 * ○ Black circle      u+25cb     '\x25cb\'
 *
 * Large white         u+25ef     '\x25ef\'
 * Large black         u+2b24     '\x2b24\'
 *
 * Small white         u+26aa     '\x26aa\'
 * Small black         u+26ab     '\x26ab\'
 *
 * ┌ Top left          u+250c     '\x250c\'
 * ┐ Top right         u+2510     '\x2510\'
 * └ Bot left          u+2514     '\x2514\'
 * ┘ Bot right         u+2518     '\x2518\'
 *
 * ├ Left              u+251c     '\x251c\'
 * ┬ Top               u+252c     '\x252c\'
 * ┤ Right             u+2524     '\x2524\'
 * ┴ Bottom            u+2534     '\x2534\'
 *
 * ┼ Fill              u+253c     '\x253c\'
 *
 * Circled a-z         u+24d0 -- u+24e9
 *  ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ
 * Circled A-Z         u+24b6 -- u+24cf
 *  ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ
 * Circled 1-20        u+2460 -- u+2473
 *  ①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳
 *
 * ─ Horizontal dash   u+2500
 * │ Vertical dash     u+2502
 */

/**
 * write_board_unit/1, write_piece/1
 * write_board_unit(+A), write_piece(+A).
 *   Writes atom A to standard output, under its mapped representation.
 */
write_board_unit(A) :- write_board_unit(A, [3,3], 2, 2), !.

write_piece(A) :- write_board_unit(A, [3,3], 2, 2), !.

/**
 * write_board_unit/4
 * write_board_unit(+P, +[RowSize,ColSize], +Row, +Col).
 *   Writes to the console the piece whose internal representation is P,
 *   on location (Row, Col), assuming the board is RowSizexColSize.
 */
% ● White piece, anywhere ●
write_board_unit(w, _, _, _) :-
    write('\x25cf\ '), !.

% ○ Black piece, anywhere ○
write_board_unit(b, _, _, _) :-
    write('\x25cb\ '), !.

% Ⓦ White piece, anywhere Ⓦ.
write_board_unit('W', _, _, _) :-
    write('\x24cc\ '), !.

% Ⓑ Black piece, anywhere Ⓑ.
write_board_unit('B', _, _, _) :-
    write('\x24b7\ '), !.

% Bottom-left piece └
write_board_unit(_, [_, _], 1, 1) :-
    write('\x2514\\x2500\'), !.

% Bottom-right piece ┘
write_board_unit(_, [_, ColSize], 1, ColSize) :-
    write('\x2518\'), !.

% Top-left piece ┌
write_board_unit(_, [RowSize, _], RowSize, 1) :-
    write('\x250c\\x2500\'), !.

% Top-right piece ┐
write_board_unit(_, [RowSize,ColSize], RowSize, ColSize) :-
    write('\x2510\'), !.

% Bottom piece ┴
write_board_unit(_, [_, ColSize], 1, Col) :-
    Col > 1, Col < ColSize,
    write('\x2534\\x2500\'), !.

% Top piece ┬
write_board_unit(_, [RowSize,ColSize], RowSize, Col) :-
    Col > 1, Col < ColSize,
    write('\x252c\\x2500\'), !.

% Left piece ├
write_board_unit(_, [RowSize, _], Row, 1) :-
    Row > 1, Row < RowSize,
    write('\x251c\\x2500\'), !.

% Right piece ┤
write_board_unit(_, [RowSize,ColSize], Row, ColSize) :-
    Row > 1, Row < RowSize,
    write('\x2524\'), !.

% Fill piece ┼
write_board_unit(_, [RowSize,ColSize], Row, Col) :-
    Row > 1, Row < RowSize, Col > 1, Col < ColSize,
    write('\x253c\\x2500\'), !.

/**
 * write_npieces/2
 * write_npieces(+N, +P).
 *   Writes N pieces P.
 */
write_npieces(N, P) :- repeat_call(write_piece(P), N), !.

/**
 * write_board_left(+P, +Row, +RowSize).
 *   Print the row's number on the left of the board.
 *
 * You may choose alph or cnum here for a different representation.
 */
% 19 18 ...
write_board_left_alph(w, Row, _) :- Row < 10, format(' ~d ', Row).
write_board_left_alph(w, Row, _) :- Row > 9, format('~d ', Row).
write_board_left_alph(b, R, Size) :- Row is Size + 1 - R, Row < 10, format(' ~d ', Row).
write_board_left_alph(b, R, Size) :- Row is Size + 1 - R, Row > 9, format('~d ', Row).
% ⑲  ⑱ ...
write_board_left_cnum(w, Row, _) :- C is Row + 9311, write(' '), put_code(C), write(' ').
write_board_left_cnum(b, R, Size) :- C is Size + 1 - R + 9311, write(' '), put_code(C), write(' ').

write_board_left(P, Row, Size) :- write_board_left_alph(P, Row, Size), !.

/**
 * write_board_top_char(+I).
 *   Write the char at index I.
 *   We choose to skip letter 'I'.
 *   Some board authors prefer to skip 'J', others prefer using numbers.
 *
 * You may choose alph, ccap or cmin here for a different representation.
 */
% A  B ...
write_board_top_char_alph(I) :- I < 9, C is I + 64, write(' '), put_code(C).
write_board_top_char_alph(I) :- I > 8, C is I + 65, write(' '), put_code(C).
% Ⓐ Ⓑ ...
write_board_top_char_ccap(I) :- I < 9, C is I + 9397, write(' '), put_code(C).
write_board_top_char_ccap(I) :- I > 8, C is I + 9398, write(' '), put_code(C).
% ⓐ ⓑ ...
write_board_top_char_cmin(I) :- I < 9, C is I + 9423, write(' '), put_code(C).
write_board_top_char_cmin(I) :- I > 8, C is I + 9424, write(' '), put_code(C).

write_board_top_char(I) :- write_board_top_char_alph(I), !.

/**
 * write_board_top/[1,2]
 * write_board_top(+P).
 * write_board_top(+P, +ColSize).
 *   Print the top row of the board.
 */
write_board_top(P) :- write_board_top(P, 19).

write_board_top(w, ColSize) :-
    write('  '),
    forloop_increasing(write_board_top_char, 1, ColSize), nl, !.

write_board_top(b, ColSize) :-
    write('  '),
    forloop_decreasing(write_board_top_char, 1, ColSize), nl, !.

/**
 * write_bottom/[2,3]
 * write_bottom(+P, +Cap).
 * write_bottom(+P, +Cap, +Turn).
 *   Print the players' captures + turn below the board.
 */
write_bottom(w, [Wc,Bc]) :-
    write('       > White: '), write_npieces(Wc, b), nl,
    write('         Black: '), write_npieces(Bc, w), nl.

write_bottom(b, [Wc,Bc]) :-
    write('         White: '), write_npieces(Wc, b), nl,
    write('       > Black: '), write_npieces(Bc, w), nl.

write_bottom(w, [Wc,Bc], Turn) :-
    write('       > White: '), write_npieces(Wc, b), nl,
    write('         Black: '), write_npieces(Bc, w), nl,
    format(' Turn: ~d', Turn), nl, !.

write_bottom(b, [Wc,Bc], Turn) :-
    write('         White: '), write_npieces(Wc, b), nl,
    write('       > Black: '), write_npieces(Bc, w), nl,
    format(' Turn: ~d', Turn), nl, !.

/**
 * write_board_line_raw/1, write_board_line/4
 * write_board_line_raw(+L).
 * write_board_line(+L, +P, +[RowSize,ColSize], +Row).
 *   Print a board row (ColSize elements) on a given Row.
 *   According to player P's perspective.
 */
write_board_line_raw(L) :-
    length(L, ColSize), ColSize2 is ColSize + 2,
    lb_foreach_increasing(L, write_board_unit, [[3,ColSize2], 2], 2).

write_board_line(L, P, [RowSize,ColSize], Row) :-
    write_board_left(P, Row, RowSize),
    lb_foreach_increasing(L, write_board_unit, [[RowSize,ColSize], Row], 1), nl.

/**
 * print_board/[1-3]
 * print_board(+Board).
 * print_board(+Board, +P).
 * print_board(+Board, +P, +Flip).
 *   Print the whole board. The second version flips the board for Black. The
 *   third version only flips if Flip is true.
 */
print_board(Board) :- print_board(Board, w), !.

print_board(Board, w) :-
    matrix_size(Board, RowSize, ColSize),
    write_board_top(w, ColSize),
    lb_foreach_decreasing(Board, write_board_line, [w, [RowSize,ColSize]], RowSize), !.

print_board(Board, b) :-
    matrix_size(Board, RowSize, ColSize),
    matrix_rowcol_reverse(Board, Reversed),
    write_board_top(b, ColSize),
    lb_foreach_decreasing(Reversed, write_board_line, [b, [RowSize,ColSize]], RowSize), !.

print_board(Board, P, Flip) :-
    Flip, !, print_board(Board, P); \+ Flip, print_board(Board).

/**
 * display_game/[1,3]
 * display_game(+Game).
 * display_game(+Board, +P, +Cap).
 *   Print all the game's board information, plus captures and turn on the bottom.
 */
display_game(Game) :-
    Game = game(Board, P, Cap, Turn, Options),
    opt_flip(Options, Flip),
    print_board(Board, P, Flip),
    write_bottom(P, Cap, Turn), !.

display_game(Board, P, Cap) :-
    print_board(Board),
    write_bottom(P, Cap), !.

/**
 * ===== ===== ===== VALUE ===== ===== =====
 */

/**
 * print_val/1
 * print_val(+Val).
 *   For debugging purposes only.
 */
print_val(Val) :-
    Val = val(RowV,ColV,LeftV,RightV),
    write('===== ===== ===== val/4 ===== ===== ====='), nl,
    write(' RowV:   '), write(RowV), nl,
    write(' ColV:   '), write(ColV), nl,
    write(' LeftV:  '), write(LeftV), nl,
    write(' RightV: '), write(RightV), nl,
    sumval(Val, Total),
    format(' Total: ~D', Total), nl, !.

/**
 * ===== ===== ===== TREE ===== ===== =====
 */

/**
 * print_node/1
 * print_node(+Node).
 *   For debugging purposes only.
 */
print_node(Node) :-
    Node = node(Board, P, Val, Cap, _, Worth),
    write('===== ===== ===== ===== node/6 ===== ===== ===== ====='), nl,
    display_game(Board, P, Cap),
    print_val(Val), nl,
    format('Node Worth: ~D', Worth), nl,
    print_children(Node), nl, !.

/**
 * print_node_deep/1
 * print_node_deep(+Node).
 *   For debugging purposes only.
 */
print_node_deep(Node) :-
    Node = node(Board, P, _, Cap, _, Worth),
    write('===== ===== ===== ===== node/6 ===== ===== ===== ====='), nl,
    display_game(Board, P, Cap),
    format('Node Worth: ~D', Worth), nl,
    print_children_deep(Node), nl, !.

/**
 * print_tree/1
 * print_tree(+Tree).
 *   For debugging purposes only.
 */
print_tree(Node) :-
    Node = node(_, _, Val, _, _, Worth),
    write('===== ===== ===== ===== node/6 ===== ===== ===== ====='), nl,
    print_val(Val), nl,
    format('Node Worth: ~D', Worth), nl,
    print_children(Node), nl, !.

/**
 * print_tree_deep/1
 * print_tree_deep(+Tree).
 *   For debugging purposes only.
 */
print_tree_deep(Node) :-
    Node = node(_, _, _, _, _, Worth),
    write('===== ===== ===== ===== node/6 ===== ===== ===== ====='), nl,
    format('Node Worth: ~D', Worth), nl,
    print_children_deep(Node), nl, !.

/**
 * print_children/1
 * print_children(+Node).
 *   For debugging purposes only.
 */
print_children(Node) :-
    Node = node(Board, _, _, _, Children, _), !,
    matrix_size(Board, RowSize, _),
    length(Children, C), % can be 0
    format('===== ===== Children: ~d ===== =====', C), nl,
    (   foreach(Worth-(Move-Child), Children),
        param(RowSize)
    do  format('  Worth ~D~n  Move: ', Worth),
        mainline(Child, Mainline),
        print_moves([Move|Mainline], RowSize), nl
    ), !.

/**
 * print_children_deep/1
 * print_children_deep(+Node).
 *   For debugging purposes only.
 */
print_children_deep(Node) :-
    Node = node(_, _, _, _, Children, _), !,
    length(Children, C), % can be 0
    format('===== ===== Children: ~d ===== =====', C), nl,
    print_playlines(Node).

/**
 * print_move/3
 * print_move(+Move, +RowSize)
 * print_move(+P, +Move, +RowSize)
 */
print_move(Move, RowSize) :-
    rep_internal(RowSize, [RepRow,RepCol], Move),
    RepRow > 9, !, format('~w~d  ', [RepCol,RepRow]).

print_move(Move, RowSize) :-
    rep_internal(RowSize, [RepRow,RepCol], Move),
    RepRow < 10, !, format('~w~d   ', [RepCol,RepRow]).

print_move(P, Move, RowSize) :-
    rep_internal(RowSize, [RepRow,RepCol], Move),
    RepRow > 9, !,
    write_piece(P),
    format('~w~d  ', [RepCol,RepRow]).

print_move(P, Move, RowSize) :-
    rep_internal(RowSize, [RepRow,RepCol], Move),
    RepRow < 10, !,
    write_piece(P),
    format('~w~d   ', [RepCol,RepRow]).

/**
 * print_moves/1
 * print_moves(+Node).
 */
print_moves(Moves) :- print_moves(Moves, 19).

print_moves(Moves, RowSize) :-
    (   foreach(Move, Moves),
        param(RowSize)
    do  print_move(Move, RowSize)
    ), !.

/**
 * print_playlines/[1,2]
 * print_playlines(+Node).
 * print_playlines(+Node, +N).
 */
print_playlines(Node) :- print_playlines(Node, 0).

print_playlines(Node, _) :-
    Node = node(_, _, _, _, [], Worth), !,
    format('   ~D', Worth), nl.

print_playlines(Node, N) :- 
    Node = node(Board, P, _, _, Children, _), !,
    length(Children, C),
    Spaces is 7 * N + 3,
    fill_n(Spaces, ' ', SpacesList),
    atom_chars(String, SpacesList),
    NChild is N + 1,
    matrix_length(Board, RowSize, _),
    (N is 0 -> write(String); otherwise),
    (   foreach(_-(Move-Child), Children),
        count(I, 1, C),
        param(String),
        param(NChild),
        param(RowSize),
        param(N), param(P)
    do  (I > 1 -> write(String); otherwise),
        print_move(P, Move, RowSize),
        print_playlines(Child, NChild)
    ), !.

/**
 * ===== ===== ===== SCORE ===== ===== =====
 */

/**
 * pretty_print_pattern/2
 * pretty_print_pattern(+Pattern, +Length).
 */
pretty_print_pattern(Pattern, [LeftSpaces, RightSpaces]) :-
    fill_n(LeftSpaces, ' ', LeftSpacesList),
    atom_chars(LeftString, LeftSpacesList),
    fill_n(RightSpaces, ' ', RightSpacesList),
    atom_chars(RightString, RightSpacesList),
    write(LeftString),
    write_board_line_raw(Pattern),
    write(RightString).

pretty_print_pattern(Pattern, Length) :-
    integer(Length), !,
    length(Pattern, PatternLength),
    FillSpaces is Length - PatternLength,
    fill_n(FillSpaces, ' ', SpacesList),
    atom_chars(SpaceString, SpacesList),
    write(SpaceString),
    write_board_line_raw(Pattern),
    write(SpaceString).

/**
 * print_pattern_scores/1
 * print_pattern_scores(+Pattern).
 */
print_pattern_scores(Pattern, [PadLeft,PadRight]) :-
    numlist(0, PadLeft, LeftsReversed),
    numlist(0, PadRight, RightsReversed),
    reverse(LeftsReversed, Lefts), reverse(RightsReversed, Rights),
    (   foreach(Left, Lefts),
        param(Pattern),
        param(PadLeft),
        param(PadRight),
        param(Rights)
    do  (   foreach(Right, Rights),
            param(Pattern),
            param(PadLeft),
            param(PadRight),
            param(Left)
        do  fill_n(Left, c, CLeft),
            fill_n(Right, c, CRight),
            append([CLeft, Pattern, CRight], FullPattern),
            evaluate(FullPattern, Value),
            LeftSpaces is 2 * (PadLeft - Left),
            RightSpaces is 2 * (PadRight - Right),
            pretty_print_pattern(FullPattern, [LeftSpaces, RightSpaces]),
            format(' -- ~D~n', Value)
        )
    ).

/**
 * check_evaluate/1
 * check_evaluate(+Pattern).
 */
check_evaluate(List) :-
    length(List, Length),
    count_element(w, List, Whites),
    score_list(Patterns),
    (   foreach(Pattern, Patterns),
        param(List),
        param(Length),
        param(Whites)
    do  score(Pattern, Score),
        countsegment(List, Pattern, N),
        count_element(w, Pattern, PWhites),
        (N > 0, PWhites = Whites ->
            pretty_print_pattern(Pattern, Length),
            evaluate(Pattern, V),
            format('~t  --~t~2| ~d~t~4+| ~D~t~20+| ~D~n', [N, Score, V]);
            true
        )
    ),
    evaluate(List, Value),
    format('Total Value: ~D~n', Value).

/**
 * check_evaluate_all/1
 * check_evaluate_all(+Pattern).
 */
check_evaluate_all(List) :-
    length(List, Length),
    score_list(Patterns),
    (   foreach(Pattern, Patterns),
        param(List),
        param(Length)
    do  score(Pattern, Score),
        countsegment(List, Pattern, N),
        (N > 0 ->
            pretty_print_pattern(Pattern, Length),
            evaluate(Pattern, V),
            format('~t  --~t~2| ~d~t~4+| ~D~t~20+| ~D~n', [N, Score, V]);
            true
        )
    ),
    evaluate(List, Value),
    format('Total Value: ~D~n', Value).

p(Pattern, Pad) :- print_pattern_scores(Pattern, Pad).
e(List) :- check_evaluate(List).
a(List) :- check_evaluate_all(List).
