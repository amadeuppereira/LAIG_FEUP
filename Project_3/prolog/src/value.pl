/**
 * ===== ===== ===== ===== BOARD EVALUATIONS ===== ===== ===== =====
 *
 *   There are a few ways to use evaluate/2 to rank board positions.
 * Common among them is the need to evaluate all R rows, all C columns,
 * all R+C-1 left diagonals and all R+C-1 right diagonals, for a
 * total of 3R+3C-2 lists.
 * 
 *   For a 19x19 board this is 112 evaluate/2 calls.
 *   For a 13x13 board this is 76 evaluate/2 calls.
 *   For a 9x9 board this is 52 evaluate/2 calls.
 *   
 *   So we make a predicate evaluate_board/2 which just evaluates a Board
 * in its entirety: all rows, all columns, all diagonals.
 *
 *   We store the Board's value in a compound val/4:
 *                       val(RowV,ColV,LeftV,RightV)
 * whose args are lists containing the values of the successive rows, column,
 * left diagonals and right diagonals respectively. The diagonals are ordered
 * by matrix_*_diagonal_index/3.
 *
 *   Suppose we have a Board with value V0, and we want to choose the best
 * move for White. Say Board has E empty positions. Then White has E possible
 * moves, some of them pretty stupid, others pretty good, others sometimes forced
 * given the board position. 
 *   Placing a stone in position (R,C) requires reevaluating only row R, column C,
 * and the diagonals passing through (R,C) as long as the move captured no enemy
 * stones. If it did capture enemy stones, we have to reevaluate those now empty
 * positions as well (meaning row, column and diagonals passing through them).
 *
 *   This way we make a predicate reevaluate_board/4 which takes a Board, the
 * position where a new piece has been placed on the Board, the previous
 * val/4 compound, and computes a new val/4 compound by only reevaluating
 * one row, one column, and one of each diagonal. This means a total of four
 * evaluate/2 calls.
 *
 *   Now, we have to do this for each empty position on the Board. Suppose
 * E ~ 80% of the Board, which should be the average.
 *
 *   For a 19x19 board this is 4*0.80*19*19 = 1155 evaluate/2 calls.
 *   For a 13x13 board this is 4*0.80*13*13 = 541 evaluate/2 calls.
 *   For a 9x9 board this is 4*0.80*9*9 = 259 evaluate/2 calls.
 */

/**
 * sumval/2
 * sumval(+Val, -TotalValue).
 *   Sums up the values in a val/4.
 */
sumval(Val, TotalValue) :-
    Val = val(RowV,ColV,LeftV,RightV),
    sumlist(RowV, RowTotal),
    sumlist(ColV, ColTotal),
    sumlist(LeftV, LeftTotal),
    sumlist(RightV, RightTotal), !,
    TotalValue is integer(RowTotal + ColTotal + LeftTotal + RightTotal), !.

/**
 * totalval/3
 * totalval(+Val, +Cap, -TotalValue).
 *   Sums up the values in a val/4 and a cap [Wc,Bc].
 */
totalval(Val, Cap, TotalValue) :-
    sumval(Val, ValValue),
    captures_score(Cap, CapValue),
    TotalValue is integer(ValValue + CapValue), !.

/**
 * evaluate_board/2
 * evaluate_board(+Board, -Val).
 *   Evaluate every row, column and diagonal of Board, storing the results
 *   in Row, Col, Left and Right, which are lists enumerating said rows,
 *   columns, left and right diagonals respectively.
 */
evaluate_board(Board, Val) :-
    Val = val(RowV,ColV,LeftV,RightV),
    transpose(Board, ColList),
    matrix_left_diagonals(Board, LeftList),
    matrix_right_diagonals(Board, RightList),
    map(evaluate, Board, RowV), !,
    map(evaluate, ColList, ColV), !,
    map(evaluate, LeftList, LeftV), !,
    map(evaluate, RightList, RightV), !.

/**
 * reevaluate_cell/4
 * reevaluate_cell(+[R,C], +Board, +OldVal, -NewVal).
 *   Reevaluate row, column and diagonals passing through cell (R,C),
 *   as a new piece has been placed there.
 */
reevaluate_cell([R,C], Board, OldVal, NewVal) :-
    OldVal = val(RowV,ColV,LeftV,RightV),
    NewVal = val(NewRowV,NewColV,NewLeftV,NewRightV), !,
    matrix_length(Board, _, ColSize),
    matrix_left_diagonal_index(LeftI, [R,C], ColSize),
    matrix_right_diagonal_index(RightI, [R,C], ColSize), !,
    matrix_row(R, Board, RowList),
    matrix_col(C, Board, ColList),
    matrix_left_diagonal([R,C], Board, LeftList),
    matrix_right_diagonal([R,C], Board, RightList), !,
    evaluate(RowList, RowValue), !,
    evaluate(ColList, ColValue), !,
    evaluate(LeftList, LeftValue), !,
    evaluate(RightList, RightValue), !,
    selectnth1(_, RowV, RowValue, NewRowV, R),
    selectnth1(_, ColV, ColValue, NewColV, C),
    selectnth1(_, LeftV, LeftValue, NewLeftV, LeftI),
    selectnth1(_, RightV, RightValue, NewRightV, RightI), !.

/**
 * reevaluate_board/5
 * reevaluate_board(+OldBoard, +NewBoard, +OldVal, -NewVal).
 *   Takes a board OldBoard and a new board NewBoard, finds the positions
 *   in which they differ, and computes new val/4 NewVal from OldVal.
 */
reevaluate_board(OldBoard, NewBoard, OldVal, NewVal) :-
    findall(P, matrix_differentnth1(_, OldBoard, _, NewBoard, P), Cells), !,
    (   foreach(Position, Cells),
        fromto(OldVal, InVal, OutVal, NewVal),
        param(NewBoard)
    do  reevaluate_cell(Position, NewBoard, InVal, OutVal)
    ), !.

/**
 * value/2
 * value(+Game, -Value).
 */
value(Game, Value) :-
    Game = game(Board, _, Cap, _, _),
    evaluate_board(Board, Val),
    totalval(Val, Cap, Value).
