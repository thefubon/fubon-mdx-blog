import { Feed } from 'feed';
import { getAllPosts } from '@/lib/mdx';

export async function GET() {
  const site_url = 'https://yourdomain.com';
  const posts = getAllPosts();

  const feed = new Feed({
    title: 'MDX Блог на Next.js 15',
    description: 'Блог, созданный с использованием Next.js 15 и MDX',
    id: site_url,
    link: site_url,
    language: 'ru',
    image: `${site_url}/images/logo.png`,
    favicon: `${site_url}/favicon.ico`,
    copyright: `Все права защищены ${new Date().getFullYear()}`,
    feedLinks: {
      rss: `${site_url}/rss.xml`,
    },
    author: {
      name: 'Ваше имя',
      email: 'email@example.com',
      link: site_url,
    },
  });

  posts.forEach((post) => {
    const { title, description, publishedAt, slug } = post.frontmatter;
    const url = `${site_url}/blog/${slug}`;

    feed.addItem({
      title,
      id: url,
      link: url,
      description,
      content: post.content,
      date: new Date(publishedAt),
    });
  });

  return new Response(feed.rss2(), {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
