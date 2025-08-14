import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Clock, CreditCard, Star, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function Subscription() {
  const [transactionId, setTransactionId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { subscription, hasActiveSubscription, isTrialActive, daysLeft, submitUpiTransaction } = useSubscription();
  const navigate = useNavigate();

  const handleSubmitTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      toast.error('Please enter transaction ID');
      return;
    }

    setSubmitting(true);
    const result = await submitUpiTransaction(transactionId.trim());
    
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Transaction submitted for verification! You will be notified once approved.');
      setTransactionId('');
    }
    
    setSubmitting(false);
  };

  const getStatusBadge = () => {
    if (!subscription) return null;

    switch (subscription.status) {
      case 'active':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending Verification</Badge>;
      case 'free':
        return isTrialActive 
          ? <Badge className="bg-blue-500"><Star className="w-3 h-3 mr-1" />Free Trial</Badge>
          : <Badge variant="outline">Trial Expired</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      default:
        return null;
    }
  };

  const t = (en: string, hi: string) => en; // Simple translation function

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p>Please sign in to access subscription settings.</p>
            <Button onClick={() => navigate('/auth')} className="mt-4">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('Back', 'वापस')}
          </Button>
          <h1 className="text-2xl font-bold">
            {t('Subscription', 'सब्स्क्रिप्शन')}
          </h1>
          <div></div>
        </div>

        {/* Current Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {t('Current Plan', 'वर्तमान योजना')}
              </CardTitle>
              {getStatusBadge()}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {hasActiveSubscription ? (
                <div className="text-green-600">
                  <p className="font-semibold">
                    {subscription?.status === 'active' 
                      ? t('Premium Plan Active', 'प्रीमियम प्लान सक्रिय')
                      : t('Free Trial Active', 'मुफ्त ट्रायल सक्रिय')
                    }
                  </p>
                  <p className="text-sm">
                    {daysLeft > 0 
                      ? t(`${daysLeft} days remaining`, `${daysLeft} दिन शेष`)
                      : t('Expires today', 'आज समाप्त होता है')
                    }
                  </p>
                </div>
              ) : (
                <div className="text-orange-600">
                  <p className="font-semibold">
                    {t('No Active Subscription', 'कोई सक्रिय सब्स्क्रिप्शन नहीं')}
                  </p>
                  <p className="text-sm">
                    {t('Upgrade to access premium features', 'प्रीमियम सुविधाओं का उपयोग करने के लिए अपग्रेड करें')}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">
                {t('Free Features', 'मुफ्त सुविधाएं')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>{t('Basic Health Assessment', 'बेसिक स्वास्थ्य मूल्यांकन')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>{t('Basic Results View', 'बेसिक परिणाम दृश्य')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>{t('Local Storage', 'लोकल स्टोरेज')}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="text-primary">
                {t('Premium Features (₹99/month)', 'प्रीमियम सुविधाएं (₹99/महीना)')}
              </CardTitle>
              <CardDescription>
                {t('7 days free trial included', '7 दिन का मुफ्त ट्रायल शामिल')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-primary" />
                <span>{t('AI-Powered Business Advisor', 'AI-संचालित व्यावसायिक सलाहकार')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-primary" />
                <span>{t('Advanced Dashboard & Analytics', 'उन्नत डैशबोर्ड और एनालिटिक्स')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-primary" />
                <span>{t('PDF Report Downloads', 'PDF रिपोर्ट डाउनलोड')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-primary" />
                <span>{t('Cloud Data Storage', 'क्लाउड डेटा स्टोरेज')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-primary" />
                <span>{t('Priority Support', 'प्राथमिकता सहायता')}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Section */}
        {(!hasActiveSubscription || subscription?.status === 'free') && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                {t('Upgrade to Premium', 'प्रीमियम में अपग्रेड करें')}
              </CardTitle>
              <CardDescription>
                {t('Pay ₹99 via UPI and enter transaction ID below', 'UPI के माध्यम से ₹99 का भुगतान करें और नीचे ट्रांजेक्शन ID दर्ज करें')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-semibold">
                      {t('UPI Payment Instructions:', 'UPI भुगतान निर्देश:')}
                    </p>
                    <p>1. {t('Open any UPI app (GPay, PhonePe, Paytm, etc.)', 'कोई भी UPI ऐप खोलें (GPay, PhonePe, Paytm, आदि)')}</p>
                    <p>2. {t('Send ₹99 to:', '₹99 भेजें:')} <span className="font-mono font-bold text-primary">7976159171@ybl</span></p>
                    <p>3. {t('Copy the transaction ID from your UPI app', 'अपने UPI ऐप से ट्रांजेक्शन ID कॉपी करें')}</p>
                    <p>4. {t('Enter it below for verification', 'सत्यापन के लिए इसे नीचे दर्ज करें')}</p>
                  </div>
                </AlertDescription>
              </Alert>

              <div className="p-4 bg-primary/10 rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  {t('UPI ID', 'UPI ID')}
                </p>
                <p className="text-xl font-mono font-bold text-primary">
                  7976159171@ybl
                </p>
                <p className="text-lg font-semibold mt-2">
                  {t('Amount: ₹99', 'राशि: ₹99')}
                </p>
              </div>

              <form onSubmit={handleSubmitTransaction} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="transaction-id">
                    {t('UPI Transaction ID', 'UPI ट्रांजेक्शन ID')}
                  </Label>
                  <Input
                    id="transaction-id"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder={t('Enter your UPI transaction ID', 'अपना UPI ट्रांजेक्शन ID दर्ज करें')}
                    required
                    disabled={submitting}
                  />
                </div>
                <Button type="submit" disabled={submitting || !transactionId.trim()}>
                  {submitting ? t('Submitting...', 'सबमिट कर रहे हैं...') : t('Submit for Verification', 'सत्यापन के लिए सबमिट करें')}
                </Button>
              </form>

              <Alert>
                <AlertDescription>
                  {t('Your payment will be verified within 24 hours. You will be notified once approved.', 
                     'आपका भुगतान 24 घंटों के भीतर सत्यापित किया जाएगा। स्वीकृत होने पर आपको सूचित किया जाएगा।')}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* Pending Status */}
        {subscription?.status === 'pending' && (
          <Card className="border-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 text-orange-600">
                <Clock className="w-5 h-5" />
                <div>
                  <p className="font-semibold">
                    {t('Payment Verification Pending', 'भुगतान सत्यापन लंबित')}
                  </p>
                  <p className="text-sm">
                    {t('Transaction ID:', 'ट्रांजेक्शन ID:')} {subscription.upi_transaction_id}
                  </p>
                  <p className="text-sm">
                    {t('We are verifying your payment. You will be notified once approved.', 
                       'हम आपके भुगतान को सत्यापित कर रहे हैं। स्वीकृत होने पर आपको सूचित किया जाएगा।')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}