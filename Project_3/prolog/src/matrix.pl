/**
 * is_matrix/1
 * is_matrix(?Matrix).
 *   True if Matrix is a (rectangular) matrix.
 */
is_matrix(Matrix) :-
    is_list(Matrix),
    a_all_of(proper_length, _, Matrix),
    clear_empty_list(Matrix, Matrix).

/**
 * is_list_of_lists/1
 * is_list_of_lists(?L).
 *   True if L is a proper list of proper lists.
 */
is_list_of_lists(L) :-
    is_list(L),
    all_of(is_list, L).

/**
 * matrix_size/3, matrix_length/3, matrix_proper_size/3, matrix_proper_length/3
 * matrix_size(?Matrix, ?R, ?C).
 * matrix_length(?Matrix, ?R, ?C).
 * matrix_proper_size(+Matrix, ?R, ?C).
 * matrix_proper_length(+Matrix, ?R, ?C).
 *   The matrix Matrix is made up of R rows and C columns.
 */
matrix_size(Matrix, R, C) :-
    length(Matrix, R),
    a_all_of(length, C, Matrix).

matrix_length(Matrix, R, C) :-
    length(Matrix, R),
    a_all_of(length, C, Matrix).

matrix_proper_size(Matrix, R, C) :-
    proper_length(Matrix, R),
    a_all_of(proper_length, C, Matrix).

matrix_proper_length(Matrix, R, C) :-
    proper_length(Matrix, R),
    a_all_of(proper_length, C, Matrix).

/**
 * matrixnth0/3
 * matrixnth0(?[R,C], ?Matrix, ?Elem).
 *   Get element at position (R,C) in Matrix, 0-indexed.
 */
matrixnth0([R,C], Matrix, Elem) :-
    nth0(R, Matrix, RowList),
    nth0(C, RowList, Elem).

/**
 * matrixnth1/3
 * matrixnth1(?[R,C], ?Matrix, ?Elem).
 *   Get element at position (R,C) in Matrix, 1-indexed.
 */
matrixnth1([R,C], Matrix, Elem) :-
    nth1(R, Matrix, RowList),
    nth1(C, RowList, Elem).

/**
 * matrix_select/4
 * matrix_select(?X, ?XMatrix, ?Y, ?YMatrix).
 *   Like select/4 but for matrices.
 */
matrix_select(X, XMatrix, Y, YMatrix) :-
    select(Xlist, XMatrix, Ylist, YMatrix),
    select(X, Xlist, Y, Ylist).

/**
 * matrix_selectnth0/5, matrix_selectnth1/5
 * matrix_selectnth0(?X, ?XMatrix, ?Y, ?YMatrix, ?[R,C]).
 * matrix_selectnth1(?X, ?XMatrix, ?Y, ?YMatrix, ?[R,C]).
 *   Idem selectnth0/5 and selectnth1/5 for matrices.
 */
matrix_selectnth0(X, XMatrix, Y, YMatrix, [R,C]) :-
    selectnth0(Xlist, XMatrix, Ylist, YMatrix, R),
    selectnth0(X, Xlist, Y, Ylist, C).

matrix_selectnth1(X, XMatrix, Y, YMatrix, [R,C]) :-
    selectnth1(Xlist, XMatrix, Ylist, YMatrix, R),
    selectnth1(X, Xlist, Y, Ylist, C).

/**
 * matrix_selectchknth0/5, matrix_selectchknth1/5
 * matrix_selectchknth0(?X, ?XMatrix, ?Y, ?YMatrix, ?[R,C]).
 * matrix_selectchknth1(?X, ?XMatrix, ?Y, ?YMatrix, ?[R,C]).
 *   Idem selectchknth0/5 and selectchknth1/5 for matrices.
 */
matrix_selectchknth0(X, XMatrix, Y, YMatrix, [R,C]) :-
    matrix_selectnth0(X, XMatrix, Y, YMatrix, [R,C]), !.

matrix_selectchknth1(X, XMatrix, Y, YMatrix, [R,C]) :-
    matrix_selectnth1(X, XMatrix, Y, YMatrix, [R,C]), !.

/**
 * matrix_row/3, matrix_col/3, matrix_cell/3
 * matrix_row(+R, +Matrix, -RowList).
 * matrix_col(+C, +Matrix, -ColList).
 * matrix_cell(+[R,C], +Matrix, -Cell).
 *   Conventions the use of 1-indexing for matrices.
 */
matrix_row(R, Matrix, RowList) :-
    nth1(R, Matrix, RowList), !.

matrix_col(C, Matrix, ColList) :-
    map(nth1(C), Matrix, ColList), !.

matrix_cell([R,C], Matrix, Cell) :-
    matrixnth1([R,C], Matrix, Cell), !.

/**
 * matrix_remove_row/3, matrix_remove_col/3, matrix_remove_rowcol/3,
 * matrix_remove_rows/3, matrix_remove_cols/3
 * matrix_remove_row(+R, +Matrix, -NewMatrix).
 * matrix_remove_col(+C, +Matrix, -NewMatrix).
 * matrix_remove_rowcol(+[R,C], +Matrix, -NewMatrix).
 * matrix_remove_rows(+[R1,R2], +Matrix, -NewMatrix).
 * matrix_remove_cols(+[C1,C2], +Matrix, -NewMatrix).
 * matrix_remove_rowscols(+[[R1,R2],[C1,C2]], +Matrix, -NewMatrix).
 */
matrix_remove_row(R, Matrix, NewMatrix) :-
    remove(R, Matrix, NewMatrix).

matrix_remove_col(R, Matrix, NewMatrix) :-
    map(remove(R), Matrix, Intermediate),
    clear_empty_list(Intermediate, NewMatrix), !.

matrix_remove_rowcol([R,C], Matrix, NewMatrix) :-
    matrix_remove_row(R, Matrix, Intermediate),
    matrix_remove_col(C, Intermediate, NewMatrix).

matrix_remove_rows([R1,R2], Matrix, NewMatrix) :-
    rangeremove([R1,R2], Matrix, NewMatrix).

matrix_remove_cols([C1,C2], Matrix, NewMatrix) :-
    map(rangeremove([C1,C2]), Matrix, NewMatrix).

matrix_remove_rowscols([R,C], Matrix, NewMatrix) :-
    matrix_remove_rows(R, Matrix, Intermediate),
    matrix_remove_cols(C, Intermediate, NewMatrix).

/**
 * matrix_row_reverse/2, matrix_col_reverse/2, matrix_rowcol_reverse/2
 * matrix_row_reverse(?Matrix, ?RowReversed).
 * matrix_col_reverse(?Matrix, ?ColReversed).
 * matrix_rowcol_reverse(?Matrix, ?RowColReversed).
 *   Reverses matrix horizontally, vertically, and both, respectively.
 */
matrix_row_reverse(Matrix, RowReversed) :-
    reverse(Matrix, RowReversed), !.

matrix_col_reverse(Matrix, ColReversed) :-
    map(reverse, Matrix, ColReversed), !.

matrix_rowcol_reverse(Matrix, RowColReversed) :-
    reverse(Matrix, RowReversed), !,
    map(reverse, RowReversed, RowColReversed), !.

/**
 * matrix_range/3
 * matrix_range(+Matrix, ?SubMatrix, ?[RowRange,ColRange]).
 *   Extracts a submatrix from Matrix. Like range/3 but for matrices.
 */
matrix_range(Matrix, SubMatrix, [RowRange,ColRange]) :-
    range(Matrix, Intermediate, RowRange),
    a_map(range, ColRange, Intermediate, Unclean),
    clear_empty_list(Unclean, SubMatrix).

/**
 * submatrix/4
 * submatrix(+Matrix, ?SubMatrix, ?[RBegin,RLength,RAfter], ?[CBegin,CLength,CAfter]).
 *   Like sublist/5 but for matrices.
 */
submatrix(Matrix, SubMatrix, [RBegin, RLength, RAfter], [CBegin, CLength, CAfter]) :-
    sublist(Matrix, RowsSublist, RBegin, RLength, RAfter),
    la_map(sublist, [CBegin, CLength, CAfter], RowsSublist, SubMatrix).

/**
 * matrix_main_diagonal/2
 * matrix_main_diagonal(+Matrix, -Diagonal).
 *   Extracts the main diagonal from Matrix (top-left to bottom-right).
 */
matrix_main_diagonal([], []) :- !.
matrix_main_diagonal(Matrix, [E|Tail]) :-
    matrix_cell([1,1], Matrix, E),
    matrix_remove_rowcol([1,1], Matrix, Minor),
    matrix_main_diagonal(Minor, Tail).

/**
 * matrix_left_diagonal/3
 * matrix_left_diagonal(+[R,C], +Matrix, -Diagonal).
 *   Extracts a diagonal parallel to the main diagonal passing through (R,C).
 */
matrix_left_diagonal([R,C], Matrix, Diagonal) :-
    R > C, !, I is R - C,
    matrix_remove_rows([1,I], Matrix, Bottom),
    matrix_main_diagonal(Bottom, Diagonal);
    R < C, !, I is C - R,
    matrix_remove_cols([1,I], Matrix, Right),
    matrix_main_diagonal(Right, Diagonal);
    matrix_main_diagonal(Matrix, Diagonal).

