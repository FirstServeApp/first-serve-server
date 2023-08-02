import { IGame, ISet } from '../models/match.model.js'

const getHistoryByPlayer = (games: IGame[], player: 'ME' | 'OPPONENT') => {
  return games.filter((game) => game.server === player).flatMap((item) => item.history)
}

const getBreakPoint = (games: IGame[], player: 'ME' | 'OPPONENT', type: 'saved' | 'won') => {
  return games
    .filter((game) => game.server === player)
    .flatMap((item) => item.history)
    .filter((item) => item.server === player)
    .filter((item) => {
      if (type === 'saved') {
        return item.myScore < item.opponentScore
      } else {
        return item.myScore > item.opponentScore
      }
    })
}

type StatType = 'Ace' | 'Double fault' | 'Winner' | 'Forced error' | 'Unforced error'

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

export const getServesStat = (sets: ISet[], serveType: '1' | '2') => {
  const games = sets.flatMap((set) => set.games)

  const myServesCount = getHistoryByPlayer(games, 'ME').filter((item) => item.serve === serveType).length
  const opponentServesCount = getHistoryByPlayer(games, 'OPPONENT').filter((item) => item.serve === serveType).length

  return {
    all: {
      me: { total: getHistoryByPlayer(games, 'ME').length, count: myServesCount },
      opponent: { total: getHistoryByPlayer(games, 'OPPONENT').length, count: opponentServesCount },
    },
    bySet: sets.map((set) => ({
      me: {
        total: getHistoryByPlayer(set.games, 'ME').length,
        count: getHistoryByPlayer(set.games, 'ME').filter((item) => item.serve === serveType).length,
      },
      opponent: {
        total: getHistoryByPlayer(set.games, 'OPPONENT').length,
        count: getHistoryByPlayer(set.games, 'OPPONENT').filter((item) => item.serve === serveType).length,
      },
    })),
  }
}

export const getServesPoints = (sets: ISet[], serveType: '1' | '2') => {
  const games = sets.flatMap((set) => set.games)

  const myServesCount = getHistoryByPlayer(games, 'ME')
    .filter((item) => item.serve === serveType && item.server === 'ME').length
  const opponentServesCount = getHistoryByPlayer(games, 'OPPONENT')
    .filter((item) => item.serve === serveType && item.server === 'OPPONENT').length

  return {
    all: {
      me: { total: getHistoryByPlayer(games, 'ME').length, count: myServesCount },
      opponent: { total: getHistoryByPlayer(games, 'OPPONENT').length, count: opponentServesCount },
    },
    bySet: sets.map((set) => ({
      me: {
        total: getHistoryByPlayer(set.games, 'ME').length,
        count: getHistoryByPlayer(set.games, 'ME')
          .filter((item) => item.serve === serveType && item.server === 'ME').length,
      },
      opponent: {
        total: getHistoryByPlayer(set.games, 'OPPONENT').length,
        count: getHistoryByPlayer(set.games, 'OPPONENT')
          .filter((item) => item.serve === serveType && item.server === 'OPPONENT').length,
      },
    })),
  }
}

export const getBreakPointsStat = (sets: ISet[], type: 'saved' | 'won') => {
  const games = sets.flatMap((set) => set.games)

  const myBreakPointsCount = getBreakPoint(games, 'ME', type).length
  const opponentBreakPointsCount = getBreakPoint(games, 'OPPONENT', type).length

  return {
    all: {
      me: { count: myBreakPointsCount },
      opponent: { count: opponentBreakPointsCount },
    },
    bySet: sets.map((set) => ({
      me: { count: getBreakPoint(set.games, 'ME', type).length },
      opponent: { count: getBreakPoint(set.games, 'OPPONENT', type).length },
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
