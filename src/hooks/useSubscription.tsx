import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Subscription {
  id: string;
  status: 'free' | 'pending' | 'active' | 'expired';
  plan_type: string;
  trial_end_date: string | null;
  subscription_end_date: string | null;
  upi_transaction_id: string | null;
  created_at: string;
}

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    fetchSubscription();
  }, [user]);

  const fetchSubscription = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching subscription:', error);
        return;
      }

      setSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasActiveSubscription = () => {
    if (!subscription) return false;
    
    const now = new Date();
    const trialEnd = subscription.trial_end_date ? new Date(subscription.trial_end_date) : null;
    const subscriptionEnd = subscription.subscription_end_date ? new Date(subscription.subscription_end_date) : null;

    // Active paid subscription
    if (subscription.status === 'active' && (!subscriptionEnd || subscriptionEnd > now)) {
      return true;
    }

    // Free trial still active
    if (subscription.status === 'free' && trialEnd && trialEnd > now) {
      return true;
    }

    return false;
  };

  const isTrialActive = () => {
    if (!subscription) return false;
    
    const now = new Date();
    const trialEnd = subscription.trial_end_date ? new Date(subscription.trial_end_date) : null;
    
    return subscription.status === 'free' && trialEnd && trialEnd > now;
  };

  const getDaysLeft = () => {
    if (!subscription) return 0;
    
    const now = new Date();
    let endDate: Date | null = null;

    if (subscription.status === 'active' && subscription.subscription_end_date) {
      endDate = new Date(subscription.subscription_end_date);
    } else if (subscription.status === 'free' && subscription.trial_end_date) {
      endDate = new Date(subscription.trial_end_date);
    }

    if (endDate && endDate > now) {
      return Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    }

    return 0;
  };

  const submitUpiTransaction = async (transactionId: string) => {
    if (!user || !subscription) return { error: 'No user or subscription found' };

    try {
      // First, create the UPI transaction record
      const { data: transactionData, error: transactionError } = await supabase
        .from('upi_transactions')
        .insert({
          user_id: user.id,
          subscription_id: subscription.id,
          transaction_id: transactionId,
          amount: 99,
          status: 'pending'
        })
        .select()
        .single();

      if (transactionError) {
        return { error: transactionError.message };
      }

      // Update subscription status to pending
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({ 
          status: 'pending',
          upi_transaction_id: transactionId
        })
        .eq('id', subscription.id);

      if (updateError) {
        return { error: updateError.message };
      }

      // Refresh subscription data
      await fetchSubscription();

      return { success: true };
    } catch (error) {
      return { error: 'Failed to submit transaction' };
    }
  };

  return {
    subscription,
    loading,
    hasActiveSubscription: hasActiveSubscription(),
    isTrialActive: isTrialActive(),
    daysLeft: getDaysLeft(),
    submitUpiTransaction,
    refetch: fetchSubscription
  };
}