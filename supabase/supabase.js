import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto'
import { SUPABASE_URL, SUPABASE_PUBLIC_KEY } from '@env';


const supabaseUrl = SUPABASE_URL
const supabaseKey = SUPABASE_PUBLIC_KEY

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY
, {
  auth: {
    persistSession: false,
    
  },
});


export { supabase };

