
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
    guest: z.object({
      name: z.string(),
      image: z.string(),
      linkedin: z.string().optional(),
      website: z.string().optional(),
    }),
    description: z.string(), // Single markdown field combining description, topics, and guest bio
    links: z.array(z.object({
      text: z.string(),
      url: z.string(),
    })).optional(),
    shortTopics: z.array(z.string()).optional(),
    episodeLink: z.string().nullable().optional(),
    spotifyUrl: z.string().nullable().optional(),
    transcript: z.string().nullable().optional(),
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
    }),
});

export const collections = {
  'episodes': episodesCollection,
  'guests': guestsCollection,
  'site': siteCollection,
};
