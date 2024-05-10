import { IGame, ISet } from '../models/match.model.js'

const getHistoryByPlayer = (games: IGame[], player: 'ME' | 'OPPONENT') => {
  return games.filter((game) => game.server === player).flatMap((item) => item.history)
}

// const s = (games: IGame[], player: 'ME' | 'OPPONENT') => {
//   let total = 0
//   let count = 0
//   const filtredGames = games.filter((item) => item.server !== player)
//   filtredGames.map((game) => {
//     const isOpponentWin = game.opponentScore > game.myScore
//     // const gameBreakPoints = game.history
//     //   .map((item) => {
//     //     if (player === 'ME' && item.myScore >= 30 && item.opponentScore <= 15) {
//     //       total += 1
//     //       return 1
//     //     } else if (player === 'ME' && item.myScore === 40 && item.opponentScore >= 40) {
//     //       total += 1
//     //       return 1
//     //     } else if (player === 'OPPONENT' && item.opponentScore >= 30 && item.myScore <= 15) {
//     //       total += 1
//     //       return 1
//     //     } else if (player === 'OPPONENT' && item.opponentScore === 40 && item.myScore >= 40) {
//     //       total += 1
//     //       return 1
//     //     }
//     //   })
//     game.history.map((item) => {
//       if (player === 'ME' && item.myScore > item.opponentScore && item.myScore >= 40) {
//         total += 1
//       } else if (player === 'OPPONENT' && item.opponentScore > item.myScore && item.opponentScore >= 40) {
//         total += 1
//       }
//     })

//     if (player === 'ME' && !isOpponentWin && total > 0) {
//       count += 1
//     } else if (player === 'OPPONENT' && isOpponentWin && total > 0) {
//       count += 1
//     }
//   })

//   return { total, count }
// }

const getBreakPoints = (games: IGame[], player: 'ME' | 'OPPONENT') => {
  let total = 0
  let count = 0

  const filteredGames = games.filter((game) => game.server !== player)
  filteredGames.flatMap((game) => game.history).map((item, index, arr) => {
    if (player === 'ME') {
      // if (item.myScore > item.opponentScore && item.myScore >= 40
      //   && arr[index + 1]?.server === 'ME' && arr[index + 1]?.myScore > item.myScore) {
      //   total += 1
      // }

      if (item.myScore - item.opponentScore > 20
        && (index+1 === arr.length ? true : arr[index + 1]?.myScore < item.myScore) && item.server === 'ME') {
        count += 1
      }
      if (item.myScore >= 40 && item.myScore > item.opponentScore) {
        total += 1
      }
    } else if (player === 'OPPONENT') {
      // if (item.opponentScore > item.myScore && item.opponentScore >= 40
      //   && arr[index + 1]?.server === 'OPPONENT' && arr[index + 1]?.opponentScore > item.opponentScore) {
      //   total += 1
      // }

      if (item.opponentScore - item.myScore > 20 && (index + 1 === arr.length ? true
        : arr[index + 1]?.opponentScore < item.opponentScore) && item.server === 'OPPONENT') {
        count += 1
      }
      if (item.opponentScore >= 40 && item.opponentScore > item.myScore) {
        total += 1
      }
    }
  })

  return { total, count }
}

type StatType = 'Ace' | 'Winner'

export const getStat = (sets: ISet[], statType: StatType) => {
  const games = sets.flatMap((set) => set.games)

  const myGames = games.filter((game) => game.server === 'ME')
  const opponentGames = games.filter((game) => game.server === 'OPPONENT')

  const myStatCount = getHistoryByPlayer(games, 'ME').filter((item) => item.type === statType).length
  const opponentStatCount = getHistoryByPlayer(games, 'OPPONENT').filter((item) => item.type === statType).length

  return {
    all: {
      me: { total: myGames.flatMap((game) => game.history).length, count: myStatCount },
      opponent: { total: opponentGames.flatMap((game) => game.history).length, count: opponentStatCount },
    },
    bySet: sets.map((set) => ({
      me: {
        total: getHistoryByPlayer(set.games, 'ME').length,
        count: getHistoryByPlayer(set.games, 'ME').filter((item) => item.type === statType).length,
      },
      opponent: {
        total: getHistoryByPlayer(set.games, 'OPPONENT').length,
        count: getHistoryByPlayer(set.games, 'OPPONENT').filter((item) => item.type === statType).length,
      },
    })),
  }
}

