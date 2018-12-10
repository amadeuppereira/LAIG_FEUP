/**
 * ===== ===== ===== ===== EVALUATION TREE ===== ===== ===== =====
 *
 * Each node in the tree with be represented by the compound node/6:
 *           node(Board, P, val/4, [Wc,Bc], Children, Worth).
 *                                          ^ = [[Ri,Ci]-node/6, ...]
 * P is the next player to play.
 * val/4 is the value compound discussed earlier.
 * Wc and Bc are white and black's captures respectively.
 * Children is a list of Key-Value pairs, where the key is the move.
 * Worth is a float which represents the value of the node; for leaf nodes
 * without children this is computed by totalval/2.
 *
 * The behaviour of the evaluation tree can be tuned with an OptionsList
 *
 * Supported options:
 * 
 *     depth(D) D = 1,2,3,...
 *       Node depth of the tree.
 *
 *     padding(P) P = 0,1,2,...
 *       Padding of the board on new analysis recursion.
 *
 *     width([W1,W2,...]), Wi = 1,2,... for each i = 1,...,D.
 *       Or, for each depth i (top is depth 1) keep Wi children.
 *
 * See tree-opt.pl
 */

/**
 * ===== ===== ===== ACCESSORS ===== ===== =====
 */

node_board(node(Board, _, _, _, _, _), Board).
node_player(node(_, P, _, _, _, _), P).
node_val(node(_, _, Val, _, _, _), Val).
node_cap(node(_, _, _, Cap, _, _), Cap).
node_children(node(_, _, _, _, Children, _), Children).
node_worth(node(_, _, _, _, _, Worth), Worth).
node_bestchild(node(_, _, _, _, [Child|_], _), Child).

child_worth(Worth-(_-_), Worth).
child_move(_-(Move-_), Move).
child_node(_-(_-Child), Child).

/**
 * mainline/[2,3]
 * mainline(+Node, -Mainline).
 * mainline(+Node, +Move, -Mainline).
 *   Gets the mainline of moves starting at Node with either Move or the move
 *   of its best child, recursively.
 */
mainline(Node, []) :-
    Node = node(_, _, _, _, [], _), !.

mainline(Node, Mainline) :-
    Node = node(_, _, _, _, Children, _), !,
    (   fromto(Children, [_-(Move-Child)|_], ChildsChildren, []),
        fromto([], Main, [Move|Main], Reversed)
    do  Child = node(_, _, _, _, ChildsChildren, _)
    ),
    reverse(Reversed, Mainline), !.

mainline(Node, Move, Mainline) :-
    Node = node(_, _, _, _, Children, _),
    proper_length(Children, Length), Length > 0, !,
    memberchk(_-(Move-FirstChild), Children),
    mainline(FirstChild, ChildMainline),
    Mainline = [Move|ChildMainline].

/**
 * ===== ===== ===== BASIC NODE CONSTRUCTORS ===== ===== =====
 */

/**
 * build_start_node/[2,4]
 * build_start_node(+Board, -Node).
 * build_start_node(+Board, +P, +Cap, -Node).
 *   Build a node/6 from scratch.
 */
build_start_node(Board, Node) :-
    build_start_node(Board, w, [0,0], Node), !.

build_start_node(Board, P, Cap, Node) :-
    Node = node(Board, P, Val, Cap, [], Total),
    evaluate_board(Board, Val),
    totalval(Val, Cap, Total), !.

/**
 * build_child_node/3
 * build_child_node(+Move, +ParentNode, -ChildNode).
 *   From a ParentNode and a move, constructs a ChildNode.
 */
build_child_node(Move, ParentNode, ChildNode) :-
    other_player(P, Other),
    ParentNode = node(Board, P, Val, Cap, _, _),
    ChildNode = node(ChildBoard, Other, ChildVal, ChildCap, [], Worth),
    place_stone(P, Board, Move, ChildBoard, Captures), !,
    add_captures(P, Captures, Cap, ChildCap),
    reevaluate_board(Board, ChildBoard, Val, ChildVal), !,
    totalval(ChildVal, ChildCap, Worth), !.

/**
 * ===== ===== ===== TREE AUXILIARIES ===== ===== =====
 */

/**
 * order_children/3
 * order_children(+P, +Children, -OrderedChildren).
 *   Order a list [V-([Ri,Ci]-node/6),...] according to key V.
 */
order_children(w, Children, OrderedChildren) :-
    keysort(Children, BlackOrdered),
    reverse(BlackOrdered, OrderedChildren).

order_children(b, Children, OrderedChildren) :-
    keysort(Children, OrderedChildren).

/**
 * reorder_clumps/2
 * reorder_clumps(+Ordered, -Reordered).
 */
reorder_clumps(Ordered, Reordered) :-
    keyclumps(Ordered, Clumps),
    map(random_permutation, Clumps, Permuted),
    append(Permuted, Reordered).

