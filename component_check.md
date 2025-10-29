# Componentization Check

## Findings

- **No `components` directory:** The `src` directory does not contain a `components` directory.
- **No component imports:** The main pages (`src/pages/index.astro` and `src/pages/episodes/[slug].astro`) do not import or use any reusable components. They are built directly with HTML and data from content collections.

## Conclusion

The site is not componentized. The pages are monolithic and contain a lot of repeated markup, especially for the episode and guest sections.

## Componentization Checklist

To properly componentize the site, the following steps should be taken:

- [ ] Create a `src/components` directory to store reusable components.
- [x] Create a `Guest.astro` component to display a single guest.
- [x] Create an `Episode.astro` component to display a single episode.
- [x] Create a `Panel.astro` component to encapsulate the panel styling and structure.
- [x] Create a `GuestList.astro` component to display the list of guests.
- [x] Create an `EpisodeList.astro` component to display the list of episodes.
- [x] Refactor `src/pages/index.astro` to use the `GuestList` and `EpisodeList` components.
- [x] Refactor `src/pages/episodes/[slug].astro` to use the `Episode` component.
