/**
 * ===== ===== ===== ===== LIST EVALUATIONS ===== ===== ===== =====
 *
 * To evaluate the board, we will split it into rows, columns and diagonals
 * and evalaute these independently. Each will be called simply a 'list'.
 *
 * Each list is an ordered sequence of {c,w,b} stones. These stones form
 * patterns, which are segments of the list. For example, the list
 *                            [c,b,w,c,c,w,w,c,w,b]
 *                                     ^
 * has patterns [w,w,c,w], [c,c,w], etc, but not [w,w,w] or [b,w,w].
 * This list is good for White: if White plays in the caret position, it becomes
 * a win in 1 (five-in-a-row), regardless of where Black plays. So scoring this
 * list should favor White.
 *
 * We will score patterns independently in favor of White with integer points in
 * the range ]-∞,+∞[, as follows:
 * A winning pattern [w,w,w,w,w] will be worth pretty much +∞, say 2^90.
 * Strong patterns with forcing moves like [c,w,w,w,c,c], threating to make a
 * four-in-a-row (win in 1), will be scored highly, say 2^50 points. The actual
 * pre-win positions like [c,w,w,w,w,c] will be scored even higher, say 2^80 points.
 * Equivalent positions but for Black will be worth the opposite. So position
 * [c,b,b,b,b,c] would be worth -2^80 points.
 *
 * Notice that the list [c,b,b,b,b,c] encloses many patterns, such as [b,b,b],
 * [b,b] and [c,b,b]. Each of these patterns has their own score, which be added up
 * to the score of the pattern [c,b,b,b,b,c] itself to find the value of the list
 * [c,b,b,b,b,c].
 *
 * So we start by scoring patterns comprising only white pieces and empty positions
 * (pure patterns), then consider their reversals (replacing white with black pieces)
 */

/**
 * pattern/2
 * pattern(+Pattern, -Score).
 *   Determines the score of a given pattern.
 */

/**
 * Pure Pattern with 1 stone.
 * Capped at 2 ** 7 === 128
 */

% - - w - - CHECK 128
    pattern([c,c,w,c,c], 38).
    pattern([c,c,w,c],   16).
    pattern([c,c,w],     10).

    pattern([c,w,c,c], 16).
    pattern([c,w,c],   24).
    pattern([c,w],      6).

    pattern([w,c,c], 10).
    pattern([w,c],   6).
    pattern([w],     2).

/**
 * Pure Pattern with 2 stones.
 * Capped at 2 ** 20 === 1M
 */

% - - w w - - CHECK 388 - 4,772
    pattern([c,c,w,w,c,c], 12 * 2 ** 7).
    pattern([c,c,w,w,c],   5 * 2 ** 7).
    pattern([c,c,w,w],     4 * 2 ** 7).

    pattern([c,w,w,c,c], 5 * 2 ** 7).
    pattern([c,w,w,c],  40 * 2 ** 7).
    pattern([c,w,w],   -18 * 2 ** 7).

    pattern([w,w,c,c], 4 * 2 ** 7).
    pattern([w,w,c], -18 * 2 ** 7).
    pattern([w,w],     3 * 2 ** 7).

% - - w - w - - CHECK 196K - 1M
    pattern([c,c,w,c,w,c,c],   2 ** 16).
    pattern([c,c,w,c,w,c], 3 * 2 ** 15).
    pattern([c,c,w,c,w],   5 * 2 ** 14).

    pattern([c,w,c,w,c,c], 3 * 2 ** 15).
    pattern([c,w,c,w,c],       2 ** 17).
    pattern([c,w,c,w],         2 ** 17).

    pattern([w,c,w,c,c], 5 * 2 ** 14).
    pattern([w,c,w,c],       2 ** 17).
    pattern([w,c,w],     3 * 2 ** 16).

% - - w - - w - - CHECK 41K - 160K
    pattern([c,c,w,c,c,w,c,c], 2 ** 11).
    pattern([c,c,w,c,c,w,c],   2 ** 12).
    pattern([c,c,w,c,c,w],     2 ** 12.5).

    pattern([c,w,c,c,w,c,c], 2 ** 12).
    pattern([c,w,c,c,w,c],   2 ** 15).
    pattern([c,w,c,c,w],     2 ** 15).

    pattern([w,c,c,w,c,c], 2 ** 12.5).
    pattern([w,c,c,w,c],   2 ** 15).
    pattern([w,c,c,w],     2 ** 14.5).

