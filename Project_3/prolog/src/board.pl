/**
 * make_board/2
 * make_board(+Size, ?Board).
 *   Constructs a SizexSize board with no pieces (all c) to output Board.
 */
make_board(Size, Board) :- Size > 0, fill_n(Size, c, Row), fill_n(Size, Row, Board).

/**
 * board_size/2
 * board_size(+Board, ?Size).
 */
board_size(Board, Size) :- matrix_proper_length(Board, Size, Size).

/**
 * list_reversal/2, board_reversal/2
 * list_reversal(?WList, ?BList).
 * board_reversal(?WBoard, ?BBoard).
 *   Changes white pieces to black pieces and vice versa.
 */
reversal(c, c).
reversal(w, b).
reversal(b, w).
reversal('W', 'B').
reversal('B', 'W').

list_reversal(WList, BList) :- map(reversal, WList, BList).

board_reversal(WBoard, BBoard) :- matrix_map(reversal, WBoard, BBoard).

/**
 * board_center/2
 * board_center(+Board, -Center).
 *   Asserts that Center is the position on the center of Board.
 */
board_center(Board, [Center,Center]) :-
    board_size(Board, S),
    Center is integer((S+1)/2).

/**
 * board_center_range/2
 * board_center_range(+Board, -Range).
 *   Asserts that Range is the 5x5 box surrounding the center of Board.
 */
board_center_range(Board, [[Min,Max],[Min,Max]]) :-
    board_size(Board, S),
    C is integer((S+1)/2),
    Min is C-2, Max is C+2.

/**
 * five_board/2
 * five_board(+Board, +P).
 *   Verifies if the Board position has a five-in-a-row for player P.
 */
five_board(Board, P) :- consecutive_matrix(Board, P, 5).

/**
 * check_dead_stones_left/2
 * check_dead_stones_left(+P, +L).
 *   Remember: suicides are not allowed! That's what the caps
 *   trick is for, and why we have to check left and right.
 */
check_dead_stones_left(w, L) :- segment(L, [w,b,b,'W']).
check_dead_stones_left(b, L) :- segment(L, [b,w,w,'B']).

/**
 * check_dead_stones_right/2
 * check_dead_stones_right(+P, +L).
 *   Remember: suicides are not allowed! That's what the caps
 *   trick is for, and why we have to check left and right.
 */
check_dead_stones_right(w, L) :- segment(L, ['W',b,b,w]).
check_dead_stones_right(b, L) :- segment(L, ['B',w,w,b]).

/**
 * remove_dead_stones_rowleft/5
 * remove_dead_stones_rowleft(+P, +Board, +[R,C], ?NewBoard, ?Captures).
 *   Remove dead stones on the row, left of (R,C), killed by P.
 */
remove_dead_stones_rowleft(P, Board, [R,_], Board, 0) :-
    matrix_row(R, Board, RowList),
    \+ check_dead_stones_left(P, RowList).

remove_dead_stones_rowleft(P, Board, [R,C], NewBoard, 2) :-
    matrix_row(R, Board, RowList),
    check_dead_stones_left(P, RowList),
    C1 is C - 1, C2 is C - 2,
    matrix_selectnth1(_, Board, c, Inter, [R,C1]),
    matrix_selectnth1(_, Inter, c, NewBoard, [R,C2]).

/**
 * remove_dead_stones_rowright/5
 * remove_dead_stones_rowright(+P, +Board, +[R,C], ?NewBoard, ?Captures).
 *   Remove dead stones on the row, right of (R,C), killed by P.
 */
remove_dead_stones_rowright(P, Board, [R,_], Board, 0) :-
    matrix_row(R, Board, RowList),
    \+ check_dead_stones_right(P, RowList).

remove_dead_stones_rowright(P, Board, [R,C], NewBoard, 2) :-
    matrix_row(R, Board, RowList),
    check_dead_stones_right(P, RowList),
    C1 is C + 1, C2 is C + 2,
    matrix_selectnth1(_, Board, c, Inter, [R,C1]),
    matrix_selectnth1(_, Inter, c, NewBoard, [R,C2]).

/**
 * remove_dead_stones_colabove/5
 * remove_dead_stones_colabove(+P, +Board, +[R,C], ?NewBoard, ?Captures).
 *   Remove dead stones on the column, above of (R,C), killed by P.
 */
remove_dead_stones_colabove(P, Board, [_,C], Board, 0) :-
    matrix_col(C, Board, ColList),
    \+ check_dead_stones_left(P, ColList).

