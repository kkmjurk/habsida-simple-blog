import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { getArticle } from '../services/articleService'
import type { Article } from '../types/article'
import './ArticlePage.css'

function ArticlePage() {
  const { slug } = useParams<{ slug: string }>()

  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!slug) return

    const controller = new AbortController()
    const articleSlug = slug

    async function loadArticle() {
      try {
        setLoading(true)
        setError('')

        const data = await getArticle(articleSlug, controller.signal)

        setArticle(data.article)
      } catch (err) {
        if (controller.signal.aborted) return

        setError(err instanceof Error ? err.message : 'Something went wrong.')
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadArticle()

    return () => controller.abort()
  }, [slug])

  if (!slug) {
    return (
      <main className="article-page">
        <p>Article not found.</p>
        <Link to="/articles">Back to articles</Link>
      </main>
    )
  }

  if (loading) {
    return <p className="article-page__status">Loading article...</p>
  }

  if (error || !article) {
    return (
      <main className="article-page">
        <p className="article-page__error">{error || 'Article not found.'}</p>
        <Link to="/articles">Back to articles</Link>
      </main>
    )
  }

  return (
    <main className="article-page">
      <Link to="/articles" className="article-page__back">
        ← Back to articles
      </Link>

      <header className="article-page__header">
        <h1>{article.title}</h1>

        <div className="article-page__author">
          {article.author.image && (
            <img src={article.author.image} alt={article.author.username} />
          )}

          <div>
            <p>{article.author.username}</p>
            <span>{new Date(article.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </header>

      <div className="article-page__body">
        <ReactMarkdown>{article.body}</ReactMarkdown>
      </div>

      <div className="article-page__footer">
        <span>♥ {article.favoritesCount}</span>
        <Link to="/articles">Back to articles</Link>
      </div>
    </main>
  )
}

export default ArticlePage
