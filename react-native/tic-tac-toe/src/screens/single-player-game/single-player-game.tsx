import React, { ReactElement, useState, useEffect } from 'react';
import { Dimensions, View } from 'react-native';

import { GradientBackground, Text, Button } from '@components';
import styles from './single-player-game.styles';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Board } from '@components';
import {
  printFormattedBoard,
  isEmpty,
  isFull,
  getAvailableMoves,
  BoardState,
  isTerminal,
  getBestMove,
  Cell,
  useSounds
} from '@utils';
import { useSettings, difficulties } from '@contexts/settings-context';

const SCREEN_WIDTH = Dimensions.get('screen').width;

export default function Game(): ReactElement {
  // prettier-ignore
  const [state, setState] = useState<BoardState>([
    null, null, null,
    null, null, null,
    null, null, null,
  ])
  const [turn, setTurn] = useState<'HUMAN' | 'BOT'>(
    Math.random() < 0.5 ? 'HUMAN' : 'BOT'
  );
  const [isHumanMaximizing, setIsHumanMaximizing] = useState<boolean>(true);

  const [gamesCount, setGamesCount] = useState({
    wins: 0,
    losses: 0,
    draws: 0
  });

  const placySound = useSounds();
  const { settings } = useSettings();

  const gameResult = isTerminal(state);
  // console.log('getBestMove', getBestMove(state, true));

  const insertCell = (cell: number, symbol: 'x' | 'o'): void => {
    const stateCopy: BoardState = [...state];
    if (stateCopy[cell] || isTerminal(stateCopy)) return;
    stateCopy[cell] = symbol;
    setState(stateCopy);
    try {
      symbol === 'x' ? placySound('pop1') : placySound('pop2');
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnCellPressed = (cell: number): void => {
    if (turn !== 'HUMAN') return;
    insertCell(cell, isHumanMaximizing ? 'x' : 'o');
    setTurn('BOT');
  };

  const getWinner = (winnerSymbol: Cell): 'HUMAN' | 'BOT' | 'DRAW' => {
    if (winnerSymbol === 'x') {
      return isHumanMaximizing ? 'HUMAN' : 'BOT';
    }
    if (winnerSymbol === 'o') {
      return isHumanMaximizing ? 'BOT' : 'HUMAN';
    }
    return 'DRAW';
  };

  const newGame = () => {
    setState([null, null, null, null, null, null, null, null, null]);
    setTurn(Math.random() < 0.5 ? 'HUMAN' : 'BOT');
  };

  useEffect(() => {
    if (gameResult) {
      // handle game finished
      const winner = getWinner(gameResult.winner);
      if (winner === 'HUMAN') {
        placySound('win');
        setGamesCount({ ...gamesCount, wins: gamesCount.wins + 1 });
      }
      if (winner === 'BOT') {
        placySound('loss');
        setGamesCount({ ...gamesCount, losses: gamesCount.losses + 1 });
      }
      if (winner === 'DRAW') {
        placySound('draw');
        setGamesCount({ ...gamesCount, draws: gamesCount.draws + 1 });
      }
    } else {
      if (turn === 'BOT') {
        if (isEmpty(state)) {
          const centerAndCorners = [0, 2, 6, 8, 4];
          const firstMove =
            centerAndCorners[Math.floor(Math.random() * centerAndCorners.length)];
          insertCell(firstMove, 'x');
          setIsHumanMaximizing(false);
          setTurn('HUMAN');
        } else {
          const best = getBestMove(
            state,
            !isHumanMaximizing,
            0,
            parseInt(settings ? settings.difficulty : '-1')
          );
          insertCell(best, isHumanMaximizing ? 'o' : 'x');
          setTurn('HUMAN');
        }
      }
    }
  }, [state, turn]);

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <View>
          <Text style={styles.difficulty}>
            Difficulty: {settings ? difficulties[settings.difficulty] : 'Impossible'}
          </Text>
          <View style={styles.results}>
            <View style={styles.resultsBox}>
              <Text style={styles.resultsTitle}>Wins</Text>
              <Text style={styles.resultsCount}>{gamesCount.wins}</Text>
            </View>
            <View style={styles.resultsBox}>
              <Text style={styles.resultsTitle}>Draws</Text>
              <Text style={styles.resultsCount}>{gamesCount.draws}</Text>
            </View>
            <View style={styles.resultsBox}>
              <Text style={styles.resultsTitle}>Losses</Text>
              <Text style={styles.resultsCount}>{gamesCount.losses}</Text>
            </View>
          </View>
        </View>
        <Board
          disabled={Boolean(isTerminal(state)) || turn === 'BOT'}
          onCellPressed={(index) => {
            handleOnCellPressed(index);
          }}
          state={state}
          gameResult={gameResult}
          size={SCREEN_WIDTH - 60}
        />
        {gameResult && (
          <View style={styles.modal}>
            <Text style={styles.modalText}>
              {getWinner(gameResult.winner) === 'HUMAN' && 'You Won'}
              {getWinner(gameResult.winner) === 'BOT' && 'You Lost'}
              {getWinner(gameResult.winner) === 'DRAW' && "It's a Draw"}
            </Text>
            <Button onPress={() => newGame()} title={'Play Again'} />
          </View>
        )}
      </SafeAreaView>
    </GradientBackground>
  );
}