% - w - - - w - CHECK 292 - 1,408
    pattern([c,w,c,c,c,w,c], 2 ** 9).
    pattern([c,w,c,c,c,w],   2 ** 8).

    pattern([w,c,c,c,w,c], 2 ** 8).
    pattern([w,c,c,c,w],   2 ** 8).

/**
 * Pure Pattern with 3 stones.
 * No Sente -> 2 ** 16 --- 2 ** 28
 * Sente 1 --- 2 ** 32 --- 2 ** 36
 * Sente 2 --- 2 ** 39 --- 2 ** 43
 */

% - - w w w - - CHECK 2,1M - 324B
    pattern([c,c,w,w,w,c,c], 2 ** 41). % SENTE 2
    pattern([c,c,w,w,w,c],   2 ** 35.5). % SENTE
    pattern([c,c,w,w,w],     2 ** 28).

    pattern([c,w,w,w,c,c], 2 ** 35.5). % SENTE
    pattern([c,w,w,w,c],   2 ** 28.5).
    pattern([c,w,w,w],     2 ** 23).

    pattern([w,w,w,c,c], 2 ** 28).
    pattern([w,w,w,c],   2 ** 23).
    pattern([w,w,w],     2 ** 21).

% - w w - w -   @   - w - w w - CHECK -1,9M - 12B
    pattern([c,w,w,c,w,c], 2 ** 33.5). % SENTE
    pattern([c,w,w,c,w],   2 ** 26).

    pattern([w,w,c,w,c],    2 ** 21).
    pattern([w,w,c,w], -1 * 2 ** 21).

    pattern([c,w,c,w,w,c], 2 ** 33.5). % SENTE
    pattern([c,w,c,w,w],   2 ** 21).

    pattern([w,c,w,w,c],    2 ** 26).
    pattern([w,c,w,w], -1 * 2 ** 21).

% - - w - w - w - - CHECK 67M - 739M
    pattern([c,c,w,c,w,c,w,c,c], 2 ** 25).
    pattern([c,c,w,c,w,c,w,c],   2 ** 25).
    pattern([c,c,w,c,w,c,w],     2 ** 25).

    pattern([c,w,c,w,c,w,c,c], 2 ** 25).
    pattern([c,w,c,w,c,w,c],   2 ** 27).
    pattern([c,w,c,w,c,w],     2 ** 27).

    pattern([w,c,w,c,w,c,c], 2 ** 25).
    pattern([w,c,w,c,w,c],   2 ** 27).
    pattern([w,c,w,c,w],     2 ** 26).

% - w - - w - w - -   @   - - w - w - - w - CHECK 549K - 1,3M
    pattern([c,w,c,c,w,c,w,c,c], 2 ** 12).
    pattern([c,w,c,c,w,c,w,c],   2 ** 13).
    pattern([c,w,c,c,w,c,w],     2 ** 14).

    pattern([w,c,c,w,c,w,c,c], 2 ** 12).
    pattern([w,c,c,w,c,w,c],   2 ** 14).
    pattern([w,c,c,w,c,w],     2 ** 16).

    pattern([c,c,w,c,w,c,c,w,c], 2 ** 12).
    pattern([c,c,w,c,w,c,c,w],   2 ** 12).

    pattern([c,w,c,w,c,c,w,c], 2 ** 13).
    pattern([c,w,c,w,c,c,w],   2 ** 14).

    pattern([w,c,w,c,c,w,c], 2 ** 14).
    pattern([w,c,w,c,c,w],   2 ** 16).

/**
 * Pure Pattern with 4 stones.
 * No Sente -> 2 ** 21 --- 2 ** 29
 * Sente 1 --> 2 ** 34 --- 2 ** 39
 * Sente 2 --> 2 ** 42 --- 2 ** 47
 * Sente 3 --> 2 ** 49 --- 2 ** 54
 * Win in 1 -> 2 ** 64 --- 2 ** 66
 * 27
 */

% - w w w w - CHECK 71M - 362B
    pattern([c,w,w,w,w,c], 2 ** 65). % WIN IN 1.
    pattern([c,w,w,w,w],   2 ** 38.4). % STRONG SENTE

    pattern([w,w,w,w,c], 2 ** 38.4). % STRONG SENTE
    pattern([w,w,w,w],   2 ** 26).

