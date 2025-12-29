import { Component, OnInit, OnDestroy } from '@angular/core';
import { AnalyticsService } from '../../services/analytics.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-analytics',
  template: `
    <div class="analytics-dashboard">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-search"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ analytics?.totalSearches || 0 | number }}</div>
            <div class="stat-label">Total Searches</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-bolt"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ analytics?.avgSearchTime || 0 | number:'1.0-0' }}ms</div>
            <div class="stat-label">Avg Response Time</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-robot"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ analytics?.activeCrawlers || 0 }}</div>
            <div class="stat-label">Active Crawlers</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ realTimeSearches }}</div>
            <div class="stat-label">Live Searches</div>
          </div>
        </div>
      </div>

      <!-- Real-time Activity -->
      <div class="activity-feed" *ngIf="recentActivity.length > 0">
        <h3>
          <i class="fas fa-pulse"></i>
          Real-time Activity
        </h3>
        <div class="activity-list">
          <div *ngFor="let activity of recentActivity.slice(0, 5)" class="activity-item">
            <div class="activity-icon">
              <i class="fas fa-search"></i>
            </div>
            <div class="activity-content">
              <div class="activity-query">"{{ activity.query }}"</div>
              <div class="activity-meta">
                {{ activity.resultCount }} results • {{ activity.searchTime }}ms • {{ formatTime(activity.timestamp) }}
              </div>
            </div>
            <div class="activity-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .analytics-dashboard {
      margin-bottom: 30px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 15px;
      padding: 25px;
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      gap: 20px;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-5px);
      background: rgba(255, 255, 255, 0.15);
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      background: linear-gradient(45deg, #4f46e5, #7c3aed);
      border-radius: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }

    .stat-content {
      flex: 1;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 5px;
    }

    .stat-label {
      font-size: 0.9rem;
      opacity: 0.8;
    }

    .activity-feed {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 15px;
      padding: 25px;
      color: #1a202c;
    }

    .activity-feed h3 {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 20px;
      font-size: 1.2rem;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 15px;
      background: #f8fafc;
      border-radius: 10px;
      border-left: 4px solid #4f46e5;
      position: relative;
      overflow: hidden;
    }

    .activity-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(45deg, #4f46e5, #7c3aed);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 0.9rem;
    }

    .activity-content {
      flex: 1;
    }

    .activity-query {
      font-weight: 600;
      margin-bottom: 5px;
      color: #1a202c;
    }

    .activity-meta {
      font-size: 0.8rem;
      color: #6b7280;
    }

    .activity-pulse {
      width: 12px;
      height: 12px;
      background: #10b981;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
      }
      
      70% {
        transform: scale(1);
        box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
      }
      
      100% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
      }
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .stat-card {
        flex-direction: column;
        text-align: center;
        gap: 15px;
      }

      .activity-item {
        flex-direction: column;
        text-align: center;
        gap: 10px;
      }
    }
  `]
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  analytics: any = null;
  recentActivity: any[] = [];
  realTimeSearches = 0;
  private subscriptions: Subscription[] = [];

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {
    this.loadAnalytics();
    this.subscribeToRealTimeUpdates();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.analyticsService.disconnect();
  }

  loadAnalytics() {
    const sub = this.analyticsService.getAnalytics().subscribe({
      next: (data) => {
        this.analytics = data;
      },
      error: (error) => {
        console.error('Failed to load analytics:', error);
      }
    });
    this.subscriptions.push(sub);
  }

  subscribeToRealTimeUpdates() {
    const sub = this.analyticsService.getRealTimeAnalytics().subscribe({
      next: (data) => {
        if (data) {
          this.recentActivity.unshift(data);
          this.recentActivity = this.recentActivity.slice(0, 10);
          this.realTimeSearches++;
        }
      }
    });
    this.subscriptions.push(sub);
  }

  formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  }
}