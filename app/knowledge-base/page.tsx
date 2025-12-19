// app/knowledge-base/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Article } from '@/lib/db'

export default function KnowledgeBase() {
  const [articles, setArticles] = useState<Article[]>([])
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/knowledge-base')
      const data = await response.json()
      setArticles(data)
      setFilteredArticles(data)
    } catch (error) {
      console.error('Error fetching articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const searchArticles = () => {
    if (!searchTerm.trim()) {
      setFilteredArticles(articles)
      return
    }

    const filtered = articles.filter(article =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (article.keywords && article.keywords.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    setFilteredArticles(filtered)
  }

  const filterByCategory = (category: string) => {
    setSelectedCategory(category)
    if (category === 'all') {
      setFilteredArticles(articles)
    } else {
      setFilteredArticles(articles.filter(article => article.category === category))
    }
  }

  const expandArticle = (articleId: string) => {
    setExpandedArticle(expandedArticle === articleId ? null : articleId)
  }

  const getCategoryClass = (category: string) => {
    const classes: { [key: string]: string } = {
      'Kwatos': 'kwatos',
      'Hardware': 'hardware',
      'Network': 'network',
      'Access Control': 'access-control'
    }
    return classes[category] || 'general'
  }

  const popularArticles = [...articles].sort((a, b) => b.views - a.views).slice(0, 5)

  const categories = ['all', 'Kwatos', 'Hardware', 'Network', 'Access Control']

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h2>Knowledge Base</h2>
          <p className="page-subtitle">Find quick solutions to common IT issues</p>
        </div>

        <div className="search-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search for solutions... (e.g., 'Kwatos password', 'printer error')"
              className="search-input"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                if (!e.target.value.trim()) {
                  setFilteredArticles(articles)
                }
              }}
              onKeyPress={(e) => e.key === 'Enter' && searchArticles()}
            />
            <button className="btn-primary" onClick={searchArticles}>
              🔍 Search
            </button>
          </div>
        </div>

        <div className="category-tabs">
          {categories.map(category => (
            <button
              key={category}
              className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => filterByCategory(category)}
            >
              {category === 'all' ? 'All Articles' : category}
            </button>
          ))}
        </div>

        <div className="content-grid">
          <div className="main-content">
            {loading ? (
              <div className="loading-state">
                <div className="loader"></div>
                <p>Loading articles...</p>
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="empty-state">
                <h3>No articles found</h3>
                <p>Try different keywords or <a href="/submit-ticket">submit a ticket</a> for assistance.</p>
              </div>
            ) : (
              <div className="articles-list">
                {filteredArticles.map(article => (
                  <div 
                    key={article.id} 
                    className={`article-card ${expandedArticle === article.article_id ? 'expanded' : ''}`}
                  >
                    <div className="article-header">
                      <div className="article-title-section">
                        <h3 className="article-title">{article.title}</h3>
                        <div className="article-meta">
                          <span className={`category-badge ${getCategoryClass(article.category)}`}>
                            {article.category}
                          </span>
                          <span className="views-count">👁 {article.views} views</span>
                          {article.helpful_count > 0 && (
                            <span className="helpful-count">👍 {article.helpful_count} helpful</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="article-preview">
                      <p>{article.content.substring(0, 200).replace(/\n/g, ' ')}...</p>
                    </div>
                    
                    <button
                      className="btn-text expand-btn"
                      onClick={() => expandArticle(article.article_id)}
                    >
                      {expandedArticle === article.article_id ? 'Show Less' : 'Read Full Article'}
                      <span className="arrow">{expandedArticle === article.article_id ? '↑' : '↓'}</span>
                    </button>
                    
                    {expandedArticle === article.article_id && (
                      <div className="article-full-content">
                        <div className="article-content">
                          <pre style={{ 
                            whiteSpace: 'pre-wrap', 
                            fontFamily: 'inherit',
                            lineHeight: '1.6',
                            margin: '0'
                          }}>
                            {article.content}
                          </pre>
                        </div>
                        <div className="article-footer">
                          <div className="article-actions">
                            <button className="btn-small btn-outline">
                              👍 Helpful ({article.helpful_count})
                            </button>
                            <button
                              className="btn-small btn-primary"
                              onClick={() => window.location.href = '/tickets/new'}
                            >
                              Still need help? Submit a ticket
                            </button>
                          </div>
                          <div className="article-keywords">
                            <strong>Keywords:</strong> {article.keywords}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="sidebar">
            <div className="sidebar-card">
              <h3 className="sidebar-title">🔥 Most Viewed</h3>
              <ul className="popular-articles-list">
                {popularArticles.map(article => (
                  <li key={article.id} className="popular-article-item">
                    <button
                      className="popular-article-link"
                      onClick={() => expandArticle(article.article_id)}
                    >
                      <span className="article-rank">#{(popularArticles.indexOf(article) + 1)}</span>
                      <span className="article-title-truncated">{article.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sidebar-card">
              <h3 className="sidebar-title">💡 Quick Tips</h3>
              <div className="tips-list">
                <div className="tip-item">
                  <div className="tip-icon">🔍</div>
                  <div className="tip-content">Search our knowledge base first</div>
                </div>
                <div className="tip-item">
                  <div className="tip-icon">🔄</div>
                  <div className="tip-content">Try restarting your device</div>
                </div>
                <div className="tip-item">
                  <div className="tip-icon">🔌</div>
                  <div className="tip-content">Check cable connections</div>
                </div>
                <div className="tip-item">
                  <div className="tip-icon">🧹</div>
                  <div className="tip-content">Clear your browser cache</div>
                </div>
              </div>
            </div>

            <div className="sidebar-card">
              <h3 className="sidebar-title">📞 Emergency Contacts</h3>
              <div className="contacts-list">
                <div className="contact-item">
                  <strong>ICT Helpdesk:</strong> Ext. 2000
                </div>
                <div className="contact-item">
                  <strong>After Hours:</strong> +254 700 123 456
                </div>
                <div className="contact-item">
                  <strong>Email:</strong> ict.support@nexus.co.ke
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }
        
        .page-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .page-header h2 {
          color: #0066cc;
          margin-bottom: 0.5rem;
          font-size: 2.5rem;
        }
        
        .page-subtitle {
          color: #666;
          font-size: 1.1rem;
        }
        
        .search-section {
          margin-bottom: 2rem;
        }
        
        .search-bar {
          display: flex;
          gap: 1rem;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .search-input {
          flex: 1;
          padding: 1rem;
          border: 2px solid #ddd;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }
        
        .search-input:focus {
          outline: none;
          border-color: #0066cc;
        }
        
        .category-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        
        .category-tab {
          padding: 0.75rem 1.5rem;
          border: 2px solid #ddd;
          border-radius: 50px;
          background: white;
          color: #666;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .category-tab:hover {
          border-color: #0066cc;
          color: #0066cc;
        }
        
        .category-tab.active {
          background: #0066cc;
          color: white;
          border-color: #0066cc;
        }
        
        .content-grid {
          display: grid;
          grid-template-columns: 3fr 1fr;
          gap: 2rem;
        }
        
        @media (max-width: 768px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
        }
        
        .article-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: all 0.3s;
          border: 1px solid #eee;
        }
        
        .article-card:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
          transform: translateY(-2px);
        }
        
        .article-card.expanded {
          box-shadow: 0 6px 20px rgba(0,0,0,0.2);
        }
        
        .article-header {
          margin-bottom: 1rem;
        }
        
        .article-title-section {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .article-title {
          color: #333;
          margin: 0;
          font-size: 1.25rem;
          flex: 1;
          min-width: 300px;
        }
        
        .article-meta {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }
        
        .category-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
        }
        
        .category-badge.kwatos {
          background: #e3f2fd;
          color: #1565c0;
        }
        
        .category-badge.hardware {
          background: #e8f5e9;
          color: #2e7d32;
        }
        
        .category-badge.network {
          background: #f3e5f5;
          color: #7b1fa2;
        }
        
        .category-badge.access-control {
          background: #fff3e0;
          color: #ef6c00;
        }
        
        .category-badge.general {
          background: #f5f5f5;
          color: #616161;
        }
        
        .views-count, .helpful-count {
          color: #666;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        
        .article-preview {
          color: #666;
          line-height: 1.6;
          margin-bottom: 1rem;
        }
        
        .btn-text {
          background: none;
          border: none;
          color: #0066cc;
          cursor: pointer;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0;
          font-size: 0.95rem;
        }
        
        .btn-text:hover {
          text-decoration: underline;
        }
        
        .arrow {
          font-size: 0.8rem;
        }
        
        .article-full-content {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #eee;
        }
        
        .article-content {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          white-space: pre-wrap;
          font-family: inherit;
          line-height: 1.6;
        }
        
        .article-footer {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .article-actions {
          display: flex;
          gap: 1rem;
        }
        
        .btn-small {
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.875rem;
          cursor: pointer;
        }
        
        .btn-outline {
          background: white;
          border: 1px solid #ddd;
          color: #666;
        }
        
        .btn-outline:hover {
          border-color: #0066cc;
          color: #0066cc;
        }
        
        .btn-primary {
          background: #0066cc;
          border: none;
          color: white;
        }
        
        .btn-primary:hover {
          background: #0052a3;
        }
        
        .article-keywords {
          color: #666;
          font-size: 0.875rem;
          padding: 0.5rem;
          background: #f8f9fa;
          border-radius: 4px;
        }
        
        .sidebar-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .sidebar-title {
          color: #333;
          margin: 0 0 1rem 0;
          font-size: 1.1rem;
          border-bottom: 2px solid #0066cc;
          padding-bottom: 0.5rem;
        }
        
        .popular-articles-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .popular-article-item {
          margin-bottom: 0.75rem;
        }
        
        .popular-article-link {
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          padding: 0.75rem;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          transition: background 0.3s;
        }
        
        .popular-article-link:hover {
          background: #f8f9fa;
        }
        
        .article-rank {
          background: #0066cc;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: bold;
        }
        
        .article-title-truncated {
          flex: 1;
          color: #333;
          font-size: 0.9rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .tips-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .tip-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem;
          background: #f8f9fa;
          border-radius: 8px;
        }
        
        .tip-icon {
          font-size: 1.25rem;
        }
        
        .tip-content {
          color: #333;
          font-size: 0.9rem;
        }
        
        .contacts-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .contact-item {
          padding: 0.75rem;
          background: #f8f9fa;
          border-radius: 8px;
          font-size: 0.9rem;
        }
        
        .loading-state {
          text-align: center;
          padding: 3rem;
        }
        
        .loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #0066cc;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .empty-state {
          text-align: center;
          padding: 3rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .empty-state h3 {
          color: #666;
          margin-bottom: 0.5rem;
        }
        
        .empty-state a {
          color: #0066cc;
          text-decoration: none;
        }
        
        .empty-state a:hover {
          text-decoration: underline;
        }
      `}</style>
      <Footer />
    </>
  )
}