% - - w w w - w   @   w - w w w - - CHECK 68B - 4,56T
    pattern([c,c,w,w,w,c,w], 2 ** 43). % STRONG SENTE 2
    pattern([c,w,w,w,c,w],   2 ** 36). % STRONG SENTE
    pattern([w,w,w,c,w],     2 ** 36). % STRONG SENTE

    pattern([w,c,w,w,w,c,c], 2 ** 43). % STRONG SENTE 2
    pattern([w,c,w,w,w,c],   2 ** 36). % STRONG SENTE
    pattern([w,c,w,w,w],     2 ** 36). % STRONG SENTE

% - w - w w - w - CHECK 131M - 3,89T
    pattern([c,w,c,w,w,c,w,c], 2 ** 41.8). % SENTE 2
    pattern([c,w,c,w,w,c,w],   2 ** 34). % BAD SENTE

    pattern([w,c,w,w,c,w,c], 2 ** 34). % BAD SENTE
    pattern([w,c,w,w,c,w],   2 ** 20).

% - - w - w - w - w - - CHECK 138B - 585B
    pattern([c,c,w,c,w,c,w,c,w,c,c], 2 ** 37). % SENTE
    pattern([c,c,w,c,w,c,w,c,w,c],   2 ** 35). % SENTE
    pattern([c,c,w,c,w,c,w,c,w],     2 ** 35). % SENTE

    pattern([c,w,c,w,c,w,c,w,c,c], 2 ** 35). % SENTE
    pattern([c,w,c,w,c,w,c,w,c],   2 ** 35). % SENTE
    pattern([c,w,c,w,c,w,c,w],     2 ** 36). % SENTE

    pattern([w,c,w,c,w,c,w,c,c], 2 ** 35). % SENTE
    pattern([w,c,w,c,w,c,w,c],   2 ** 36). % SENTE
    pattern([w,c,w,c,w,c,w],     2 ** 37). % SENTE

% - w w - w w - CHECK 12,7M - 1,2B
    pattern([c,w,w,c,w,w,c], 2 ** 30). % BAD STRONG SENTE
    pattern([c,w,w,c,w,w],   2 ** 21). % BAD STRONG SENTE

    pattern([w,w,c,w,w,c],    2 ** 21). % BAD STRONG SENTE
    pattern([w,w,c,w,w], -1 * 2 ** 27). % BAD STRONG SENTE

/**
 * Pure Pattern with 5 stones.
 * No Sente -> 2 ** 20 --- 2 ** 32
 * Sente 1 --> 2 ** 34 --- 2 ** 38
 * Sente 2 --> 2 ** 40 --- 2 ** 47
 * Sente 3 --> 2 ** 46 --- 2 ** 56
 * Win in 1 -> 2 ** 65 --- 2 ** 67
 */

% w w w w w - CHECK INFINITY :-)
    pattern([w,w,w,w,w], 2 ** 100). % WIN.

% w - w w w - w CHECK
    pattern([w,c,w,w,w,c,w], 2 ** 67). % WIN IN 1.

% - w w - w - w w - CHECK 4,3M - 4.4T
    pattern([c,w,w,c,w,c,w,w,c], 2 ** 42). % SENTE 2
    pattern([c,w,w,c,w,c,w,w],   2 ** 35). % SENTE

    pattern([w,w,c,w,c,w,w,c],    2 ** 35). % SENTE
    pattern([w,w,c,w,c,w,w], -1 * 2 ** 33).

% - - w w w - w w -   @   - w w - w w w - -
    pattern([c,c,w,w,w,c,w,w,c], 2 ** 41.5). % STRONG SENTE 2
    pattern([c,w,w,w,c,w,w,c],   2 ** 34). % STRONG SENTE
    pattern([w,w,w,c,w,w,c],     2 ** 34). % STRONG SENTE

    pattern([c,c,w,w,w,c,w,w],  2 ** 39). % BAD STRONG SENTE 2
    %pattern([c,w,w,w,c,w,w], 0). % BAD STRONG SENTE
    pattern([w,w,w,c,w,w], -1 * 2 ** 33). % BAD STRONG SENTE

    pattern([c,w,w,c,w,w,w,c,c], 2 ** 41.5). % SENTE 2
    pattern([c,w,w,c,w,w,w,c],   2 ** 34). % SENTE
    pattern([c,w,w,c,w,w,w],     2 ** 34). % SENTE

    pattern([w,w,c,w,w,w,c,c],  2 ** 39). % BAD SENTE 2
    %pattern([w,w,c,w,w,w,c], 0). % BAD SENTE
    pattern([w,w,c,w,w,w], -1 * 2 ** 33). % BAD SENTE

