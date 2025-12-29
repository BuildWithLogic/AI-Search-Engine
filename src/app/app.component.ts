import { Component, OnInit } from '@angular/core';
import { SearchService } from './services/search.service';
import { AnalyticsService } from './services/analytics.service';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <!-- Header -->
      <header class="header">
        <div class="container">
          <div class="header-content glass-effect">
            <h1 class="logo">
              <i class="fas fa-brain"></i>
              AI Search Engine
            </h1>
            <p class="tagline">Cross-Platform Intelligence • Multi-Stage Ranking • Explainable Results</p>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="main-content">
        <div class="container">
          
          <!-- Analytics Dashboard -->
          <app-analytics></app-analytics>
          
          <!-- Search Interface -->
          <div class="search-section glass-effect">
            <h2 class="section-title">Intelligent Search Across AI Platforms</h2>
            <app-search (searchPerformed)="onSearchPerformed($event)"></app-search>
          </div>

          <!-- Search Results -->
          <app-results 
            [results]="searchResults" 
            [loading]="searchLoading"
            [explanation]="searchExplanation">
          </app-results>

          <!-- Crawler Status -->
          <app-crawler-status></app-crawler-status>

          <!-- Strategy Overview -->
          <div class="strategy-section glass-effect">
            <h2 class="section-title">Our 8-Point AI Search Strategy</h2>
            <div class="strategy-grid">
              <div class="strategy-card" *ngFor="let point of strategyPoints; let i = index">
                <div class="strategy-number">{{ i + 1 }}</div>
                <h3>{{ point.title }}</h3>
                <p>{{ point.description }}</p>
              </div>
            </div>
          </div>

        </div>
      </main>

      <!-- Footer -->
      <footer class="footer">
        <div class="container">
          <div class="footer-content glass-effect">
            <p>&copy; 2024 AI Search Engine. Powered by cross-platform crawlers and intelligent ranking.</p>
            <div class="footer-stats">
              <span><i class="fas fa-search"></i> Real-time Search</span>
              <span><i class="fas fa-robot"></i> 5 AI Platforms</span>
              <span><i class="fas fa-bolt"></i> Sub-200ms Response</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .header {
      padding: 20px 0;
    }

    .header-content {
      text-align: center;
      padding: 30px;
      color: white;
    }

    .logo {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 10px;
    }

    .logo i {
      margin-right: 15px;
      color: #fbbf24;
    }

    .tagline {
      font-size: 1.1rem;
      opacity: 0.9;
    }

    .main-content {
      flex: 1;
      padding: 20px 0;
    }

    .search-section, .strategy-section {
      margin-bottom: 30px;
      padding: 30px;
      color: white;
    }

    .section-title {
      font-size: 1.8rem;
      font-weight: 600;
      margin-bottom: 25px;
      text-align: center;
    }

    .strategy-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    .strategy-card {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 15px;
      padding: 25px;
      text-align: center;
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
    }

    .strategy-card:hover {
      transform: translateY(-5px);
      background: rgba(255, 255, 255, 0.15);
    }

    .strategy-number {
      width: 50px;
      height: 50px;
      background: linear-gradient(45deg, #4f46e5, #7c3aed);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: bold;
      color: white;
      margin: 0 auto 15px;
    }

    .strategy-card h3 {
      font-size: 1.2rem;
      margin-bottom: 10px;
    }

    .strategy-card p {
      opacity: 0.9;
      line-height: 1.6;
    }

    .footer {
      padding: 20px 0;
    }

    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 30px;
      color: white;
    }

    .footer-stats {
      display: flex;
      gap: 30px;
    }

    .footer-stats span {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    @media (max-width: 768px) {
      .footer-content {
        flex-direction: column;
        gap: 15px;
        text-align: center;
      }

      .footer-stats {
        gap: 20px;
      }

      .strategy-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  searchResults: any[] = [];
  searchLoading = false;
  searchExplanation: any = null;

  strategyPoints = [
    {
      title: "Unique Search Advantage",
      description: "Cross-platform AI crawler technology that indexes content from multiple AI platforms simultaneously"
    },
    {
      title: "Scalable Pipeline",
      description: "Reliable crawling and indexing infrastructure designed for high-volume, real-time processing"
    },
    {
      title: "Content Classification",
      description: "Early content classification to understand quality, intent, and relevance before ranking"
    },
    {
      title: "Multi-Stage Ranking",
      description: "Balanced approach combining relevance scoring with speed optimization for optimal results"
    },
    {
      title: "Explainable Decisions",
      description: "Transparent ranking process with detailed explanations for every search result"
    },
    {
      title: "Low Latency Optimization",
      description: "Aggressive performance optimization targeting sub-200ms response times"
    },
    {
      title: "Real User Evaluation",
      description: "Performance measurement using actual user queries and measurable relevance metrics"
    },
    {
      title: "Continuous Improvement",
      description: "Focused launch scope with iterative enhancement based on user feedback and data analysis"
    }
  ];

  constructor(
    private searchService: SearchService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit() {
    // Initialize real-time analytics
    this.analyticsService.initializeRealTimeUpdates();
  }

  onSearchPerformed(searchData: any) {
    this.searchLoading = true;
    this.searchResults = [];
    this.searchExplanation = null;

    this.searchService.search(searchData.query, searchData.filters).subscribe({
      next: (response) => {
        this.searchResults = response.results;
        this.searchExplanation = response.explanation;
        this.searchLoading = false;
      },
      error: (error) => {
        console.error('Search failed:', error);
        this.searchLoading = false;
      }
    });
  }
}