/**
 * organize_children/[4,5]
 * organize_children(+P, +Unordered, -Ordered, -BestWorth).
 * organize_children(+P, +Width, +Unordered, -Ordered, -BestWorth).
 *   Order a nonempty list of children and deduce the highest worth. Also trim said
 *   children list to have at most Width elements, if requested.
 */
organize_children(P, Unordered, Ordered, BestWorth) :-
    order_children(P, Unordered, Ordered), !,
    head(Ordered, BestChild),
    child_worth(BestChild, BestWorth), !.

organize_children(P, Width, Unordered, BestOrdered, BestWorth) :-
    order_children(P, Unordered, Ordered), !,
    reorder_clumps(Ordered, Reordered),
    extra_prefix_length(Reordered, BestOrdered, Width),
    head(BestOrdered, BestChild),
    child_worth(BestChild, BestWorth), !.

/**
 * choose_winner_if/4
 * choose_winner_if(+P, +Child, +Children, -BestChildren).
 *   Used by the loop functions. If the loop functions find any winning child,
 *   this child will be promoted to Best and BestChildren will be the one element
 *   list [Best]. Losing children will be removed, as long as at least one losing
 *   child in BestChildren. So BestChildren is always nonempty, and usually
 *   will contain all constructed children.
 */
choose_winner_if(P, _, [Worth-(Move-Child)|_], [Worth-(Move-Child)]) :-
    winning_value(P, Worth), !.

choose_winner_if(P, Worth-(Move-Child), _, [Worth-(Move-Child)]) :-
    winning_value(P, Worth), !.

choose_winner_if(_, Child, Children, [Child|Children]).

/**
 * choose_best_entry/4
 * choose_best_entry(+P, +Child1, +Child2, -Best).
 *   As the name suggests, Best is either Child1 or Child2, according to who is
 *   best for player P.
 */
choose_best_entry(P, Child1, Child2, Child1) :-
    Child1 = Worth1-(_-_),
    Child2 = Worth2-(_-_),
    best_value(P, Worth1, Worth2, Worth1), !.

choose_best_entry(P, Child1, Child2, Child2) :-
    Child1 = Worth1-(_-_),
    Child2 = Worth2-(_-_),
    best_value(P, Worth1, Worth2, Worth2).

/**
 * ===== ===== ===== ANALYSIS TREE ===== ===== =====
 */

/**
 * build_children_loop/3
 * build_children_loop(Node, +MovesList, -Children, +Options).
 *   build_children/3 Loop. Iterates over a MovesList constructing Children for Node.
 *   If a winning child is found, i.e. one making 10 captures or five-in-a-row for
 *   Node's player, the iteration stops and Children becomes a one element list
 *   holding that winning node. Otherwise Children holds all constructed children.
 *   Notice that no losing children will be found, as in Pente a player's move cannot
 *   cause him to lose.
 */
build_children_loop(_, [], []).

build_children_loop(Node, [Move|OtherMoves], ResultChildren) :-
    build_child_node(Move, Node, Child), !,
    node_worth(Child, Worth),
    ChildEntry = Worth-(Move-Child),
    node_player(Node, P),
    % if the new entry is a winning child (read: move), promote it to only child
    % and stop iterating. Otherwise continue recursion.
    (   winning_value(P, Worth) ->
        ResultChildren = [ChildEntry];
        build_children_loop(Node, OtherMoves, RestChildren),
        choose_winner_if(P, ChildEntry, RestChildren, ResultChildren)
    ), !.

/**
 * build_children/3
 * build_children(+Node, -NewNode, +Options).
 *   Constructs a list [V-([Ri,Ci]-node/6),...] for a Node without children, with no
 *   recursion. Then returns the new node, with said list of children and a new worth.
 */
% winners and losers are natural leafs, do not recurse them.
build_children(Node, Node, _) :-
    Node = node(_, _, _, _, _, Worth), end_value(Worth), !.

% not a natural leaf.
build_children(Node, NewNode, Options) :-
    opt_padding(Options, Padding),
    opt_turn(Options, Turn),
    opt_tournament(Options, Tournament),
    opt_width(Options, Width),
    Node = node(Board, P, Val, Cap, _, _),
    NewNode = node(Board, P, Val, Cap, Children, NewWorth), !,
    valid_moves_within_boundary(Board, Padding, Turn, Tournament, MovesList), !,
    build_children_loop(Node, MovesList, Unordered), !,
    organize_children(P, Width, Unordered, Children, NewWorth),
    garbage_collect, !.

/**
 * recurse_children_loop/5
 * recurse_children_loop(+Node, +Children, -NewChildren, +Options, ?Best).
 *   recurse_children/3 Loop. Iterates over a Children list, recursively calling
 *   build_tree/3 for each one. A winning child is promoted to only child. A losing
 *   child is discarded. The best child (regardless of status) is kept as Best,
 *   and will be kept as only child if all children, including itself, are losing.
 */
