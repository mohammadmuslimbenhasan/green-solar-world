// Reviews (Phase 2).
// NOTE: These are REAL Google reviews captured during keyword/content research for the
// rebuild (source: the business's Google Business Profile). The admin panel (phase 3)
// should keep them synced with the live GBP; update text/ratings there when the GBP changes.

export interface Review {
  authorName: string;
  rating: number;
  text: string;
  source: 'google';
}

export const GBP_URL =
  'https://www.google.com/maps/search/?api=1&query=Green+Solar+World+Inc+4615+Burgoyne+St+Mississauga+ON';

export const gbpAggregate = {
  rating: 5.0,
  reviewCount: 239,
};

export const reviews: Review[] = [
  {
    authorName: 'Moe R.',
    rating: 5,
    text: 'Amazing service, great product also great price, highly recommended',
    source: 'google',
  },
  {
    authorName: 'Cindy L.',
    rating: 5,
    text: "Great service and very reliable. He's always helpful, gives honest advice, and usually has the materials I need. Easy to deal with and a pleasure to buy from each time.",
    source: 'google',
  },
  {
    authorName: 'James T.',
    rating: 5,
    text: 'I had an amazing experience at Green Solar World Inc! From the moment I walked in, the staff was friendly and helpful. Shahab made the whole process smooth, ensuring I felt comfortable throughout. The customer service was top-notch, and I\u2019ll be returning!',
    source: 'google',
  },
  {
    authorName: 'Amir K.',
    rating: 5,
    text: 'I have relied on Green Solar Electrical as my primary electrical supplier for over 15 years, and they have consistently exceeded my expectations. Incredible variety of LED lighting products at very reasonable and competitive prices \u2014 highest possible recommendation.',
    source: 'google',
  },
  {
    authorName: 'David P.',
    rating: 5,
    text: 'As a contractor, I\u2019ve dealt with many suppliers over the years, and Green Solar World Inc truly stands out. Their prices are very competitive, and their service and business ethics are excellent. The owner is very knowledgeable and always solution-oriented.',
    source: 'google',
  },
];
