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
  
  // Улучшение производительности изображений
  images: {
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 дней
  },
  
  // Конфигурация для улучшения метрик Core Web Vitals
  experimental: {
    // Отключаем оптимизацию CSS, которая требует пакет critters
    optimizeCss: false,
    optimizePackageImports: ['lucide-react', '@headlessui/react'],
    serverActions: {
      allowedOrigins: ['localhost:3000', 'yourdomain.com'],
    },
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
    ];
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
  ],
});

// Применяем конфигурации последовательно
// @ts-ignore - игнорируем ошибку несоответствия типов
const mdxConfig = withMDX(baseConfig);
// @ts-ignore - игнорируем ошибку несоответствия типов
const finalConfig = withPWAConfig(mdxConfig);

export default finalConfig;
