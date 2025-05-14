import mongoose from 'mongoose';

const ProblemStatsSchema = new mongoose.Schema({
  easy: { type: Number, default: 0 },
  medium: { type: Number, default: 0 },
  hard: { type: Number, default: 0 },
});

const LanguageStatsSchema = new mongoose.Schema({
  languageName: { type: String },
  problemsSolved: { type: Number, default: 0 },
});

const BadgeSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String },
  displayName: { type: String },
  icon: { type: String },
  medal: {
    slug: { type: String },
    iconGif: { type: String },
  },
  category: { type: String },
});

const ContestHistorySchema = new mongoose.Schema({
  attended: { type: Boolean, default: false },
  problemsSolved: { type: Number, default: 0 },
  totalProblems: { type: Number, default: 0 },
  finishTimeInSeconds: { type: Number, default: 0 },
  ranking: { type: Number, default: 0 },
  contestTitle: { type: String },
  startTime: { type: Number },
});

const tagSchema = new mongoose.Schema({
  tagName: {
    type: String,
    required: true
  },
  problemsSolved: {
    type: Number,
    required: true
  }
});

const tagProblemCountsSchema = new mongoose.Schema({
  advanced: [tagSchema],
  intermediate: [tagSchema],
  fundamental: [tagSchema]
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true }, 
  profileImage: { type: String, default: '' },
  realName: { type: String, default: '' },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  reputation: { type: Number, default: 0 },
  // reputationDiff: { type: Number, default: 0 },
  ranking: { type: Number, default: 0 },
  country: { type: String, default: '' },
  // company: { type: String, default: '' },
  // jobTitle: { type: String, default: '' },
  aboutMe: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  twitterUrl: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' },
  problemStats: { type: ProblemStatsSchema, default: () => ({}) },
  languageStats: [LanguageStatsSchema],
  postViewCount: { type: Number, default: 0 },
  // postViewCountDiff: { type: Number, default: 0 },
  solutionCount: { type: Number, default: 0 },
  // solutionCountDiff: { type: Number, default: 0 },
  categoryDiscussCount: { type: Number, default: 0 },
  // categoryDiscussCountDiff: { type: Number, default: 0 },
  contestRating: { type: Number, default: 0 },
  totalContestsParticipated: { type: Number, default: 0 },
  globalRanking: { type: Number, default: null },
  totalParticipants: { type: Number, default: 0 },
  topPercentage: { type: Number, default: 0 },
  badges: [BadgeSchema],
  MonthlyProgress: { type: Number, default: 0 },
  // activeBadge: {
  //   displayName: { type: String, default: '' },
  //   icon: { type: String, default: '' },
  // },
  contestBadge: {
    name: { type: String, default: '' },
    expired: { type: Boolean, default: false },
    icon: { type: String, default: '' },
  },
  contestRankingHistory: [ContestHistorySchema],
  totalActiveDays: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  score: { type: Number, default: 0 },
  password: {type : String, required: true},
  problemCount: { type: Number, default: 0 },
  tagProblemCounts: { type: tagProblemCountsSchema, default: () => ({}) },
  StriverSolvedQue: {type: Array},
});

const User = mongoose.model('User', UserSchema);
export default User;
