createAdminPanel() {
      const container = UI.createElement('div', { className: 'space-y-6' });

      // Admin header
      const header = UI.createElement('div', { 
        className: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-lg mb-6' 
      });
      header.appendChild(UI.createElement('h3', { 
        className: 'text-lg font-semibold mb-2' 
      }, ['Admin Panel']));
      header.appendChild(UI.createElement('p', { 
        className: 'text-purple-100 text-sm' 
      }, ['Manage announcements and moderate content']));
      container.appendChild(header);

      // Create announcement section
      const announcementSection = UI.createElement('div', { className: 'space-y-4' });
      announcementSection.appendChild(UI.createElement('h4', { 
        className: 'text-lg font-semibold text-gray-900' 
      }, ['Create New Announcement']));

      const announcementForm = UI.createElement('div', { className: 'feedbase-form' });

      // Title input
      const titleGroup = UI.createElement('div', { className: 'feedbase-form-group' });
      titleGroup.appendChild(UI.createElement('label', { 
        className: 'feedbase-label' 
      }, ['Title']));
      
      const titleInput = UI.createElement('input', {
        type: 'text',
        className: 'feedbase-input',
        placeholder: 'Announcement title...',
        value: this.state.newAnnouncement.title,/**
 * Feedbase Widget with Supabase Integration
 * Standalone version for single-line integration
 * Features: Feature announcements, feedback system, notifications
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    FEEDBASE_API_URL: 'https://api.feedbase.app',
    SUPABASE_URL: '', // Set your Supabase URL
    SUPABASE_ANON_KEY: '', // Set your Supabase anon key
    WIDGET_ID: 'feedbase-widget-container',
    AUTH_CONFIG_URL: '/lib/feedbase-auth.js' // Path to auth config
  };

  // Authorization system
  const Auth = {
    admins: [],
    banned: [],
    roles: {},
    
    async loadConfig() {
      try {
        // Try to load from external auth config
        const response = await fetch(CONFIG.AUTH_CONFIG_URL);
        if (response.ok) {
          const authModule = await response.text();
          // Parse the auth config (simplified - in real implementation you'd use proper module loading)
          const adminMatch = authModule.match(/AUTHORIZED_ADMINS\s*=\s*\[([\s\S]*?)\]/);
          const bannedMatch = authModule.match(/BANNED_USERS\s*=\s*\[([\s\S]*?)\]/);
          
          if (adminMatch) {
            this.admins = this.parseUserArray(adminMatch[1]);
          }
          if (bannedMatch) {
            this.banned = this.parseUserArray(bannedMatch[1]);
          }
        }
      } catch (error) {
        // Fallback to default config
        this.admins = ['demo-admin', 'admin-123'];
        this.banned = ['banned-user-001'];
        console.warn('Could not load auth config, using defaults:', error);
      }
    },

    parseUserArray(str) {
      return str.match(/'([^']+)'/g)?.map(match => match.slice(1, -1)) || [];
    },

    isAdmin(userId) {
      return userId && this.admins.includes(userId);
    },

    isBanned(userId) {
      return userId && this.banned.includes(userId);
    },

    canCreateAnnouncement(userId) {
      return this.isAdmin(userId) && !this.isBanned(userId);
    },

    canDeleteAnnouncement(userId) {
      return this.isAdmin(userId) && !this.isBanned(userId);
    },

    canModerateFeedback(userId) {
      return this.isAdmin(userId) && !this.isBanned(userId);
    },

    // Dynamic management
    addAdmin(userId) {
      if (!this.admins.includes(userId)) {
        this.admins.push(userId);
        this.saveConfig();
      }
    },

    removeAdmin(userId) {
      this.admins = this.admins.filter(id => id !== userId);
      this.saveConfig();
    },

    banUser(userId) {
      if (!this.banned.includes(userId)) {
        this.banned.push(userId);
        this.removeAdmin(userId); // Remove admin if banned
        this.saveConfig();
      }
    },

    unbanUser(userId) {
      this.banned = this.banned.filter(id => id !== userId);
      this.saveConfig();
    },

    async saveConfig() {
      // In a real implementation, this would save to a secure backend
      // For now, we'll use localStorage as a demo
      const config = {
        admins: this.admins,
        banned: this.banned,
        timestamp: Date.now()
      };
      localStorage.setItem('feedbase_auth_config', JSON.stringify(config));
    },

    loadLocalConfig() {
      try {
        const stored = localStorage.getItem('feedbase_auth_config');
        if (stored) {
          const config = JSON.parse(stored);
          this.admins = config.admins || [];
          this.banned = config.banned || [];
        }
      } catch (error) {
        console.warn('Could not load local auth config:', error);
      }
    }
  };

  // Feedbase API Client
  class FeedbaseAPI {
    constructor(apiKey) {
      this.apiKey = apiKey;
      this.baseURL = CONFIG.FEEDBASE_API_URL;
      this.headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
    }

    async request(endpoint, options = {}) {
      try {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
          headers: this.headers,
          ...options
        });
        
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Feedbase API Error:', error);
        throw error;
      }
    }

    async getFeedback(projectId, params = {}) {
      const url = new URL(`${this.baseURL}/v1/projects/${projectId}/feedback`);
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined) {
          url.searchParams.append(key, params[key]);
        }
      });
      return this.request(url.pathname + url.search, { method: 'GET' });
    }

    async createFeedback(projectId, data) {
      return this.request(`/v1/projects/${projectId}/feedback`, {
        method: 'POST',
        body: JSON.stringify(data)
      });
    }

    async voteFeedback(projectId, feedbackId, voteData) {
      return this.request(`/v1/projects/${projectId}/feedback/${feedbackId}/vote`, {
        method: 'POST',
        body: JSON.stringify(voteData)
      });
    }

    async createAnnouncement(projectId, announcementData) {
      return this.request(`/v1/projects/${projectId}/announcements`, {
        method: 'POST',
        body: JSON.stringify(announcementData)
      });
    }

    async deleteAnnouncement(projectId, announcementId) {
      return this.request(`/v1/projects/${projectId}/announcements/${announcementId}`, {
        method: 'DELETE'
      });
    }

    async getAnnouncements(projectId) {
      return this.request(`/v1/projects/${projectId}/announcements`, {
        method: 'GET'
      });
    }

    async moderateFeedback(projectId, feedbackId, action, reason = '') {
      return this.request(`/v1/projects/${projectId}/feedback/${feedbackId}/moderate`, {
        method: 'POST',
        body: JSON.stringify({ action, reason })
      });
    }
  }

  // Supabase Integration
  class SupabaseClient {
    constructor(url, key) {
      this.url = url;
      this.key = key;
      this.user = null;
      this.initialized = false;
    }

    async initialize() {
      if (this.initialized) return;
      
      try {
        // Load Supabase client if not already loaded
        if (!window.supabase) {
          await this.loadSupabase();
        }
        
        this.client = window.supabase.createClient(this.url, this.key);
        
        // Get current session
        const { data: { session } } = await this.client.auth.getSession();
        this.user = session?.user || null;
        
        // Listen for auth changes
        this.client.auth.onAuthStateChange((event, session) => {
          this.user = session?.user || null;
          this.onAuthChange?.(this.user);
        });
        
        this.initialized = true;
      } catch (error) {
        console.warn('Supabase initialization failed, using mock auth:', error);
        // Fallback to mock user for demo
        this.user = {
          id: 'demo-user',
          email: 'demo@example.com',
          user_metadata: { name: 'Demo User' }
        };
        this.initialized = true;
      }
    }

    async loadSupabase() {
      return new Promise((resolve, reject) => {
        if (window.supabase) {
          resolve();
          return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    onAuthChange(callback) {
      this.onAuthChange = callback;
    }
  }

  // Storage utilities
  const Storage = {
    getUserKey(userId, key) {
      return `feedbase_${userId}_${key}`;
    },

    getViewedFeatures(userId) {
      if (!userId) return [];
      const stored = localStorage.getItem(this.getUserKey(userId, 'viewed_features'));
      return stored ? JSON.parse(stored) : [];
    },

    markFeatureAsViewed(userId, featureId) {
      if (!userId) return;
      const viewed = this.getViewedFeatures(userId);
      if (!viewed.includes(featureId)) {
        viewed.push(featureId);
        localStorage.setItem(this.getUserKey(userId, 'viewed_features'), JSON.stringify(viewed));
      }
    },

    getSettings(userId) {
      if (!userId) return { notifications: true, position: 'bottom-right' };
      const stored = localStorage.getItem(this.getUserKey(userId, 'settings'));
      return stored ? JSON.parse(stored) : { notifications: true, position: 'bottom-right' };
    },

    saveSettings(userId, settings) {
      if (!userId) return;
      localStorage.setItem(this.getUserKey(userId, 'settings'), JSON.stringify(settings));
    }
  };

  // Widget UI Components
  const UI = {
    createElement(tag, props = {}, children = []) {
      const element = document.createElement(tag);
      
      Object.entries(props).forEach(([key, value]) => {
        if (key === 'className') {
          element.className = value;
        } else if (key === 'onClick') {
          element.addEventListener('click', value);
        } else if (key === 'onChange') {
          element.addEventListener('change', value);
        } else if (key === 'onInput') {
          element.addEventListener('input', value);
        } else {
          element.setAttribute(key, value);
        }
      });
      
      children.forEach(child => {
        if (typeof child === 'string') {
          element.appendChild(document.createTextNode(child));
        } else if (child) {
          element.appendChild(child);
        }
      });
      
      return element;
    },

    createIcon(name, className = 'w-5 h-5') {
      const icons = {
        bell: `<svg class="${className}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5-5V9a5 5 0 1 0-10 0v3l-5 5h5a5 5 0 0 0 10 0z"/></svg>`,
        message: `<svg class="${className}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>`,
        x: `<svg class="${className}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`,
        send: `<svg class="${className}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>`,
        thumbsUp: `<svg class="${className}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2v0a2 2 0 00-2 2v6.5m0 0h0 2m0 0h.01"/></svg>`,
        sparkles: `<svg class="${className}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3l4 6-4 6L3 12l2-3zM19 3l-2 3 2 3 2-3-2-3zM9 3l6 9-6 9-6-9 6-9z"/></svg>`,
        settings: `<svg class="${className}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`
      };
      
      const span = document.createElement('span');
      span.innerHTML = icons[name] || icons.message;
      return span.firstElementChild;
    },

    addStyles() {
      if (document.getElementById('feedbase-widget-styles')) return;
      
      const styles = `
        #feedbase-widget-container * {
          box-sizing: border-box;
        }
        
        .feedbase-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: fadeIn 0.3s ease-out;
        }
        
        .feedbase-modal {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          width: 100%;
          max-width: 32rem;
          max-height: 90vh;
          overflow: hidden;
          animation: slideIn 0.3s ease-out;
        }
        
        .feedbase-feature-modal {
          max-width: 40rem;
        }
        
        .feedbase-modal-header {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
        }
        
        .feedbase-modal-header::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2));
        }
        
        .feedbase-modal-header > * {
          position: relative;
          z-index: 1;
        }
        
        .feedbase-modal-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        
        .feedbase-modal-title h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0;
        }
        
        .feedbase-close-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 0.5rem;
          padding: 0.5rem;
          color: white;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .feedbase-close-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        
        .feedbase-nav {
          display: flex;
          gap: 0.25rem;
        }
        
        .feedbase-nav-btn {
          background: transparent;
          border: none;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .feedbase-nav-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .feedbase-nav-btn.active {
          background: rgba(255, 255, 255, 0.2);
        }
        
        .feedbase-modal-content {
          padding: 1.5rem;
          max-height: calc(90vh - 140px);
          overflow-y: auto;
        }
        
        .feedbase-notification-widget {
          position: fixed;
          z-index: 9999;
        }
        
        .feedbase-notification-widget.bottom-right {
          bottom: 1.5rem;
          right: 1.5rem;
        }
        
        .feedbase-notification-widget.bottom-left {
          bottom: 1.5rem;
          left: 1.5rem;
        }
        
        .feedbase-notification-widget.top-right {
          top: 1.5rem;
          right: 1.5rem;
        }
        
        .feedbase-notification-widget.top-left {
          top: 1.5rem;
          left: 1.5rem;
        }
        
        .feedbase-notification-btn {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          border: none;
          border-radius: 50%;
          width: 3.5rem;
          height: 3.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
          transition: all 0.2s;
          position: relative;
        }
        
        .feedbase-notification-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
        }
        
        .feedbase-badge {
          position: absolute;
          top: -0.5rem;
          right: -0.5rem;
          background: #ef4444;
          color: white;
          border-radius: 50%;
          width: 1.25rem;
          height: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
        }
        
        .feedbase-dropdown {
          position: absolute;
          bottom: 100%;
          right: 0;
          margin-bottom: 0.5rem;
          width: 20rem;
          background: white;
          border-radius: 0.75rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
          border: 1px solid #e5e7eb;
          overflow: hidden;
          animation: slideUp 0.2s ease-out;
        }
        
        .feedbase-dropdown-header {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          padding: 1rem;
        }
        
        .feedbase-dropdown-header h3 {
          margin: 0;
          font-weight: 600;
        }
        
        .feedbase-dropdown-content {
          padding: 1rem;
          max-height: 16rem;
          overflow-y: auto;
        }
        
        .feedbase-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .feedbase-form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .feedbase-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
        }
        
        .feedbase-input,
        .feedbase-select,
        .feedbase-textarea {
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          padding: 0.75rem;
          font-size: 0.875rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        
        .feedbase-input:focus,
        .feedbase-select:focus,
        .feedbase-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .feedbase-textarea {
          resize: vertical;
          min-height: 6rem;
        }
        
        .feedbase-btn {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          border: none;
          border-radius: 0.5rem;
          padding: 0.75rem 1.5rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .feedbase-btn:hover {
          background: linear-gradient(135deg, #2563eb, #7c3aed);
        }
        
        .feedbase-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .feedbase-feedback-item {
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 1rem;
          margin-bottom: 1rem;
          transition: background-color 0.2s;
        }
        
        .feedbase-feedback-item:hover {
          background: #f9fafb;
        }
        
        .feedbase-feedback-title {
          font-weight: 500;
          color: #111827;
          margin: 0 0 0.5rem 0;
        }
        
        .feedbase-feedback-content {
          color: #6b7280;
          font-size: 0.875rem;
          margin: 0 0 0.75rem 0;
        }
        
        .feedbase-feedback-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .feedbase-vote-btn {
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.875rem;
          transition: color 0.2s;
        }
        
        .feedbase-vote-btn:hover {
          color: #3b82f6;
        }
        
        .feedbase-status-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
        }
        
        .feedbase-status-badge.open {
          background: #dcfce7;
          color: #166534;
        }
        
        .feedbase-status-badge.in-progress {
          background: #dbeafe;
          color: #1d4ed8;
        }
        
        .feedbase-status-badge.closed {
          background: #f3f4f6;
          color: #374151;
        }
        
        .feedbase-feature-announcement {
          text-align: center;
        }
        
        .feedbase-feature-image {
          width: 100%;
          height: 12rem;
          object-fit: cover;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }
        
        .feedbase-toggle {
          position: relative;
          display: inline-flex;
          height: 1.5rem;
          width: 2.75rem;
          align-items: center;
          border-radius: 9999px;
          transition: background-color 0.2s;
          cursor: pointer;
          border: none;
        }
        
        .feedbase-toggle.active {
          background: #3b82f6;
        }
        
        .feedbase-toggle.inactive {
          background: #d1d5db;
        }
        
        .feedbase-toggle-thumb {
          display: inline-block;
          height: 1rem;
          width: 1rem;
          transform: translateX(0.25rem);
          border-radius: 50%;
          background: white;
          transition: transform 0.2s;
        }
        
        .feedbase-toggle.active .feedbase-toggle-thumb {
          transform: translateX(1.5rem);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to { 
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideOutRight {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(100%);
          }
        }
        
        .feedbase-toast {
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          font-size: 14px;
        }
      `;
      
      const styleSheet = document.createElement('style');
      styleSheet.id = 'feedbase-widget-styles';
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
    }
  };

  // Main Widget Class
  class FeedbaseWidget {
    constructor(options = {}) {
      this.options = {
        projectId: options.projectId || '',
        apiKey: options.apiKey || process.env?.FEEDBASE_API_KEY || '',
        newFeatures: options.newFeatures || [],
        supabaseUrl: options.supabaseUrl || CONFIG.SUPABASE_URL,
        supabaseKey: options.supabaseKey || CONFIG.SUPABASE_ANON_KEY,
        position: options.position || 'bottom-right',
        ...options
      };

      this.state = {
        isModalOpen: false,
        isNotificationOpen: false,
        currentView: 'feedback', // 'feedback', 'create', 'feature', 'settings', 'admin'
        feedbackList: [],
        newFeedback: { title: '', content: '', category: 'feature-request' },
        newAnnouncement: { title: '', description: '', image: '', type: 'feature' },
        unreadCount: 0,
        currentFeature: null,
        settings: { notifications: true, position: this.options.position },
        user: null,
        isBlocked: false
      };

      this.api = new FeedbaseAPI(this.options.apiKey);
      this.supabase = new SupabaseClient(this.options.supabaseUrl, this.options.supabaseKey);
      this.container = null;

      this.init();
    }

    async init() {
      UI.addStyles();
      await Auth.loadConfig();
      Auth.loadLocalConfig(); // Load any local overrides
      
      await this.supabase.initialize();
      this.state.user = this.supabase.user;
      
      // Check if user is banned
      if (this.state.user && Auth.isBanned(this.state.user.id)) {
        this.state.isBlocked = true;
        this.renderBlockedMessage();
        return;
      }
      
      if (this.state.user) {
        this.state.settings = Storage.getSettings(this.state.user.id);
        this.checkNewFeatures();
        this.loadFeedback();
      }

      this.render();
      
      this.supabase.onAuthChange((user) => {
        this.state.user = user;
        
        // Check if newly authenticated user is banned
        if (user && Auth.isBanned(user.id)) {
          this.state.isBlocked = true;
          this.renderBlockedMessage();
          return;
        }
        
        this.state.isBlocked = false;
        
        if (user) {
          this.state.settings = Storage.getSettings(user.id);
          this.checkNewFeatures();
          this.loadFeedback();
        }
        this.render();
      });
    }

    checkNewFeatures() {
      if (!this.state.user || !this.options.newFeatures.length) return;

      const viewedFeatures = Storage.getViewedFeatures(this.state.user.id);
      const unviewedFeatures = this.options.newFeatures.filter(
        feature => !viewedFeatures.includes(feature.id)
      );

      if (unviewedFeatures.length > 0) {
        this.state.currentFeature = unviewedFeatures[0];
        this.state.currentView = 'feature';
        this.state.isModalOpen = true;
      }

      this.state.unreadCount = unviewedFeatures.length;
    }

    async loadFeedback() {
      try {
        const data = await this.api.getFeedback(this.options.projectId, { 
          limit: 10, 
          status: 'open' 
        });
        this.state.feedbackList = data || [];
      } catch (error) {
        console.error('Error loading feedback:', error);
        // Mock data for demo
        this.state.feedbackList = [
          { 
            id: '1', 
            title: 'Dark mode support', 
            content: 'Would love to see dark mode in the app', 
            votes: 15, 
            status: 'open' 
          },
          { 
            id: '2', 
            title: 'Mobile app', 
            content: 'Native mobile app would be great', 
            votes: 8, 
            status: 'in-progress' 
          }
        ];
      }
    }

    handleFeatureViewed() {
      if (this.state.currentFeature && this.state.user) {
        Storage.markFeatureAsViewed(this.state.user.id, this.state.currentFeature.id);
        this.state.unreadCount = Math.max(0, this.state.unreadCount - 1);
        
        const remainingFeatures = this.options.newFeatures.filter(f => 
          f.id !== this.state.currentFeature.id && 
          !Storage.getViewedFeatures(this.state.user.id).includes(f.id)
        );
        
        if (remainingFeatures.length > 0) {
          this.state.currentFeature = remainingFeatures[0];
        } else {
          this.state.currentFeature = null;
          this.state.isModalOpen = false;
        }
        
        this.render();
      }
    }

    async handleSubmitFeedback() {
      if (!this.state.newFeedback.title.trim() || !this.state.newFeedback.content.trim()) {
        return;
      }

      // Check if user is banned
      if (Auth.isBanned(this.state.user?.id)) {
        this.showToast('You are not authorized to submit feedback.', 'error');
        return;
      }

      try {
        await this.api.createFeedback(this.options.projectId, {
          ...this.state.newFeedback,
          author: this.state.user?.email || 'anonymous'
        });
        
        this.state.newFeedback = { title: '', content: '', category: 'feature-request' };
        this.state.currentView = 'feedback';
        await this.loadFeedback();
        this.showToast('Feedback submitted successfully!', 'success');
      } catch (error) {
        console.error('Error creating feedback:', error);
        // Mock success for demo
        const mockFeedback = {
          id: Date.now().toString(),
          ...this.state.newFeedback,
          votes: 0,
          status: 'open'
        };
        this.state.feedbackList.unshift(mockFeedback);
        this.state.newFeedback = { title: '', content: '', category: 'feature-request' };
        this.state.currentView = 'feedback';
        this.showToast('Feedback submitted successfully!', 'success');
      }
      
      this.render();
    }

    async handleSubmitAnnouncement() {
      if (!this.state.newAnnouncement.title.trim() || !this.state.newAnnouncement.description.trim()) {
        return;
      }

      if (!Auth.canCreateAnnouncement(this.state.user?.id)) {
        alert('You are not authorized to create announcements.');
        return;
      }

      try {
        const announcementData = {
          ...this.state.newAnnouncement,
          id: `announcement-${Date.now()}`,
          createdBy: this.state.user?.id,
          createdAt: new Date().toISOString()
        };

        await this.api.createAnnouncement(this.options.projectId, announcementData);
        
        // Add to local features list
        this.options.newFeatures.unshift(announcementData);
        
        this.state.newAnnouncement = { title: '', description: '', image: '', type: 'feature' };
        this.state.currentView = 'admin';
        
        // Show success message
        this.showToast('Announcement created successfully!', 'success');
        
      } catch (error) {
        console.error('Error creating announcement:', error);
        this.showToast('Failed to create announcement', 'error');
      }
      
      this.render();
    }

    async handleDeleteAnnouncement(announcementId) {
      if (!Auth.canDeleteAnnouncement(this.state.user?.id)) {
        alert('You are not authorized to delete announcements.');
        return;
      }

      if (!confirm('Are you sure you want to delete this announcement?')) {
        return;
      }

      try {
        await this.api.deleteAnnouncement(this.options.projectId, announcementId);
        
        // Remove from local features list
        this.options.newFeatures = this.options.newFeatures.filter(f => f.id !== announcementId);
        
        this.showToast('Announcement deleted successfully!', 'success');
        
      } catch (error) {
        console.error('Error deleting announcement:', error);
        this.showToast('Failed to delete announcement', 'error');
      }
      
      this.render();
    }

    async handleModerateFeedback(feedbackId, action, reason = '') {
      if (!Auth.canModerateFeedback(this.state.user?.id)) {
        alert('You are not authorized to moderate feedback.');
        return;
      }

      try {
        await this.api.moderateFeedback(this.options.projectId, feedbackId, action, reason);
        
        if (action === 'delete') {
          this.state.feedbackList = this.state.feedbackList.filter(f => f.id !== feedbackId);
        } else if (action === 'hide') {
          this.state.feedbackList = this.state.feedbackList.map(f => 
            f.id === feedbackId ? { ...f, status: 'hidden' } : f
          );
        }
        
        this.showToast(`Feedback ${action}d successfully!`, 'success');
        
      } catch (error) {
        console.error('Error moderating feedback:', error);
        this.showToast(`Failed to ${action} feedback`, 'error');
      }
      
      this.render();
    }

    showToast(message, type = 'info') {
      // Create toast notification
      const toast = UI.createElement('div', {
        className: `feedbase-toast feedbase-toast-${type}`,
        style: 'position: fixed; top: 20px; right: 20px; z-index: 10001; padding: 12px 20px; border-radius: 8px; color: white; font-weight: 500; animation: slideInRight 0.3s ease-out;'
      }, [message]);

      // Set background color based on type
      const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
      };
      toast.style.background = colors[type] || colors.info;

      document.body.appendChild(toast);

      // Remove after 3 seconds
      setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }
      `;
      
      const styleSheet = document.createElement('style');
      styleSheet.id = 'feedbase-widget-styles';
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
    }
  };

  // Main Widget Class
  class FeedbaseWidget {
    constructor(options = {}) {
      this.options = {
        projectId: options.projectId || '',
        apiKey: options.apiKey || process.env?.FEEDBASE_API_KEY || '',
        newFeatures: options.newFeatures || [],
        supabaseUrl: options.supabaseUrl || CONFIG.SUPABASE_URL,
        supabaseKey: options.supabaseKey || CONFIG.SUPABASE_ANON_KEY,
        position: options.position || 'bottom-right',
        ...options
      };

      this.state = {
        isModalOpen: false,
        isNotificationOpen: false,
        currentView: 'feedback', // 'feedback', 'create', 'feature', 'settings', 'admin'
        feedbackList: [],
        newFeedback: { title: '', content: '', category: 'feature-request' },
        newAnnouncement: { title: '', description: '', image: '', type: 'feature' },
        unreadCount: 0,
        currentFeature: null,
        settings: { notifications: true, position: this.options.position },
        user: null,
        isBlocked: false
      };

      this.api = new FeedbaseAPI(this.options.apiKey);
      this.supabase = new SupabaseClient(this.options.supabaseUrl, this.options.supabaseKey);
      this.container = null;

      this.init();
    }

    async init() {
      UI.addStyles();
      await Auth.loadConfig();
      Auth.loadLocalConfig(); // Load any local overrides
      
      await this.supabase.initialize();
      this.state.user = this.supabase.user;
      
      // Check if user is banned
      if (this.state.user && Auth.isBanned(this.state.user.id)) {
        this.state.isBlocked = true;
        this.renderBlockedMessage();
        return;
      }
      
      if (this.state.user) {
        this.state.settings = Storage.getSettings(this.state.user.id);
        this.checkNewFeatures();
        this.loadFeedback();
      }

      this.render();
      
      this.supabase.onAuthChange((user) => {
        this.state.user = user;
        
        // Check if newly authenticated user is banned
        if (user && Auth.isBanned(user.id)) {
          this.state.isBlocked = true;
          this.renderBlockedMessage();
          return;
        }
        
        this.state.isBlocked = false;
        
        if (user) {
          this.state.settings = Storage.getSettings(user.id);
          this.checkNewFeatures();
          this.loadFeedback();
        }
        this.render();
      });
    }

    checkNewFeatures() {
      if (!this.state.user || !this.options.newFeatures.length) return;

      const viewedFeatures = Storage.getViewedFeatures(this.state.user.id);
      const unviewedFeatures = this.options.newFeatures.filter(
        feature => !viewedFeatures.includes(feature.id)
      );

      if (unviewedFeatures.length > 0) {
        this.state.currentFeature = unviewedFeatures[0];
        this.state.currentView = 'feature';
        this.state.isModalOpen = true;
      }

      this.state.unreadCount = unviewedFeatures.length;
    }

    async loadFeedback() {
      try {
        const data = await this.api.getFeedback(this.options.projectId, { 
          limit: 10, 
          status: 'open' 
        });
        this.state.feedbackList = data || [];
      } catch (error) {
        console.error('Error loading feedback:', error);
        // Mock data for demo
        this.state.feedbackList = [
          { 
            id: '1', 
            title: 'Dark mode support', 
            content: 'Would love to see dark mode in the app', 
            votes: 15, 
            status: 'open' 
          },
          { 
            id: '2', 
            title: 'Mobile app', 
            content: 'Native mobile app would be great', 
            votes: 8, 
            status: 'in-progress' 
          }
        ];
      }
    }

    handleFeatureViewed() {
      if (this.state.currentFeature && this.state.user) {
        Storage.markFeatureAsViewed(this.state.user.id, this.state.currentFeature.id);
        this.state.unreadCount = Math.max(0, this.state.unreadCount - 1);
        
        const remainingFeatures = this.options.newFeatures.filter(f => 
          f.id !== this.state.currentFeature.id && 
          !Storage.getViewedFeatures(this.state.user.id).includes(f.id)
        );
        
        if (remainingFeatures.length > 0) {
          this.state.currentFeature = remainingFeatures[0];
        } else {
          this.state.currentFeature = null;
          this.state.isModalOpen = false;
        }
        
        this.render();
      }
    }

    async handleSubmitAnnouncement() {
      if (!this.state.newAnnouncement.title.trim() || !this.state.newAnnouncement.description.trim()) {
        return;
      }

      if (!Auth.canCreateAnnouncement(this.state.user?.id)) {
        alert('You are not authorized to create announcements.');
        return;
      }

      try {
        const announcementData = {
          ...this.state.newAnnouncement,
          id: `announcement-${Date.now()}`,
          createdBy: this.state.user?.id,
          createdAt: new Date().toISOString()
        };

        await this.api.createAnnouncement(this.options.projectId, announcementData);
        
        // Add to local features list
        this.options.newFeatures.unshift(announcementData);
        
        this.state.newAnnouncement = { title: '', description: '', image: '', type: 'feature' };
        this.state.currentView = 'admin';
        
        // Show success message
        this.showToast('Announcement created successfully!', 'success');
        
      } catch (error) {
        console.error('Error creating announcement:', error);
        this.showToast('Failed to create announcement', 'error');
      }
      
      this.render();
    }

    async handleDeleteAnnouncement(announcementId) {
      if (!Auth.canDeleteAnnouncement(this.state.user?.id)) {
        alert('You are not authorized to delete announcements.');
        return;
      }

      if (!confirm('Are you sure you want to delete this announcement?')) {
        return;
      }

      try {
        await this.api.deleteAnnouncement(this.options.projectId, announcementId);
        
        // Remove from local features list
        this.options.newFeatures = this.options.newFeatures.filter(f => f.id !== announcementId);
        
        this.showToast('Announcement deleted successfully!', 'success');
        
      } catch (error) {
        console.error('Error deleting announcement:', error);
        this.showToast('Failed to delete announcement', 'error');
      }
      
      this.render();
    }

    async handleModerateFeedback(feedbackId, action, reason = '') {
      if (!Auth.canModerateFeedback(this.state.user?.id)) {
        alert('You are not authorized to moderate feedback.');
        return;
      }

      try {
        await this.api.moderateFeedback(this.options.projectId, feedbackId, action, reason);
        
        if (action === 'delete') {
          this.state.feedbackList = this.state.feedbackList.filter(f => f.id !== feedbackId);
        } else if (action === 'hide') {
          this.state.feedbackList = this.state.feedbackList.map(f => 
            f.id === feedbackId ? { ...f, status: 'hidden' } : f
          );
        }
        
        this.showToast(`Feedback ${action}d successfully!`, 'success');
        
      } catch (error) {
        console.error('Error moderating feedback:', error);
        this.showToast(`Failed to ${action} feedback`, 'error');
      }
      
      this.render();
    }

    async handleSubmitFeedback() {
      if (!this.state.newFeedback.title.trim() || !this.state.newFeedback.content.trim()) {
        return;
      }

      // Check if user is banned
      if (Auth.isBanned(this.state.user?.id)) {
        this.showToast('You are not authorized to submit feedback.', 'error');
        return;
      }

      try {
        await this.api.createFeedback(this.options.projectId, {
          ...this.state.newFeedback,
          author: this.state.user?.email || 'anonymous'
        });
        
        this.state.newFeedback = { title: '', content: '', category: 'feature-request' };
        this.state.currentView = 'feedback';
        await this.loadFeedback();
        this.showToast('Feedback submitted successfully!', 'success');
      } catch (error) {
        console.error('Error creating feedback:', error);
        // Mock success for demo
        const mockFeedback = {
          id: Date.now().toString(),
          ...this.state.newFeedback,
          votes: 0,
          status: 'open'
        };
        this.state.feedbackList.unshift(mockFeedback);
        this.state.newFeedback = { title: '', content: '', category: 'feature-request' };
        this.state.currentView = 'feedback';
        this.showToast('Feedback submitted successfully!', 'success');
      }
      
      this.render();
    }

    async handleVote(feedbackId, voteType) {
      try {
        await this.api.voteFeedback(this.options.projectId, feedbackId, { type: voteType });
        
        this.state.feedbackList = this.state.feedbackList.map(item => 
          item.id === feedbackId 
            ? { ...item, votes: item.votes + (voteType === 'upvote' ? 1 : -1) }
            : item
        );
        
        this.render();
      } catch (error) {
        console.error('Error voting:', error);
      }
    }

    updateSettings(newSettings) {
      this.state.settings = { ...this.state.settings, ...newSettings };
      if (this.state.user) {
        Storage.saveSettings(this.state.user.id, this.state.settings);
      }
      this.render();
    }

    createFeatureModal() {
      if (!this.state.currentFeature) return null;

      const modal = UI.createElement('div', { 
        className: 'feedbase-modal-overlay',
        onClick: (e) => {
          if (e.target === e.currentTarget) {
            this.state.isModalOpen = false;
            this.render();
          }
        }
      });

      const modalContent = UI.createElement('div', { 
        className: 'feedbase-modal feedbase-feature-modal' 
      });

      const header = UI.createElement('div', { className: 'feedbase-modal-header' });
      const titleRow = UI.createElement('div', { className: 'feedbase-modal-title' });
      
      const titleLeft = UI.createElement('div', { className: 'flex items-center gap-3' });
      titleLeft.appendChild(UI.createIcon('sparkles', 'w-6 h-6'));
      titleLeft.appendChild(UI.createElement('div', {}, [
        UI.createElement('h2', {}, ['New Feature!']),
        UI.createElement('p', { className: 'text-blue-100 text-sm mt-1' }, ['We\'ve got something exciting to show you'])
      ]));

      const closeBtn = UI.createElement('button', {
        className: 'feedbase-close-btn',
        onClick: () => {
          this.state.isModalOpen = false;
          this.render();
        }
      });
      closeBtn.appendChild(UI.createIcon('x', 'w-5 h-5'));

      titleRow.appendChild(titleLeft);
      titleRow.appendChild(closeBtn);
      header.appendChild(titleRow);

      const content = UI.createElement('div', { className: 'feedbase-modal-content feedbase-feature-announcement' });
      
      content.appendChild(UI.createElement('h3', { 
        className: 'text-xl font-semibold text-gray-900 mb-3' 
      }, [this.state.currentFeature.title]));
      
      content.appendChild(UI.createElement('p', { 
        className: 'text-gray-600 leading-relaxed mb-6' 
      }, [this.state.currentFeature.description]));

      if (this.state.currentFeature.image) {
        content.appendChild(UI.createElement('img', {
          src: this.state.currentFeature.image,
          alt: this.state.currentFeature.title,
          className: 'feedbase-feature-image'
        }));
      }

      const actions = UI.createElement('div', { className: 'flex items-center gap-3' });
      
      const gotItBtn = UI.createElement('button', {
        className: 'feedbase-btn flex-1',
        onClick: () => this.handleFeatureViewed()
      });
      gotItBtn.appendChild(UI.createIcon('sparkles', 'w-4 h-4'));
      gotItBtn.appendChild(document.createTextNode('Got it, thanks!'));
      
      const feedbackBtn = UI.createElement('button', {
        className: 'px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors',
        onClick: () => {
          this.state.currentView = 'create';
          this.handleFeatureViewed();
        }
      }, ['Give Feedback']);

      actions.appendChild(gotItBtn);
      actions.appendChild(feedbackBtn);
      content.appendChild(actions);

      modalContent.appendChild(header);
      modalContent.appendChild(content);
      modal.appendChild(modalContent);

      return modal;
    }

    createMainModal() {
      const modal = UI.createElement('div', { 
        className: 'feedbase-modal-overlay',
        onClick: (e) => {
          if (e.target === e.currentTarget) {
            this.state.isModalOpen = false;
            this.render();
          }
        }
      });

      const modalContent = UI.createElement('div', { className: 'feedbase-modal' });

      // Header
      const header = UI.createElement('div', { className: 'feedbase-modal-header' });
      const titleRow = UI.createElement('div', { className: 'feedbase-modal-title' });
      
      const titleLeft = UI.createElement('div', { className: 'flex items-center gap-3' });
      titleLeft.appendChild(UI.createIcon('message', 'w-6 h-6'));
      
      const titleText = {
        'create': 'Share Your Feedback',
        'settings': 'Widget Settings',
        'feedback': 'Feedback'
      }[this.state.currentView] || 'Feedback';
      
      titleLeft.appendChild(UI.createElement('h2', {}, [titleText]));

      const closeBtn = UI.createElement('button', {
        className: 'feedbase-close-btn',
        onClick: () => {
          this.state.isModalOpen = false;
          this.render();
        }
      });
      closeBtn.appendChild(UI.createIcon('x', 'w-5 h-5'));

      titleRow.appendChild(titleLeft);
      titleRow.appendChild(closeBtn);

      // Navigation
      const nav = UI.createElement('div', { className: 'feedbase-nav' });
      
      const navItems = ['feedback', 'create'];
      
      // Add admin tab for authorized users
      if (Auth.isAdmin(this.state.user?.id)) {
        navItems.push('admin');
      }
      
      navItems.push('settings');
      
      navItems.forEach(view => {
        const btn = UI.createElement('button', {
          className: `feedbase-nav-btn ${this.state.currentView === view ? 'active' : ''}`,
          onClick: () => {
            this.state.currentView = view;
            this.render();
          }
        }, [view.charAt(0).toUpperCase() + view.slice(1)]);
        nav.appendChild(btn);
      });

      header.appendChild(titleRow);
      header.appendChild(nav);

      // Content
      const content = UI.createElement('div', { className: 'feedbase-modal-content' });
      
      if (this.state.currentView === 'feedback') {
        content.appendChild(this.createFeedbackList());
      } else if (this.state.currentView === 'create') {
        content.appendChild(this.createFeedbackForm());
      } else if (this.state.currentView === 'admin') {
        content.appendChild(this.createAdminPanel());
      } else if (this.state.currentView === 'settings') {
        content.appendChild(this.createSettingsForm());
      }

      modalContent.appendChild(header);
      modalContent.appendChild(content);
      modal.appendChild(modalContent);

      return modal;
    }

    createFeedbackList() {
      const container = UI.createElement('div', { className: 'space-y-4' });

      this.state.feedbackList.forEach(item => {
        const feedbackItem = UI.createElement('div', { 
          className: 'feedbase-feedback-item' 
        });

        const title = UI.createElement('h3', { 
          className: 'feedbase-feedback-title' 
        }, [item.title]);

        const content = UI.createElement('p', { 
          className: 'feedbase-feedback-content' 
        }, [item.content]);

        const meta = UI.createElement('div', { 
          className: 'feedbase-feedback-meta' 
        });

        const voteBtn = UI.createElement('button', {
          className: 'feedbase-vote-btn',
          onClick: () => this.handleVote(item.id, 'upvote')
        });
        voteBtn.appendChild(UI.createIcon('thumbsUp', 'w-4 h-4'));
        voteBtn.appendChild(document.createTextNode(item.votes.toString()));

        const statusBadge = UI.createElement('span', {
          className: `feedbase-status-badge ${item.status}`
        }, [item.status.replace('-', ' ')]);

        meta.appendChild(voteBtn);
        meta.appendChild(statusBadge);

        // Add moderation controls for admins
        if (Auth.canModerateFeedback(this.state.user?.id)) {
          const moderateBtn = UI.createElement('button', {
            className: 'text-red-600 text-sm hover:underline ml-4',
            onClick: () => {
              const action = confirm('Delete this feedback item?') ? 'delete' : 
                          confirm('Hide this feedback item?') ? 'hide' : null;
              if (action) {
                this.handleModerateFeedback(item.id, action);
              }
            }
          }, ['Moderate']);
          meta.appendChild(moderateBtn);
        }

        feedbackItem.appendChild(title);
        feedbackItem.appendChild(content);
        feedbackItem.appendChild(meta);
        container.appendChild(feedbackItem);
      });

      return container;
    }

    createFeedbackForm() {
      const form = UI.createElement('div', { className: 'feedbase-form' });

      // Title input
      const titleGroup = UI.createElement('div', { className: 'feedbase-form-group' });
      titleGroup.appendChild(UI.createElement('label', { 
        className: 'feedbase-label' 
      }, ['Title']));
      
      const titleInput = UI.createElement('input', {
        type: 'text',
        className: 'feedbase-input',
        placeholder: 'Brief title for your feedback...',
        value: this.state.newFeedback.title,
        onInput: (e) => {
          this.state.newFeedback.title = e.target.value;
        }
      });
      titleGroup.appendChild(titleInput);

      // Category select
      const categoryGroup = UI.createElement('div', { className: 'feedbase-form-group' });
      categoryGroup.appendChild(UI.createElement('label', { 
        className: 'feedbase-label' 
      }, ['Category']));
      
      const categorySelect = UI.createElement('select', {
        className: 'feedbase-select',
        value: this.state.newFeedback.category,
        onChange: (e) => {
          this.state.newFeedback.category = e.target.value;
        }
      });
      
      ['feature-request', 'bug-report', 'improvement', 'question'].forEach(option => {
        const optionEl = UI.createElement('option', { value: option }, [
          option.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        ]);
        categorySelect.appendChild(optionEl);
      });
      categoryGroup.appendChild(categorySelect);

      // Content textarea
      const contentGroup = UI.createElement('div', { className: 'feedbase-form-group' });
      contentGroup.appendChild(UI.createElement('label', { 
        className: 'feedbase-label' 
      }, ['Description']));
      
      const contentTextarea = UI.createElement('textarea', {
        className: 'feedbase-textarea',
        placeholder: 'Describe your feedback in detail...',
        value: this.state.newFeedback.content,
        onInput: (e) => {
          this.state.newFeedback.content = e.target.value;
        }
      });
      contentGroup.appendChild(contentTextarea);

      // Submit button
      const submitBtn = UI.createElement('button', {
        className: 'feedbase-btn',
        disabled: !this.state.newFeedback.title.trim() || !this.state.newFeedback.content.trim(),
        onClick: () => this.handleSubmitFeedback()
      });
      submitBtn.appendChild(UI.createIcon('send', 'w-4 h-4'));
      submitBtn.appendChild(document.createTextNode('Submit Feedback'));

      form.appendChild(titleGroup);
      form.appendChild(categoryGroup);
      form.appendChild(contentGroup);
      form.appendChild(submitBtn);

      return form;
    }

    createSettingsForm() {
      const form = UI.createElement('div', { className: 'feedbase-form' });

      // Notifications toggle
      const notificationGroup = UI.createElement('div', { 
        className: 'flex items-center justify-between' 
      });
      
      notificationGroup.appendChild(UI.createElement('label', { 
        className: 'feedbase-label' 
      }, ['Show notifications']));

      const notificationToggle = UI.createElement('button', {
        className: `feedbase-toggle ${this.state.settings.notifications ? 'active' : 'inactive'}`,
        onClick: () => {
          this.updateSettings({ notifications: !this.state.settings.notifications });
        }
      });
      notificationToggle.appendChild(UI.createElement('span', { 
        className: 'feedbase-toggle-thumb' 
      }));
      
      notificationGroup.appendChild(notificationToggle);

      // Position select
      const positionGroup = UI.createElement('div', { className: 'feedbase-form-group' });
      positionGroup.appendChild(UI.createElement('label', { 
        className: 'feedbase-label' 
      }, ['Widget position']));
      
      const positionSelect = UI.createElement('select', {
        className: 'feedbase-select',
        value: this.state.settings.position,
        onChange: (e) => {
          this.updateSettings({ position: e.target.value });
        }
      });
      
      [
        { value: 'bottom-right', label: 'Bottom Right' },
        { value: 'bottom-left', label: 'Bottom Left' },
        { value: 'top-right', label: 'Top Right' },
        { value: 'top-left', label: 'Top Left' }
      ].forEach(option => {
        const optionEl = UI.createElement('option', { 
          value: option.value 
        }, [option.label]);
        positionSelect.appendChild(optionEl);
      });
      positionGroup.appendChild(positionSelect);

      form.appendChild(notificationGroup);
      form.appendChild(positionGroup);

      return form;
    }

    createNotificationWidget() {
      if (!this.state.settings.notifications) return null;

      const widget = UI.createElement('div', { 
        className: `feedbase-notification-widget ${this.state.settings.position}` 
      });

      const btn = UI.createElement('button', {
        className: 'feedbase-notification-btn',
        onClick: () => {
          this.state.isNotificationOpen = !this.state.isNotificationOpen;
          this.render();
        }
      });

      btn.appendChild(UI.createIcon('bell', 'w-6 h-6'));

      if (this.state.unreadCount > 0) {
        const badge = UI.createElement('span', { 
          className: 'feedbase-badge' 
        }, [this.state.unreadCount > 9 ? '9+' : this.state.unreadCount.toString()]);
        btn.appendChild(badge);
      }

      widget.appendChild(btn);

      // Dropdown
      if (this.state.isNotificationOpen) {
        const dropdown = UI.createElement('div', { className: 'feedbase-dropdown' });

        const dropdownHeader = UI.createElement('div', { 
          className: 'feedbase-dropdown-header' 
        });
        dropdownHeader.appendChild(UI.createElement('h3', {}, ['Feedback & Updates']));

        const dropdownContent = UI.createElement('div', { 
          className: 'feedbase-dropdown-content' 
        });

        // New features notification
        if (this.state.unreadCount > 0) {
          const featureNotif = UI.createElement('div', { 
            className: 'bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3' 
          });
          
          const featureHeader = UI.createElement('div', { 
            className: 'flex items-center gap-2 text-blue-800 mb-1' 
          });
          featureHeader.appendChild(UI.createIcon('sparkles', 'w-4 h-4'));
          featureHeader.appendChild(UI.createElement('span', { 
            className: 'font-medium' 
          }, ['New Features!']));

          const featureText = UI.createElement('p', { 
            className: 'text-blue-700 text-sm' 
          }, [`${this.state.unreadCount} new feature${this.state.unreadCount > 1 ? 's' : ''} available`]);

          const featureBtn = UI.createElement('button', {
            className: 'text-blue-600 text-sm font-medium hover:underline mt-1',
            onClick: () => {
              this.state.isModalOpen = true;
              this.state.currentView = 'feature';
              this.state.isNotificationOpen = false;
              this.render();
            }
          }, ['View details →']);

          featureNotif.appendChild(featureHeader);
          featureNotif.appendChild(featureText);
          featureNotif.appendChild(featureBtn);
          dropdownContent.appendChild(featureNotif);
        }

        // Menu items
        const menuContainer = UI.createElement('div', {});

        const browseFeedbackBtn = UI.createElement('button', {
          className: 'w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors',
          onClick: () => {
            this.state.isModalOpen = true;
            this.state.currentView = 'feedback';
            this.state.isNotificationOpen = false;
            this.render();
          }
        });
        
        const browseFeedbackContent = UI.createElement('div', {});
        browseFeedbackContent.appendChild(UI.createElement('div', { 
          className: 'font-medium text-gray-900' 
        }, ['Browse Feedback']));
        browseFeedbackContent.appendChild(UI.createElement('div', { 
          className: 'text-sm text-gray-600' 
        }, ['See what others are saying']));
        browseFeedbackBtn.appendChild(browseFeedbackContent);

        const shareFeedbackBtn = UI.createElement('button', {
          className: 'w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors',
          onClick: () => {
            this.state.isModalOpen = true;
            this.state.currentView = 'create';
            this.state.isNotificationOpen = false;
            this.render();
          }
        });
        
        const shareFeedbackContent = UI.createElement('div', {});
        shareFeedbackContent.appendChild(UI.createElement('div', { 
          className: 'font-medium text-gray-900' 
        }, ['Share Feedback']));
        shareFeedbackContent.appendChild(UI.createElement('div', { 
          className: 'text-sm text-gray-600' 
        }, ['Tell us what you think']));
        shareFeedbackBtn.appendChild(shareFeedbackContent);

        menuContainer.appendChild(browseFeedbackBtn);
        menuContainer.appendChild(shareFeedbackBtn);
        dropdownContent.appendChild(menuContainer);

        dropdown.appendChild(dropdownHeader);
        dropdown.appendChild(dropdownContent);
        widget.appendChild(dropdown);
      }

      return widget;
    }

    render() {
      // Don't render if user is blocked
      if (this.state.isBlocked) {
        return;
      }

      // Create container if it doesn't exist
      if (!this.container) {
        this.container = document.getElementById(CONFIG.WIDGET_ID);
        if (!this.container) {
          this.container = document.createElement('div');
          this.container.id = CONFIG.WIDGET_ID;
          document.body.appendChild(this.container);
        }
      }

      // Clear container
      this.container.innerHTML = '';

      // Render modals
      if (this.state.isModalOpen) {
        if (this.state.currentView === 'feature' && this.state.currentFeature) {
          this.container.appendChild(this.createFeatureModal());
        } else if (this.state.currentView !== 'feature') {
          this.container.appendChild(this.createMainModal());
        }
      }

      // Render notification widget
      const notificationWidget = this.createNotificationWidget();
      if (notificationWidget) {
        this.container.appendChild(notificationWidget);
      }

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.feedbase-notification-widget') && this.state.isNotificationOpen) {
          this.state.isNotificationOpen = false;
          this.render();
        }
      });
    }

    // Public API
    addFeature(feature) {
      this.options.newFeatures.push(feature);
      if (this.state.user) {
        this.checkNewFeatures();
        this.render();
      }
    }

    updateConfig(newConfig) {
      this.options = { ...this.options, ...newConfig };
      if (newConfig.apiKey) {
        this.api = new FeedbaseAPI(newConfig.apiKey);
      }
      this.render();
    }

    destroy() {
      if (this.container) {
        this.container.remove();
      }
      const styles = document.getElementById('feedbase-widget-styles');
      if (styles) {
        styles.remove();
      }
    }
  }

  // Auto-initialization function
  function initFeedbaseWidget(options = {}) {
    // Get API key from environment or options
    const apiKey = options.apiKey || 
                   (typeof process !== 'undefined' && process.env?.FEEDBASE_API_KEY) ||
                   (typeof window !== 'undefined' && window.FEEDBASE_API_KEY);

    if (!apiKey) {
      console.warn('Feedbase API key not found. Set FEEDBASE_API_KEY environment variable or pass apiKey in options.');
    }

    const config = {
      apiKey,
      projectId: options.projectId || 'demo-project',
      newFeatures: options.newFeatures || [],
      supabaseUrl: options.supabaseUrl || CONFIG.SUPABASE_URL,
      supabaseKey: options.supabaseKey || CONFIG.SUPABASE_ANON_KEY,
      ...options
    };

    return new FeedbaseWidget(config);
  }

  // Export for different environments
  if (typeof module !== 'undefined' && module.exports) {
    // Node.js
    module.exports = { FeedbaseWidget, initFeedbaseWidget };
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define([], function() {
      return { FeedbaseWidget, initFeedbaseWidget };
    });
  } else {
    // Browser global
    window.FeedbaseWidget = FeedbaseWidget;
    window.initFeedbaseWidget = initFeedbaseWidget;
    
    // Auto-initialize if data attributes are present
    document.addEventListener('DOMContentLoaded', function() {
      const autoInit = document.querySelector('[data-feedbase-auto-init]');
      if (autoInit) {
        const options = {
          projectId: autoInit.dataset.feedbaseProjectId,
          apiKey: autoInit.dataset.feedbaseApiKey,
          supabaseUrl: autoInit.dataset.feedbaseSupabaseUrl,
          supabaseKey: autoInit.dataset.feedbaseSupabaseKey
        };
        
        // Parse new features from JSON
        if (autoInit.dataset.feedbaseNewFeatures) {
          try {
            options.newFeatures = JSON.parse(autoInit.dataset.feedbaseNewFeatures);
          } catch (e) {
            console.warn('Invalid JSON in data-feedbase-new-features');
          }
        }
        
        window.feedbaseWidget = initFeedbaseWidget(options);
      }
    });
  }

})();

// Usage examples:

/* 
// Method 1: Single line integration from CDN
<script src="https://raw.githubusercontent.com/yourusername/repo/main/feedbase-widget.js"></script>
<div data-feedbase-auto-init 
     data-feedbase-project-id="your-project-id"
     data-feedbase-api-key="your-api-key"
     data-feedbase-supabase-url="your-supabase-url"
     data-feedbase-supabase-key="your-supabase-key"
     data-feedbase-new-features='[{"id":"feature-1","title":"New Feature","description":"Description"}]'>
</div>

// Method 2: Programmatic initialization
const widget = initFeedbaseWidget({
  projectId: 'your-project-id',
  apiKey: process.env.FEEDBASE_API_KEY,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  newFeatures: [
    {
      id: 'feature-1',
      title: 'New Dashboard',
      description: 'We redesigned the dashboard!',
      image: 'https://example.com/image.jpg'
    }
  ]
});

// Method 3: Dynamic feature addition
widget.addFeature({
  id: 'feature-2',
  title: 'New API',
  description: 'Check out our new API endpoints'
});

// Method 4: Next.js integration
// pages/_app.js
import { useEffect } from 'react';

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://raw.githubusercontent.com/yourusername/repo/main/feedbase-widget.js';
    script.onload = () => {
      window.feedbaseWidget = window.initFeedbaseWidget({
        projectId: process.env.NEXT_PUBLIC_FEEDBASE_PROJECT_ID,
        apiKey: process.env.FEEDBASE_API_KEY,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        newFeatures: []
      });
    };
    document.head.appendChild(script);
    
    return () => {
      if (window.feedbaseWidget) {
        window.feedbaseWidget.destroy();
      }
    };
  }, []);

  return <Component {...pageProps} />;
}
*/
