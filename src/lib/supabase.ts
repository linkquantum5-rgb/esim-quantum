import { createClient } from '@supabase/supabase-js';

// Usamos tus credenciales REALES
const supabaseUrl = 'https://tgwhebrmhlhgwyvysrld.supabase.co';
const supabaseKey = 'sb_publishable_vcdwlwo1dnJwAapz9UqFUQ_TF3vq1l1'; // Usamos la pública (publishable)

export const supabase = createClient(supabaseUrl, supabaseKey);
