export interface User {
  id: number;
  email: string;
  timezone: string;
  locale: string;
  subscription_tier: "free" | "pro";
}

export interface Persona {
  id: number;
  name: string;
  arabic_name: string;
  domain: string;
  eventually: string;
  icon: string;
  color: string;
  one_thing: string | null;
  ritual: string | null;
  guardrail: string | null;
  points: string[];
  milestones: Milestone[];
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Milestone {
  id: number;
  persona_id: number;
  target_date: string | null;
  goal: string;
  is_completed: boolean;
}

export interface ScheduleBlock {
  id: number;
  persona_id: number;
  start_time: string;
  end_time: string;
  activity: string;
  day_type: "weekday" | "weekend" | "daily";
  is_prayer_block: boolean;
  order: number;
}

export interface Principle {
  id: number;
  name: string;
  arabic: string;
  meaning: string;
  verse: string | null;
  icon: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface NonNegotiable {
  id: number;
  title: string;
  category: "spiritual" | "health" | "growth";
  order: number;
  streak: Streak | null;
}

export interface Streak {
  current_streak: number;
  longest_streak: number;
  last_check_date: string | null;
}

export interface DailyCheck {
  id: number;
  non_negotiable_id: number;
  check_date: string;
  is_completed: boolean;
}

export interface UserSettings {
  super_objective: string;
  prayer_calculation_method: string;
  latitude: number | null;
  longitude: number | null;
  theme: "light" | "dark" | "system";
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
}

export interface DashboardData {
  super_objective: string;
  personas: Pick<Persona, "id" | "name" | "arabic_name" | "domain" | "icon" | "color">[];
  schedule_blocks: Pick<ScheduleBlock, "id" | "start_time" | "end_time" | "activity" | "persona_id" | "is_prayer_block">[];
  non_negotiables_total: number;
  non_negotiables_checked_today: number;
  streaks: { title: string; current: number; longest: number }[];
}
