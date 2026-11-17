import { useEffect, useState } from 'react'
import ArticleCard from '../components/ArticleCard'
import Pagination from '../components/Pagination'
import { getArticles } from '../services/articleService'
import type { ArticlePreview } from '../types/article'
import './ArticlesPage.css'

const ARTICLES_PER_PAGE = 5

function ArticlesPage() {
  const [articles, setArticles] = useState<ArticlePreview[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [articlesCount, setArticlesCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  const totalPages = Math.ceil(articlesCount / ARTICLES_PER_PAGE)

  useEffect(() => {
    const controller = new AbortController()

    async function loadArticles() {
      try {
        setLoading(true)
        setError('')

        const offset = (currentPage - 1) * ARTICLES_PER_PAGE

        const data = await getArticles(
          ARTICLES_PER_PAGE,
          offset,
          controller.signal,
        )

        setArticles(data.articles)
        setArticlesCount(data.articlesCount)
      } catch (err) {
        if (controller.signal.aborted) {
          return
        }

        setError(err instanceof Error ? err.message : 'Something went wrong.')
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadArticles()

    return () => controller.abort()
  }, [currentPage, retryCount])

  function handlePageChange(page: number) {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="articles-page">
      <header className="articles-page__header">
        <h1>Simple Blog</h1>
        <p>Discover interesting articles from our community.</p>
      </header>

      {loading && <p className="articles-page__status">Loading articles...</p>}

      {error && (
        <div className="articles-page__error">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <section className="articles-page__list">
            {articles.length > 0 ? (
              articles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))
            ) : (
              <p>No articles found.</p>
            )}
          </section>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </main>
  )
}

export default ArticlesPage