% - w - w w - w w -   @   - w w - w w - w -
    pattern([c,w,c,w,w,c,w,w,c], 2 ** 41.5). % SENTE 2
    pattern([w,c,w,w,c,w,w,c],   2 ** 36). % SENTE

    pattern([c,w,c,w,w,c,w,w],    2 ** 38.5). % BAD SENTE 2
    pattern([w,c,w,w,c,w,w], -1 * 2 ** 34). % BAD SENTE

    pattern([c,w,w,c,w,w,c,w,c], 2 ** 41.5). % SENTE 2
    pattern([c,w,w,c,w,w,c,w],   2 ** 36). % SENTE

    pattern([w,w,c,w,w,c,w,c],    2 ** 38.5). % BAD SENTE 2
    pattern([w,w,c,w,w,c,w], -1 * 2 ** 34). % BAD SENTE

% - - w - w - w - w - w - - CHECK 9,2T - 2,265T
    pattern([c,c,w,c,w,c,w,c,w,c,w,c,c], 2 ** 51). % SENTE 3
    pattern([c,c,w,c,w,c,w,c,w,c,w,c],   2 ** 38.5). % SENTE 2
    pattern([c,c,w,c,w,c,w,c,w,c,w],     2 ** 38.5). % SENTE 2

    pattern([c,w,c,w,c,w,c,w,c,w,c,c], 2 ** 38.5). % SENTE 2
    pattern([c,w,c,w,c,w,c,w,c,w,c],   2 ** 39). % SENTE 2
    pattern([c,w,c,w,c,w,c,w,c,w],     2 ** 39.5). % SENTE 2

    pattern([w,c,w,c,w,c,w,c,w,c,c], 2 ** 38.5). % SENTE 2
    pattern([w,c,w,c,w,c,w,c,w,c],   2 ** 39.5). % SENTE 2
    pattern([w,c,w,c,w,c,w,c,w],     2 ** 43). % SENTE 2

% - w - w w - w - w   @   w - w - w w - w -
    pattern([c,w,c,w,w,c,w,c,w], 2 ** 43.5). % SENTE 2
    pattern([w,c,w,w,c,w,c,w],   2 ** 38). % SENTE

    pattern([w,c,w,c,w,w,c,w,c], 2 ** 43.5). % SENTE 2
    pattern([w,c,w,c,w,w,c,w],   2 ** 38). % SENTE

/**
 * Pure Pattern with 6 stones.
 * Sente 1 --> 2 ** 36 --- 2 ** 40
 * Sente 2 --> 2 ** 41 --- 2 ** 48
 * Sente 3 --> 2 ** 47 --- 2 ** 57
 * Win in 1 -> 2 ** 64 --- 2 ** 65
 */

% - - w w w - w w w - -
    pattern([c,c,w,w,w,c,w,w,w,c,c], 2 ** 52.5). % SENTE 3
    pattern([c,c,w,w,w,c,w,w,w,c],   2 ** 43). % SENTE 2
    pattern([c,c,w,w,w,c,w,w,w],     2 ** 43). % SENTE 2

    pattern([c,w,w,w,c,w,w,w,c,c], 2 ** 43). % SENTE 2
    pattern([c,w,w,w,c,w,w,w,c],   2 ** 38). % SENTE
    pattern([c,w,w,w,c,w,w,w],     2 ** 38). % SENTE

    pattern([w,w,w,c,w,w,w,c,c], 2 ** 43). % SENTE 2
    pattern([w,w,w,c,w,w,w,c],   2 ** 38). % SENTE
    pattern([w,w,w,c,w,w,w],     2 ** 40). % SENTE

% w w - w w - w w
    pattern([w,w,c,w,w,c,w,w], 2 ** 64). % WIN IN 1.

% - w - w w - w w w - -
    pattern([c,w,c,w,w,c,w,w,w,c,c], 2 ** 52.5). % SENTE 3
    pattern([c,w,c,w,w,c,w,w,w,c],   2 ** 41). % SENTE 2
    pattern([c,w,c,w,w,c,w,w,w],     2 ** 43). % SENTE 2

    pattern([w,c,w,w,c,w,w,w,c,c], 2 ** 39.5). % SENTE 2
    pattern([w,c,w,w,c,w,w,w,c],   2 ** 34). % SENTE
    pattern([w,c,w,w,c,w,w,w],     2 ** 33). % SENTE

    pattern([c,c,w,w,w,c,w,w,c,w,c], 2 ** 52.5). % SENTE 3
    pattern([c,c,w,w,w,c,w,w,c,w],   2 ** 39.5). % SENTE 2

    pattern([c,w,w,w,c,w,w,c,w,c], 2 ** 41). % SENTE 2
    pattern([c,w,w,w,c,w,w,c,w],   2 ** 34). % SENTE

    pattern([w,w,w,c,w,w,c,w,c], 2 ** 43). % SENTE 2
    pattern([w,w,w,c,w,w,c,w],   2 ** 33). % SENTE

