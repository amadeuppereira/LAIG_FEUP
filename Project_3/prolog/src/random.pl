/**
 * random_list/3
 * random_list(+S, +E, -L)
 *  L is a list with S elements from the list E
 */
random_list(0, _, []).
random_list(S, E, [X|T]) :-
    integer(S), !,
    M is S-1,
    random_member(X, E),
    random_list(M, E, T), !.

random_list(S, E, [X|T]) :-
    var(S), !,
    random_member(X, E),
    random_list(M, E, T),
    S is M+1. 

/**
 * random_matrix/[3,4]
 * random_matrix(+S, E, -M)
 * random_matrix(+R, C, E, -M)
 *   create a random SxS or RxC matrix M and elements from the list E
 */
random_matrix(R, C, E, M) :- random_matrix_aux(R, C, E, M).
random_matrix(S, E, M) :- random_matrix_aux(S, S, E, M).
random_matrix_aux(0, _, _, []).
random_matrix_aux(R, C, E, [X|T]) :-
    random_list(C, E, X),
    M is R-1,
    random_matrix_aux(M, C, E, T), !.
    