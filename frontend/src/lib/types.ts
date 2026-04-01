import { z } from 'zod';

// User Metrics Schema
export const UserMetricsSchema = z.object({
  'External Users': z.number().min(0),
  'Internal Users': z.number().min(0),
  'Number of Regions Served': z.number().min(1).max(6),
  'Geographic Scope': z.enum(['National', 'Regional', 'Local']),
  'FMC Coverage': z.array(z.string()).optional(),
});

// Mission Metrics Schema
export const MissionMetricsSchema = z.object({
  'Business Criticality': z.enum(['Tier 1', 'Tier 2', 'Tier 3']),
  'Statutory Requirements': z.array(z.string()),
  'Downtime Cost Per Hour': z.number().min(0),
  'RTO (Recovery Time Objective)': z.string(),
  'RPO (Recovery Point Objective)': z.string().optional(),
  'Compliance Mandates': z.array(z.string()).optional(),
});

// Resource Metrics Schema
export const ResourceMetricsSchema = z.object({
  'Annual Hosting Cost': z.number().min(0),
  'FTE Dedicated': z.number().min(0),
  'Support Tickets Annual': z.number().min(0),
  'Incident Count Annual': z.number().min(0),
  'Tech Stack Age Years': z.number().min(0),
  'Lines of Code': z.number().min(0).optional(),
  'Technical Debt Hours': z.number().min(0),
  'Security Vulnerabilities': z.number().min(0).optional(),
  'Last Major Update': z.string().optional(),
});

// Application Schema
export const ApplicationSchema = z.object({
  id: z.string().optional(),
  Application: z.string().min(1, 'Application name is required'),
  'Program Name': z.string().min(1, 'Program name is required'),
  'Prod URL': z.string().url().or(z.literal('')),
  'Dev URL': z.string().url().or(z.literal('')).optional(),
  'Test URL': z.string().url().or(z.literal('')).optional(),
  'Any Additional url': z.string().optional(),
  'Public Access?': z.enum(['Yes', 'No', 'Unknown']),
  'Requires Login?': z.enum(['Yes', 'No', 'Unknown']).optional(),
  'Type of Login': z.string().optional(),
  'Akamai?': z.enum(['Yes', 'No', 'Unknown']).optional(),
  'Technology Stack': z.string().min(1, 'Technology stack is required'),
  'Product Owner': z.string().min(1, 'Product owner is required'),
  'Product Contact': z.string(),
  'Project Manager': z.string().optional(),
  'Development Team': z.string().optional(),
  'Development Org': z.string().optional(),
  'Hosting Org': z.string().optional(),
  'Hosting Cost': z.string().optional(),
  'Number of Users': z.number().min(0),
  Purpose: z.string().min(10, 'Purpose must be at least 10 characters'),
  'Funding Notes': z.string().optional(),
  Notes: z.string().optional(),
  'User Metrics': UserMetricsSchema.optional(),
  'Mission Metrics': MissionMetricsSchema.optional(),
  'Resource Metrics': ResourceMetricsSchema.optional(),
});

export type Application = z.infer<typeof ApplicationSchema>;
export type UserMetrics = z.infer<typeof UserMetricsSchema>;
export type MissionMetrics = z.infer<typeof MissionMetricsSchema>;
export type ResourceMetrics = z.infer<typeof ResourceMetricsSchema>;

// RICE Analysis Result
export interface RICEResult {
  priorityRank: number;
  application: string;
  program: string;
  reach: number;
  impact: number;
  confidence: number;
  effort: number;
  riceScore: number;
  reachExplanation: string;
  impactExplanation: string;
  confidenceExplanation: string;
  effortExplanation: string;
  scoringMethod: {
    reach: 'quantitative' | 'qualitative';
    impact: 'quantitative' | 'qualitative';
    effort: 'quantitative' | 'qualitative';
  };
  isFullyQuantitative: boolean;
  dataQualityScore: string;
}
