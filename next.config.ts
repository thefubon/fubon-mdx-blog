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

// Правильная базовая конфигурация для Next.js 15.3.1
const baseConfig = {
  devIndicators: false, // Использовать false, а не boolean
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
};

// Конфигурация MDX
const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
  },
});

// Конфигурация PWA
const withPWAConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

// Применяем конфигурации последовательно с обходом типов
// @ts-ignore - игнорируем ошибку несоответствия типов
const mdxConfig = withMDX(baseConfig);
// @ts-ignore - игнорируем ошибку несоответствия типов
const finalConfig = withPWAConfig(mdxConfig);

export default finalConfig;
