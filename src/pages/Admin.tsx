import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, Clock, Users, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

interface PendingTransaction {
  id: string;
  user_id: string;
  transaction_id: string;
  amount: number;
  created_at: string;
  profiles: {
    email: string;
    display_name: string;
  };
  subscriptions: {
    id: string;
    status: string;
  };
}

interface Subscription {
  id: string;
  user_id: string;
  status: string;
  plan_type: string;
  subscription_start_date: string | null;
  subscription_end_date: string | null;
  profiles: {
    email: string;
    display_name: string;
  };
}

export default function Admin() {
  const { user } = useAuth();
  const [pendingTransactions, setPendingTransactions] = useState<PendingTransaction[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      if (data && !error) {
        setIsAdmin(true);
        await loadData();
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    try {
      // Load pending transactions
      const { data: transactionData, error: transactionError } = await supabase
        .from('upi_transactions')
        .select(`
          id,
          user_id,
          transaction_id,
          amount,
          created_at,
          subscription_id
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (transactionData) {
        // Get profile data separately
        const userIds = transactionData.map(t => t.user_id);
        const { data: profileData } = await supabase
          .from('profiles')
          .select('user_id, email, display_name')
          .in('user_id', userIds);

        const { data: subscriptionData } = await supabase
          .from('subscriptions')
          .select('id, status')
          .in('id', transactionData.map(t => t.subscription_id));

        const enrichedTransactions = transactionData.map(transaction => {
          const profile = profileData?.find(p => p.user_id === transaction.user_id);
          const subscription = subscriptionData?.find(s => s.id === transaction.subscription_id);
          
          return {
            ...transaction,
            profiles: profile || { email: '', display_name: '' },
            subscriptions: subscription || { id: '', status: '' }
          };
        });

        setPendingTransactions(enrichedTransactions);
      }

      // Load all subscriptions
      const { data: allSubscriptionData, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select(`
          id,
          user_id,
          status,
          plan_type,
          subscription_start_date,
          subscription_end_date
        `)
        .order('created_at', { ascending: false });

      if (allSubscriptionData) {
        // Get profile data for subscriptions
        const userIds = allSubscriptionData.map(s => s.user_id);
        const { data: profileData } = await supabase
          .from('profiles')
          .select('user_id, email, display_name')
          .in('user_id', userIds);

        const enrichedSubscriptions = allSubscriptionData.map(subscription => {
          const profile = profileData?.find(p => p.user_id === subscription.user_id);
          
          return {
            ...subscription,
            profiles: profile || { email: '', display_name: '' }
          };
        });

        setSubscriptions(enrichedSubscriptions);
      }

    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  };

  const handleApproveTransaction = async (transactionId: string, subscriptionId: string) => {
    try {
      // Update transaction status
      const { error: transactionError } = await supabase
        .from('upi_transactions')
        .update({ 
          status: 'approved',
          verified_at: new Date().toISOString(),
          verified_by: user?.id
        })
        .eq('id', transactionId);

      if (transactionError) {
        toast.error('Failed to update transaction');
        return;
      }

      // Update subscription status
      const subscriptionEndDate = new Date();
      subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);

      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .update({ 
          status: 'active',
          subscription_start_date: new Date().toISOString(),
          subscription_end_date: subscriptionEndDate.toISOString()
        })
        .eq('id', subscriptionId);

      if (subscriptionError) {
        toast.error('Failed to update subscription');
        return;
      }

      toast.success('Transaction approved and subscription activated!');
      await loadData();
    } catch (error) {
      console.error('Error approving transaction:', error);
      toast.error('Failed to approve transaction');
    }
  };

  const handleRejectTransaction = async (transactionId: string, subscriptionId: string) => {
    try {
      // Update transaction status
      const { error: transactionError } = await supabase
        .from('upi_transactions')
        .update({ 
          status: 'rejected',
          verified_at: new Date().toISOString(),
          verified_by: user?.id
        })
        .eq('id', transactionId);

      if (transactionError) {
        toast.error('Failed to update transaction');
        return;
      }

      // Update subscription status back to free
      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .update({ 
          status: 'free',
          upi_transaction_id: null
        })
        .eq('id', subscriptionId);

      if (subscriptionError) {
        toast.error('Failed to update subscription');
        return;
      }

      toast.success('Transaction rejected');
      await loadData();
    } catch (error) {
      console.error('Error rejecting transaction:', error);
      toast.error('Failed to reject transaction');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p>You don't have admin privileges to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Badge variant="outline" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Admin Panel
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Transactions</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingTransactions.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {subscriptions.filter(s => s.status === 'active').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{subscriptions.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Pending UPI Transactions
            </CardTitle>
            <CardDescription>
              Review and approve/reject pending payment verifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingTransactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No pending transactions
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{transaction.profiles.display_name}</div>
                          <div className="text-sm text-muted-foreground">{transaction.profiles.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">{transaction.transaction_id}</TableCell>
                      <TableCell>₹{transaction.amount}</TableCell>
                      <TableCell>{new Date(transaction.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApproveTransaction(transaction.id, transaction.subscriptions.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRejectTransaction(transaction.id, transaction.subscriptions.id)}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* All Subscriptions */}
        <Card>
          <CardHeader>
            <CardTitle>All Subscriptions</CardTitle>
            <CardDescription>
              Overview of all user subscriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{subscription.profiles.display_name}</div>
                        <div className="text-sm text-muted-foreground">{subscription.profiles.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        subscription.status === 'active' ? 'default' :
                        subscription.status === 'pending' ? 'secondary' :
                        subscription.status === 'free' ? 'outline' : 'destructive'
                      }>
                        {subscription.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{subscription.plan_type}</TableCell>
                    <TableCell>
                      {subscription.subscription_start_date 
                        ? new Date(subscription.subscription_start_date).toLocaleDateString()
                        : '-'
                      }
                    </TableCell>
                    <TableCell>
                      {subscription.subscription_end_date 
                        ? new Date(subscription.subscription_end_date).toLocaleDateString()
                        : '-'
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}