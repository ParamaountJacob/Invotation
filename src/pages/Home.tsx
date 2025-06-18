import { useEffect } from 'react';
import Hero from '../components/Hero';
import LiveCampaigns from '../components/LiveCampaigns';
import HowItWorks from '../components/HowItWorks';
import SEOHead from '../components/SEOHead';
import { campaignCache } from '../lib/campaignCache';

const Home = () => {
  useEffect(() => {
    // Pre-cache campaigns immediately when homepage loads
    campaignCache.preloadCampaigns().catch(console.error);
  }, []);

  return (
    <>
      <SEOHead
        title="Invotation - Turn Your Ideas Into Reality | Innovation Platform"
        description="Join Invotation's innovation platform where great ideas become reality. Vote on emerging products, support inventors, and get exclusive early access to groundbreaking innovations. Submit your own ideas and earn profits when they succeed."
        keywords="innovation platform, product development, crowdfunding, invention, startup ideas, vote on products, early access, product voting, inventor platform, innovation community, product launch, kickstarter alternative"
        url="https://invotation.com/"
      />
      <main>
        <Hero />
        <LiveCampaigns />
        <HowItWorks />
      </main>
    </>
  );
};

export default Home;