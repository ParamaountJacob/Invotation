import { supabase } from './supabase';

export interface DatabaseCampaign {
  id: number;
  title: string;
  short_description?: string;
  description: string;
  image: string;
  reservation_goal: number;
  current_reservations: number;
  estimated_retail_price: number;
  category: string;
  minimum_bid: number;
  days_old: number;
  is_archived: boolean;
  created_at: string;
  status: string;
  goal_reached_at?: string;
  kickstarter_url?: string;
  amazon_url?: string;
  website_url?: string;
  video_url?: string;
}

export interface CampaignSupporter {
  id: string;
  campaign_id: number;
  user_id: string;
  coins_spent: number;
  position?: number;
  discount_percentage?: number;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export interface Campaign {
  id: number;
  title: string;
  short_description?: string;
  description: string;
  image: string;
  reservationGoal: number;
  currentReservations: number;
  estimatedRetailPrice: number;
  daysOld: number;
  category: 'tech' | 'home' | 'lifestyle';
  projectUrl: string;
  minimumBid: number;
  topBidders: CampaignSupporter[];
  status?: string;
  goal_reached_at?: string;
  kickstarterUrl?: string;
  amazonUrl?: string;
  websiteUrl?: string;
  videoUrl?: string;
  videoUrl?: string;
  isArchived: boolean;
  status: string;
}

export function convertCampaignToFrontend(dbCampaign: DatabaseCampaign, topBidders: CampaignSupporter[]): Campaign {
  // Calculate total coins spent by all supporters
  const totalCoinsSpent = topBidders.reduce((sum, supporter) => sum + supporter.coins_spent, 0);
  
  // Create a short description if one doesn't exist
  let shortDescription = dbCampaign.short_description;
  if (!shortDescription) {
    try {
      if (dbCampaign.description.startsWith('{')) {
        const parsed = JSON.parse(dbCampaign.description);
        if (parsed && typeof parsed === 'object' && parsed.text) {
          shortDescription = parsed.text.substring(0, 150) + (parsed.text.length > 150 ? '...' : '');
        }
      } else {
        shortDescription = dbCampaign.description.substring(0, 150) + (dbCampaign.description.length > 150 ? '...' : '');
      }
    } catch (e) {
      shortDescription = dbCampaign.description.substring(0, 150) + (dbCampaign.description.length > 150 ? '...' : '');
    }
  }
  return {
    id: dbCampaign.id,
    title: dbCampaign.title,
    short_description: shortDescription,
    description: dbCampaign.description,
    image: dbCampaign.image,
    reservationGoal: dbCampaign.reservation_goal,
    currentReservations: dbCampaign.current_reservations || totalCoinsSpent,
    estimatedRetailPrice: dbCampaign.estimated_retail_price,
    daysOld: dbCampaign.days_old,
    category: dbCampaign.category as 'tech' | 'home' | 'lifestyle',
    projectUrl: `/campaign/${dbCampaign.id}`,
    minimumBid: dbCampaign.minimum_bid,
    status: dbCampaign.status || 'live',
    goal_reached_at: dbCampaign.goal_reached_at,
    topBidders,
    kickstarterUrl: dbCampaign.kickstarter_url,
    amazonUrl: dbCampaign.amazon_url,
    websiteUrl: dbCampaign.website_url,
    videoUrl: dbCampaign.video_url,
    videoUrl: dbCampaign.video_url,
    isArchived: dbCampaign.is_archived,
    status: dbCampaign.status || 'live'
  };
}

export async function fetchCampaigns(includeArchived: boolean = false): Promise<DatabaseCampaign[]> {
  try {
    let query = supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (!includeArchived) {
      query = query.eq('is_archived', false);
    }

    const { data: campaigns, error } = await query;

    if (error) {
      console.error('Error fetching campaigns:', error);
      return [];
    }

    return campaigns || [];
  } catch (error) {
    console.error('Error in fetchCampaigns:', error);
    return [];
  }
}

export async function fetchCampaignSupporters(campaignId: number): Promise<CampaignSupporter[]> {
  try {
    const { data: supporters, error } = await supabase
      .from('campaign_supporters')
      .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url
        )
      `)
      .eq('campaign_id', campaignId)
      .order('coins_spent', { ascending: false });

    if (error) {
      console.error('Error fetching campaign supporters:', error);
      return [];
    }

    return supporters || [];
  } catch (error) {
    console.error('Error in fetchCampaignSupporters:', error);
    return [];
  }
}

export async function getCampaigns(): Promise<Campaign[]> {
  try {
    const campaigns = await fetchCampaigns(false);

    // Fetch top bidders for each campaign
    const campaignsWithBidders = await Promise.all(
      campaigns.map(async (campaign) => {
        const supporters = await fetchCampaignSupporters(campaign.id);
        return convertCampaignToFrontend(campaign, supporters);
      })
    );

    return campaignsWithBidders;
  } catch (error) {
    console.error('Error in getCampaigns:', error);
    return [];
  }
}

export async function getCampaignById(id: number): Promise<Campaign | null> {
  try {
    const { data: campaign, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !campaign) {
      console.error('Error fetching campaign:', error);
      return null;
    }

    // Fetch supporters for this campaign
    const supporters = await fetchCampaignSupporters(id);

    return convertCampaignToFrontend(campaign, supporters);
  } catch (error) {
    console.error('Error in getCampaignById:', error);
    return null;
  }
}

export async function supportCampaign(campaignId: number, coinsToSpend: number): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    // Check if user already supports this campaign
    const { data: existingSupport, error: fetchError } = await supabase
      .from('campaign_supporters')
      .select('*')
      .eq('campaign_id', campaignId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (fetchError) {
      console.error('Error checking existing support:', fetchError);
      return false;
    }

    if (existingSupport) {
      // Update existing support
      const { error } = await supabase
        .from('campaign_supporters')
        .update({
          coins_spent: existingSupport.coins_spent + coinsToSpend,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingSupport.id);

      if (error) {
        console.error('Error updating support:', error);
        return false;
      }
    } else {
      // Create new support
      const { error } = await supabase
        .from('campaign_supporters')
        .insert({
          campaign_id: campaignId,
          user_id: user.id,
          coins_spent: coinsToSpend
        });

      if (error) {
        console.error('Error creating support:', error);
        return false;
      }
    }

    // Update campaign and recalculate positions
    await recalculateCampaignData(campaignId);
    // Recalculate user influence on comments
    try {
      const { recalculateUserInfluenceOnComments } = await import('./comments');
      await recalculateUserInfluenceOnComments(user.id, campaignId);
    } catch (err) {
      console.error('Error recalculating comment influence:', err);
      // Continue even if this fails - it's not critical
    }

    return true;
  } catch (error) {
    console.error('Error supporting campaign:', error);
    return false;
  }
}

export async function getUserCampaignSupport(campaignId: number): Promise<CampaignSupporter | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: support, error } = await supabase
      .from('campaign_supporters')
      .select('*')
      .eq('campaign_id', campaignId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user campaign support:', error);
      return null;
    }

    return support;
  } catch (error) {
    console.error('Error in getUserCampaignSupport:', error);
    return null;
  }
}

// Function to recalculate campaign data (supporter positions and reservation count)
export async function recalculateCampaignData(campaignId: number): Promise<void> {
  try {
    // Get all supporters for this campaign
    const { data: supporters, error: supportersError } = await supabase
      .from('campaign_supporters')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('coins_spent', { ascending: false });

    if (supportersError) {
      console.error('Error fetching supporters:', supportersError);
      return;
    }

    // Calculate total coins spent by all supporters
    const totalCoinsSpent = supporters?.reduce((sum, supporter) => sum + supporter.coins_spent, 0) || 0;

    // Update campaign reservation count
    const { error: updateError } = await supabase
      .from('campaigns')
      .update({ current_reservations: totalCoinsSpent })
      .eq('id', campaignId);

    if (updateError) {
      console.error('Error updating campaign:', updateError);
    }

    // Update supporter positions and discounts
    if (supporters && supporters.length > 0) {
      for (let i = 0; i < supporters.length; i++) {
        const position = i + 1;
        let discount = 20; // Default discount

        // Calculate discount based on position
        if (position === 1) discount = 40;
        else if (position === 2) discount = 35;
        else if (position === 3) discount = 30;
        else if (position === 4) discount = 27;
        else discount = 20; // Base tier for position 5 and beyond

        // Update supporter
        const { error } = await supabase
          .from('campaign_supporters')
          .update({
            position,
            discount_percentage: discount,
            updated_at: new Date().toISOString()
          })
          .eq('id', supporters[i].id);

        if (error) {
          console.error(`Error updating supporter position ${position}:`, error);
        }
      }
    }
  } catch (error) {
    console.error('Error in recalculateCampaignData:', error);
  }
  
  // Check if campaign has reached its goal
  try {
    const { data: campaign } = await supabase
      .from('campaigns')
      .select('current_reservations, reservation_goal, status, goal_reached_at')
      .eq('id', campaignId)
      .single();
    
    if (campaign && campaign.current_reservations >= campaign.reservation_goal && 
        campaign.status !== 'goal_reached' && 
        campaign.status !== 'kickstarter' && 
        campaign.status !== 'archived' && 
        !campaign.goal_reached_at) {
      
      // Update campaign status to goal_reached and set goal_reached_at timestamp
      await supabase
        .from('campaigns')
        .update({ 
          status: 'goal_reached',
          goal_reached_at: new Date().toISOString()
        })
        .eq('id', campaignId);
    }
  } catch (error) {
    console.error('Error checking campaign goal:', error);
  }
}