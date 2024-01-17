import { ImageResponse } from '@vercel/og';

export async function GET({ query }) {
  const { imagePath } = query;
  if (!imagePath) {
    // Возвращайте ошибку или заглушку, если не указан путь к изображению.
    return new ImageResponse('<div>Error: Image path not provided</div>');
  }

  // Собирайте путь к изображению на основе переданных параметров.
  const fullImagePath = `./bmp/${imagePath}.jpg`;

  const imageData = await fetch(new URL(fullImagePath, import.meta.url)).then(
    (res) => res.arrayBuffer(),
  );

  // Преобразуйте ArrayBuffer в строку, например, используя base64.
  const imageBase64 = Buffer.from(imageData).toString('base64');

  return new ImageResponse(
    `
    <div style="
      display: flex;
      background: #f6f6f6;
      width: 100%;
      height: 100%;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    ">
      <img width="1200" height="630" src="data:image/jpeg;base64,${imageBase64}" alt="${imagePath}" />
    </div>
    `,
    {
      width: 1200,
      height: 630,
    }
  );
}