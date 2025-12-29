import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-results',
  template: `
    <div class="results-container" *ngIf="results.length > 0 || loading || explanation">
      
      <!-- Loading State -->
      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
        <p>Searching across AI platforms...</p>
      </div>

      <!-- Search Explanation -->
      <div *ngIf="explanation && !loading" class="explanation-panel">
        <h3 class="explanation-title">
          <i class="fas fa-lightbulb"></i>
          Search Strategy Applied
        </h3>
        <p><strong>{{ explanation.strategy }}</strong></p>
        <ul class="explanation-steps">
          <li *ngFor="let step of explanation.steps">{{ step }}</li>
        </ul>
        <div class="platforms-used">
          <strong>Platforms searched:</strong>
          <span *ngFor="let platform of explanation.platforms; let last = last" class="platform-tag">
            {{ platform }}<span *ngIf="!last">, </span>
          </span>
        </div>
      </div>

      <!-- Results Header -->
      <div *ngIf="results.length > 0 && !loading" class="results-header">
        <h3>
          <i class="fas fa-search-plus"></i>
          {{ results.length }} Results Found
        </h3>
        <div class="results-stats">
          <span><i class="fas fa-clock"></i> Search completed in {{ getAverageTime() }}ms</span>
          <span><i class="fas fa-star"></i> Avg relevance: {{ getAverageRelevance() }}%</span>
        </div>
      </div>

      <!-- Search Results -->
      <div class="results-list" *ngIf="results.length > 0 && !loading">
        <div *ngFor="let result of results; let i = index" class="result-card" 
             [style.animation-delay]="i * 0.1 + 's'">
          
          <div class="result-header">
            <a [href]="result.url" target="_blank" class="result-title">
              {{ result.title }}
            </a>
            <div class="result-score">
              <i class="fas fa-chart-line"></i>
              {{ result.relevanceScore | number:'1.0-1' }}%
            </div>
          </div>
          
          <p class="result-snippet">{{ result.snippet }}</p>
          
          <div class="result-meta">
            <div class="meta-left">
              <span class="platform-badge">{{ result.aiPlatform }}</span>
              <span class="content-type">
                <i class="fas fa-tag"></i>
                {{ result.contentType }}
              </span>
            </div>
            <div class="meta-right">
              <span class="timestamp">
                <i class="fas fa-clock"></i>
                {{ formatTimestamp(result.timestamp) }}
              </span>
            </div>
          </div>
          
          <!-- Quality Indicators -->
          <div class="quality-indicators">
            <div class="indicator" [class.active]="result.relevanceScore > 80">
              <i class="fas fa-bullseye"></i>
              High Relevance
            </div>
            <div class="indicator" [class.active]="isRecentContent(result.timestamp)">
              <i class="fas fa-clock"></i>
              Fresh Content
            </div>
            <div class="indicator" [class.active]="isAuthoritative(result.aiPlatform)">
              <i class="fas fa-shield-alt"></i>
              Authoritative Source
            </div>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div *ngIf="results.length === 0 && !loading && explanation" class="no-results">
        <i class="fas fa-search"></i>
        <h3>No results found</h3>
        <p>Try adjusting your search terms or filters</p>
      </div>
    </div>
  `,
  styles: [`
    .results-container {
      margin-top: 20px;
    }

    .loading {
      text-align: center;
      padding: 40px;
      color: white;
    }

    .loading p {
      margin-top: 20px;
      font-size: 1.1rem;
    }

    .results-header {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 15px;
      padding: 20px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .results-header h3 {
      color: #1a202c;
      font-size: 1.3rem;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .results-stats {
      display: flex;
      gap: 20px;
      color: #4a5568;
      font-size: 14px;
    }

    .results-stats span {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .results-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .result-card {
      animation: slideInUp 0.6s ease-out forwards;
      opacity: 0;
      transform: translateY(20px);
    }

    @keyframes slideInUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .result-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }

    .result-score {
      background: linear-gradient(45deg, #10b981, #059669);
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 5px;
      min-width: 70px;
      justify-content: center;
    }

    .meta-left, .meta-right {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .content-type {
      display: flex;
      align-items: center;
      gap: 5px;
      color: #6b7280;
      font-size: 13px;
    }

    .timestamp {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 13px;
    }

    .quality-indicators {
      display: flex;
      gap: 10px;
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #e5e7eb;
    }

    .indicator {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 11px;
      background: #f3f4f6;
      color: #6b7280;
      transition: all 0.3s ease;
    }

    .indicator.active {
      background: #dcfce7;
      color: #166534;
    }

    .platforms-used {
      margin-top: 15px;
      color: #4a5568;
    }

    .platform-tag {
      color: #4f46e5;
      font-weight: 500;
    }

    .no-results {
      text-align: center;
      padding: 60px 20px;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 15px;
      color: #4a5568;
    }

    .no-results i {
      font-size: 3rem;
      margin-bottom: 20px;
      color: #9ca3af;
    }

    @media (max-width: 768px) {
      .results-header {
        flex-direction: column;
        gap: 15px;
        text-align: center;
      }

      .results-stats {
        flex-direction: column;
        gap: 10px;
      }

      .result-header {
        flex-direction: column;
        gap: 10px;
      }

      .quality-indicators {
        flex-wrap: wrap;
      }
    }
  `]
})
export class ResultsComponent {
  @Input() results: any[] = [];
  @Input() loading = false;
  @Input() explanation: any = null;

  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  }

  getAverageTime(): number {
    return Math.floor(Math.random() * 150) + 50; // Simulated response time
  }

  getAverageRelevance(): number {
    if (this.results.length === 0) return 0;
    const sum = this.results.reduce((acc, result) => acc + result.relevanceScore, 0);
    return Math.round(sum / this.results.length);
  }

  isRecentContent(timestamp: string): boolean {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    return diffHours < 24;
  }

  isAuthoritative(platform: string): boolean {
    const authoritativePlatforms = ['OpenAI GPT', 'Google Bard', 'Anthropic Claude'];
    return authoritativePlatforms.includes(platform);
  }
}