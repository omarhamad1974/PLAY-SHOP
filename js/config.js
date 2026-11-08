// PLAY configuration.
// Data lives in /data/*.json inside the GitHub repo. Supabase is used ONLY for admin login.
window.PLAY_CONFIG = {
  // Supabase (Authentication only): Project Settings > API
  SUPABASE_URL: 'https://lwatvuncahvbymzfscxl.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_Vfbb6N50u7uTCcJBvPNSoQ_hABVtD2R',

  // GitHub repo that hosts the site (the admin panel commits JSON and images here)
  GITHUB_OWNER: 'omarhamad1974',        // e.g. 'your-username'
  GITHUB_REPO: 'PLAY-SHOP',         // e.g. 'play-store'
  GITHUB_BRANCH: 'main',

  WHATSAPP: '201000000000',      // international format, no +
  USD_RATE: 0.02,                // 1 EGP in USD, update as needed
  PAYMENT_NOTE_EN: 'Pay by InstaPay, Vodafone Cash or bank transfer. We confirm your order after receiving the receipt.',
  PAYMENT_NOTE_AR: 'الدفع عبر إنستاباي أو فودافون كاش أو التحويل البنكي. نؤكد طلبك بعد استلام الإيصال.'
};