/**
 * dynamic score/2
 * score(+Pattern, -Score).
 *   Uses pattern/2 to score a given pattern for white or black.
 */
 :- abolish(score/2). % reload
 :- findall([Pattern, Score], pattern(Pattern, Score), List),
    (   foreach([WPattern, Score], List)
    do  (   list_reversal(WPattern, BPattern),
            BScore is integer(-Score),
            WScore is integer(Score),
            assertz((score(WPattern, WScore))),
            assertz((score(BPattern, BScore)))
        )
    ).

/**
 * dynamic score_list/1
 * score_list(-PatternList).
 *   Get the list of scored patterns.
 */
 :- abolish(score_list/1). % reload
 :- findall(Pattern, score(Pattern, _), PatternList),
    asserta((score_list(PatternList) :- !)).

/**
 * multiscore/3
 * multiscore(+List, +Pattern, -Score).
 *   Find all instances of Pattern in List, and accumulate their score.
 */
multiscore(List, Pattern, TotalScore) :-
    score(Pattern, Score),
    countsegment(List, Pattern, N),
    TotalScore is Score * N.

/**
 * captures_score/4
 * captures_score(Wc, Bc, Score).
 *   Setting a score to a pair of captures (Wc,Bc).
 */
captures_score([C,C], 0) :- 0 is mod(C, 2), C < 10, C >= 0.

captures_score([2,0], 2 ** 33).
captures_score([4,0], 2 ** 49).
captures_score([6,0], 2 ** 63).
captures_score([8,0], 2 ** 73).
captures_score([4,2], 2 ** 44).
captures_score([6,2], 2 ** 61.5).
captures_score([8,2], 2 ** 72.8).
captures_score([6,4], 2 ** 57.5).
captures_score([8,4], 2 ** 71.5).
captures_score([8,6], 2 ** 67).
captures_score([10,_], 2 ** 100).

captures_score([Wc,Bc], Score) :-
    Wc < Bc,
    captures_score([Bc,Wc], WScore),
    Score is -WScore.

/**
 * winning_value/2
 * winning_value(+P, +Value).
 *   Value can be a worth or a token w-N / b-N where N is the turn
 *   where the win is obtained by the respective player.
 */
winning_value(w, Value) :- Value > 2 ** 97.
winning_value(b, Value) :- -Value > 2 ** 97.

/**
 * losing_value/2
 * losing_value(+P, +Value).
 *   Value can be a worth or a token w-N / b-N where N is the turn
 *   where the win is obtained by the respective player.
 */
losing_value(w, Value) :- winning_value(b, Value).
losing_value(b, Value) :- winning_value(w, Value).

/**
 * end_value/[1,2]
 * end_value(+Value).
 * end_value(+P, +Value).
 */
end_value(Value) :- winning_value(w, Value); winning_value(b, Value).
end_value(_, Value) :- end_value(Value).

/**
 * best_value/4
 * best_value(+P, +Val1, +Val2, -Best).
 */
best_value(w, Val1, Val2, Val1) :- Val1 >= Val2, !.
best_value(w, Val1, Val2, Val2) :- Val1 < Val2.
best_value(b, Val1, Val2, Val1) :- Val1 =< Val2, !.
best_value(b, Val1, Val2, Val2) :- Val1 > Val2.

/**
 * worst_value/4
 * worst_value(+P, +Val1, +Val2, -Best).
 */
best_value(w, Val1, Val2, Val2) :- Val1 >= Val2, !.
best_value(w, Val1, Val2, Val1) :- Val1 < Val2.
best_value(b, Val1, Val2, Val2) :- Val1 =< Val2, !.
best_value(b, Val1, Val2, Val1) :- Val1 > Val2.

/**
 * dynamic evaluate/2
 * evaluate(+List, -Value).
 *   Evaluate a list.
 */
 :- abolish(evaluate/2). % reload
 :- dynamic evaluate/2.

evaluate(List, IntegerValue) :-
    score_list(Patterns),
    map(multiscore(List), Patterns, Scores), !, % very expensive
    scanlist(plus, Scores, 0, Value),
    IntegerValue is integer(Value),
    asserta((evaluate(List, IntegerValue))), !. % store for future calls on the same list.
