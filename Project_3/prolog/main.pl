% ***** Libraries

% Generating integers
:- use_module(library(between)).
% Basic operations on lists
:- use_module(library(lists)).
% Random
:- use_module(library(random)).
% Sleep
:- use_module(library(system)).
% Sorting
:- use_module(library(samsort)).

% ***** User

% Library extensions
:- compile('src/general.pl').
:- compile('src/lists.pl').
:- compile('src/matrix.pl').
:- compile('src/random.pl').

% Board mini lib
:- compile('src/board.pl').

% Board display
:- compile('src/strings.pl').
:- compile('src/print.pl').
:- compile('src/help.pl').

% Player Bot
:- compile('src/score.pl').
:- compile('src/value.pl').
:- compile('src/tree.pl').

% Options
:- compile('src/options.pl').

% Game logic
:- compile('src/game.pl').
:- compile('src/input.pl').
:- compile('src/menus.pl').

% Examples
:- compile('src/examples.pl').

% ***** Shorthands

re :- compile('main.pl').
te :- compile('test/test.pl').

play :- pente.
play(Options) :- pente(Options).
help :- help_menu.
