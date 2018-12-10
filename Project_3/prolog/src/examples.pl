/**
 * Game from https://www.youtube.com/watch?v=lNFbF1_eZLQ
 */
plog(earlygame) :- display_game([
%    A B C D E F G H J K L M N O P Q R S T
    [c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c], % 19
    [c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c], % 18
    [c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c], % 17
    [c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c], % 16
    [c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c], % 15
    [c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c], % 14
    [c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c], % 13
    [c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c], % 12
    [c,c,c,c,c,c,c,c,b,c,b,c,c,c,c,c,c,c,c], % 11
    [c,c,c,c,c,c,c,c,c,w,w,b,w,c,c,c,c,c,c], % 10
    [c,c,c,c,c,c,c,c,c,b,c,w,c,c,c,c,c,c,c], % 9
    [c,c,c,c,c,c,c,c,c,c,w,c,c,c,c,c,c,c,c], % 8
    [c,c,c,c,c,c,c,c,c,b,c,c,c,c,c,c,c,c,c], % 7
    [c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c], % 6
    [c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c], % 5
    [c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c], % 4
    [c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c], % 3
    [c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c], % 2
    [c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c]  % 1
], w, [0,0]).

plog(midgame) :- display_game([
%    A B C D E F G H J K L M N O P Q R S T
    [c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c], % 19
    [c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c], % 18
    [c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c], % 17
    [c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c], % 16
    [c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c], % 15
    [c,c,c,c,c,c,c,c,c,b,b,c,c,b,c,c,c,c,c], % 14
    [c,c,c,c,c,c,c,c,b,c,w,c,w,c,c,c,c,c,c], % 13
    [c,c,c,c,c,c,c,c,c,c,c,w,b,c,c,c,c,c,c], % 12
    [c,c,c,c,c,c,c,c,b,b,w,c,w,c,c,c,c,c,c], % 11
    [c,c,c,c,c,c,c,c,c,w,c,b,w,c,c,c,c,c,c], % 10
    [c,c,c,c,c,c,c,c,b,b,c,w,w,b,c,c,c,c,c], % 9
    [c,c,c,c,c,c,c,c,c,c,w,c,b,c,c,c,c,c,c], % 8
    [c,c,c,c,c,c,c,c,c,b,c,c,c,c,c,c,c,c,c], % 7
    [c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c], % 6
    [c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c], % 5
    [c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c], % 4
    [c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c], % 3
    [c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c], % 2
    [c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c]  % 1
], b, [4,2]).

plog(lategame) :- display_game([
%    A B C D E F G H J K L M N O P Q R S T
    [c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c], % 19
    [c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c], % 18
    [c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c], % 17
    [c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c], % 16
    [c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c], % 15
    [c,c,c,c,c,c,c,c,c,b,c,c,c,b,c,c,c,c,c], % 14
    [c,c,c,c,c,c,c,c,b,c,w,c,w,c,c,c,c,c,c], % 13
    [c,c,c,c,c,c,c,c,b,c,c,w,b,c,c,b,c,c,c], % 12
    [c,c,c,c,c,c,c,c,b,b,w,c,w,c,w,c,c,c,c], % 11
    [c,c,c,c,c,c,c,c,w,w,c,b,c,w,c,c,c,c,c], % 10
    [c,c,c,c,c,c,c,c,b,b,c,w,c,c,b,w,c,c,c], % 9
    [c,c,c,c,c,c,c,c,c,c,w,c,c,c,w,c,c,c,c], % 8
    [c,c,c,c,c,c,c,c,c,b,w,c,c,c,b,c,c,c,c], % 7
    [c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c], % 6
    [c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c], % 5
    [c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c], % 4
    [c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c], % 3
    [c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c], % 2
    [c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c]  % 1
], w, [8,8]).

plog(early13) :- display_game([
%    A  B  C  D  E  F  G  H  J  K  L  M  N
    [c,c,c,c,c,c,c,c,c,c,c,c,c], % 13
    [c,c,c,c,c,c,c,c,c,c,c,c,c], % 12
    [c,c,c,c,c,c,c,c,c,c,c,c,c], % 11
    [c,c,c,c,c,c,c,c,w,c,c,c,c], % 10
    [c,c,c,c,c,c,c,c,c,c,c,c,c], % 9
    [c,c,c,c,c,c,b,c,w,c,c,c,c], % 8
    [c,c,c,c,c,c,w,w,b,b,w,c,c], % 7
    [c,c,c,c,c,c,c,c,c,w,c,c,c], % 6
    [c,c,c,c,c,c,c,w,b,c,c,c,c], % 5
    [c,c,c,c,c,c,c,c,c,c,c,c,c], % 4
    [c,c,c,c,c,c,c,c,c,c,c,c,c], % 3
    [c,c,c,c,c,c,c,c,c,c,c,c,c], % 2
    [c,c,c,c,c,c,c,c,c,c,c,c,c]  % 1
], w, [0,0]).
