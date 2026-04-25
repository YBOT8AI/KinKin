/**
 * KINKIN Gamification System
 * Level progression, XP tracking, strikes, and achievements
 */

// ============================================
// LEVEL CONFIGURATION
// ============================================

export const LEVELS = [
  { level: 1, title: 'Neighbor', icon: '🌱', xpRequired: 0, benefits: { radiusKm: 0.5, maxJobs: 2 } },
  { level: 2, title: 'Helper', icon: '🏡', xpRequired: 100, benefits: { radiusKm: 1.0, maxJobs: 3 } },
  { level: 3, title: 'Pro', icon: '🛠️', xpRequired: 300, benefits: { radiusKm: 2.0, maxJobs: 4 } },
  { level: 4, title: 'Expert', icon: '⭐', xpRequired: 750, benefits: { radiusKm: 3.5, maxJobs: 5 } },
  { level: 5, title: 'Legend', icon: '🏆', xpRequired: 1500, benefits: { radiusKm: 5.0, maxJobs: 6 } },
  { level: 6, title: 'Community Hero', icon: '👑', xpRequired: 3000, benefits: { radiusKm: 7.0, maxJobs: 8, priorityMatching: true } },
] as const;

// ============================================
// XP REWARDS
// ============================================

export const XP_REWARDS = {
  JOB_COMPLETED: 20,
  RATING_5_STAR: 10,
  RATING_4_STAR: 5,
  LOYALTY_BONUS: 15,  // Same customer 3+ times
  PERFECT_WEEK: 25,   // 7 days, no issues, 5+ jobs
  REFERRAL: 50,       // Referred provider completes 5 jobs
} as const;

// ============================================
// VIOLATIONS & PENALTIES
// ============================================

export type ViolationSeverity = 'critical' | 'severe' | 'moderate';

export interface Violation {
  type: string;
  severity: ViolationSeverity;
  strikes: number;
  penalty: string;
}

export const VIOLATIONS: Record<string, Violation> = {
  NO_SHOW: {
    type: 'no_show',
    severity: 'critical',
    strikes: 3,
    penalty: '7-day suspension',
  },
  JOB_ABANDONMENT: {
    type: 'job_abandonment',
    severity: 'critical',
    strikes: 3,
    penalty: '7-day suspension',
  },
  LATE_CANCELLATION: {
    type: 'late_cancellation',
    severity: 'severe',
    strikes: 2,
    penalty: '48-hour suspension',
  },
  POOR_COMMUNICATION: {
    type: 'poor_communication',
    severity: 'moderate',
    strikes: 1,
    penalty: 'Warning, radius -50% for 24h',
  },
  LOW_RATING: {
    type: 'low_rating',
    severity: 'moderate',
    strikes: 1,
    penalty: 'Mandatory retraining',
  },
  CUSTOMER_COMPLAINT: {
    type: 'customer_complaint',
    severity: 'severe',
    strikes: 2,
    penalty: 'Case review, possible suspension',
  },
} as const;

// ============================================
// STRIKE SYSTEM
// ============================================

export const STRIKE_PENALTIES = [
  { strikes: 1, consequence: 'Warning (visible on profile)' },
  { strikes: 2, consequence: 'Radius -50% for 7 days' },
  { strikes: 3, consequence: '7-day suspension' },
  { strikes: 4, consequence: '30-day suspension' },
  { strikes: 5, consequence: 'Permanent ban' },
] as const;

export const STRIKE_EXPIRY = {
  SINGLE_STRIKE_DAYS: 30,
  MULTIPLE_STRIKES_DAYS: 60,
} as const;

// ============================================
// ACHIEVEMENTS
// ============================================

export interface Achievement {
  badge: string;
  title: string;
  icon: string;
  requirement: string;
  xpBonus: number;
  benefit?: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    badge: 'fast_starter',
    title: 'Fast Starter',
    icon: '🚀',
    requirement: 'Complete 10 jobs in first week',
    xpBonus: 10,
    benefit: '+10% XP for 30 days',
  },
  {
    badge: 'perfect_month',
    title: 'Perfect Month',
    icon: '💯',
    requirement: '30 days, 0 strikes, 4.8★+ avg',
    xpBonus: 25,
    benefit: 'Featured in local feed',
  },
  {
    badge: 'pet_specialist',
    title: 'Pet Specialist',
    icon: '🐾',
    requirement: '20 pet-sitting jobs, 4.8★+',
    xpBonus: 50,
    benefit: 'Pet jobs: +20% radius',
  },
  {
    badge: 'respect_keeper',
    title: 'Respect Keeper',
    icon: '🙏',
    requirement: '10 funeral prayer jobs, 5★ only',
    xpBonus: 50,
    benefit: 'Priority for funeral services',
  },
  {
    badge: 'master_cook',
    title: 'Master Cook',
    icon: '🍳',
    requirement: '50 meal prep jobs, 4.7★+',
    xpBonus: 50,
    benefit: 'Cooking category: top of search',
  },
  {
    badge: 'fix_it_pro',
    title: 'Fix-It Pro',
    icon: '🔧',
    requirement: '100 repair jobs, 4.5★+',
    xpBonus: 50,
    benefit: 'Repair category: top of search',
  },
  {
    badge: 'community_favorite',
    title: 'Community Favorite',
    icon: '🌟',
    requirement: '200+ jobs, 4.9★+',
    xpBonus: 100,
    benefit: 'Platform-wide featured profile',
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Calculate provider's current level from XP
 */
export function getLevelFromXP(xpTotal: number): number {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xpTotal >= LEVELS[i].xpRequired) {
      return LEVELS[i].level;
    }
  }
  return 1;
}

