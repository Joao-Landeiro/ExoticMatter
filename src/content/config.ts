
import { z, defineCollection } from 'astro:content';

const episodesCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    season: z.number(),
    number: z.number(),
    title: z.string(),
    status: z.string(),
    guestId: z.string(), // Reference to guest file (e.g., "nick-himowicz")
    description: z.string(), // Single markdown field combining description, topics, and guest bio
    links: z.array(z.object({
      text: z.string(),
      url: z.string(),
    })).optional(),
    shortTopics: z.array(z.string()).optional(),
    episodeLink: z.string().nullable().optional(),
    spotifyUrl: z.string().nullable().optional(),
    transcript: z.string().nullable().optional(),
    publishDate: z.string().regex(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})$/,
      "Invalid datetime format"
    ).optional(), // ISO 8601 datetime string (accepts timezone offsets)
    seo: z.object({
      metaDescription: z.string().max(160).optional(),
      ogImage: z.string().optional(),
      seoTitle: z.string().optional(),
      seoKeywords: z.string().optional(),
      noindex: z.boolean().optional(),
    }).optional(),
  }),
});

// Individual guest collection - each guest is a separate file
const guestsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    image: z.string(),
    bio: z.string().optional(),
    linkedin: z.string().optional(),
    website: z.string().optional(),
    twitter: z.string().optional(),
    seo: z.object({
      seoBio: z.string().optional(),
      keywords: z.string().optional(),
    }).optional(),
  }),
});

const siteCollection = defineCollection({
    type: 'data',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        baseUrl: z.string(),
        author: z.string(),
        season: z.string(),
        intro: z.object({
            observation: z.string(),
            hypothesis: z.string(),
            methodology: z.string(),
        }),
        team: z.object({
            description: z.string(),
        }),
        seo: z.object({
            seoDefaultImage: z.string().optional(),
            twitterHandle: z.string().optional(),
            facebookPage: z.string().optional(),
            defaultKeywords: z.string().optional(),
            googleAnalyticsId: z.string().optional(),
        }).optional(),
    }),
});

export const collections = {
  'episodes': episodesCollection,
  'guests': guestsCollection,
  'site': siteCollection,
};
