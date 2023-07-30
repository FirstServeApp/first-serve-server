import { Model, Schema, model, Document } from 'mongoose'

export interface IGameHistory {
  myScore: number;
  opponentScore: number;
  serve: string;
  type: string;
  server: string;
}

export interface IGame {
  index: number;
  duration: number;
  myScore: number;
  opponentScore: number;
  server: string;
  history: IGameHistory[];
}

export interface ISet extends Document {
  index: number;
  myScore: number;
  opponentScore: number;
  // myServes: string[];
  // opponentServes: string[];
  games: IGame[];
}

export interface IMatch extends Document {
  user_id: Schema.Types.ObjectId;
  winner: string;
  opponentName: string;
  sets: Schema.Types.ObjectId[];
  duration: number;
}

export const SetServesEnum = ['Ace', 'Winner', 'Forced Error', 'Unforced Error', 'Double Faults']

const SetSchema = new Schema<ISet>({
  index: { type: Number, required: true },
  myScore: { type: Number, required: true },
  opponentScore: { type: Number, required: true },
  // myServes: [{ type: String, enum: SetServesEnum, required: true }],
  // opponentServes: [{ type: String, enum: SetServesEnum, required: true }],
  games: [{
    index: { type: Number, required: true },
    duration: { type: Number, required: true },
    server: { type: String, required: true },
    history: [{
      myScore: { type: Number, required: true },
      opponentScore: { type: Number, required: true },
      serve: { type: String, required: true },
      type: { type: String, required: true },
      server: { type: String, required: true },
    }],
  }],
}, { strict: 'throw' })

const MatchSchema = new Schema<IMatch>({
  user_id: { type: Schema.Types.ObjectId, required: true },
  winner: { type: String, required: true },
  opponentName: { type: String, default: 'Player 2' },
  duration: { type: Number, required: true },
  sets: [{ type: Schema.Types.ObjectId, ref: 'Set', required: true }],
}, {
  timestamps: true,
  strict: 'throw',
})

const SetModel: Model<ISet> = model<ISet>('Set', SetSchema)
const MatchModel: Model<IMatch> = model<IMatch>('Match', MatchSchema)

export {
  SetModel,
  MatchModel,
}