remove_dead_stones_colabove(P, Board, [R,C], NewBoard, 2) :-
    matrix_col(C, Board, ColList),
    check_dead_stones_left(P, ColList),
    R1 is R - 1, R2 is R - 2,
    matrix_selectnth1(_, Board, c, Inter, [R1,C]),
    matrix_selectnth1(_, Inter, c, NewBoard, [R2,C]).

/**
 * remove_dead_stones_colbelow/5
 * remove_dead_stones_colbelow(+P, +Board, +[R,C], ?NewBoard, ?Captures).
 *   Remove dead stones on the column, below of (R,C), killed by P.
 */
remove_dead_stones_colbelow(P, Board, [_,C], Board, 0) :-
    matrix_col(C, Board, ColList),
    \+ check_dead_stones_right(P, ColList).

remove_dead_stones_colbelow(P, Board, [R,C], NewBoard, 2) :-
    matrix_col(C, Board, ColList),
    check_dead_stones_right(P, ColList),
    R1 is R + 1, R2 is R + 2,
    matrix_selectnth1(_, Board, c, Inter, [R1,C]),
    matrix_selectnth1(_, Inter, c, NewBoard, [R2,C]).

/**
 * remove_dead_stones_leftleft/5
 * remove_dead_stones_leftleft(+P, +Board, +[R,C], ?NewBoard, ?Captures).
 *   Remove dead stones on the left diagonal, left of (R,C), killed by P.
 */
remove_dead_stones_leftleft(P, Board, [R,C], Board, 0) :-
    matrix_left_diagonal([R,C], Board, DiagonalList),
    \+ check_dead_stones_left(P, DiagonalList).

remove_dead_stones_leftleft(P, Board, [R,C], NewBoard, 2) :-
    matrix_left_diagonal([R,C], Board, DiagonalList),
    check_dead_stones_left(P, DiagonalList),
    R1 is R - 1, R2 is R - 2,
    C1 is C - 1, C2 is C - 2,
    matrix_selectnth1(_, Board, c, Inter, [R1,C1]),
    matrix_selectnth1(_, Inter, c, NewBoard, [R2,C2]).

/**
 * remove_dead_stones_leftright/5
 * remove_dead_stones_leftright(+P, +Board, +[R,C], ?NewBoard, ?Captures).
 *   Remove dead stones on the left diagonal, right of (R,C), killed by P.
 */
remove_dead_stones_leftright(P, Board, [R,C], Board, 0) :-
    matrix_left_diagonal([R,C], Board, DiagonalList),
    \+ check_dead_stones_right(P, DiagonalList).

remove_dead_stones_leftright(P, Board, [R,C], NewBoard, 2) :-
    matrix_left_diagonal([R,C], Board, DiagonalList),
    check_dead_stones_right(P, DiagonalList),
    R1 is R + 1, R2 is R + 2,
    C1 is C + 1, C2 is C + 2,
    matrix_selectnth1(_, Board, c, Inter, [R1,C1]),
    matrix_selectnth1(_, Inter, c, NewBoard, [R2,C2]).

/**
 * remove_dead_stones_rightleft/5
 * remove_dead_stones_rightleft(+P, +Board, +[R,C], ?NewBoard, ?Captures).
 *   Remove dead stones on the right diagonal, left of (R,C), killed by P.
 */
remove_dead_stones_rightleft(P, Board, [R,C], Board, 0) :-
    matrix_right_diagonal([R,C], Board, DiagonalList),
    \+ check_dead_stones_left(P, DiagonalList).

remove_dead_stones_rightleft(P, Board, [R,C], NewBoard, 2) :-
    matrix_right_diagonal([R,C], Board, DiagonalList),
    check_dead_stones_left(P, DiagonalList),
    R1 is R - 1, R2 is R - 2,
    C1 is C + 1, C2 is C + 2,
    matrix_selectnth1(_, Board, c, Inter, [R1,C1]),
    matrix_selectnth1(_, Inter, c, NewBoard, [R2,C2]).

/**
 * remove_dead_stones_rightright/5
 * remove_dead_stones_rightright(+P, +Board, +[R,C], ?NewBoard, ?Captures).
 *   Remove dead stones on the right diagonal, right of (R,C), killed by P.
 */
remove_dead_stones_rightright(P, Board, [R,C], Board, 0) :-
    matrix_right_diagonal([R,C], Board, DiagonalList),
    \+ check_dead_stones_right(P, DiagonalList).

remove_dead_stones_rightright(P, Board, [R,C], NewBoard, 2) :-
    matrix_right_diagonal([R,C], Board, DiagonalList),
    check_dead_stones_right(P, DiagonalList),
    R1 is R + 1, R2 is R + 2,
    C1 is C - 1, C2 is C - 2,
    matrix_selectnth1(_, Board, c, Inter, [R1,C1]),
    matrix_selectnth1(_, Inter, c, NewBoard, [R2,C2]).