export const getWinners = (sets: ISet[]) => {
  const history = sets.flatMap((set) => set.games).flatMap((game) => game.history)

  const myStatCount = history.filter((item) => item.type === 'Winner' && item.server === 'ME').length
  const opponentStatCount = history.filter((item) => item.type === 'Winner' && item.server === 'OPPONENT').length

  return {
    all: {
      me: { total: history.length, count: myStatCount },
      opponent: { total: history.length, count: opponentStatCount },
    },
    bySet: sets.map((set) => ({
      me: {
        total: set.games.flatMap((item) => item.history).length,
        count: set.games
          .flatMap((item) => item.history)
          .filter((item) => item.type === 'Winner' && item.server === 'ME').length,
      },
      opponent: {
        total: set.games.flatMap((item) => item.history).length,
        count: set.games
          .flatMap((item) => item.history)
          .filter((item) => item.type === 'Winner' && item.server === 'OPPONENT').length,
      },
    })),
  }
}

export const getForcedErrors = (sets: ISet[]) => {
  const games = sets.flatMap((set) => set.games)
  const total = games.flatMap((game) => game.history).length
  const history = sets.flatMap((set) => set.games).flatMap((game) => game.history)

  const myStatCount = history.filter((item) => item.type === 'Forced error' && item.server === 'OPPONENT').length
  const opponentStatCount = history.filter((item) => item.type === 'Forced error' && item.server === 'ME').length

  return {
    all: {
      me: { total, count: myStatCount },
      opponent: { total, count: opponentStatCount },
    },
    bySet: sets.map((set) => ({
      me: {
        total: set.games.flatMap((game) => game.history).length,
        count: set.games
          .flatMap((game) => game.history)
          .filter((item) => item.type === 'Forced error' && item.server === 'OPPONENT').length,
      },
      opponent: {
        total: set.games.flatMap((game) => game.history).length,
        count: set.games
          .flatMap((game) => game.history)
          .filter((item) => item.type === 'Forced error' && item.server === 'ME').length,
      },
    })),
  }
}

export const getDoubleFaults = (sets: ISet[]) => {
  const games = sets.flatMap((set) => set.games)
  const history = sets.flatMap((set) => set.games).flatMap((game) => game.history)

  // const myGames = games.filter((game) => game.server === 'ME')
  // const opponentGames = games.filter((game) => game.server === 'OPPONENT')

  const myStatCount = history.filter((item) => item.type === 'Double fault' && item.server === 'OPPONENT').length
  const opponentStatCount = history.filter((item) => item.type === 'Double fault' && item.server === 'ME').length

  const getTotal = (gamesArr: IGame[], player: 'ME' | 'OPPONENT'): number => {
    const secondServes = getHistoryByPlayer(gamesArr, player)
      .filter((item) => item.serve === '2' && item.type !== 'Double fault').length
    const doubleFaults = getHistoryByPlayer(games, player)
      .filter((item) => item.type === 'Double fault').length
    return secondServes + doubleFaults
  }

  return {
    all: {
      me: { total: getTotal(games, 'ME'), count: myStatCount },
      opponent: {
        total: getTotal(games, 'OPPONENT'),
        count: opponentStatCount,
      },
    },
    bySet: sets.map((set) => ({
      me: {
        total: getTotal(set.games, 'ME'),
        count: set.games
          .flatMap((game) => game.history)
          .filter((item) => item.type === 'Double fault' && item.server === 'OPPONENT').length,
      },
      opponent: {
        total: getTotal(set.games, 'OPPONENT'),
        count: set.games
          .flatMap((game) => game.history)
          .filter((item) => item.type === 'Double fault' && item.server === 'ME').length,
      },
    })),
  }
}

export const getUnforcedErrors = (sets: ISet[]) => {
  const games = sets.flatMap((set) => set.games)
  const history = games.flatMap((game) => game.history)

  const myStatCount = history.filter((item) => item.type === 'Unforced error' && item.server === 'OPPONENT').length
  const opponentStatCount = history.filter((item) => item.type === 'Unforced error' && item.server === 'ME').length

  return {
    all: {
      me: { total: history.length, count: myStatCount },
      opponent: { total: history.length, count: opponentStatCount },
    },
    bySet: sets.map((set) => ({
      me: {
        total: set.games.flatMap((item) => item.history).length,
        count: set.games
          .flatMap((item) => item.history)
          .filter((item) => item.type === 'Unforced error' && item.server === 'OPPONENT').length,
      },
      opponent: {
        total: set.games.flatMap((item) => item.history).length,
        count: set.games
          .flatMap((item) => item.history)
          .filter((item) => item.type === 'Unforced error' && item.server === 'ME').length,
      },
    })),
  }
}

export const getTotalWon = (sets: ISet[]) => {
  const games = sets.flatMap((set) => set.games)

  const myWonsCount = games.flatMap((game) => game.history).filter((item) => item.server === 'ME').length
  const opponentWonsCount = games.flatMap((game) => game.history).filter((item) => item.server === 'OPPONENT').length

  return {
    all: {
      me: { total: games.flatMap((game) => game.history).length, count: myWonsCount },
      opponent: { total: games.flatMap((game) => game.history).length, count: opponentWonsCount },
    },
    bySet: sets.map((set) => ({
      me: {
        total: set.games.flatMap((game) => game.history).length,
        count: set.games.flatMap((game) => game.history).filter((item) => item.server === 'ME').length,
      },
      opponent: {
        total: set.games.flatMap((game) => game.history).length,
        count: set.games.flatMap((game) => game.history).filter((item) => item.server === 'OPPONENT').length,
      },
    })),
  }
}

export const getTotalServiceWon = (sets: ISet[]) => {
  const games = sets.flatMap((set) => set.games)

  const myGames = getHistoryByPlayer(games, 'ME')
  const opponentGames = getHistoryByPlayer(games, 'OPPONENT')

  const myTotalServiceWons = myGames.filter((game) => game.server === 'ME').length
  const opponentTotalServiceWons = opponentGames.filter((game) => game.server === 'OPPONENT').length

  return {
    all: {
      me: { total: myGames.length, count: myTotalServiceWons },
      opponent: { total: opponentGames.length, count: opponentTotalServiceWons },
    },
    bySet: sets.map((set) => ({
      me: {
        total: getHistoryByPlayer(set.games, 'ME').length,
        count: getHistoryByPlayer(set.games, 'ME').filter((item) => item.server === 'ME').length,
      },
      opponent: {
        total: getHistoryByPlayer(set.games, 'OPPONENT').length,
        count: getHistoryByPlayer(set.games, 'OPPONENT').filter((item) => item.server === 'OPPONENT').length,
      },
    })),
  }
}

export const getTotalReturnWon = (sets: ISet[]) => {
  const games = sets.flatMap((set) => set.games)

  const myGames = getHistoryByPlayer(games, 'ME')
  const opponentGames = getHistoryByPlayer(games, 'OPPONENT')

  const myTotalReturnWons = opponentGames.filter((game) => game.server === 'ME').length
  const opponentTotalReturnWons = myGames.filter((game) => game.server === 'OPPONENT').length

  return {
    all: {
      me: { total: opponentGames.length, count: myTotalReturnWons },
      opponent: { total: myGames.length, count: opponentTotalReturnWons },
    },
    bySet: sets.map((set) => ({
      me: {
        total: getHistoryByPlayer(set.games, 'OPPONENT').length,
        count: getHistoryByPlayer(set.games, 'OPPONENT').filter((item) => item.server === 'ME').length,
      },
      opponent: {
        total: getHistoryByPlayer(set.games, 'ME').length,
        count: getHistoryByPlayer(set.games, 'ME').filter((item) => item.server === 'OPPONENT').length,
      },
    })),
  }
}

// export const getSecondServes = (sets: ISet[], serveType: '1' | '2') => {
//   const games = sets.flatMap((set) => set.games)

//   const myServesCount = getHistoryByPlayer(games, 'ME')
//     .filter((item) => item.serve === serveType && item.type !== 'Double fault').length
//   const opponentServesCount = getHistoryByPlayer(games, 'OPPONENT')
//     .filter((item) => item.serve === serveType && item.type !== 'Double fault').length

//   return {
//     all: {
//       me: {
//         total: getHistoryByPlayer(games, 'ME').filter((item) => item.serve === serveType).length,
//         count: myServesCount,
//       },
//       opponent: {
//         total: getHistoryByPlayer(games, 'OPPONENT').filter((item) => item.serve === serveType).length,
//         count: opponentServesCount,
//       },
//     },
//     bySet: sets.map((set) => ({
//       me: {
//         total: getHistoryByPlayer(set.games, 'ME')
//           .filter((item) => item.serve === serveType).length,
//         count: getHistoryByPlayer(set.games, 'ME')
//           .filter((item) => item.serve === serveType && item.type !== 'Double fault').length,
//       },
//       opponent: {
//         total: getHistoryByPlayer(set.games, 'OPPONENT')
//           .filter((item) => item.serve === serveType).length,
//         count: getHistoryByPlayer(set.games, 'OPPONENT')
//           .filter((item) => item.serve === serveType && item.type !== 'Double fault').length,
//       },
//     })),
//   }
// }

