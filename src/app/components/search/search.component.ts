import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-search',
  template: `
    <form [formGroup]="searchForm" (ngSubmit)="onSearch()" class="search-form">
      <div class="search-container">
        <input 
          type="text" 
          formControlName="query"
          class="search-input"
          placeholder="Search across AI platforms: OpenAI, Google Bard, Claude, Copilot, LLaMA..."
          (keyup.enter)="onSearch()">
        <button type="submit" class="search-btn" [disabled]="!searchForm.get('query')?.value">
          <i class="fas fa-search"></i>
        </button>
      </div>
      
      <div class="search-filters">
        <div class="filter-group">
          <label>Content Type:</label>
          <select formControlName="contentType" class="filter-select">
            <option value="">All Types</option>
            <option value="article">Articles</option>
            <option value="documentation">Documentation</option>
            <option value="tutorial">Tutorials</option>
            <option value="research">Research</option>
            <option value="code">Code</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>AI Platform:</label>
          <select formControlName="platform" class="filter-select">
            <option value="">All Platforms</option>
            <option value="OpenAI GPT">OpenAI GPT</option>
            <option value="Google Bard">Google Bard</option>
            <option value="Anthropic Claude">Anthropic Claude</option>
            <option value="Microsoft Copilot">Microsoft Copilot</option>
            <option value="Meta LLaMA">Meta LLaMA</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>Relevance Threshold:</label>
          <input 
            type="range" 
            formControlName="relevanceThreshold"
            min="0" 
            max="100" 
            class="range-slider">
          <span class="range-value">{{ searchForm.get('relevanceThreshold')?.value }}%</span>
        </div>
      </div>
    </form>
  `,
  styles: [`
    .search-form {
      width: 100%;
    }

    .search-filters {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-top: 20px;
      padding: 20px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 15px;
      backdrop-filter: blur(10px);
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .filter-group label {
      font-weight: 500;
      color: white;
      font-size: 14px;
    }

    .filter-select {
      padding: 10px;
      border: none;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.9);
      font-size: 14px;
      outline: none;
    }

    .range-slider {
      width: 100%;
      height: 6px;
      border-radius: 3px;
      background: rgba(255, 255, 255, 0.3);
      outline: none;
    }

    .range-value {
      color: white;
      font-weight: 500;
      font-size: 14px;
    }

    @media (max-width: 768px) {
      .search-filters {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SearchComponent {
  @Output() searchPerformed = new EventEmitter<any>();

  searchForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      query: [''],
      contentType: [''],
      platform: [''],
      relevanceThreshold: [70]
    });
  }

  onSearch() {
    const query = this.searchForm.get('query')?.value?.trim();
    if (!query) return;

    const filters = {
      contentType: this.searchForm.get('contentType')?.value,
      platform: this.searchForm.get('platform')?.value,
      relevanceThreshold: this.searchForm.get('relevanceThreshold')?.value
    };

    this.searchPerformed.emit({ query, filters });
  }
}