/**
 * remove_dead_stones/5
 * remove_dead_stones(+P, +Board, +Move, ?NewBoard, ?Captures).
 *   Remove all dead stones (rows, columns and diagonals).
 *   Remember: suicides are not allowed!
 */
remove_dead_stones(P, Board, Move, NewBoard, Captures) :-
    remove_dead_stones_rowleft(P, Board, Move, New1, C1),
    remove_dead_stones_rowright(P, New1, Move, New2, C2),
    remove_dead_stones_colabove(P, New2, Move, New3, C3),
    remove_dead_stones_colbelow(P, New3, Move, New4, C4),
    remove_dead_stones_leftleft(P, New4, Move, New5, C5),
    remove_dead_stones_leftright(P, New5, Move, New6, C6),
    remove_dead_stones_rightleft(P, New6, Move, New7, C7),
    remove_dead_stones_rightright(P, New7, Move, NewBoard, C8),
    Captures is C1 + C2 + C3 + C4 + C5 + C6 + C7 + C8.

/**
 * place_stone/5
 * place_stone(+P, +Board, +Move, ?NewBoard, ?Captures).
 *   Places a stone P (w or b) on Board at position (R,C).
 *   Doing so removes captured stones from the board, binding the
 *   number of removed stones to Captures.
 */
place_stone(w, Board, Move, NewBoard, Captures) :-
	matrix_selectnth1(c, Board, 'W', WBoard, Move),
    remove_dead_stones(w, WBoard, Move, Removed, Captures),
    matrix_selectnth1('W', Removed, w, NewBoard, Move).

place_stone(b, Board, Move, NewBoard, Captures) :-
    matrix_selectnth1(c, Board, 'B', BBoard, Move),
    remove_dead_stones(b, BBoard, Move, Removed, Captures),
    matrix_selectnth1('B', Removed, b, NewBoard, Move).

/**
 * valid_moves/2
 * valid_moves(+Board, -ListOfMoves).
 *   List of possible moves for either player in the Board.
 *   See also valid_moves/[3,4]
 */
valid_moves(Board, ListOfMoves) :- empty_positions(Board, ListOfMoves).

/**
 * move/3
 * move(+Move, +Game, -NewGame).
 */
move(Move, Game, NewGame) :-
    Game = game(Board, P, Cap, Turn, Options),
    NewGame = game(NewBoard, Q, NewCap, NextTurn, Options),
    other_player(P, Q),
    place_stone(P, Board, Move, NewBoard, Captures),
    add_captures(P, Captures, Cap, NewCap),
    NextTurn is Turn + 1.

/**
 * add_captures/4
 * add_captures(+P, +Captures, +[Wc,Bc], -[NewWc,NewBc]).
 */
add_captures(w, Captures, [Wc,Bc], [NewWc,Bc]) :- NewWc is Wc + Captures.
add_captures(b, Captures, [Wc,Bc], [Wc,NewBc]) :- NewBc is Bc + Captures.

/**
 * empty_position/2
 * empty_position(+Board, ?[R,C]).
 *   Asserts (R,C) is an empty position (c) on the Board.
 *   Provides all such positions.
 */
empty_position(Board, [R,C]) :- matrixnth1([R,C], Board, c).

/**
 * empty_positions/[2,3]
 * empty_positions(+Board, -ListOfMoves).
 * empty_positions(+Board, +Range, -ListOfMoves).
 *   Gets all empty positions on the board, possibly only within a range.
 */
empty_positions(Board, ListOfMoves) :-
    findall(X, empty_position(Board, X), ListOfMoves), !.

empty_positions(Board, Range, FilteredListOfMoves) :-
    empty_positions(Board, ListOfMoves),
    include(matrix_between(Range), ListOfMoves, FilteredListOfMoves), !.

/**
 * empty_positions_within_boundary/[2,3]
 * empty_positions_within_boundary(+Board, -ListOfMoves).
 * empty_positions_within_boundary(+Board, +Padding, -ListOfMoves).
 */
empty_positions_within_boundary(Board, ListOfMoves) :-
    board_boundary(Board, 0, Range),
    empty_positions(Board, Range, ListOfMoves), !.

empty_positions_within_boundary(Board, Padding, ListOfMoves) :-
    board_boundary(Board, Padding, Range), 
    empty_positions(Board, Range, ListOfMoves), !.

/**
 * valid_move/4
 * valid_move(+Board, +Turn, +Tournament, +Move).
 *    Check if a given move Move is valid in the given Turn
 */