export const getSecondServes = (sets: ISet[]) => {
  const serveType = '2'
  const games = sets.flatMap((set) => set.games)

  const myServesCount = getHistoryByPlayer(games, 'ME')
    .filter((item) => item.serve === serveType && item.type !== 'Double fault').length
  const opponentServesCount = getHistoryByPlayer(games, 'OPPONENT')
    .filter((item) => item.serve === serveType && item.type !== 'Double fault').length

  const getTotal = (gamesArr: IGame[], player: 'ME' | 'OPPONENT'): number => {
    const secondServes = getHistoryByPlayer(gamesArr, player)
      .filter((item) => item.serve === serveType && item.type !== 'Double fault').length
    const doubleFaults = getHistoryByPlayer(games, player)
      .filter((item) => item.type === 'Double fault').length
    return secondServes + doubleFaults
  }

  return {
    all: {
      me: {
        // total: getTotal(games, 'ME'),
        total: getHistoryByPlayer(games, 'ME').length,
        count: myServesCount,
      },
      opponent: {
        // total: getTotal(games, 'OPPONENT'),
        total: getHistoryByPlayer(games, 'OPPONENT').length,
        count: opponentServesCount,
      },
    },
    bySet: sets.map((set) => ({
      me: {
        // total: getTotal(set.games, 'ME'),
        total: getHistoryByPlayer(set.games, 'ME').length,
        count: getHistoryByPlayer(set.games, 'ME')
          .filter((item) => item.serve === serveType && item.type !== 'Double fault').length,
      },
      opponent: {
        // total: getTotal(set.games, 'OPPONENT'),
        total: getHistoryByPlayer(set.games, 'OPPONENT').length,
        count: getHistoryByPlayer(set.games, 'OPPONENT')
          .filter((item) => item.serve === serveType && item.type !== 'Double fault').length,
      },
    })),
  }
}

export const getFirstServes = (sets: ISet[]) => {
  const serveType = '1'
  const games = sets.flatMap((set) => set.games)

  const myServesCount = getHistoryByPlayer(games, 'ME')
    .filter((item) => item.serve === serveType && item.type !== 'Double fault').length
  const opponentServesCount = getHistoryByPlayer(games, 'OPPONENT')
    .filter((item) => item.serve === serveType && item.type !== 'Double fault').length

  return {
    all: {
      me: {
        total: getHistoryByPlayer(games, 'ME').length,
        count: myServesCount,
      },
      opponent: {
        total: getHistoryByPlayer(games, 'OPPONENT').length,
        count: opponentServesCount,
      },
    },
    bySet: sets.map((set) => ({
      me: {
        total: getHistoryByPlayer(set.games, 'ME').length,
        count: getHistoryByPlayer(set.games, 'ME')
          .filter((item) => item.serve === serveType && item.type !== 'Double fault').length,
      },
      opponent: {
        total: getHistoryByPlayer(set.games, 'OPPONENT').length,
        count: getHistoryByPlayer(set.games, 'OPPONENT')
          .filter((item) => item.serve === serveType && item.type !== 'Double fault').length,
      },
    })),
  }
}

export const getServesPoints = (sets: ISet[], serveType: '1' | '2') => {
  const games = sets.flatMap((set) => set.games)

  const myServesCount = getHistoryByPlayer(games, 'ME')
    .filter((item) => item.serve === serveType && item.server === 'ME' && item.type !== 'Double fault').length
  const opponentServesCount = getHistoryByPlayer(games, 'OPPONENT')
    .filter((item) => item.serve === serveType && item.server === 'OPPONENT' && item.type !== 'Double fault').length

  return {
    all: {
      me: {
        total: getHistoryByPlayer(games, 'ME')
          .filter((item) => item.serve === serveType).length, count: myServesCount },
      opponent: {
        total: getHistoryByPlayer(games, 'OPPONENT')
          .filter((item) => item.serve === serveType).length, count: opponentServesCount },
    },
    bySet: sets.map((set) => ({
      me: {
        total: getHistoryByPlayer(set.games, 'ME')
          .filter((item) => item.serve === serveType).length,
        count: getHistoryByPlayer(set.games, 'ME')
          .filter((item) => item.serve === serveType && item.server === 'ME' && item.type !== 'Double fault').length,
      },
      opponent: {
        total: getHistoryByPlayer(set.games, 'OPPONENT')
          .filter((item) => item.serve === serveType).length,
        count: getHistoryByPlayer(set.games, 'OPPONENT')
          .filter((item) => item.serve === serveType && item.server === 'OPPONENT'
            && item.type !== 'Double fault').length,
      },
    })),
  }
}

