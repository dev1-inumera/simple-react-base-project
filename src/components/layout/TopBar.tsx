
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { Bell, X, Check } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead, Notification } from '@/services/NotificationService';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const TopBar: React.FC = () => {
  const { auth } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (auth.user) {
      loadNotifications();
    }
  }, [auth.user]);

  const loadNotifications = async () => {
    if (!auth.user) return;
    
    try {
      setLoading(true);
      const data = await fetchNotifications(auth.user.id);
      setNotifications(data);
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    const success = await markNotificationAsRead(notificationId);
    if (success) {
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!auth.user) return;
    
    const success = await markAllNotificationsAsRead(auth.user.id);
    if (success) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  const getNotificationTypeStyle = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-500';
      case 'warning':
        return 'bg-yellow-100 border-yellow-500';
      case 'error':
        return 'bg-red-100 border-red-500';
      default:
        return 'bg-blue-100 border-blue-500';
    }
  };

  return (
    <div className="w-full bg-white shadow-sm py-2.5 px-4 flex justify-between items-center">
      <div className="flex-1" /> {/* Empty div for spacing */}
      
      <div className="flex items-center gap-6">
        <Popover>
          <PopoverTrigger asChild>
            <div className="relative cursor-pointer">
              <Bell className="h-5 w-5 text-gray-500 hover:text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="flex items-center justify-between p-3 border-b">
              <h3 className="font-medium">Notifications</h3>
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleMarkAllAsRead}
                  className="h-7 text-xs"
                >
                  Marquer tout comme lu
                </Button>
              )}
            </div>
            
            <div className="max-h-[350px] overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-muted-foreground">
                  Chargement...
                </div>
              ) : notifications.length > 0 ? (
                notifications.map(notification => (
                  <div 
                    key={notification.id}
                    className={`p-3 border-l-2 ${getNotificationTypeStyle(notification.type)} ${!notification.read ? 'bg-muted/30' : ''}`}
                  >
                    <div className="flex justify-between mb-1">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      {!notification.read && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="h-5 w-5 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <p className="text-xs">{notification.content}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-[10px] text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: fr })}
                      </span>
                      {notification.link && (
                        <Link 
                          to={notification.link}
                          className="text-xs text-primary hover:underline"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          Voir détails
                        </Link>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  Aucune notification
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
        
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {auth.user ? auth.user.firstName[0] : 'U'}
            </span>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-700">
              {auth.user ? `${auth.user.firstName} ${auth.user.lastName}` : 'Utilisateur'}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {auth.user?.role || 'Non connecté'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
