atom_is_char(A) :- atom_chars(A, [_]).

is_char(A) :- atom(A), atom_is_char(A).

is_lowercase_char(A) :- is_char(A), char_code(A, C), C >= 0'a, C =< 0'z.
is_uppercase_char(A) :- is_char(A), char_code(A, C), C > 64, C < 91.
is_numeric(A) :- is_char(A), char_code(A, C), C > 47, C < 58.
is_alpha(A) :- is_lowercase_char(A); is_uppercase_char(A).

atom_is_lowercases(S) :- atom_chars(S, L), all_of(L, char_is_lowercase).
atom_is_uppercases(S) :- atom_chars(S, L), all_of(L, char_is_uppercase).

char_lowercase(A, A) :- is_lowercase_char(A).
char_lowercase(A, L) :- is_uppercase_char(A),
                        char_code(A, C),
                        T is C + 32,
                        char_code(L, T).

char_uppercase(A, A) :- is_uppercase_char(A).
char_uppercase(A, U) :- is_lowercase_char(A),
                        char_code(A, C),
                        T is C - 32,
                        char_code(U, T).

char_numeric(A, N) :- is_numeric(A),
                      char_code(A, C),
                      N is C - 48.

char_rep(L, U, C) :- is_lowercase_char(L), !,
                     char_uppercase(L, U),
                     char_code(U, S), C is S - 64.

char_rep(L, U, C) :- is_uppercase_char(U), !,
                     char_lowercase(U, L),
                     char_code(U, S), C is S - 64.

char_rep(L, U, C) :- integer(C), !,
                     Sl is C + 96, Su is C + 64,
                     char_code(L, Sl), char_code(U, Su).

% Wanna know what's funny? This whole thing just for char_rep ---
% it would have taken less lines if done by brute force. Ayy lmao.

% Back to Pente...

/**
 * Internal Board representation
 *    A  B  C  D  E  F  G  H  J  K  L  M  N  O  P  Q  R  S  T <- REP
 *    1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19  --
 * 19 ┌──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┐   1
 * 18 ├──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┤   2
 * 17 ├──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┤   3
 * 16 ├──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┤   4
 * 15 ├──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┤   5
 * 14 ├──┼──┼──┼──●──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┤   6
 * 13 ├──┼──┼──┼──┼──┼──┼──┼──┼──┼──●──┼──●──┼──┼──┼──┼──┼──┤   7
 * 12 ├──┼──┼──┼──┼──┼──┼──┼──┼──●──○──┼──○──┼──┼──┼──┼──┼──┤   8
 * 11 ├──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┤   9
 * 10 ├──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┤  10
 *  9 ├──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┤  11
 *  8 ├──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┤  12
 *  7 ├──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┤  13
 *  6 ├──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┤  14
 *  5 ├──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┤  15
 *  4 ├──┼──┼──┼──┼──┼──○──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┤  16
 *  3 ├──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┤  17
 *  2 ├──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┤  18
 *  1 └──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┘  19
 *  ^                                                           ^
 * REP                                                          |
 * -- 1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 <- INTERNAL
 *
 * The board above has white pieces at
 *   E14 = [6,5];  K12 = [8,10];  L13 = [7,11];  N13 = [7,13].
 *
 * The board above has black pieces at
 *   G4 = [16,7];  L12 = [8,11];  N12 = [8,13].
 * 
 * The above are written in form REPRESENTATIVE=INTERNAL:
 * RepCol RepRow = [IntRow,IntCol].
 *
 * Notice: RepRow + IntRow = 20.
 */

/**
 * toprow_index(+C, -I).
 *   Returns the 1-index I, in the top row, of some alphanumeric atom C.
 */
toprow_index(U, I) :- is_uppercase_char(U), char_rep(_, U, S), S < 9, I is S.
toprow_index(U, I) :- is_uppercase_char(U), char_rep(_, U, S), S > 9, I is S - 1.
toprow_index(L, I) :- is_lowercase_char(L), char_rep(L, _, S), S < 9, I is S.
toprow_index(L, I) :- is_lowercase_char(L), char_rep(L, _, S), S > 9, I is S - 1.
toprow_index(N, I) :- is_numeric(N), char_numeric(N, I).
toprow_index(I, I) :- integer(I).

/**
 * toprow_rep(+I, -C).
 *   Returns the character matching the 1-index I in the top row.
 */
toprow_rep(I, C) :- I < 9, J is I, char_rep(_, C, J).
toprow_rep(I, C) :- I > 8, J is I + 1, char_rep(_, C, J).

/**
 * col_rep_index(?RepCol, ?IntCol).
 *   Matches a character on the top row with a 1-index IntCol.
 */
col_rep_index(RepCol, IntCol) :- nonvar(RepCol), toprow_index(RepCol, IntCol).
col_rep_index(RepCol, IntCol) :- nonvar(IntCol), toprow_rep(IntCol, RepCol).

/**
 * row_rep_index(+Size, ?RepRow, ?IntRow)
 */
row_rep_index(Size, RepRow, IntRow) :- nonvar(RepRow), IntRow is Size + 1 - RepRow.
row_rep_index(Size, RepRow, IntRow) :- nonvar(IntRow), RepRow is Size + 1 - IntRow.

/**
 * rep_internal(+RowSize, ?Rep, ?Int).
 *   Matches, for a given board size, an internal [IntRow,IntCol]
 *   with a UI [RepRow,RepCol]
 */
rep_internal(RowSize, [RepRow,RepCol], [IntRow,IntCol]) :-
    col_rep_index(RepCol, IntCol),
    row_rep_index(RowSize, RepRow, IntRow).

/**
 * rep_piece_at(+Board, +[Row,Col], ?E).
 *   E is the piece at position Row|Col in the Board.
 *   Row and Col are representative.
 */
rep_piece_at(Board, [Row,Col], E) :-
    matrix_proper_length(Board, RowSize, _),
    rep_internal(RowSize, [Row,Col], [R,C]),
    matrixnth1([R,C], Board, E).
