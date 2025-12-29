import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-crawler-status',
  template: `
    <div class="crawler-status-panel glass-effect">
      <h2 class="section-title">
        <i class="fas fa-spider"></i>
        Cross-Platform Crawler Status
      </h2>
      
      <div class="crawler-grid">
        <div *ngFor="let crawler of crawlers" class="crawler-card">
          <div class="crawler-header">
            <div class="crawler-info">
              <h3>{{ crawler.platform }}</h3>
              <div class="crawler-status">
                <div class="status-indicator" [class]="crawler.status"></div>
                <span class="status-text">{{ getStatusText(crawler.status) }}</span>
              </div>
            </div>
            <div class="crawler-icon">
              <i [class]="getPlatformIcon(crawler.platform)"></i>
            </div>
          </div>
          
          <div class="crawler-metrics">
            <div class="metric">
              <div class="metric-label">Documents Indexed</div>
              <div class="metric-value">{{ crawler.documentsIndexed | number }}</div>
            </div>
            <div class="metric">
              <div class="metric-label">Avg Response Time</div>
              <div class="metric-value">{{ crawler.avgResponseTime }}ms</div>
            </div>
            <div class="metric">
              <div class="metric-label">Last Crawl</div>
              <div class="metric-value">{{ formatLastCrawl(crawler.lastCrawl) }}</div>
            </div>
          </div>
          
          <div class="crawler-progress">
            <div class="progress-bar">
              <div class="progress-fill" [style.width]="getHealthPercentage(crawler) + '%'"></div>
            </div>
            <span class="progress-text">{{ getHealthPercentage(crawler) }}% Health</span>
          </div>
        </div>
      </div>
      
      <div class="crawler-summary">
        <div class="summary-stats">
          <div class="summary-stat">
            <i class="fas fa-check-circle"></i>
            <span>{{ getActiveCrawlers() }} Active</span>
          </div>
          <div class="summary-stat">
            <i class="fas fa-database"></i>
            <span>{{ getTotalDocuments() | number }} Total Documents</span>
          </div>
          <div class="summary-stat">
            <i class="fas fa-clock"></i>
            <span>{{ getAverageResponseTime() }}ms Avg Response</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .crawler-status-panel {
      margin-bottom: 30px;
      padding: 30px;
      color: white;
    }

    .section-title {
      font-size: 1.8rem;
      font-weight: 600;
      margin-bottom: 25px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 15px;
    }

    .crawler-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .crawler-card {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 15px;
      padding: 20px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
    }

    .crawler-card:hover {
      transform: translateY(-5px);
      background: rgba(255, 255, 255, 0.15);
    }

    .crawler-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
    }

    .crawler-info h3 {
      font-size: 1.1rem;
      margin-bottom: 8px;
    }

    .crawler-status {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .status-indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #10b981;
    }

    .status-indicator.maintenance {
      background: #f59e0b;
    }

    .status-indicator.error {
      background: #ef4444;
    }

    .status-text {
      font-size: 0.9rem;
      opacity: 0.9;
    }

    .crawler-icon {
      width: 50px;
      height: 50px;
      background: linear-gradient(45deg, #4f46e5, #7c3aed);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }

    .crawler-metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      gap: 15px;
      margin-bottom: 20px;
    }

    .metric {
      text-align: center;
    }

    .metric-label {
      font-size: 0.8rem;
      opacity: 0.8;
      margin-bottom: 5px;
    }

    .metric-value {
      font-size: 1.1rem;
      font-weight: 600;
    }

    .crawler-progress {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .progress-bar {
      flex: 1;
      height: 8px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(45deg, #10b981, #059669);
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .progress-text {
      font-size: 0.9rem;
      font-weight: 500;
      min-width: 80px;
    }

    .crawler-summary {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 15px;
      padding: 20px;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .summary-stats {
      display: flex;
      justify-content: space-around;
      align-items: center;
    }

    .summary-stat {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 500;
    }

    .summary-stat i {
      color: #10b981;
    }

    @media (max-width: 768px) {
      .crawler-grid {
        grid-template-columns: 1fr;
      }

      .summary-stats {
        flex-direction: column;
        gap: 15px;
      }

      .crawler-metrics {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CrawlerStatusComponent implements OnInit {
  crawlers: any[] = [];

  constructor(private searchService: SearchService) {}

  ngOnInit() {
    this.loadCrawlerStatus();
    // Refresh status every 30 seconds
    setInterval(() => this.loadCrawlerStatus(), 30000);
  }

  loadCrawlerStatus() {
    this.searchService.getCrawlerStatus().subscribe({
      next: (data) => {
        this.crawlers = data;
      },
      error: (error) => {
        console.error('Failed to load crawler status:', error);
      }
    });
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'active': return 'Active';
      case 'maintenance': return 'Maintenance';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  }

  getPlatformIcon(platform: string): string {
    const iconMap: { [key: string]: string } = {
      'OpenAI GPT': 'fas fa-brain',
      'Google Bard': 'fab fa-google',
      'Anthropic Claude': 'fas fa-robot',
      'Microsoft Copilot': 'fab fa-microsoft',
      'Meta LLaMA': 'fab fa-meta'
    };
    return iconMap[platform] || 'fas fa-robot';
  }

  formatLastCrawl(lastCrawl: string): string {
    const date = new Date(lastCrawl);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  }

  getHealthPercentage(crawler: any): number {
    if (crawler.status === 'active') return Math.floor(85 + Math.random() * 15);
    if (crawler.status === 'maintenance') return Math.floor(60 + Math.random() * 25);
    return Math.floor(20 + Math.random() * 40);
  }

  getActiveCrawlers(): number {
    return this.crawlers.filter(c => c.status === 'active').length;
  }

  getTotalDocuments(): number {
    return this.crawlers.reduce((sum, c) => sum + c.documentsIndexed, 0);
  }

  getAverageResponseTime(): number {
    if (this.crawlers.length === 0) return 0;
    const sum = this.crawlers.reduce((sum, c) => sum + c.avgResponseTime, 0);
    return Math.round(sum / this.crawlers.length);
  }
}