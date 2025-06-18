import { useEffect } from 'react';

const VideoPreloader = () => {
  useEffect(() => {
    // Preload the coin spending celebration video
    const spendingVideo = document.createElement('video');
    spendingVideo.preload = 'auto';
    spendingVideo.muted = true;
    spendingVideo.playsInline = true;
    
    const spendingSource = document.createElement('source');
    spendingSource.src = 'https://res.cloudinary.com/digjsdron/video/upload/v1749612635/Coin_Spending_g8wd9v.mp4';
    spendingSource.type = 'video/mp4';
    spendingVideo.appendChild(spendingSource);
    
    spendingVideo.load();
    (window as any).preloadedCelebrationVideo = spendingVideo;

    // Preload the coin buying celebration video
    const buyingVideo = document.createElement('video');
    buyingVideo.preload = 'auto';
    buyingVideo.muted = true;
    buyingVideo.playsInline = true;
    
    const buyingSource = document.createElement('source');
    buyingSource.src = 'https://res.cloudinary.com/digjsdron/video/upload/v1749741996/Coin_Buying_jx2yfz.mp4';
    buyingSource.type = 'video/mp4';
    buyingVideo.appendChild(buyingSource);
    
    buyingVideo.load();
    (window as any).preloadedCoinBuyingVideo = buyingVideo;
    
    return () => {
      // Cleanup
      if ((window as any).preloadedCelebrationVideo) {
        (window as any).preloadedCelebrationVideo = null;
      }
      if ((window as any).preloadedCoinBuyingVideo) {
        (window as any).preloadedCoinBuyingVideo = null;
      }
    };
  }, []);

  return null; // This component doesn't render anything
};

export default VideoPreloader;