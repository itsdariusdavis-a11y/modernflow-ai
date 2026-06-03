/**
 * Minimal, hand-written types for the parts of the MLB Stats API
 * (https://statsapi.mlb.com) that this dashboard consumes. The API returns far
 * more than we model here; we only type the fields we actually read.
 */

export type Handedness = "L" | "R" | "S";

export interface TeamRef {
  id: number;
  name: string;
  abbreviation?: string;
  teamName?: string;
}

export interface PersonRef {
  id: number;
  fullName: string;
}

// ---- Schedule ----------------------------------------------------------------

export interface ScheduleResponse {
  dates: ScheduleDate[];
}

export interface ScheduleDate {
  date: string;
  games: ScheduleGame[];
}

export interface ScheduleGame {
  gamePk: number;
  gameDate: string; // ISO timestamp (UTC)
  officialDate: string; // YYYY-MM-DD (the game's official calendar date)
  dayNight?: "day" | "night";
  status: { abstractGameState: string; detailedState: string };
  teams: {
    away: ScheduleGameTeam;
    home: ScheduleGameTeam;
  };
  venue?: { id: number; name: string };
  linescore?: { teams?: { home?: { runs?: number }; away?: { runs?: number } } };
}

export interface ScheduleGameTeam {
  team: TeamRef;
  leagueRecord?: { wins: number; losses: number; pct: string };
  score?: number;
  probablePitcher?: PersonRef & { pitchHand?: { code: Handedness } };
  isWinner?: boolean;
}

// ---- People (probable pitcher handedness) ------------------------------------

export interface PeopleResponse {
  people: Array<{
    id: number;
    fullName: string;
    pitchHand?: { code: Handedness; description?: string };
    batSide?: { code: Handedness; description?: string };
    primaryPosition?: { abbreviation?: string };
  }>;
}

// ---- Stats (hitting splits, vsTeam, vsPlayer) --------------------------------

export interface HittingSplitStat {
  gamesPlayed?: number;
  runs?: number;
  avg?: string;
  obp?: string;
  slg?: string;
  ops?: string;
  atBats?: number;
  hits?: number;
  homeRuns?: number;
  plateAppearances?: number;
}

export interface PitchingSplitStat {
  gamesPlayed?: number;
  inningsPitched?: string;
  era?: string;
  whip?: string;
  avg?: string; // batting avg against
  ops?: string; // ops against
  strikeOuts?: number;
  baseOnBalls?: number;
  hits?: number;
  homeRuns?: number;
  atBats?: number;
  battersFaced?: number;
}

export interface StatSplit<T> {
  season?: string;
  stat: T;
  split?: { code?: string; description?: string };
  team?: TeamRef;
  opponent?: TeamRef;
  player?: PersonRef;
}

export interface StatGroup<T> {
  type?: { displayName?: string };
  group?: { displayName?: string };
  splits: StatSplit<T>[];
}

export interface StatsResponse<T> {
  stats: StatGroup<T>[];
}

// ---- Standings (home/away/day/night records) ---------------------------------

export interface StandingsResponse {
  records: StandingsLeagueRecord[];
}

export interface StandingsLeagueRecord {
  teamRecords: StandingsTeamRecord[];
}

export interface SplitRecord {
  wins: number;
  losses: number;
  pct?: string;
  type: string; // "home" | "away" | "day" | "night" | "lastTen" | ...
}

export interface StandingsTeamRecord {
  team: TeamRef;
  wins: number;
  losses: number;
  winningPercentage?: string;
  records?: { splitRecords?: SplitRecord[] };
}
