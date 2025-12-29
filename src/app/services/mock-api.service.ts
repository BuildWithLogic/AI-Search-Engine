import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockApiService {

  search(query: string, filters: any = {}): Observable<any> {
    const mockResults = this.generateMockResults(query, filters);
    
    return of({
      query,
      results: mockResults,
      totalResults: mockResults.length,
      searchTime: Math.floor(Math.random() * 150) + 50,
      explanation: this.generateSearchExplanation(query, mockResults)
    }).pipe(delay(800)); // Simulate network delay
  }

  getCrawlerStatus(): Observable<any> {
    const aiPlatforms = [
      'OpenAI GPT', 'Google Bard', 'Anthropic Claude', 'Microsoft Copilot', 'Meta LLaMA'
    ];
    
    const crawlerStatuses = aiPlatforms.map(platform => ({
      platform,
      status: Math.random() > 0.1 ? 'active' : 'maintenance',
      lastCrawl: new Date(Date.now() - Math.random() * 3600000),
      documentsIndexed: Math.floor(Math.random() * 1000000) + 100000,
      avgResponseTime: Math.floor(Math.random() * 200) + 50
    }));
    
    return of(crawlerStatuses).pipe(delay(300));
  }

  private generateMockResults(query: string, filters: any): any[] {
    const results = [];
    const aiPlatforms = ['OpenAI GPT', 'Google Bard', 'Anthropic Claude', 'Microsoft Copilot', 'Meta LLaMA'];
    const contentTypes = ['article', 'documentation', 'tutorial', 'research', 'code'];
    
    // Filter platforms if specified
    const platformsToSearch = filters.platform ? [filters.platform] : aiPlatforms;
    
    for (const platform of platformsToSearch) {
      const platformResults = this.generatePlatformResults(query, platform, 3, contentTypes, filters);
      results.push(...platformResults);
    }
    
    // Apply relevance threshold filter
    const threshold = filters.relevanceThreshold || 0;
    return results
      .filter(result => result.relevanceScore >= threshold)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 15);
  }

  private generatePlatformResults(query: string, platform: string, count: number, contentTypes: string[], filters: any): any[] {
    const results = [];
    
    const searchUrls: { [key: string]: string } = {
      'OpenAI GPT': `https://www.google.com/search?q=site:openai.com+${encodeURIComponent(query)}`,
      'Google Bard': `https://www.google.com/search?q=Google+Bard+${encodeURIComponent(query)}`,
      'Anthropic Claude': `https://www.google.com/search?q=site:anthropic.com+${encodeURIComponent(query)}`,
      'Microsoft Copilot': `https://www.google.com/search?q=Microsoft+Copilot+${encodeURIComponent(query)}`,
      'Meta LLaMA': `https://www.google.com/search?q=Meta+LLaMA+${encodeURIComponent(query)}`
    };
    
    for (let i = 0; i < count; i++) {
      const contentType = filters.contentType || contentTypes[Math.floor(Math.random() * contentTypes.length)];
      const relevanceScore = Math.random() * 40 + 60; // 60-100% relevance
      
      results.push({
        title: `${query} - ${contentType} from ${platform}`,
        url: searchUrls[platform] || `https://www.google.com/search?q=${encodeURIComponent(query + ' ' + platform)}`,
        snippet: `Comprehensive ${query} information from ${platform}. This ${contentType} has been classified as high-quality and relevant to your search intent. Learn about advanced techniques and best practices.`,
        relevanceScore: Math.round(relevanceScore),
        aiPlatform: platform,
        contentType: contentType,
        timestamp: new Date(Date.now() - Math.random() * 86400000) // Random time within last 24 hours
      });
    }
    
    return results;
  }

  private generateSearchExplanation(query: string, results: any[]): any {
    return {
      strategy: "Multi-stage AI ranking applied",
      steps: [
        "Content classified across AI platforms",
        "Relevance scoring using semantic analysis", 
        "Quality filtering based on source authority",
        "Cross-platform deduplication applied",
        `Results optimized for low latency (${results.length} results in <200ms)`
      ],
      platforms: [...new Set(results.map(r => r.aiPlatform))]
    };
  }
}