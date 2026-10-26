// Site settings (Phase 2). Seeded into the site_settings table; Supabase values
// override these defaults when configured. Admins edit them in the phase-3 panel.

export const defaultSiteSettings = {
  social_facebook: '',
  social_instagram: '',
  social_linkedin: '',
  google_business_url:
    'https://www.google.com/maps/search/?api=1&query=Green+Solar+World+Inc+5040+Maingate+Dr+Unit+6+Mississauga+ON+L4W+1X5',
} as const;

export type SiteSettings = Record<keyof typeof defaultSiteSettings, string>;
