import { createClient } from '@supabase/supabase-js';

// Estes valores virão das suas variáveis de ambiente ou do contexto do projeto
// Por enquanto, usamos placeholders que o usuário deve substituir
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://sua-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sua-chave-anonima';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
