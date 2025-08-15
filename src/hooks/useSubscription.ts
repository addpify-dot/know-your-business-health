import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Subscription {
  id: string;
  status: 'free' | 'pending' | 'active' | 'expired';
  trial_end_date: string | null;
  subscription_end_date: string | null;
  plan_type: string;
  amount_paid: number;
  upi_transaction_id: string | null;
  created_at: string;
}

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setHasActiveSubscription(false);
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
        .maybeSingle();

      if (error) {
        console.error('Error fetching subscription:', error);
        return;
      }

      setSubscription(data);
      
      // Check if subscription is active
      if (data) {
        const now = new Date();
        const trialEnd = data.trial_end_date ? new Date(data.trial_end_date) : null;
        const subscriptionEnd = data.subscription_end_date ? new Date(data.subscription_end_date) : null;
        
        const isActiveSubscription = data.status === 'active' && (!subscriptionEnd || subscriptionEnd > now);
        const isInTrial = data.status === 'free' && trialEnd && trialEnd > now;
        
        setHasActiveSubscription(isActiveSubscription || isInTrial);
      } else {
        setHasActiveSubscription(false);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
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
    hasActiveSubscription,
    isTrialActive: isTrialActive(),
    daysLeft: getDaysLeft(),
    submitUpiTransaction,
    refetch: fetchSubscription
  };
}