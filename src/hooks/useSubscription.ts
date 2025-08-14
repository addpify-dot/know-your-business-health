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

  const submitPayment = async (transactionId: string) => {
    if (!user || !subscription) return { error: 'No user or subscription found' };

    try {
      // Insert UPI transaction
      const { error: transactionError } = await supabase
        .from('upi_transactions')
        .insert({
          user_id: user.id,
          subscription_id: subscription.id,
          transaction_id: transactionId,
          amount: 99,
          status: 'pending'
        });

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
      
      return { error: null };
    } catch (error) {
      return { error: 'Failed to submit payment' };
    }
  };

  return {
    subscription,
    loading,
    hasActiveSubscription,
    submitPayment,
    refetch: fetchSubscription
  };
}