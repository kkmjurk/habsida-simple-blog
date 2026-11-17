import { Link } from 'react-router-dom'
import type { ArticlePreview } from '../types/article'
import './ArticleCard.css'

interface ArticleCardProps {
  article: ArticlePreview
}

function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="article-card">
      <div className="article-card__content">
        <div className="article-card__author">
          {article.author.image && (
            <img
              className="article-card__avatar"
              src={article.author.image}
              alt={article.author.username}
            />
          )}

          <span>{article.author.username}</span>
        </div>

        <Link to={`/articles/${article.slug}`} className="article-card__title">
          {article.title}
        </Link>

        <p className="article-card__description">{article.description}</p>

        <div className="article-card__tags">
          {article.tagList.map((tag) => (
            <span key={tag} className="article-card__tag">
              {tag}
            </span>
          ))}
        </div>

        <span className="article-card__date">
          {new Date(article.createdAt).toLocaleDateString()}
        </span>
      </div>

      <button
        className="article-card__like"
        type="button"
        disabled
        aria-label="Likes are unavailable without authentication"
      >
        ♥ {article.favoritesCount}
      </button>
    </article>
  )
}

export default ArticleCard
