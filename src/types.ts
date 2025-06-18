import { useState } from 'react';
import { Edit, Archive, Eye, TrendingUp, Users, DollarSign, Plus, Rocket, Play, Pause, Upload, X, ExternalLink } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export type Campaign = {
  id: number;
  title: string;
  description: string;
  image: string;
  reservationGoal: number;
  currentReservations: number;
  estimatedRetailPrice: number;
  daysOld: number;
  category: 'tech' | 'home' | 'lifestyle';
  projectUrl: string;
  kickstarterUrl?: string;
  amazonUrl?: string;
  websiteUrl?: string;
  videoUrl?: string;
  topBidders: Array<{
    position: number;
    coins: number;
    userId?: string;
    reward: string;
  }>;
  minimumBid: number;
};

interface CampaignManagementProps {
  campaigns: Campaign[];
  onCampaignEdit: (campaign: Campaign) => void;
  onCampaignView: (campaignId: number) => void;
  onCampaignArchive: (campaignId: number) => void;
  onCampaignCreate?: () => void;
  onCampaignStatusChange?: (campaignId: number, status: string) => void;
}

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  company_name?: string;
  phone?: string;
  website?: string;
  linkedin_url?: string;
  bio?: string;
  coins?: number;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
};

export type Submission = {
  id: string;
  user_id: string;
  title: string;
  score?: number;
  admin_notes?: string;
  terms_accepted: boolean;
  short_description: string;
  problem_statement: string;
  solution_description: string;
  target_market: string;
  competitive_advantage: string;
  development_stage: string;
  intellectual_property?: string;
  funding_needs?: number;
  team_description?: string;
  business_model?: string;
  go_to_market?: string;
  status: 'pending' | 'review' | 'approved' | 'rejected' | 'development';
  created_at: string;
  updated_at: string;
};

export type SubmissionFile = {
  id: string;
  submission_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_url: string;
  file_category: 'pitch_deck' | 'prototype' | 'market_research' | 'other';
  created_at: string;
};

export type SubmissionUpdate = {
  id: string;
  submission_id: string;
  status: string;
  comment?: string;
  created_by: string;
  created_at: string;
};

export type ScoreDescription = {
  score: number;
  description: string;
  market_potential: string;
  next_steps: string;
  created_at: string;
};

export type Message = {
  id: string;
  from_user_id: string;
  to_user_id: string;
  content: string;
  read: boolean;
  created_at: string;
};

export type CampaignComment = {
  id: string;
  campaign_id: number;
  user_id: string;
  content: string;
  parent_id?: string;
  author_coin_weight: number;
  total_agree_weight: number;
  total_disagree_weight: number;
  calculated_score: number;
  created_at: string;
  updated_at: string;
  profile?: Profile;
  replyCount?: number;
  agreeCount?: number;
  disagreeCount?: number;
};

export type CommentReaction = {
  id: string;
  comment_id: string;
  user_id: string;
  reaction_type: 'agree' | 'disagree';
  reactor_coin_weight: number;
  created_at: string;
  updated_at: string;
};