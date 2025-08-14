import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, CreditCard, CheckCircle, Clock, XCircle, IndianRupee, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Subscription() {
  const { user } = useAuth();
  const { subscription, loading, hasActiveSubscription, submitPayment } = useSubscription();
  const navigate = useNavigate();
  const [transactionId, setTransactionId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      setError('कृपया ट्रांजैक्शन आईडी दर्ज करें / Please enter transaction ID');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    const { error } = await submitPayment(transactionId.trim());
    
    if (error) {
      setError(error);
    } else {
      setSuccess('भुगतान जमा हो गया! हम 24 घंटे में वेरिफाई करेंगे / Payment submitted! We will verify within 24 hours');
      setTransactionId('');
    }
    
    setSubmitting(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />सक्रिय / Active</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />वेरिफिकेशन पेंडिंग / Verification Pending</Badge>;
      case 'expired':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />समाप्त / Expired</Badge>;
      default:
        return <Badge variant="outline">फ्री ट्रायल / Free Trial</Badge>;
    }
  };

  const getTrialDaysLeft = () => {
    if (!subscription?.trial_end_date) return 0;
    const trialEnd = new Date(subscription.trial_end_date);
    const now = new Date();
    const diffTime = trialEnd.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const trialDaysLeft = getTrialDaysLeft();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">सब्स्क्रिप्शन प्लान / Subscription Plan</h1>
          <p className="text-muted-foreground">
            अपने बिजनेस के लिए AI चैटबॉट और एडवांस्ड डैशबोर्ड का उपयोग करें
          </p>
          <p className="text-muted-foreground">
            Use AI Chatbot and Advanced Dashboard for your business
          </p>
        </div>

        {/* Current Status */}
        {subscription && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>वर्तमान स्थिति / Current Status</span>
                {getStatusBadge(subscription.status)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">प्लान / Plan</Label>
                  <p className="text-lg">Premium (₹99/महीना)</p>
                </div>
                {subscription.status === 'free' && (
                  <div>
                    <Label className="text-sm font-medium">ट्रायल बचे दिन / Trial Days Left</Label>
                    <p className="text-lg font-semibold text-primary">{trialDaysLeft} दिन / days</p>
                  </div>
                )}
                {subscription.subscription_end_date && (
                  <div>
                    <Label className="text-sm font-medium">समाप्ति तिथि / Expiry Date</Label>
                    <p className="text-lg">{new Date(subscription.subscription_end_date).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">फ्री फीचर्स / Free Features</CardTitle>
              <CardDescription>सभी के लिए उपलब्ध / Available for everyone</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>बेसिक बिजनेस हेल्थ असेसमेंट / Basic Business Health Assessment</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>रिजल्ट व्यू / Results View</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>लोकल स्टोरेज सेव / Local Storage Save</span>
              </div>
            </CardContent>
          </Card>

          {/* Premium Features */}
          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="text-primary flex items-center">
                <IndianRupee className="w-5 h-5 mr-2" />
                प्रीमियम फीचर्स / Premium Features
              </CardTitle>
              <CardDescription>₹99/महीना / ₹99/month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>AI चैटबॉट सपोर्ट / AI Chatbot Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>एडवांस्ड डैशबोर्ड / Advanced Dashboard</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>PDF रिपोर्ट डाउनलोड / PDF Report Download</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>क्लाउड स्टोरेज / Cloud Storage</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>हिस्टोरिकल डेटा / Historical Data</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Section */}
        {!hasActiveSubscription && subscription?.status !== 'pending' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Smartphone className="w-5 h-5 mr-2" />
                UPI से भुगतान करें / Pay via UPI
              </CardTitle>
              <CardDescription>
                नीचे दी गई UPI ID पर ₹99 भेजें और ट्रांजैक्शन ID दर्ज करें
              </CardDescription>
              <CardDescription>
                Send ₹99 to the UPI ID below and enter the transaction ID
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* UPI ID */}
              <div className="bg-primary/10 p-4 rounded-lg text-center">
                <Label className="text-sm font-medium">UPI ID</Label>
                <p className="text-2xl font-bold text-primary">7976159171@ybl</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Amount: ₹99 | Purpose: Business Health Checkup Subscription
                </p>
              </div>

              {/* Instructions */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">भुगतान स्टेप्स / Payment Steps:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>अपनी UPI ऐप खोलें (PhonePe, GPay, Paytm, etc.) / Open your UPI app</li>
                  <li>ऊपर दी गई UPI ID पर ₹99 भेजें / Send ₹99 to the UPI ID above</li>
                  <li>Transaction ID कॉपी करें / Copy the transaction ID</li>
                  <li>नीचे फॉर्म में Transaction ID पेस्ट करें / Paste it in the form below</li>
                </ol>
              </div>

              {/* Transaction Form */}
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="transactionId">UPI ट्रांजैक्शन ID / UPI Transaction ID</Label>
                  <Input
                    id="transactionId"
                    placeholder="Enter your UPI transaction ID"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  <CreditCard className="w-4 h-4 mr-2" />
                  भुगतान सबमिट करें / Submit Payment
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Status Messages */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert>
            <CheckCircle className="w-4 h-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {subscription?.status === 'pending' && (
          <Alert>
            <Clock className="w-4 h-4" />
            <AlertDescription>
              आपका भुगतान वेरिफिकेशन के लिए पेंडिंग है। हम 24 घंटे में वेरिफाई करेंगे।
              <br />
              Your payment is pending verification. We will verify within 24 hours.
            </AlertDescription>
          </Alert>
        )}

        {hasActiveSubscription && (
          <Alert>
            <CheckCircle className="w-4 h-4" />
            <AlertDescription>
              बधाई हो! आपका प्रीमियम सब्स्क्रिप्शन सक्रिय है।
              <br />
              Congratulations! Your premium subscription is active.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}