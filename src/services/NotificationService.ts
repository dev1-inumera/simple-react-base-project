
import { supabase } from "@/integrations/supabase/client";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
  link?: string;
}

export const fetchNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) throw error;

    // Si la table n'existe pas encore, on retourne un tableau vide
    if (!data) return [];

    return data.map(notification => ({
      id: notification.id,
      userId: notification.user_id,
      title: notification.title,
      content: notification.content,
      type: notification.type as "info" | "success" | "warning" | "error",
      read: notification.read,
      createdAt: notification.created_at,
      link: notification.link
    }));
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};

export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notificationId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return false;
  }
};

export const markAllNotificationsAsRead = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", userId)
      .eq("read", false);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return false;
  }
};

export const createNotification = async (
  userId: string,
  title: string,
  content: string,
  type: "info" | "success" | "warning" | "error" = "info",
  link?: string
): Promise<Notification | null> => {
  try {
    const notification = {
      user_id: userId,
      title,
      content,
      type,
      read: false,
      link
    };

    const { data, error } = await supabase
      .from("notifications")
      .insert(notification)
      .select()
      .single();

    if (error) throw error;
    
    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      content: data.content,
      type: data.type as "info" | "success" | "warning" | "error",
      read: data.read,
      createdAt: data.created_at,
      link: data.link
    };
  } catch (error) {
    console.error("Error creating notification:", error);
    return null;
  }
};