/**
 * matrix_right_diagonal/3
 * matrix_right_diagonal(+[R,C], +Matrix, -Diagonal).
 *   Extracts a diagonal perpendicular to the main diagonal passing through (R,C).
 */
matrix_right_diagonal([R,C], Matrix, Diagonal) :-
    matrix_proper_length(Matrix, _, MCols),
    Cl is MCols - C + 1,
    matrix_col_reverse(Matrix, ColReversed),
    matrix_left_diagonal([R,Cl], ColReversed, Diagonal).

/**
 * matrix_left_diagonal_index/3
 * matrix_left_diagonal_index(?I, ?[R,C], +ColSize).
 *   Associates with every left diagonal an index I.
 *   If (R,C) is given, I is calculated for the diagonal passing
 *   through said position. If I is given, (R,C) is chosen lying on
 *   the first row or the first column.
 */
matrix_left_diagonal_index(I, [R,C], ColSize) :-
    var(I), !,
    I is ColSize - C + R.

matrix_left_diagonal_index(I, [1,C], ColSize) :-
    integer(I), I < ColSize, !,
    C is ColSize - I + 1.

matrix_left_diagonal_index(I, [R,1], ColSize) :-
    integer(I), I >= ColSize, !,
    R is I - ColSize + 1.

/**
 * matrix_right_diagonal/3
 */
matrix_right_diagonal_index(I, [R,C], _) :-
    var(I), !,
    I is R + C - 1.

matrix_right_diagonal_index(I, [1,C], ColSize) :-
    integer(I), I < ColSize, !,
    C is I.

matrix_right_diagonal_index(I, [R,ColSize], ColSize) :-
    itneger(I), I >= ColSize, !,
    R is I - ColSize + 1.

/**
 * matrix_left_diagonals/2, matrix_right_diagonals/2, matrix_diagonals/2
 */
matrix_left_diagonals(Matrix, LeftDiagonals) :-
    matrix_proper_length(Matrix, R, C),
    Upper is R + C - 1,
    numlist(1, Upper, Is),
    a_map(matrix_left_diagonal_index, C, Is, RCs),
    b_map(matrix_left_diagonal, Matrix, RCs, LeftDiagonals).

matrix_right_diagonals(Matrix, RightDiagonals) :-
    matrix_col_reverse(Matrix, ColReversed),
    matrix_left_diagonals(ColReversed, RightDiagonals).

matrix_diagonals(Matrix, Diagonals) :-
    matrix_left_diagonals(Matrix, Lefts),
    matrix_right_diagonals(Matrix, Rights),
    append(Lefts, Rights, Diagonals).

/**
 * matrix_lists/2
 * matrix_lists(+Matrix, -Lists).
 *   Extracts a list containing the matrix's rows, columns and diagonals, unidentified.
 */
matrix_lists(Matrix, Lists) :-
    transpose(Matrix, Transpose),
    matrix_diagonals(Matrix, Diagonals),
    append([Matrix, Transpose, Diagonals], Lists).

/**
 * matrix_map/3
 * matrix_map(:P, ?XMatrix, ?YMatrix).
 *   Succeeds when P(X, Y) for each corresponding X in XMatrix and Y in YMatrix.
 *   Like map/3 but for matrices.
 */
matrix_map(P, XMatrix, YMatrix) :-
    (   foreach(XRow, XMatrix),
        foreach(YRow, YMatrix),
        param(P)
    do  (   foreach(X, XRow),
            foreach(Y, YRow),
            param(P)
        do  call(P, X, Y)
        )
    ).

/**
 * matrix_map/4
 * matrix_map(:P, ?XMatrix, ?YMatrix, ?ZMatrix).
 *   Succeeds when P(X, Y, Z) for each corresponding X in XMatrix,º
 *   Y in YMatrix, Z in ZMatrix.
 *   Like map/4 but for matrices.
 */
matrix_map(P, XMatrix, YMatrix, ZMatrix) :-
    (   foreach(XRow, XMatrix),
        foreach(YRow, YMatrix),
        foreach(ZRow, ZMatrix),
        param(P)
    do  (   foreach(X, XRow),
            foreach(Y, YRow),
            foreach(Z, ZRow),
            param(P)
        do  call(P, X, Y, Z)
        )
    ).

/**
 * matrix_a_map/4
 * matrix_a_map(:P, ?A, ?XMatrix, ?YMatrix).
 *   Succeeds when P(X, Y, A) for each corresponding X in XMatrix and Y in YMatrix.
 *   Like a_map/4 but for matrices.
 */
