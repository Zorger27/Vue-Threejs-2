export default {
  methods: {
    setOpenGraphImage(imageUrl) {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:image');
      meta.setAttribute('content', imageUrl);

      // Удаляем старые метатеги og:image, если они есть
      const existingMetaTags = document.querySelectorAll('meta[property="og:image"]');
      existingMetaTags.forEach((tag) => tag.remove());

      // Добавляем новый метатег og:image
      document.head.appendChild(meta);
    },
  },
};
