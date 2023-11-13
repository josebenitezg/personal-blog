import Layout from '../components/Layout'
import { load } from 'outstatic/server'
import ContentGrid from '../components/ContentGrid'
import MarkdownToHtml from '@/components/MarkdownToHtml'
import Header from '@/components/Header'


export default async function Index() {
  const { content, allPosts, allProjects } = await getData()

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-5">
        <Header />
      </div>  
      <div className="max-w-6xl mx-auto px-5 py-5">
        <section className="prose lg:prose-xl dark:text-white">
          <MarkdownToHtml content={content} />
        </section>
        {allPosts.length > 0 && (
          <ContentGrid
            title="Posts"
            items={allPosts}
            collection="posts"
            priority
          />
        )}
        {allProjects.length > 0 && (
          <ContentGrid
            title="Projects"
            items={allProjects}
            collection="projects"
          />
        )}
      </div>
    </Layout>
  )
}

async function getData() {
  const db = await load()

  const page = await db
    .find({ collection: 'pages', slug: 'home' }, ['content'])
    .first()

  const content = page.content

  const allPosts = await db
    .find({ collection: 'posts' }, [
      'title',
      'publishedAt',
      'slug',
      'coverImage',
      'description',
      'tags'
    ])
    .sort({ publishedAt: -1 })
    .toArray()

  const allProjects = await db
    .find({ collection: 'projects' }, ['title', 'slug', 'coverImage'])
    .sort({ publishedAt: -1 })
    .toArray()

  return {
    content,
    allPosts,
    allProjects
  }
}
