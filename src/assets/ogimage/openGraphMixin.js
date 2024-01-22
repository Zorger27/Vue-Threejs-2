export const openGraphMixin = {
  methods: {
    setOpenGraphTags(metaDescription, title, description, imageUrl, url) {
      // Проверка, существует ли уже тег <title>
      let pageTitle = document.querySelector('title');

      if (pageTitle) {
        // Если тег <title> существует, обновить его содержимое
        pageTitle.innerText = title;
      } else {
        // Если тег <title> не существует, создать новый
        const newTitleTag = document.createElement('title');
        newTitleTag.innerText = title;
        document.head.appendChild(newTitleTag);
      }

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
        // Проверка, существует ли уже элемент с таким property или name
        const existingMetaTag = document.querySelector(
          `[property="${metaTag.property}"], [name="${metaTag.name}"]`
        );

        if (existingMetaTag) {
          // Если элемент существует, обновить его содержимое
          existingMetaTag.setAttribute('content', metaTag.content);
        } else {
          // Если элемент не существует, создать новый
          const newMetaTag = document.createElement('meta');
          if (metaTag.property) {
            newMetaTag.setAttribute('property', metaTag.property);
          } else if (metaTag.name) {
            newMetaTag.setAttribute('name', metaTag.name);
          }
          newMetaTag.setAttribute('content', metaTag.content);
          document.head.appendChild(newMetaTag);
        }
      });
    },
  },
};
