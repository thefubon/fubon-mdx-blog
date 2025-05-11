import { Feed } from 'feed';
import { getAllPosts } from '@/lib/mdx';

export async function GET() {
  const site_url = 'https://fubon.ru';
  const posts = getAllPosts();

  const feed = new Feed({
    title: 'Fubon | Креативное агентство по дизайну и разработке.',
    description: 'Используя методы Data Science и лучшие практики UX-дизайна и проектирования продуктов, мы достигаем измеримых бизнес-результатов и создаем решения, которые отвечают потребностям пользователей и целям компании.',
    id: site_url,
    link: site_url,
    language: 'ru',
    image: `${site_url}/splash-n.jpg`,
    favicon: `${site_url}/favicon.ico`,
    copyright: `Все права защищены ${new Date().getFullYear()}`,
    feedLinks: {
      rss: `${site_url}/rss.xml`,
    },
    author: {
      name: 'Anthony Fubon',
      email: 'hello@fubon.ru',
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
