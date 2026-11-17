import type { ArticleResponse, ArticlesResponse } from '../types/article'

const API_URL = 'https://realworld.habsida.net/api'

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('Too many requests. Please try again later.')
    }

    throw new Error(`Request failed: ${response.status}`)
  }

  return response.json()
}

export async function getArticles(
  limit: number,
  offset: number,
  signal?: AbortSignal,
): Promise<ArticlesResponse> {
  const response = await fetch(
    `${API_URL}/articles?limit=${limit}&offset=${offset}`,
    { signal },
  )

  return handleResponse<ArticlesResponse>(response)
}

export async function getArticle(
  slug: string,
  signal?: AbortSignal,
): Promise<ArticleResponse> {
  const response = await fetch(
    `${API_URL}/articles/${encodeURIComponent(slug)}`,
    { signal },
  )

  return handleResponse<ArticleResponse>(response)
}