matrix_a_map(P, A, XMatrix, YMatrix) :-
    (   foreach(XRow, XMatrix),
        foreach(YRow, YMatrix),
        param(P),
        param(A)
    do  (   foreach(X, XRow),
            foreach(Y, YRow),
            param(P),
            param(A)
        do  call(P, X, Y, A)
        )
    ).

/**
 * matrix_a_map/5
 * matrix_a_map(:P, ?A, ?XMatrix, ?YMatrix, ?ZMatrix).
 *   Succeeds when P(X, Y, A) for each corresponding X in XMatrix,
 *   Y in YMatrix, Z in ZMatrix.
 *   Like a_map/5 but for matrices.
 */
matrix_a_map(P, A, XMatrix, YMatrix, ZMatrix) :-
    (   foreach(XRow, XMatrix),
        foreach(YRow, YMatrix),
        foreach(ZRow, ZMatrix),
        param(P),
        param(A)
    do  (   foreach(X, XRow),
            foreach(Y, YRow),
            foreach(Z, ZRow),
            param(P),
            param(A)
        do  call(P, X, Y, Z, A)
        )
    ).

/**
 * matrix_b_map/4
 * matrix_b_map(:P, ?B, ?XMatrix, ?YMatrix).
 *   Succeeds when P(X, B, Y) for each corresponding X in XMatrix and Y in YMatrix.
 *   Like b_map/4 but for matrices.
 */
matrix_b_map(P, B, XMatrix, YMatrix) :-
    (   foreach(XRow, XMatrix),
        foreach(YRow, YMatrix),
        param(P),
        param(B)
    do  (   foreach(X, XRow),
            foreach(Y, YRow),
            param(P),
            param(B)
        do  call(P, X, B, Y)
        )
    ).


/**
 * matrix_la_map/4
 * matrix_la_map(:P, ?Args, ?XMatrix, ?YMatrix).
 *   Succeeds when P(X, Y, Args...) for each corresponding X in XMatrix and Y in YMatrix.
 *   Like la_map/4 but for matrices.
 */
matrix_la_map(P, Args, XMatrix, YMatrix) :-
    (   foreach(XRow, XMatrix),
        foreach(YRow, YMatrix),
        param(P),
        param(Args)
    do  (   foreach(X, XRow),
            foreach(Y, YRow),
            param(P),
            param(Args)
        do  apply(P, [X,Y|Args])
        )
    ).

/**
 * matrix_la_map/5
 * matrix_la_map(:P, ?Args, ?XMatrix, ?YMatrix, ?ZMatrix).
 *   Succeeds when P(X, Y, Z, Args...) for each corresponding X in XMatrix,
 *   Y in YMatrix, Z in ZMatrix.
 *   Like la_map/5 but for matrices.
 */
matrix_la_map(P, Args, XMatrix, YMatrix, ZMatrix) :-
    (   foreach(XRow, XMatrix),
        foreach(YRow, YMatrix),
        foreach(ZRow, ZMatrix),
        param(P),
        param(Args)
    do  (   foreach(X, XRow),
            foreach(Y, YRow),
            foreach(Z, ZRow),
            param(P),
            param(Args)
        do  apply(P, [X,Y,Z|Args])
        )
    ).

/**
 * matrix_lb_map/4
 * matrix_lb_map(:P, ?Args, ?XMatrix, ?YMatrix).
 *   Succeeds when P(X, Args..., Y) for each corresponding X in XMatrix and Y in YMatrix.
 *   Like lb_map/4 but for matrices.
 */
matrix_lb_map(P, Args, XMatrix, YMatrix) :-
    (   foreach(XRow, XMatrix),
        foreach(YRow, YMatrix),
        param(P),
        param(Args)
    do  (   foreach(X, XRow),
            foreach(Y, YRow),
            param(P),
            param(Args)
        do  (append([X|Args], [Y], A), apply(P, A))
        )
    ).

/**
 * consecutive_any_row(+Matrix, +Elem, +N).
 *   Asserts the matrix has N consecutive elements Elem along any row.
 */
consecutive_any_row(Matrix, Elem, N) :-
    l_any_of(consecutive, [Elem, N], Matrix).

/**
 * consecutive_any_col(+Matrix, +Elem, +N).
 *   Asserts the matrix has N consecutive elements Elem along any column.
 */
consecutive_any_col(Matrix, Elem, N) :-
    transpose(Matrix, Transpose),
    l_any_of(consecutive, [Elem, N], Transpose).

/**
 * consecutive_any_diag(+Matrix, +Elem, +N).
 *   Asserts the matrix has N consecutive elements Elem along any diagonal.
 */