valid_move(Board, 0, _, Center) :-
    board_center(Board, Center).

valid_move(Board, 2, Tournament, Move) :-
    valid_moves(Board, 2, Tournament, ListOfMoves), !,
    contains(ListOfMoves, Move), !.

valid_move(Board, Turn, _, Move) :-
    Turn \= 0, Turn \= 2, !,
    valid_moves(Board, Turn, ListOfMoves),
    contains(ListOfMoves, Move).

/**
 * valid_moves/3
 * valid_moves(+Board, +Turn, -ListOfMoves).
 *   Gets a list with all the valid moves (does not depend on the player).
 */

valid_moves(Board, 0, [Center]) :- board_center(Board, Center), !.

valid_moves(Board, 2, ListOfMoves) :- 
    board_center_range(Board, CenterRange),
    empty_positions(Board, CenterRange, ExcludedMoves),
    empty_positions(Board, AllMoves),
    exclude(contains(ExcludedMoves), AllMoves, ListOfMoves), !.

valid_moves(Board, Turn, ListOfMoves) :-
    Turn \= 0, Turn \= 2, !,
    empty_positions(Board, ListOfMoves), !.

/**
 * valid_moves/4
 * valid_moves(+Board, +Turn, +Tournament, -ListOfMoves).
 *   Gets a list the valid moves for turn 2 taking in consideration Tournament.
 */
valid_moves(Board, 0, _, [Center]) :- board_center(Board, Center), !.

valid_moves(Board, 2, true, ListOfMoves) :- 
    board_center_range(Board, CenterRange),
    empty_positions(Board, CenterRange, ExcludedMoves),
    empty_positions(Board, AllMoves),
    exclude(contains(ExcludedMoves), AllMoves, ListOfMoves), !.

valid_moves(Board, 2, false, ListOfMoves) :- 
    empty_positions(Board, ListOfMoves).

valid_moves(Board, Turn, _, ListOfMoves) :-
    Turn \= 0, Turn \= 2, !,
    empty_positions(Board, ListOfMoves), !.

/**
 * valid_moves/5
 * valid_moves(+Board, +Range, +Turn, +Tournament, -ListOfMoves).
 *   Gets a list with all the valid moves within a given range
 *  having in consideration the Tournament rule.
 *   (does not depend on the player).
 */
valid_moves(Board, _, 0, _, [Center]) :-
    board_center(Board, Center), !.

valid_moves(Board, Range, 2, true, ListOfMoves) :-
    board_center_range(Board, CenterRange), !,
    empty_positions(Board, CenterRange, ExcludedMoves),
    empty_positions(Board, Range, AllMoves),
    exclude(contains(ExcludedMoves), AllMoves, ListOfMoves), !.

valid_moves(Board, Range, 2, false, ListOfMoves) :-
    empty_positions(Board, Range, ListOfMoves), !.

valid_moves(Board, Range, _, _, ListOfMoves) :-
    empty_positions(Board, Range, ListOfMoves), !.

/**
 * valid_moves_within_boundary/[3-5]
 * valid_moves_within_boundary(+Board, +Turn, -ListOfMoves).
 * valid_moves_within_boundary(+Board, +Padding, +Turn, -ListOfMoves).
 * valid_moves_within_boundary(+Board, +Padding, +Turn, +Tournament, -ListOfMoves)
 */
valid_moves_within_boundary(Board, 0, [Center]) :-
    board_center(Board, Center), !.

valid_moves_within_boundary(Board, Turn, ListOfMoves) :-
    board_boundary(Board, Range),
    valid_moves(Board, Range, Turn, true, ListOfMoves).


valid_moves_within_boundary(Board, _, 0, [Center]) :-
    board_center(Board, Center), !.

valid_moves_within_boundary(Board, Padding, Turn, ListOfMoves) :-
    board_boundary(Board, Padding, Range),
    valid_moves(Board, Range, Turn, true, ListOfMoves).


valid_moves_within_boundary(Board, _, 0, _, [Center]) :-
    board_center(Board, Center), !.

valid_moves_within_boundary(Board, Padding, Turn, Tournament, ListOfMoves) :-
    board_boundary(Board, Padding, Range),
    valid_moves(Board, Range, Turn, Tournament, ListOfMoves).

/**
 * board_boundary/[2,3]
 * board_boundary(+Board, -Range).
 * board_boundary(+Board, +Padding, -Range).
 */
board_boundary(Board, Range) :-
    matrix_boundary(Board, c, Range).

board_boundary(Board, Padding, Range) :-
    matrix_boundary(Board, c, Padding, Range).
