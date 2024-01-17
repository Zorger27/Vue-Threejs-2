export const openGraphMixin = {
  methods: {
    setOpenGraphTags(metaDescription, title, description, imageUrl, url) {
      const metaTags = [
        { name: 'description', content: metaDescription },
        { property: 'og:title', content: title },
        { property: 'twitter:title', content: title },
        { property: 'og:description', content: description },
        { property: 'twitter:description', content: description },
        { property: 'og:image', content: imageUrl },
        { property: 'twitter:image', content: imageUrl },
        { property: 'og:url', content: url },
        { property: 'og:type', content: 'website' },
        { property: 'twitter:card', content: 'summary_large_image' }
      ];

      metaTags.forEach((metaTag) => {
        const meta = document.createElement('meta');
        if (metaTag.property) {
          meta.setAttribute('property', metaTag.property);
        } else if (metaTag.name) {
          meta.setAttribute('name', metaTag.name);
        }
        meta.setAttribute('content', metaTag.content);

        // Remove existing meta tags with the same property or name
        const existingMetaTags = document.querySelectorAll(
          `[property="${metaTag.property}"], [name="${metaTag.name}"]`
        );
        existingMetaTags.forEach((tag) => tag.remove());

        // Add the new meta tag
        document.head.appendChild(meta);
      });
    },
  },
};
