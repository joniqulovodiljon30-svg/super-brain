import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: SupabaseClient;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
        '❌ Supabase credentials missing! Check .env.local and restart dev server.'
    );

    const createChainProxy = (): any => {
        const errorResult = Promise.resolve({
            data: null,
            error: { message: 'Supabase not configured' }
        });
        return new Proxy(() => { }, {
            get: (_target, prop) => {
                if (prop === 'then') return errorResult.then.bind(errorResult);
                return createChainProxy();
            },
            apply: () => createChainProxy(),
        });
    };

    supabase = createChainProxy() as unknown as SupabaseClient;
} else {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };
