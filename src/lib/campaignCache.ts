// Campaign pre-caching system
import { fetchCampaigns, convertCampaignToFrontend, fetchCampaignSupporters } from './campaigns';
import { LIMITS } from '../constants';

class CampaignCache {
  private cache: Map<string, any> = new Map();
  private isPreloading = false;
  private preloadPromise: Promise<void> | null = null;

  // Pre-cache the first campaigns immediately
  async preloadCampaigns(): Promise<void> {
    if (this.isPreloading || this.preloadPromise) {
      return this.preloadPromise || Promise.resolve();
    }

    this.isPreloading = true;
    this.preloadPromise = this.performPreload();

    try {
      await this.preloadPromise;
    } finally {
      this.isPreloading = false;
    }
  }

  private async performPreload(): Promise<void> {
    try {
      const dbCampaigns = await fetchCampaigns(false);

      // Pre-cache first campaigns with their supporters
      const preloadPromises = dbCampaigns.slice(0, LIMITS.PRELOAD_CAMPAIGNS_COUNT).map(async (dbCampaign) => {
        const supporters = await fetchCampaignSupporters(dbCampaign.id);
        const convertedCampaign = convertCampaignToFrontend(dbCampaign, supporters);
        this.cache.set(`campaign-${dbCampaign.id}`, convertedCampaign);
        return convertedCampaign;
      });

      const preloadedCampaigns = await Promise.all(preloadPromises);

      // Cache the full list
      this.cache.set('campaigns-active', preloadedCampaigns);

      // Load remaining campaigns in background
      if (dbCampaigns.length > LIMITS.PRELOAD_CAMPAIGNS_COUNT) {
        this.loadRemainingCampaigns(dbCampaigns.slice(LIMITS.PRELOAD_CAMPAIGNS_COUNT));
      }
    } catch (error) {
      console.error('Error preloading campaigns:', error);
    }
  }

  private async loadRemainingCampaigns(remainingCampaigns: any[]): Promise<void> {
    try {
      const remainingPromises = remainingCampaigns.map(async (dbCampaign) => {
        const supporters = await fetchCampaignSupporters(dbCampaign.id);
        const convertedCampaign = convertCampaignToFrontend(dbCampaign, supporters);
        this.cache.set(`campaign-${dbCampaign.id}`, convertedCampaign);
        return convertedCampaign;
      });

      const remainingConverted = await Promise.all(remainingPromises);

      // Update the full campaigns list
      const preloaded = this.cache.get('campaigns-active') || [];
      this.cache.set('campaigns-active', [...preloaded, ...remainingConverted]);
    } catch (error) {
      console.error('Error loading remaining campaigns:', error);
    }
  }

  getCachedCampaigns(): any[] | null {
    return this.cache.get('campaigns-active') || null;
  }

  getCachedCampaign(id: number): any | null {
    return this.cache.get(`campaign-${id}`) || null;
  }

  invalidateCache(): void {
    this.cache.clear();
    this.isPreloading = false;
    this.preloadPromise = null;
  }

  // Update a specific campaign in cache
  updateCampaignInCache(campaignId: number, updatedCampaign: any): void {
    this.cache.set(`campaign-${campaignId}`, updatedCampaign);

    // Update in the campaigns list too
    const campaigns = this.cache.get('campaigns-active');
    if (campaigns) {
      const index = campaigns.findIndex((c: any) => c.id === campaignId);
      if (index !== -1) {
        campaigns[index] = updatedCampaign;
        this.cache.set('campaigns-active', campaigns);
      }
    }
  }
}

export const campaignCache = new CampaignCache();