
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth';
import { UserRole } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PaymentNotification {
  id: string;
  payment_status: string;
  payment_method: string;
  amount: number;
  fee: number;
  client_name: string;
  description: string;
  merchant_payment_reference: string;
  payment_reference: string;
  notification_token: string;
  created_at: string;
  quote_id: string | null;
  processed: boolean;
}

const PaymentHistory: React.FC = () => {
  const [payments, setPayments] = useState<PaymentNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { auth } = useAuth();
  const isAdmin = auth.user?.role === UserRole.ADMIN;

  const fetchPayments = async () => {
    if (!isAdmin) {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les droits pour accéder à cette page.",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('payment_notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payment history:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger l'historique des paiements.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
    
    // Set up real-time subscription for new payment notifications
    const paymentChannel = supabase
      .channel('payment_notifications_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'payment_notifications'
        },
        (payload) => {
          setPayments(current => [payload.new as PaymentNotification, ...current]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(paymentChannel);
    };
  }, [isAdmin]);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    if (status.toUpperCase() === 'SUCCESS') return 'bg-green-500';
    if (status.toUpperCase() === 'FAILED') return 'bg-red-500';
    return 'bg-yellow-500';
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center">Vous n'avez pas les droits pour accéder à cette page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Historique des paiements</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Transactions récentes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Chargement de l'historique des paiements...</div>
          ) : payments.length === 0 ? (
            <div className="text-center py-4">Aucune transaction trouvée</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Méthode</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Frais</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Réf. Devis</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="whitespace-nowrap">
                        <div className="font-medium">
                          {new Date(payment.created_at).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(payment.created_at), { 
                            addSuffix: true,
                            locale: fr
                          })}
                        </div>
                      </TableCell>
                      <TableCell>{payment.client_name}</TableCell>
                      <TableCell>{payment.payment_method}</TableCell>
                      <TableCell>{formatAmount(payment.amount)}</TableCell>
                      <TableCell>{formatAmount(payment.fee)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(payment.payment_status)}>
                          {payment.payment_status}
                        </Badge>
                      </TableCell>
                      <TableCell>{payment.description}</TableCell>
                      <TableCell>
                        {payment.quote_id ? (
                          <a 
                            href={`/quotes/${payment.quote_id}`} 
                            className="text-blue-500 hover:underline"
                          >
                            {payment.quote_id.substring(0, 8)}...
                          </a>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentHistory;
