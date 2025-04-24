import createMDX from '@next/mdx';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';

/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
  devIndicators: false,
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
};

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

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
  },
});

export default withMDX(nextConfig);