/**
 * Get level details
 */
export function getLevelDetails(level: number) {
  return LEVELS.find(l => l.level === level) || LEVELS[0];
}

/**
 * Calculate XP needed for next level
 */
export function getXPToNextLevel(currentLevel: number, xpCurrent: number): number {
  const nextLevel = LEVELS.find(l => l.level === currentLevel + 1);
  if (!nextLevel) return 0;  // Max level
  
  return Math.max(0, nextLevel.xpRequired - xpCurrent);
}

/**
 * Calculate progress percentage to next level
 */
export function getLevelProgress(currentLevel: number, xpCurrent: number): number {
  const current = getLevelDetails(currentLevel);
  const next = LEVELS.find(l => l.level === currentLevel + 1);
  
  if (!next) return 100;  // Max level
  
  const xpInRange = xpCurrent - current.xpRequired;
  const xpNeeded = next.xpRequired - current.xpRequired;
  
  return Math.min(100, Math.round((xpInRange / xpNeeded) * 100));
}

/**
 * Calculate dynamic service radius based on rating and review count
 */
export function calculateServiceRadius(avgRating: number, reviewCount: number): number {
  const baseRadius = 0.5;  // km
  const radiusPerStar = 0.9;  // km
  const reviewWeight = Math.min(reviewCount / 10.0, 1.0);  // Caps at 10 reviews
  
  return baseRadius + (avgRating * radiusPerStar * reviewWeight);
}

/**
 * Calculate max allowed concurrent jobs based on earnings
 */
export function calculateMaxJobs(earningsLast7Days: number, minimumHourlyRate: number = 10): number {
  const avgDailyEarnings = earningsLast7Days / 7;
  return Math.ceil(avgDailyEarnings / minimumHourlyRate);
}

/**
 * Check if provider can accept new job (fairness rules)
 */
export function canAcceptJob(
  currentJobs: number,
  maxJobs: number,
  jobDistance: number,
  serviceRadius: number
): boolean {
  return currentJobs < maxJobs && jobDistance <= serviceRadius;
}

/**
 * Get strike penalty message
 */
export function getStrikePenaltyMessage(totalStrikes: number): string {
  const penalty = STRIKE_PENALTIES.find(s => s.strikes === totalStrikes);
  return penalty ? penalty.consequence : 'No penalty';
}

/**
 * Check if strike should expire
 */
export function shouldStrikeExpire(createdAt: Date, totalStrikes: number): boolean {
  const now = new Date();
  const daysSinceStrike = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
  const expiryDays = totalStrikes >= 2 ? STRIKE_EXPIRY.MULTIPLE_STRIKES_DAYS : STRIKE_EXPIRY.SINGLE_STRIKE_DAYS;
  
  return daysSinceStrike >= expiryDays;
}

/**
 * Calculate XP for a completed job
 */
export function calculateJobXP(rating: number | null): number {
  let xp = XP_REWARDS.JOB_COMPLETED;
  
  if (rating === 5) {
    xp += XP_REWARDS.RATING_5_STAR;
  } else if (rating === 4) {
    xp += XP_REWARDS.RATING_4_STAR;
  }
  
  return xp;
}

/**
 * Get achievement by badge ID
 */
export function getAchievementByBadge(badge: string): Achievement | undefined {
  return ACHIEVEMENTS.find(a => a.badge === badge);
}

/**
 * Check if user qualifies for an achievement
 */
export function checkAchievementQualification(
  achievement: Achievement,
  stats: {
    jobsCompleted: number;
    avgRating: number;
    strikes: number;
    daysSinceJoin: number;
    categoryJobs: Record<string, number>;
  }
): boolean {
  switch (achievement.badge) {
    case 'fast_starter':
      return stats.jobsCompleted >= 10 && stats.daysSinceJoin <= 7;
    
    case 'perfect_month':
      return stats.daysSinceJoin >= 30 && 
             stats.strikes === 0 && 
             stats.avgRating >= 4.8;
    
    case 'pet_specialist':
      return (stats.categoryJobs['pet_sitting'] || 0) >= 20 && 
             stats.avgRating >= 4.8;
    
    case 'respect_keeper':
      return (stats.categoryJobs['funeral_prayer'] || 0) >= 10 && 
             stats.avgRating >= 5.0;
    
    case 'master_cook':
      return (stats.categoryJobs['cooking'] || 0) >= 50 && 
             stats.avgRating >= 4.7;
    
    case 'fix_it_pro':
      return (stats.categoryJobs['home_repair'] || 0) >= 100 && 
             stats.avgRating >= 4.5;
    
    case 'community_favorite':
      return stats.jobsCompleted >= 200 && 
             stats.avgRating >= 4.9;
    
    default:
      return false;
  }
}

// Export types
export type Level = typeof LEVELS[number];
export type ViolationType = keyof typeof VIOLATIONS;