export const getSecondServeWon = (sets: ISet[]) => {
  const serveType = '2'
  const games = sets.flatMap((set) => set.games)

  const myServesCount = getHistoryByPlayer(games, 'ME')
    .filter((item) => item.serve === serveType && item.server === 'ME' && item.type !== 'Double fault').length
  const opponentServesCount = getHistoryByPlayer(games, 'OPPONENT')
    .filter((item) => item.serve === serveType && item.server === 'OPPONENT' && item.type !== 'Double fault').length

  const getTotal = (gamesArr: IGame[], player: 'ME' | 'OPPONENT'): number => {
    // const secondServes = getHistoryByPlayer(gamesArr, player)
    //   .filter((item) => item.serve === serveType && item.type !== 'Double fault').length
    // const doubleFaults = getHistoryByPlayer(games, player)
    //   .filter((item) => item.type === 'Double fault').length
    // return secondServes + doubleFaults
    return getHistoryByPlayer(gamesArr, player)
      .filter((item) => item.serve === serveType && item.type !== 'Double fault').length
  }

  return {
    all: {
      me: {
        total: getTotal(games, 'ME'),
        count: myServesCount,
      },
      opponent: {
        total: getTotal(games, 'OPPONENT'),
        count: opponentServesCount,
      },
    },
    bySet: sets.map((set) => ({
      me: {
        total: getTotal(set.games, 'ME'),
        count: getHistoryByPlayer(set.games, 'ME')
          .filter((item) => item.serve === serveType && item.server === 'ME' && item.type !== 'Double fault').length,
      },
      opponent: {
        total: getTotal(set.games, 'OPPONENT'),
        count: getHistoryByPlayer(set.games, 'OPPONENT')
          .filter((item) => item.serve === serveType && item.server === 'OPPONENT'
            && item.type !== 'Double fault').length,
      },
    })),
  }
}

export const getBreakPointsStat = (sets: ISet[]) => {
  const games = sets.flatMap((set) => set.games)

  const { total: myTotal, count: myCount } = getBreakPoints(games, 'ME')
  const { total: opponentTotal, count: opponentCount } = getBreakPoints(games, 'OPPONENT')

  return {
    all: {
      me: { total: myTotal, count: myCount },
      opponent: { total: opponentTotal, count: opponentCount },
    },
    bySet: sets.map((set) => ({
      me: {
        total: getBreakPoints(set.games, 'ME').total,
        count: getBreakPoints(set.games, 'ME').count,
      },
      opponent: {
        total: getBreakPoints(set.games, 'OPPONENT').total,
        count: getBreakPoints(set.games, 'OPPONENT').count,
      },
    })),
  }
}

export const getGamesStat = (sets: ISet[], type: 'service' | 'return') => {
  const games = sets.flatMap((set) => set.games)

  const myGames = games.filter((game) => {
    return type === 'service'
      ? game.server === 'ME' && game.myScore > game.opponentScore
      : game.server === 'OPPONENT' && game.myScore > game.opponentScore
  })
  const opponentGames = games.filter((game) => {
    return type === 'service'
      ? game.server === 'OPPONENT' && game.opponentScore > game.myScore
      : game.server === 'ME' && game.opponentScore > game.myScore
  })

  return {
    all: {
      me: { count: myGames.length },
      opponent: { count: opponentGames.length },
    },
    bySet: sets.map((set) => ({
      me: {
        count: set.games.filter((game) => {
          return type === 'service'
            ? game.server === 'ME' && game.myScore > game.opponentScore
            : game.server === 'OPPONENT' && game.myScore > game.opponentScore
        }).length },
      opponent: {
        count: set.games.filter((game) => {
          return type === 'service'
            ? game.server === 'OPPONENT' && game.opponentScore > game.myScore
            : game.server === 'ME' && game.opponentScore > game.myScore
        }).length },
    })),
  }
}

export const getAggressiveMargin = (sets: ISet[]) => {
  const winners = getWinners(sets)
  const forcedErrors = getForcedErrors(sets)
  const unforcedErrors = getUnforcedErrors(sets)

  const myStatCount = winners.all.me.count + forcedErrors.all.opponent.count - unforcedErrors.all.me.count
  const opponentStatCount = winners.all.opponent.count + forcedErrors.all.me.count - unforcedErrors.all.opponent.count

  return {
    all: {
      me: { count: myStatCount },
      opponent: { count: opponentStatCount },
    },
    bySet: sets.map((set, index) => ({
      me: { count: winners.bySet[index].me.count + forcedErrors.bySet[index].opponent.count
        - unforcedErrors.bySet[index].me.count },
      opponent: { count: winners.bySet[index].opponent.count + forcedErrors.bySet[index].me.count
        - unforcedErrors.bySet[index].opponent.count },
    })),
  }
}
