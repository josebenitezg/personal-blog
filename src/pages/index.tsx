import Layout from '../components/Layout'
import Head from 'next/head'
import { Document } from '../interfaces/document'
import { getDocumentBySlug, getDocuments } from 'outstatic/server'
import ContentGrid from '../components/ContentGrid'
import markdownToHtml from '../lib/markdownToHtml'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

type Props = {
  page: Document
  allPosts: Document[]
  allProjects: Document[]
}

export default function Index({ page, allPosts, allProjects }: Props) {
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  return (
    <>
      <Layout>
        <Head>
          <title>Blog de Jose</title>
        </Head>
          <div>
            {currentTheme === 'dark' ? (
              <button className="top-right-corner bg-black-700 hover:bg-black rounded-md border-purple-400 border-2"
                onClick={() => setTheme('light')}>
                <Image src="/sun.svg" alt="logo" height="20" width="20" />
              </button>
            ) : (
              <button className="top-right-corner bg-gray-100 rounded-md border-purple-400 border-2 hover:bg-gray-300"
                onClick={() => setTheme('dark')}>
                <Image src="/moon.svg" alt="logo" height="20" width="20" />
              </button>
            )}
        </div>
        <div className="max-w-6xl mx-auto px-5">
          <section className="mt-16 mb-16 md:mb-12">
            <div
              className="prose lg:prose-2xl home-intro"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </section>
          {allPosts.length > 0 && (
            <ContentGrid title="Posts" items={allPosts} collection="posts" />
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
    </>
  )
}

export const getStaticProps = async () => {
  const page = getDocumentBySlug('pages', 'home', ['content'])

  const allPosts = getDocuments('posts', [
    'title',
    'publishedAt',
    'slug',
    'coverImage',
    'description'
  ])

  const allProjects = getDocuments('projects', ['title', 'slug', 'coverImage'])

  const content = await markdownToHtml(page.content || '')

  return {
    props: { page: { content }, allPosts, allProjects }
  }
}
