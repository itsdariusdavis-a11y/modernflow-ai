export type Person = 'Darius' | 'Ryan';

export const PEOPLE: Person[] = ['Darius', 'Ryan'];

export const STAGES = [
  'Conversation',
  'Booked',
  'Deposit Paid',
  'In Build',
  'Delivered',
  'Balance Paid',
  'Recurring',
  'Dead',
] as const;

export type Stage = (typeof STAGES)[number];

/** Stages that mean the site has actually been built and handed over. */
export const DELIVERED_STAGES: Stage[] = ['Delivered', 'Balance Paid', 'Recurring'];

export interface DailyLog {
  date: string; // YYYY-MM-DD, America/Los_Angeles
  person: Person;
  touches: number;
  conversations: number;
  booked_calls: number;
  deposits_closed: number;
  cash_collected: number;
  build_task_done: boolean;
  blocker: string;
  note: string;
}

export interface Deal {
  id: string;
  business_name: string;
  contact_name: string;
  phone: string;
  source: string;
  owner: Person;
  stage: Stage;
  deposit_amount: number;
  deposit_date: string;
  balance_amount: number;
  balance_date: string;
  delivery_hours: number;
  date_created: string;
  last_touch: string;
  next_action: string;
  next_action_date: string;
  notes: string;
}

export interface Standup {
  date: string;
  person: Person;
  yesterday: string;
  today: string;
  blocker: string;
  submitted_at: string; // ISO timestamp
}

export interface WeeklyReview {
  week_number: number;
  start_date: string;
  end_date: string;
  cash_collected: number;
  touches: number;
  conversations: number;
  closes: number;
  biggest_objection: string;
  one_change: string;
  written_by: Person | '';
}

export interface Snapshot {
  daily_log: DailyLog[];
  deals: Deal[];
  standups: Standup[];
  weekly_review: WeeklyReview[];
  fetched_at: string;
}

/**
 * Column order for every tab. This is the contract with the Google Sheet:
 * the header row must match these names exactly (see SETUP.md). Reads map by
 * header name, so a human reordering columns in the Sheet won't corrupt data —
 * but a renamed or missing header will.
 */
export const HEADERS = {
  daily_log: [
    'date',
    'person',
    'touches',
    'conversations',
    'booked_calls',
    'deposits_closed',
    'cash_collected',
    'build_task_done',
    'blocker',
    'note',
  ],
  deals: [
    'id',
    'business_name',
    'contact_name',
    'phone',
    'source',
    'owner',
    'stage',
    'deposit_amount',
    'deposit_date',
    'balance_amount',
    'balance_date',
    'delivery_hours',
    'date_created',
    'last_touch',
    'next_action',
    'next_action_date',
    'notes',
  ],
  standups: ['date', 'person', 'yesterday', 'today', 'blocker', 'submitted_at'],
  weekly_review: [
    'week_number',
    'start_date',
    'end_date',
    'cash_collected',
    'touches',
    'conversations',
    'closes',
    'biggest_objection',
    'one_change',
    'written_by',
  ],
} as const;

export type TabName = keyof typeof HEADERS;
