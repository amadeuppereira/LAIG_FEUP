/**
 * apply(:F, +L).
 *   Call goal (function) F with arguments L.
 */
apply(F, L) :- T =.. [F | L], call(T).

/**
 * countfindall(+Template, +Generator, -Count).
 *   Count the number of choice points of Generator.
 */
countfindall(Template, Generator, Count) :-
    findall(Template, Generator, ChoicePoints),
    length(ChoicePoints, Count).

/**
 * forloop_increasing(:F, +I, +E).
 *   Call F(N) for N in the range [I, E], with N increasing.
 */
forloop_increasing(F, E, E) :- call(F, E).
forloop_increasing(F, I, E) :- I < E,
                               call(F, I),
                               Ir is I + 1,
                               forloop_increasing(F, Ir, E).

/**
 * l_forloop_increasing(:F, +I, +E, +L).
 *   Call F(N, L...) for N in the range [I, E], with N increasing.
 */
l_forloop_increasing(F, E, E, L) :- apply(F, [E | L]).
l_forloop_increasing(F, I, E, L) :- I < E,
                                    apply(F, [I | L]),
                                    Ir is I + 1,
                                    l_forloop_increasing(F, Ir, E, L).

/**
 * forloop_decreasing(:F, +I, +E).
 *   Call F(N) for N in the range [I, E], with N decreasing.
 */
forloop_decreasing(F, I, I) :- call(F, I).
forloop_decreasing(F, I, E) :- I < E,
                               call(F, E),
                               Er is E - 1,
                               forloop_decreasing(F, I, Er).

/**
 * l_forloop_decreasing(:F, +I, +E, +L).
 *   Call F(N, L...) for N in the range [I, E], with N decreasing.
 */
l_forloop_decreasing(F, I, I, L) :- apply(F, [I | L]).
l_forloop_decreasing(F, I, E, L) :- I < E,
                                    apply(F, [I | L]),
                                    Er is E - 1,
                                    l_forloop_decreasing(F, I, Er, L).

/**
 * whileloop(:C, :F, -R).
 *   Call goal F(X) repeatedly while goal C(X) holds, then succeed and set R to X.
 */
whileloop(C, F, R) :- call(F, X), whileloop_aux(C, F, X, R).
whileloop_aux(C, _, X, X) :- \+ call(C, X).
whileloop_aux(C, F, _, R) :- call(F, Y), !, whileloop_aux(C, F, Y, R).

/**
 * whileloop_fail(:C, :F).
 *   Call goal F(X) repeatedly while goal C(X) holds, then fail.
 */
whileloop_fail(C, F) :- call(C, X), call(F, X), whileloop_fail(C, F, X).
whileloop_fail(C, F, X) :- !, call(C, X), call(F, Y), !, whileloop_fail(C, F, Y).

/**
 * untilloop(:C, :F, -R).
 *   Call goal F(X) repeatedly until goal C(X) holds, then succeed and set R to X.
 */
untilloop(C, F, R) :- call(F, X), untilloop_aux(C, F, X, R).
untilloop_aux(C, _, X, X) :- call(C, X).
untilloop_aux(C, F, _, R) :- call(F, Y), !, untilloop_aux(C, F, Y, R).

/**
 * untilloop_fail(:C, :F).
 *   Call goal F(X) repeatedly until goal C(X) holds, then fail.
 */
untilloop_fail(C, F) :- \+ call(C, X), call(F, X), untilloop_fail(C, F, X).
untilloop_fail(C, F, X) :- !, \+ call(C, X), call(F, Y), !, untilloop_fail(C, F, Y).

/**
 * plus/3, mult/3
 * plus(+A, +B, -C).
 * mult(+A, +B, -C).
 */
plus(A, B, C) :- C is A + B.
mult(A, B, C) :- C is A * B.

/**
 * repeat_call/2
 * repeat_call(:P, +N).
 */
repeat_call(P, N) :- repeat(N), call(P), fail; true.
