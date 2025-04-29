
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types";

export const seedOffers = async () => {
  try {
    // Check if we already have offers
    const { count } = await supabase
      .from('offers')
      .select('*', { count: 'exact', head: true });
    
    if (count && count > 0) {
      console.log('Database already has offers, skipping seed');
      return;
    }
    
    console.log('Seeding offers...');
    
    const offers = [
      {
        name: "Assurance Auto Standard",
        description: "Protection de base pour votre véhicule avec responsabilité civile et protection contre le vol",
        price: 499.99,
        category: "Auto",
        image_url: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2FyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
      },
      {
        name: "Assurance Auto Premium",
        description: "Protection complète pour votre véhicule avec tous risques, assistance 24/7 et véhicule de remplacement",
        price: 899.99,
        category: "Auto",
        image_url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
      },
      {
        name: "Assurance Habitation Basique",
        description: "Couverture essentielle pour votre maison contre les dommages et la responsabilité civile",
        price: 299.99,
        category: "Habitation",
        image_url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG91c2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
      },
      {
        name: "Assurance Habitation Complète",
        description: "Protection complète pour votre maison, incluant les catastrophes naturelles, le vol et les dommages causés par les locataires",
        price: 599.99,
        category: "Habitation",
        image_url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG91c2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
      },
      {
        name: "Assurance Santé Individuelle",
        description: "Couverture médicale essentielle pour les soins de base et les urgences",
        price: 799.99,
        category: "Santé",
        image_url: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aGVhbHRofGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
      },
      {
        name: "Assurance Santé Famille",
        description: "Protection complète pour toute la famille avec des soins dentaires, ophtalmologiques et hospitaliers",
        price: 1499.99,
        category: "Santé",
        image_url: "https://images.unsplash.com/photo-1535914254981-b5012eebbd15?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGhlYWx0aHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
      },
      {
        name: "Assurance Voyage Basic",
        description: "Couverture essentielle pour vos voyages, incluant les frais médicaux d'urgence",
        price: 49.99,
        category: "Voyage",
        image_url: "https://images.unsplash.com/photo-1488085061387-422e29b40080?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dHJhdmVsfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
      },
      {
        name: "Assurance Voyage Premium",
        description: "Protection complète pour vos voyages, avec annulation, bagages perdus et frais médicaux illimités",
        price: 129.99,
        category: "Voyage",
        image_url: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
      },
      {
        name: "Assurance Responsabilité Civile",
        description: "Protection contre les dommages que vous pourriez causer à des tiers",
        price: 199.99,
        category: "Responsabilité",
        image_url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bGVnYWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
      },
      {
        name: "Assurance Professionnelle",
        description: "Couverture pour votre activité professionnelle, incluant la responsabilité civile professionnelle",
        price: 699.99,
        category: "Professionnel",
        image_url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJ1c2luZXNzfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
      },
      {
        name: "Assurance Vie",
        description: "Protection financière pour vos proches en cas de décès",
        price: 399.99,
        category: "Vie",
        image_url: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGZhbWlseXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
      },
      {
        name: "Assurance Animaux",
        description: "Couverture des frais vétérinaires pour votre animal de compagnie",
        price: 149.99,
        category: "Animaux",
        image_url: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGV0fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
      }
    ];

    const { error } = await supabase
      .from('offers')
      .insert(offers);

    if (error) {
      throw error;
    }

    console.log('Offers seeded successfully');
  } catch (error) {
    console.error('Error seeding offers:', error);
  }
};

export const seedAdminUser = async () => {
  try {
    // Check if we already have an admin user
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', UserRole.ADMIN)
      .maybeSingle();
    
    if (data) {
      console.log('Admin user already exists, skipping seed');
      return;
    }
    
    // Create admin user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'admin@inuma.fr',
      password: 'Admin123!',
      options: {
        data: {
          first_name: 'Admin',
          last_name: 'User',
          role: UserRole.ADMIN
        }
      }
    });

    if (authError) {
      throw authError;
    }

    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
};

export const seedAgentUser = async () => {
  try {
    // Check if we already have an agent user
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', UserRole.AGENT)
      .maybeSingle();
    
    if (data) {
      console.log('Agent user already exists, skipping seed');
      return;
    }
    
    // Create agent user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'agent@inuma.fr',
      password: 'Agent123!',
      options: {
        data: {
          first_name: 'Agent',
          last_name: 'User',
          role: UserRole.AGENT
        }
      }
    });

    if (authError) {
      throw authError;
    }

    console.log('Agent user created successfully');
  } catch (error) {
    console.error('Error seeding agent user:', error);
  }
};
