import createMDX from '@next/mdx';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';
import withPWA from 'next-pwa';

// Определяем интерфейсы для node
interface NodeBase {
  properties?: {
    className?: string[];
  };
}

interface LineNode extends NodeBase {
  children: Array<{ type: string; value: string }>;
}

interface HighlightedNode extends NodeBase {
  properties: {
    className: string[];
  };
}

const prettyCodeOptions = {
  theme: 'github-dark',
  onVisitLine(node: LineNode) {
    // Prevent lines from collapsing in `display: grid` mode
    if (node.children.length === 0) {
      node.children = [{ type: 'text', value: ' ' }];
    }
  },
  onVisitHighlightedLine(node: HighlightedNode) {
    node.properties.className.push('highlighted');
  },
  onVisitHighlightedWord(node: HighlightedNode) {
    node.properties.className = ['word'];
  },
};

// Улучшенная конфигурация Next.js для лучшей производительности
const baseConfig = {
  // Отключаем индикаторы разработки в продакшене
  devIndicators: false,
  
  // Расширения страниц
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  
  // Включаем улучшенную навигацию между страницами
  experimental: {
    // Отключаем оптимизацию CSS, которая требует пакет critters
    optimizeCss: false,
    optimizePackageImports: ['lucide-react', '@headlessui/react'],
    serverActions: {
      allowedOrigins: ['localhost:3000', 'yourdomain.com'],
    },
    // Улучшение скорости навигации (совместимые опции)
    scrollRestoration: true, // Восстановление позиции скролла
    webVitalsAttribution: ['CLS', 'LCP'], // Измеряем веб-метрики для оптимизации
  },
  
  // Улучшение кэширования для статических ресурсов
  headers: async () => {
    return [
      {
        source: '/(fonts|images)/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Добавляем заголовки кэширования для повышения производительности
      {
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, s-maxage=60, stale-while-revalidate=300',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          { 
            key: 'Cache-Control', 
            value: 'no-store, max-age=0' 
          },
        ],
      },
    ];
  },
  
  // Улучшение производительности изображений
  images: {
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 дней
    // Увеличиваем размер кэша для изображений
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

// Конфигурация MDX
const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
  },
});

// Конфигурация PWA с улучшенным кэшированием
const withPWAConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(?:gstatic|googleapis)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 год
        },
      },
    },
    {
      urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-font-assets',
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 60 * 60 * 24 * 365,
        },
      },
    },
    {
      urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp|avif)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-image-assets',
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
      },
    },
    {
      urlPattern: /\/_next\/image\?url=.+$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'next-image',
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
      },
    },
    {
      urlPattern: /\.(?:mp3|wav|ogg)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-audio-assets',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
      },
    },
    {
      urlPattern: /\.(?:js)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-js-assets',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 60 * 60 * 24 * 7,
        },
      },
    },
    {
      urlPattern: /\.(?:css)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-css-assets',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 60 * 60 * 24 * 7,
        },
      },
    },
    // Добавляем кэширование навигационных запросов для улучшения скорости переходов
    {
      urlPattern: /^https:\/\/(?!api\.).*$/i, // Все URL, кроме API
      handler: 'NetworkFirst',
      options: {
        cacheName: 'navigation-cache',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 60 * 5, // 5 минут
        },
        networkTimeoutSeconds: 3, // Таймаут для сети, чтобы использовать кэш
      },
    },
  ],
});

// Применяем конфигурации последовательно
// @ts-ignore - игнорируем ошибку несоответствия типов
const mdxConfig = withMDX(baseConfig);
// @ts-ignore - игнорируем ошибку несоответствия типов
const finalConfig = withPWAConfig(mdxConfig);

export default finalConfig;
