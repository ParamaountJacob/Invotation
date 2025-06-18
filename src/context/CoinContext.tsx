import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface CoinContextType {
  coins: number;
  loading: boolean;
  addCoins: (amount: number) => Promise<void>;
  deductCoins: (amount: number) => Promise<boolean>;
  updateUserCoins: (userId: string, newAmount: number) => Promise<boolean>;
  refreshCoins: () => Promise<void>;
}

const CoinContext = createContext<CoinContextType | undefined>(undefined);

export const useCoin = () => {
  const context = useContext(CoinContext);
  if (context === undefined) {
    throw new Error('useCoin must be used within a CoinProvider');
  }
  return context;
};

interface CoinProviderProps {
  children: ReactNode;
}

// Pre-cache coin data
let coinCache: { coins: number; lastFetch: number } | null = null;
const COIN_CACHE_DURATION = 10000; // 10 seconds

export const CoinProvider: React.FC<CoinProviderProps> = ({ children }) => {
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(true);

  // Function to update any user's coins (admin only)
  const updateUserCoins = async (userId: string, newAmount: number): Promise<boolean> => {
    try {
      // Verify the current user is an admin
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();
      
      if (!profile?.is_admin) return false;
      
      // Update the target user's coins
      const { data, error } = await supabase
        .from('profiles')
        .update({ coins: newAmount })
        .eq('id', userId);

      if (error) throw error;
      
      // Log the update for debugging
      console.log('Coin update successful:', { userId, newAmount, data });
      
      // If updating the current user, also update local state
      if (userId === user.id) {
        setCoins(newAmount);
        // Update cache
        coinCache = {
          coins: newAmount,
          lastFetch: Date.now()
        };
      }
      
      return true;
    } catch (err) {
      console.error('Error updating user coins:', err);
      return false;
    }
  };

  const fetchCoins = async () => {
    try {
      // Check cache first
      const now = Date.now();
      if (coinCache && (now - coinCache.lastFetch) < COIN_CACHE_DURATION) {
        setCoins(coinCache.coins);
        setLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setCoins(0);
        setLoading(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('coins')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching coins:', error);
        setCoins(0);
      } else {
        const coinCount = profile?.coins || 0;
        setCoins(coinCount);
        
        // Update cache
        coinCache = {
          coins: coinCount,
          lastFetch: now
        };
      }
    } catch (err) {
      console.error('Error in fetchCoins:', err);
      setCoins(0);
    } finally {
      setLoading(false);
    }
  };

  const addCoins = async (amount: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update({ coins: coins + amount })
        .eq('id', user.id);

      if (error) throw error;

      // Immediately update local state for instant UI feedback
      const newCoins = coins + amount;
      setCoins(newCoins);
      
      // Update cache
      coinCache = {
        coins: newCoins,
        lastFetch: Date.now()
      };
      
      // Return the new coin count for immediate use
      return newCoins;
    } catch (err) {
      console.error('Error adding coins:', err);
      throw err;
    }
  };

  const deductCoins = async (amount: number): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      if (coins < amount) {
        return false; // Insufficient coins
      }

      const { error } = await supabase
        .from('profiles')
        .update({ coins: coins - amount })
        .eq('id', user.id);

      if (error) throw error;

      const newCoins = coins - amount;
      setCoins(newCoins);
      
      // Update cache
      coinCache = {
        coins: newCoins,
        lastFetch: Date.now()
      };
      
      return true;
    } catch (err) {
      console.error('Error deducting coins:', err);
      throw err;
    }
  };

  const refreshCoins = async () => {
    // Clear cache to force fresh fetch
    coinCache = null;
    await fetchCoins();
  };

  useEffect(() => {
    fetchCoins();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // Clear cache on auth change
        coinCache = null;
        fetchCoins();
      } else {
        setCoins(0);
        setLoading(false);
        coinCache = null;
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <CoinContext.Provider value={{ coins, loading, addCoins, deductCoins, updateUserCoins, refreshCoins }}>
      {children}
    </CoinContext.Provider>
  );
};