consecutive_any_diag(Matrix, Elem, N) :-
    matrix_diagonals(Matrix, Diagonals), !,
    l_any_of(consecutive, [Elem, N], Diagonals).

/**
 * consecutive_matrix(+Matrix, +Elem, +N).
 *   Asserts the matrix has N consecutive elements Elem along any row, column or diagonal.
 */
consecutive_matrix(Matrix, Elem, N) :-
    consecutive_any_row(Matrix, Elem, N);
    consecutive_any_col(Matrix, Elem, N);
    consecutive_any_diag(Matrix, Elem, N).

/**
 * segment_any_row(+Matrix, +Segment).
 *   Asserts Matrix has Segment somewhere along any row.
 */
segment_any_row(Matrix, Segment) :-
    is_list(Segment),
    a_any_of(segment, Segment, Matrix), !.

/**
 * segment_any_col(+Matrix, +Segment).
 *   Asserts Matrix has Segment somewhere along any column.
 */
segment_any_col(Matrix, Segment) :-
    is_list(Segment),
    transpose(Matrix, Transpose), !,
    a_any_of(segment, Segment, Transpose), !.

/**
 * segment_any_diagonal(+Matrix, +Segment).
 *   Asserts Matrix has Segment somewhere along any diagonal.
 */
segment_any_diagonal(Matrix, Segment) :-
    is_list(Segment),
    matrix_diagonals(Matrix, Diagonals), !,
    a_any_of(segment, Segment, Diagonals), !.

/**
 * segment_matrix(+Matrix, +Segment).
 *   Asserts Matrix has Segment somewhere along any row, column or diagonal.
 */
segment_matrix(Matrix, Segment) :-
    segment_any_row(Matrix, Segment);
    segment_any_col(Matrix, Segment);
    segment_any_diagonal(Matrix, Segment).

/**
 * matrix_different/4
 * matrix_different(?X, ?XMatrix, ?Y, ?YMatrix).
 *   Like different/4 but for matrices.
 */
matrix_different(X, XMatrix, Y, YMatrix) :-
    different(XRow, XMatrix, YRow, YMatrix),
    different(X, XRow, Y, YRow).

/**
 * matrix_differentnth0/5, matrix_differentnth1/5
 * matrix_differentnth0(?X, ?XMatrix, ?Y, ?YMatrix, ?[R,C]).
 * matrix_differentnth1(?X, ?XMatrix, ?Y, ?YMatrix, ?[R,C]).
 *   Like differentnth0/5 and differentnth1/5 but for matrices.
 */
matrix_differentnth0(X, XMatrix, Y, YMatrix, [R,C]) :-
    differentnth0(XRow, XMatrix, YRow, YMatrix, R),
    differentnth0(X, XRow, Y, YRow, C).

matrix_differentnth1(X, XMatrix, Y, YMatrix, [R,C]) :-
    differentnth1(XRow, XMatrix, YRow, YMatrix, R),
    differentnth1(X, XRow, Y, YRow, C).

/**
 * matrix_boundary/[3,4]
 * matrix_boundary(+Matrix, +Elem, -[RowRange,ColRange]).
 * matrix_boundary(+Matrix, +Elem, +Padding, -[RowRange,ColRange]).
 */
matrix_boundary(Matrix, Elem, [RowRange,ColRange]) :-
    matrix_proper_length(Matrix, RowSize, ColSize),
    transpose(Matrix, Transposed),
    fill_n(ColSize, Elem, RowElem),
    fill_n(RowSize, Elem, ColElem),
    boundary(Matrix, RowElem, RowRange),
    boundary(Transposed, ColElem, ColRange).

matrix_boundary(Matrix, Elem, Padding, [RowRange,ColRange]) :-
    integer(Padding), !,
    matrix_boundary(Matrix, Elem, [Padding,Padding], [RowRange,ColRange]), !.

matrix_boundary(Matrix, Elem, [PadRows,PadCols], [RowRange,ColRange]) :-
    matrix_proper_length(Matrix, RowSize, ColSize),
    transpose(Matrix, Transposed),
    fill_n(ColSize, Elem, RowElem),
    fill_n(RowSize, Elem, ColElem),
    boundary(Matrix, RowElem, PadRows, RowRange), !,
    boundary(Transposed, ColElem, PadCols, ColRange).

/**
 * matrix_between/2
 * matrix_between(+[RowRange,ColRange], ?[R,C]).
 *   Like between/2 but for matrices.
 */
matrix_between([RowRange,ColRange], [R,C]) :- between(RowRange, R), between(ColRange, C).
