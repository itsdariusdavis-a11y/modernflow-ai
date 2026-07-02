import React, { useState } from 'react';

// AI-generated illustrations (Higgsfield / recraft_v4_1), one distinct scene
// per individual exercise — not just per week — so the picture actually
// changes with each selection. Hosted on Higgsfield's CDN, which serves a
// compressed WebP variant of each render alongside the full-size PNG.

const ACTIVITY_IMAGES = {
  'w1-a1': {
    url: 'https://d8j0ntlcm91z4.cloudfront.net/user_35Gxqo1zXUB1Ms3R3UpEQA5J4LE/hf_20260702_213714_5785451d-0261-4c9d-ae2e-f0088f36ac93.png',
    alt: 'Illustration of a toddler tall-kneeling upright in front of a low coffee table, reaching sideways for a colorful wooden block.',
  },
  'w1-a2': {
    url: 'https://d8j0ntlcm91z4.cloudfront.net/user_35Gxqo1zXUB1Ms3R3UpEQA5J4LE/hf_20260702_213809_9dcf0f3b-7133-4bff-8737-09065f84417a.png',
    alt: 'Illustration of a toddler sitting on a small stool with feet flat, leaning forward to pick up a block from the floor.',
  },
  'w1-a3': {
    url: 'https://d8j0ntlcm91z4.cloudfront.net/user_35Gxqo1zXUB1Ms3R3UpEQA5J4LE/hf_20260702_213811_95af5c08-ed17-45d1-96a1-13e6d8fc9160.png',
    alt: 'Illustration of a toddler crawling on hands and knees over soft cushions, reaching forward toward a set of keys.',
  },
  'w2-a1': {
    url: 'https://d8j0ntlcm91z4.cloudfront.net/user_35Gxqo1zXUB1Ms3R3UpEQA5J4LE/hf_20260702_213812_20f332e0-0dae-436d-b425-c4337317fd30.png',
    alt: 'Illustration of a toddler cruising sideways along a bare sofa frame, gripping the edge with both hands.',
  },
  'w2-a2': {
    url: 'https://d8j0ntlcm91z4.cloudfront.net/user_35Gxqo1zXUB1Ms3R3UpEQA5J4LE/hf_20260702_213814_917f02ff-3aa9-48ef-86fd-3ca4868c056f.png',
    alt: 'Illustration of a toddler standing between an armchair and a sofa, stretching one hand across the gap to reach a toy.',
  },
  'w3-a1': {
    url: 'https://d8j0ntlcm91z4.cloudfront.net/user_35Gxqo1zXUB1Ms3R3UpEQA5J4LE/hf_20260702_213815_9563ec23-8e27-4347-9b45-cb939605f3dc.png',
    alt: 'Illustration of a toddler leaning forward pushing a wooden crate filled with books across the floor.',
  },
  'w3-a2': {
    url: 'https://d8j0ntlcm91z4.cloudfront.net/user_35Gxqo1zXUB1Ms3R3UpEQA5J4LE/hf_20260702_213817_bb4968e5-1fc9-48df-b6ce-f3d81e86cc2e.png',
    alt: "Illustration of a toddler mid-step, holding a wooden dowel at chest height while a parent's hands guide it from either side.",
  },
  'w4-a1': {
    url: 'https://d8j0ntlcm91z4.cloudfront.net/user_35Gxqo1zXUB1Ms3R3UpEQA5J4LE/hf_20260702_213819_42af625c-55bb-45b8-a20c-7c590a3a3c30.png',
    alt: "Illustration of a toddler standing independently in the middle of a room with arms out for balance, a parent's hand hovering nearby.",
  },
  'w4-a2': {
    url: 'https://d8j0ntlcm91z4.cloudfront.net/user_35Gxqo1zXUB1Ms3R3UpEQA5J4LE/hf_20260702_213820_3a124c03-585c-4f27-a805-1502181ee8f0.png',
    alt: 'Illustration of a toddler taking brave independent steps toward a parent kneeling with open arms.',
  },
};

const webpVariant = (pngUrl) => pngUrl.replace(/\.png$/, '_min.webp');

// Warm the browser cache for every scene so switching exercises is instant.
// Fired once after first paint; failures are silently ignored.
let preloaded = false;
export function preloadIllustrations() {
  if (preloaded) return;
  preloaded = true;
  Object.values(ACTIVITY_IMAGES).forEach(({ url }) => {
    const img = new Image();
    img.src = webpVariant(url);
  });
}

export default function ActivityIllustration({ activityId }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const entry = ACTIVITY_IMAGES[activityId] || ACTIVITY_IMAGES['w1-a1'];

  if (failed) {
    return (
      <div className="w-full aspect-[4/3] rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center text-center p-4">
        <p className="text-xs text-stone-400">Illustration temporarily unavailable.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-card">
      {!loaded && <div className="absolute inset-0 bg-gradient-to-br from-amber-100/70 via-orange-50 to-amber-100/70 animate-pulse" aria-hidden="true" />}
      <picture>
        <source srcSet={webpVariant(entry.url)} type="image/webp" />
        <img
          src={entry.url}
          alt={entry.alt}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      </picture>
    </div>
  );
}