% last element
recurse_children_loop(Node, [ChildEntry], ResultChildren, Options, NewChildEntry) :-
    node_player(Node, P),
    ChildEntry = _-(Move-Child), !,
    build_tree(Child, NewChild, Options), !,
    node_worth(NewChild, NewWorth),
    NewChildEntry = NewWorth-(Move-NewChild),
    % discard the entry from ResultChildren if it is losing, otherwise include it.
    (   losing_value(P, NewWorth) ->
        ResultChildren = [];
        ResultChildren = [NewChildEntry]
    ), !.

% middle of the list.
recurse_children_loop(Node, [ChildEntry|OldChildren], ResultChildren, Options, Best) :-
    node_player(Node, P),
    ChildEntry = _-(Move-Child), !,
    build_tree(Child, NewChild, Options), !,
    node_worth(NewChild, NewWorth),
    NewChildEntry = NewWorth-(Move-NewChild),
    % if the new entry is a winning child, promote it to only child and stop iterating.
    % if it is a losing child, then discard it, but expect to keep it as Best children
    % if all children are losing and this is the best child in the list (read: the bot
    % doesn't resign). Continue iterating either of the two cases.
    (   winning_value(P, NewWorth) ->
        ResultChildren = [NewChildEntry],
        Best = NewChildEntry;
        losing_value(P, NewWorth) ->
        recurse_children_loop(Node, OldChildren, ResultChildren, Options, OldBest),
        choose_best_entry(P, OldBest, NewChildEntry, Best);
        recurse_children_loop(Node, OldChildren, RestChildren, Options, OldBest),
        choose_winner_if(P, NewChildEntry, RestChildren, ResultChildren),
        choose_best_entry(P, OldBest, NewChildEntry, Best)
    ), !.

/**
 * recurse_children/3
 * recurse_children(+Node, -NewNode, +Options).
 *   From a list [V-([Ri,Ci]-node/6)] of children leafs, construct a new node
 *   whose children have been recursed according to the given Options. Recursive.
 */
% winners and losers are natural leafs, do not recurse them.
recurse_children(Node, Node, _) :-
    Node = node(_, _, _, _, _, Worth), end_value(Worth), !.

% all other nodes should have children and be recursed.
recurse_children(Node, NewNode, Options) :-
    next_depth(Options, OptionsChildren),
    Node = node(Board, P, Val, Cap, OldChildren, _),
    NewNode = node(Board, P, Val, Cap, NewChildren, BestWorth), !,
    recurse_children_loop(Node, OldChildren, Unordered, OptionsChildren, Best), !,
    % Keep [Best] for NewChildren if all children are losing
    (   Unordered = [] ->
        NewChildren = [Best],
        Best = BestWorth-(_-_);
        organize_children(P, Unordered, NewChildren, BestWorth)
    ), garbage_collect, !.

/**
 * build_tree/3
 * build_tree(+Node, -Tree, +Options).
 *   Builds an evaluation Tree starting at Node with given Options. Recursive.
 */
% reached the end (max depth)...
build_tree(Node, Node, Options) :-
    opt_depth(Options, Depth),
    opt_totaldepth(Options, Depth).

% ... or maybe not
build_tree(Node, Tree, Options) :-
    build_children(Node, NodeWithChildren, Options),
    node_children(NodeWithChildren, Children),
    (   length(Children, C), C > 1 ->
        recurse_children(NodeWithChildren, Tree, Options);
        Tree = NodeWithChildren
    ), !.

/**
 * analyze_tree/2
 * analyze_tree(+Game, -Tree).
 *   Entry point to build_tree/3 from the main game loop. Starts by constructing
 *   a starting node from a Board (very fast).
 */
analyze_tree(Game, Tree) :-
    Game = game(Board, P, Cap, Turn, UserOptions),
    opt_traverse(UserOptions, true),
    tree_parseopt(UserOptions, Turn, Options),
    build_start_node(Board, P, Cap, Node),
    build_tree(Node, Tree, Options),
    print_tree_deep(Tree).

analyze_tree(Game, Tree) :-
    Game = game(Board, P, Cap, Turn, UserOptions),
    opt_traverse(UserOptions, false),
    tree_parseopt(UserOptions, Turn, Options),
    build_start_node(Board, P, Cap, Node),
    build_tree(Node, Tree, Options).

/**
 * ===== ===== ===== CHOOSING MOVE ===== ===== =====
 */

/**
 * choose_move/3
 * choose_move(+Tree, -Move, +Options).
 *   Choose move according to Options.
 */
choose_move(Tree, Move, Options) :-
    choose_move_best(Tree, Move, Options).

/**
 * choose_move_best/2
 * choose_move_best(+Tree, -Move).
 *   Choose the best move Move to a given Tree.
 */
choose_move_best(Tree, Move, _) :-
    node_bestchild(Tree, _-(Move-_)).
