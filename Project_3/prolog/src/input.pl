/**
 * read_position/2
 * read_position(-Row, -Col).
 *   Read a board position from standard input.
 *   The position must be in the form E12, A7, B8, etc,
 *   and terminated with a dot.
 *   e.g. E12.
 *        A14.
 *        Z9.
 */
read_position(Row, Col) :-
    catch(read_position_aux(Row, Col), _, read_position(Row, Col)).

read_position_aux(Row, Col) :-
    var(Row), var(Col),
    untilloop(is_alpha, get_char, Col),
    peek_char(I),
    is_numeric(I),
    read(Row),
    integer(Row);
    var(Row), var(Col),
    read_position(Row, Col).

/**
 * get_move/2
 * get_move(+Size, -Move).
 *   Wrapper around read_position, transforming representations.
 */
get_move(Size, Move) :-
    read_position(RepRow, RepCol),
    rep_internal(Size, [RepRow,RepCol], Move).
