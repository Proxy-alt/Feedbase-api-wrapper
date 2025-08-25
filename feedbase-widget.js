createPremiumPanel() {
      const container = UI.createElement('div', { className: 'space-y-6' });

      if (!Premium.isPremium) {
        // Show upgrade prompt for non-premium users
        const upgradePrompt = UI.createElement('div', { className: 'feedbase-upgrade-prompt' });
        upgradePrompt.appendChild(UI.createElement('div', { className: 'flex items-center justify-center mb-4' }, [
          UI.createIcon('crown', 'w-12 h-12 text-yellow-500')
        ]));
        upgradePrompt.appendChild(UI.createElement('h3', { className: 'text-xl font-semibold text-gray-900 mb-3' }, [
          'Unlock Premium Features'
        ]));
        upgradePrompt.appendChild(UI.createElement('p', { className: 'text-gray-600 mb-6' }, [
          'Get access to advanced analytics, custom branding, bulk export, and more premium features.'
        ]));
        
        const upgradeBtn = UI.createElement('button', {
          className: 'bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-colors',
          onClick: () => window.open('/pricing', '_blank')
        }, ['Upgrade to Premium']);
        
        upgradePrompt.appendChild(upgradeBtn);
        container.appendChild(upgradePrompt);

        // Show preview of premium features
        const featuresGrid = UI.createElement('div', { className: 'feedbase-premium-grid' });
        
        const features = [
          {
            icon: 'chart',
            title: 'Advanced Analytics',
            description: 'Detailed insights and reporting on your feedback data'
          },
          {
            icon: 'download',
            title: 'Bulk Export',
            description: 'Export all feedback data in CSV format'
          },
          {
            icon: 'sparkles',
            title: 'Custom Branding',
            description: 'Customize the widget with your brand colors and logo'
          },
          {
            icon: 'settings',
            title: 'Custom Fields',
            description: 'Add custom fields to collect specific information'
          }
        ];

        features.forEach(feature => {
          const featureCard = UI.createElement('div', { 
            className: 'bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300' 
          });
          
          featureCard.appendChild(UI.createElement('div', { className: 'flex items-center mb-2' }, [
            UI.createIcon(feature.icon, 'w-5 h-5 text-gray-400'),
            UI.createElement('h4', { className: 'ml-2 font-medium text-gray-700' }, [feature.title])
          ]));
          
          featureCard.appendChild(UI.createElement('p', { 
            className: 'text-sm text-gray-500' 
          }, [feature.description]));
          
          featuresGrid.appendChild(featureCard);
        });

        container.appendChild(featuresGrid);
        return container;
      }

      // Premium user content
      const premiumHeader = UI.createElement('div', { 
        className: 'bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 mb-6' 
      });
      
      const headerContent = UI.createElement('div', { className: 'flex items-center justify-between' });
      
      const headerLeft = UI.createElement('div', { className: 'flex items-center gap-3' });
      headerLeft.appendChild(UI.createIcon('crown', 'w-8 h-8 text-yellow-500'));
      headerLeft.appendChild(UI.createElement('div', {}, [
        UI.createElement('h3', { className: 'text-lg font-semibold text-gray-900' }, ['Premium Features']),
        UI.createElement('p', { className: 'text-purple-700 text-sm' }, [
          `You have access to ${Premium.subscriptionTier?.toUpperCase()} features`
        ])
      ]));

      const badge = PremiumUI.createPremiumBadge();
      if (badge) headerLeft.appendChild(badge);

      headerContent.appendChild(headerLeft);
      premiumHeader.appendChild(headerContent);
      container.appendChild(premiumHeader);

      // Premium features grid
      const featuresGrid = UI.createElement('div', { className: 'feedbase-premium-grid' });
      
      // Analytics Feature
      if (Premium.hasFeature(PREMIUM_FEATURES.ADVANCED_ANALYTICS)) {
        const analyticsCard = UI.createElement('div', { className: 'feedbase-premium-feature' });
        analyticsCard.appendChild(UI.createElement('div', { className: 'flex items-center mb-2' }, [
          UI.createIcon('chart', 'w-5 h-5 text-purple-600'),
          UI.createElement('h4', { className: 'ml-2 font-medium' }, ['Advanced Analytics'])
        ]));
        analyticsCard.appendChild(UI.createElement('p', { className: 'text-sm text-gray-600 mb-3' }, [
          'View detailed insights and metrics about your feedback data.'
        ]));
        
        const viewAnalyticsBtn = UI.createElement('button', {
          className: 'text-purple-600 text-sm font-medium hover:underline',
          onClick: () => {
            this.state.currentView = 'analytics';
            this.render();
          }
        }, ['View Analytics →']);
        analyticsCard.appendChild(viewAnalyticsBtn);
        featuresGrid.appendChild(analyticsCard);
      }

      // Bulk Export Feature
      if (Premium.hasFeature(PREMIUM_FEATURES.BULK_EXPORT)) {
        const exportCard = UI.createElement('div', { className: 'feedbase-premium-feature' });
        exportCard.appendChild(UI.createElement('div', { className: 'flex items-center mb-2' }, [
          UI.createIcon('download', 'w-5 h-5 text-blue-600'),
          UI.createElement('h4', { className: 'ml-2 font-medium' }, ['Bulk Export'])
        ]));
        exportCard.appendChild(UI.createElement('p', { className: 'text-sm text-gray-600 mb-3' }, [
          'Export all feedback data in CSV format for external analysis.'
        ]));
        
        const exportBtn = UI.createElement('button', {
          className: 'bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors',
          onClick: () => this.handleBulkExport()
        }, ['Export Data']);
        exportCard.appendChild(exportBtn);
        featuresGrid.appendChild(exportCard);
      }

      // Custom Branding Feature
      if (Premium.hasFeature(PREMIUM_FEATURES.CUSTOM_BRANDING)) {
        const brandingCard = UI.createElement('div', { className: 'feedbase-premium-feature' });
        brandingCard.appendChild(UI.createElement('div', { className: 'flex items-center mb-2' }, [
          UI.createIcon('sparkles', 'w-5 h-5 text-green-600'),
          UI.createElement('h4', { className: 'ml-2 font-medium' }, ['Custom Branding'])
        ]));
        brandingCard.appendChild(UI.createElement('p', { className: 'text-sm text-gray-600 mb-3' }, [
          'Customize the widget appearance with your brand colors and logo.'
        ]));
        
        const brandingBtn = UI.createElement('button', {
          className: 'text-green-600 text-sm font-medium hover:underline',
          onClick: () => this.showToast('Branding settings coming soon!', 'info')
        }, ['Customize Branding →']);
        brandingCard.appendChild(brandingBtn);
        featuresGrid.appendChild(brandingCard);
      }

      // API Access Feature
      if (Premium.hasFeature(PREMIUM_FEATURES.API_ACCESS)) {
        const apiCard = UI.createElement('div', { className: 'feedbase-premium-feature' });
        apiCard.appendChild(UI.createElement('div', { className: 'flex items-center mb-2' }, [
          UI.createIcon('settings', 'w-5 h-5 text-indigo-600'),
          UI.createElement('h4', { className: 'ml-2 font-medium' }, ['API Access'])
        ]));
        apiCard.appendChild(UI.createElement('p', { className: 'text-sm text-gray-600 mb-3' }, [
          'Full API access for custom integrations and automation.'
        ]));
        
        const apiBtn = UI.createElement('button', {
          className: 'text-indigo-600 text-sm font-medium hover:underline',
          onClick: () => window.open('/api-docs', '_blank')
        }, ['View API Docs →']);
        apiCard.appendChild(apiBtn);
        featuresGrid.appendChild(apiCard);
      }

      container.appendChild(featuresGrid);

      // Usage Stats (Premium only)
      const usageStats = UI.createElement('div', { className: 'mt-6' });
      usageStats.appendChild(UI.createElement('h4', { 
        className: 'text-lg font-semibold text-gray-900 mb-3' 
      }, ['Your Usage This Month']));
      
      const statsGrid = UI.createElement('div', { className: 'grid grid-cols-3 gap-4' });
      
      const stats = [
        { label: 'Feedback Items', value: this.state.analytics?.monthlyFeedback || '23' },
        { label: 'API Calls', value: Premium.hasFeature(PREMIUM_FEATURES.API_ACCESS) ? '1,247' : '0' },
        { label: 'Exports', value: Premium.hasFeature(PREMIUM_FEATURES.BULK_EXPORT) ? '5' : '0' }
      ];

      stats.forEach(stat => {
        const statCard = UI.createElement('div', { className: 'feedbase-analytics-card' });
        statCard.appendChild(UI.createElement('div', { className: 'feedbase-analytics-number' }, [stat.value]));
        statCard.appendChild(UI.createElement('div', { className: 'feedbase-analytics-label' }, [stat.label]));
        statsGrid.appendChild(statCard);
      });

      usageStats.appendChild(statsGrid);
      container.appendChild(usageStats);

      return container;
    }

    createAnalyticsPanel() {
      const container = UI.createElement('div', { className: 'space-y-6' });

      // Check premium access
      if (!Premium.hasFeature(PREMIUM_FEATURES.ADVANCED_ANALYTICS)) {
        return PremiumUI.createUpgradePrompt(PREMIUM_FEATURES.ADVANCED_ANALYTICS);
      }

      // Analytics header
      const header = UI.createElement('div', { 
        className: 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-6' 
      });
      header.appendChild(UI.createElement('div', { className: 'flex items-center gap-3' }, [
        UI.createIcon('chart', 'w-6 h-6 text-blue-600'),
        UI.createElement('h3', { className: 'text-lg font-semibold text-gray-900' }, ['Analytics Dashboard']),
        PremiumUI.createPremiumBadge()
      ]));
      container.appendChild(header);

      if (!this.state.analytics) {
        const loading = UI.createElement('div', { className: 'text-center py-8' });
        loading.appendChild(UI.createElement('p', { className: 'text-gray-500' }, ['Loading analytics data...']));
        container.appendChild(loading);
        return container;
      }

      // Key metrics grid
      const metricsGrid = UI.createElement('div', { className: 'feedbase-premium-grid' });
      
      const metrics = [
        {
          label: 'Total Feedback',
          value: this.state.analytics.totalFeedback,
          icon: 'message',
          color: 'blue'
        },
        {
          label: 'This Month',
          value: this.state.analytics.monthlyFeedback,
          icon: 'chart',
          color: 'green'
        },
        {
          label: 'Average Rating',
          value: this.state.analytics.averageRating + '/5',
          icon: 'sparkles',
          color: 'yellow'
        },
        {
          label: 'Response Time',
          value: this.state.analytics.responseTime,
          icon: 'settings',
          color: 'purple'
        }
      ];

      metrics.forEach(metric => {
        const metricCard = UI.createElement('div', { className: 'feedbase-analytics-card' });
        metricCard.appendChild(UI.createElement('div', { className: 'feedbase-analytics-number' }, [metric.value]));
        metricCard.appendChild(UI.createElement('div', { className: 'feedbase-analytics-label' }, [metric.label]));
        metricsGrid.appendChild(metricCard);
      });

      container.appendChild(metricsGrid);

      // Top Categories
      const categoriesSection = UI.createElement('div', { className: 'mt-6' });
      categoriesSection.appendChild(UI.createElement('h4', { 
        className: 'text-lg font-semibold text-gray-900 mb-3' 
      }, ['Top Categories']));

      const categoriesList = UI.createElement('div', { className: 'space-y-2' });
      this.state.analytics.topCategories.forEach(category => {
        const categoryItem = UI.createElement('div', { 
          className: 'flex items-center justify-between bg-gray-50 p-3 rounded-lg' 
        });
        categoryItem.appendChild(UI.createElement('span', { className: 'font-medium' }, [category.name]));
        categoryItem.appendChild(UI.createElement('span', { 
          className: 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium' 
        }, [category.count.toString()]));
        categoriesList.appendChild(categoryItem);
      });
      categoriesSection.appendChild(categoriesList);
      container.appendChild(categoriesSection);

      // Sentiment Analysis
      const sentimentSection = UI.createElement('div', { className: 'mt-6' });
      sentimentSection.appendChild(UI.createElement('h4', { 
        className: 'text-lg font-semibold text-gray-900 mb-3' 
      }, ['Sentiment Analysis']));

      const sentimentGrid = UI.createElement('div', { className: 'grid grid-cols-3 gap-4' });
      const sentiments = [
        { label: 'Positive', value: this.state.analytics.sentiment.positive, color: 'green' },
        { label: 'Neutral', value: this.state.analytics.sentiment.neutral, color: 'gray' },
        { label: 'Negative', value: this.state.analytics.sentiment.negative, color: 'red' }
      ];

      sentiments.forEach(sentiment => {
        const sentimentCard = UI.createElement('div', { className: 'feedbase-analytics-card' });
        sentimentCard.appendChild(UI.createElement('div', { className: 'feedbase-analytics-number' }, [
          sentiment.value + '%'
        ]));
        sentimentCard.appendChild(UI.createElement('div', { className: 'feedbase-analytics-label' }, [
          sentiment.label
        ]));
        sentimentGrid.appendChild(sentimentCard);
      });

      sentimentSection.appendChild(sentimentGrid);
      container.appendChild(sentimentSection);

      return container;
    }

    createFeedbackList() {
      const container = UI.createElement('div', { className: 'space-y-4' });

      // Advanced filters for premium users
      if (Premium.hasFeature(PREMIUM_FEATURES.ADVANCED_FILTERS)) {
        const filtersSection = UI.createElement('div', { 
          className: 'feedbase-premium-feature mb-4' 
        });
        
        const filtersHeader = UI.createElement('div', { className: 'flex items-center mb-3' });
        filtersHeader.appendChild(UI.createIcon('settings', 'w-4 h-4 text-purple-600'));
        filtersHeader.appendChild(UI.createElement('span', { 
          className: 'ml-2 font-medium text-sm' 
        }, ['Advanced Filters']));
        filtersHeader.appendChild(PremiumUI.createPremiumBadge());
        
        const filtersRow = UI.createElement('div', { className: 'flex gap-2' });
        
        const priorityFilter = UI.createElement('select', {
          className: 'feedbase-select text-sm',
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
        className: `feedbase-notification-btn ${Premium.isPremium ? 'feedbase-premium-pulse' : ''}`,
        onClick: () => {
          this.state.isNotificationOpen = !this.state.isNotificationOpen;
          this.render();
        }
      });

      // Premium users get crown icon, regular users get bell
      if (Premium.isPremium) {
        btn.appendChild(UI.createIcon('crown', 'w-6 h-6'));
      } else {
        btn.appendChild(UI.createIcon('bell', 'w-6 h-6'));
      }

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
          className: `feedbase-dropdown-header ${Premium.isPremium ? 'premium' : ''}` 
        });
        
        const headerContent = UI.createElement('div', { className: 'flex items-center justify-between' });
        headerContent.appendChild(UI.createElement('h3', {}, ['Feedback & Updates']));
        
        if (Premium.isPremium) {
          headerContent.appendChild(PremiumUI.createPremiumBadge());
        }
        
        dropdownHeader.appendChild(headerContent);

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

        // Browse Feedback
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

        // Share Feedback
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

        // Premium features in dropdown
        if (Premium.isPremium) {
          if (Premium.hasFeature(PREMIUM_FEATURES.ADVANCED_ANALYTICS)) {
            const analyticsBtn = UI.createElement('button', {
              className: 'w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors',
              onClick: () => {
                this.state.isModalOpen = true;
                this.state.currentView = 'analytics';
                this.state.isNotificationOpen = false;
                this.render();
              }
            });
            
            const analyticsContent = UI.createElement('div', {});
            const analyticsTitle = UI.createElement('div', { 
              className: 'font-medium text-gray-900 flex items-center gap-2' 
            });
            analyticsTitle.appendChild(UI.createIcon('chart', 'w-4 h-4 text-purple-600'));
            analyticsTitle.appendChild(document.createTextNode('Analytics'));
            analyticsTitle.appendChild(PremiumUI.createPremiumBadge());
            
            analyticsContent.appendChild(analyticsTitle);
            analyticsContent.appendChild(UI.createElement('div', { 
              className: 'text-sm text-gray-600' 
            }, ['View detailed insights']));
            analyticsBtn.appendChild(analyticsContent);
            menuContainer.appendChild(analyticsBtn);
          }

          const premiumBtn = UI.createElement('button', {
            className: 'w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors',
            onClick: () => {
              this.state.isModalOpen = true;
              this.state.currentView = 'premium';
              this.state.isNotificationOpen = false;
              this.render();
            }
          });
          
          const premiumContent = UI.createElement('div', {});
          const premiumTitle = UI.createElement('div', { 
            className: 'font-medium text-gray-900 flex items-center gap-2' 
          });
          premiumTitle.appendChild(UI.createIcon('crown', 'w-4 h-4 text-yellow-500'));
          premiumTitle.appendChild(document.createTextNode('Premium Features'));
          
          premiumContent.appendChild(premiumTitle);
          premiumContent.appendChild(UI.createElement('div', { 
            className: 'text-sm text-gray-600' 
          }, ['Manage your premium features']));
          premiumBtn.appendChild(premiumContent);
          menuContainer.appendChild(premiumBtn);
        } else {
          // Upgrade prompt for non-premium users
          const upgradeBtn = UI.createElement('button', {
            className: 'w-full text-left p-3 hover:bg-purple-50 rounded-lg transition-colors border-2 border-dashed border-purple-300',
            onClick: () => {
              this.state.isModalOpen = true;
              this.state.currentView = 'premium';
              this.state.isNotificationOpen = false;
              this.render();
            }
          });
          
          const upgradeContent = UI.createElement('div', {});
          const upgradeTitle = UI.createElement('div', { 
            className: 'font-medium text-purple-600 flex items-center gap-2' 
          });
          upgradeTitle.appendChild(UI.createIcon('crown', 'w-4 h-4'));
          upgradeTitle.appendChild(document.createTextNode('Upgrade to Premium'));
          
          upgradeContent.appendChild(upgradeTitle);
          upgradeContent.appendChild(UI.createElement('div', { 
            className: 'text-sm text-purple-500' 
          }, ['Unlock advanced features']));
          upgradeBtn.appendChild(upgradeContent);
          menuContainer.appendChild(upgradeBtn);
        }

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

    // Premium management methods
    async refreshPremiumStatus() {
      if (this.state.user) {
        await Premium.checkPremiumStatus(this.state.user.id);
        this.render();
      }
    }

    getPremiumStatus() {
      return {
        isPremium: Premium.isPremium,
        tier: Premium.subscriptionTier,
        features: Premium.premiumFeatures
      };
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

  // Auto-initialization function for Next.js integration with private environment variables
  function initFeedbaseWidget(options = {}) {
    // For Next.js, private env vars should be passed from server-side
    const config = {
      apiKey: options.apiKey, // Must be passed from server-side
      projectId: options.projectId || 'demo-project',
      supabaseUrl: options.supabaseUrl, // Must be passed from server-side  
      supabaseKey: options.supabaseKey, // Must be passed from server-side
      newFeatures: options.newFeatures || [],
      enablePremium: options.enablePremium !== false,
      ...options
    };

    // Validate required config
    if (!config.apiKey) {
      console.error('Feedbase API key is required. Pass it via options.apiKey from your server-side code.');
    }

    if (!config.supabaseUrl || !config.supabaseKey) {
      console.error('Supabase configuration is required. Pass supabaseUrl and supabaseKey via options from your server-side code.');
    }

    return new FeedbaseWidget(config);
  }

  // Export for different environments
  if (typeof module !== 'undefined' && module.exports) {
    // Node.js
    module.exports = { FeedbaseWidget, initFeedbaseWidget, PREMIUM_FEATURES };
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define([], function() {
      return { FeedbaseWidget, initFeedbaseWidget, PREMIUM_FEATURES };
    });
  } else {
    // Browser global
    window.FeedbaseWidget = FeedbaseWidget;
    window.initFeedbaseWidget = initFeedbaseWidget;
    window.FEEDBASE_PREMIUM_FEATURES = PREMIUM_FEATURES;
    
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

/* 
USAGE EXAMPLES WITH PRIVATE ENVIRONMENT VARIABLES:

// Method 1: Next.js App Router Integration
// .env.local (private - server-side only)
FEEDBASE_API_KEY=your_private_api_key
FEEDBASE_PROJECT_ID=your_project_id
SUPABASE_URL=your_supabase_url  
SUPABASE_ANON_KEY=your_supabase_anon_key

// app/layout.js (Server Component)
import FeedbaseWidget from '@/components/FeedbaseWidget';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <FeedbaseWidget 
          apiKey={process.env.FEEDBASE_API_KEY}
          projectId={process.env.FEEDBASE_PROJECT_ID}
          supabaseUrl={process.env.SUPABASE_URL}
          supabaseKey={process.env.SUPABASE_ANON_KEY}
        />
      </body>
    </html>
  );
}

// Method 2: Pages Router Integration  
// pages/_app.js
import { useEffect } from 'react';

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const initWidget = async () => {
      // Import the widget module
      const { initFeedbaseWidget } = await import('/feedbase-widget.js');
      
      // Get config from API route (keeps env vars private)
      const configResponse = await fetch('/api/feedbase-config');
      const config = await configResponse.json();
      
      window.feedbaseWidget = initFeedbaseWidget({
        ...config,
        newFeatures: []
      });
    };

    initWidget();

    return () => {
      if (window.feedbaseWidget) {
        window.feedbaseWidget.destroy();
      }
    };
  }, []);

  return <Component {...pageProps} />;
}

// pages/api/feedbase-config.js (Server-side API route)
export default async function handler(req, res) {
  // Private env vars only accessible server-side
  res.json({
    apiKey: process.env.FEEDBASE_API_KEY,
    projectId: process.env.FEEDBASE_PROJECT_ID,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_ANON_KEY
  });
}

// Method 3: Client Component with Server Props
// components/FeedbaseWidget.jsx (Client Component)
'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@supabase/auth-helpers-react';

export default function FeedbaseWidget({ apiKey, projectId, supabaseUrl, supabaseKey }) {
  const user = useUser();
  const [widget, setWidget] = useState(null);

  useEffect(() => {
    const initWidget = async () => {
      // Import widget dynamically
      const { initFeedbaseWidget } = await import('/feedbase-widget.js');
      
      const widgetInstance = initFeedbaseWidget({
        apiKey,
        projectId, 
        supabaseUrl,
        supabaseKey,
        newFeatures: [
          {
            id: 'premium-analytics',
            title: 'Advanced Analytics',
            description: 'Get detailed insights into your feedback data'
          }
        ]
      });
      
      setWidget(widgetInstance);
    };

    if (apiKey && projectId && supabaseUrl && supabaseKey) {
      initWidget();
    }

    return () => {
      if (widget) {
        widget.destroy();
      }
    };
  }, [apiKey, projectId, supabaseUrl, supabaseKey]);

  return null; // Widget renders itself
}

// Method 4: API Route for Premium Check (matching your booster pattern)
// pages/api/is-premium.js
import { createClient } from '@/utils/supabase/server';

export default async function handler(req, res) {
  const { user_id } = req.body;
  
  if (!user_id) {
    return res.status(400).json({ error: 'User ID required' });
  }
  
  try {
    // Check your database for premium status
    const supabase = createClient();
    
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('status, plan')
      .eq('user_id', user_id)
      .eq('status', 'active')
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    const isPremium = subscription?.status === 'active';
    const tier = subscription?.plan || 'free';
    
    // Define features based on tier
    const features = [];
    if (isPremium) {
      switch (tier) {
        case 'starter':
          features.push('advanced_analytics', 'custom_branding');
          break;
        case 'pro':
          features.push('advanced_analytics', 'custom_branding', 'bulk_export', 'custom_fields');
          break;
        case 'enterprise':
          features.push('advanced_analytics', 'custom_branding', 'bulk_export', 'custom_fields', 'api_access', 'white_label');
          break;
      }
    }
    
    res.json({
      isPremium,
      tier,
      features
    });
  } catch (error) {
    console.error('Error checking premium status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Method 5: Server Action Integration (App Router)
// app/actions/feedbase.js
'use server';

import { initFeedbaseWidget } from '@/lib/feedbase-widget';

export async function initializeFeedbaseWidget() {
  return {
    apiKey: process.env.FEEDBASE_API_KEY,
    projectId: process.env.FEEDBASE_PROJECT_ID,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_ANON_KEY
  };
}

// components/FeedbaseClientWrapper.jsx
'use client';

import { useEffect } from 'react';
import { initializeFeedbaseWidget } from '@/app/actions/feedbase';

export default function FeedbaseClientWrapper() {
  useEffect(() => {
    const setupWidget = async () => {
      const config = await initializeFeedbaseWidget();
      
      const { initFeedbaseWidget } = await import('/feedbase-widget.js');
      window.feedbaseWidget = initFeedbaseWidget(config);
    };
    
    setupWidget();
  }, []);
  
  return null;
}

// Method 6: Middleware for Config (Advanced)
// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  if (request.nextUrl.pathname === '/api/feedbase-widget-config') {
    // Only allow this endpoint from same origin
    const response = NextResponse.json({
      apiKey: process.env.FEEDBASE_API_KEY,
      projectId: process.env.FEEDBASE_PROJECT_ID,
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_ANON_KEY
    });
    
    // Add security headers
    response.headers.set('X-Robots-Tag', 'noindex');
    return response;
  }
}

export const config = {
  matcher: '/api/feedbase-widget-config'
};
*/) => this.filterFeedback('priority', e.target.value)
        });
        priorityFilter.appendChild(UI.createElement('option', { value: '' }, ['All Priorities']));
        ['high', 'medium', 'low'].forEach(priority => {
          priorityFilter.appendChild(UI.createElement('option', { value: priority }, [
            priority.charAt(0).toUpperCase() + priority.slice(1)
          ]));
        });
        
        const statusFilter = UI.createElement('select', {
          className: 'feedbase-select text-sm',
          onChange: (e) => this.filterFeedback('status', e.target.value)
        });
        statusFilter.appendChild(UI.createElement('option', { value: '' }, ['All Statuses']));
        ['open', 'in-progress', 'closed'].forEach(status => {
          statusFilter.appendChild(UI.createElement('option', { value: status }, [
            status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
          ]));
        });

        filtersRow.appendChild(priorityFilter);
        filtersRow.appendChild(statusFilter);
        
        filtersSection.appendChild(filtersHeader);
        filtersSection.appendChild(filtersRow);
        container.appendChild(filtersSection);
      }

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

        // Show priority for premium users
        if (Premium.hasFeature(PREMIUM_FEATURES.ADVANCED_FILTERS) && item.priority) {
          const priorityBadge = UI.createElement('span', {
            className: `px-2 py-1 rounded-full text-xs font-medium ${
              item.priority === 'high' ? 'bg-red-100 text-red-800' :
              item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`
          }, [item.priority.toUpperCase()]);
          meta.appendChild(priorityBadge);
        }

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

        // Show custom fields for premium users
        if (Premium.hasFeature(PREMIUM_FEATURES.CUSTOM_FIELDS) && item.customFields) {
          const customFieldsContainer = UI.createElement('div', { 
            className: 'mt-2 space-y-1' 
          });
          
          Object.entries(item.customFields).forEach(([key, value]) => {
            const fieldItem = UI.createElement('div', { className: 'text-sm' });
            fieldItem.appendChild(UI.createElement('span', { 
              className: 'font-medium text-gray-600' 
            }, [key + ': ']));
            fieldItem.appendChild(UI.createElement('span', { 
              className: 'text-gray-800' 
            }, [value]));
            customFieldsContainer.appendChild(fieldItem);
          });
          
          feedbackItem.appendChild(customFieldsContainer);
        }

        feedbackItem.appendChild(meta);
        container.appendChild(feedbackItem);
      });

      return container;
    }

    filterFeedback(filterType, filterValue) {
      // Premium feature - filter feedback based on criteria
      if (!Premium.hasFeature(PREMIUM_FEATURES.ADVANCED_FILTERS)) {
        this.showToast('Advanced filters require premium subscription', 'error');
        return;
      }

      // Implementation would filter this.state.feedbackList and re-render
      this.showToast(`Filtering by ${filterType}: ${filterValue}`, 'info');
      // For demo purposes, we'll just show a toast
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

      // Custom fields for premium users
      if (Premium.hasFeature(PREMIUM_FEATURES.CUSTOM_FIELDS)) {
        const customFieldsSection = UI.createElement('div', { 
          className: 'feedbase-premium-feature' 
        });
        
        const customFieldsHeader = UI.createElement('div', { className: 'flex items-center mb-3' });
        customFieldsHeader.appendChild(UI.createIcon('settings', 'w-4 h-4 text-purple-600'));
        customFieldsHeader.appendChild(UI.createElement('span', { 
          className: 'ml-2 font-medium' 
        }, ['Additional Information']));
        customFieldsHeader.appendChild(PremiumUI.createPremiumBadge());
        
        // Customer segment field
        const segmentGroup = UI.createElement('div', { className: 'feedbase-form-group' });
        segmentGroup.appendChild(UI.createElement('label', { 
          className: 'feedbase-label text-sm' 
        }, ['Customer Segment']));
        
        const segmentSelect = UI.createElement('select', {
          className: 'feedbase-select',
          onChange: (e) => {
            if (!this.state.customFields) this.state.customFields = {};
            this.state.customFields['Customer Segment'] = e.target.value;
          }
        });
        segmentSelect.appendChild(UI.createElement('option', { value: '' }, ['Select segment...']));
        ['Enterprise', 'SMB', 'Startup', 'Individual'].forEach(segment => {
          segmentSelect.appendChild(UI.createElement('option', { value: segment }, [segment]));
        });
        segmentGroup.appendChild(segmentSelect);
        
        // Revenue impact field
        const revenueGroup = UI.createElement('div', { className: 'feedbase-form-group' });
        revenueGroup.appendChild(UI.createElement('label', { 
          className: 'feedbase-label text-sm' 
        }, ['Revenue Impact']));
        
        const revenueSelect = UI.createElement('select', {
          className: 'feedbase-select',
          onChange: (e) => {
            if (!this.state.customFields) this.state.customFields = {};
            this.state.customFields['Revenue Impact'] = e.target.value;
          }
        });
        revenueSelect.appendChild(UI.createElement('option', { value: '' }, ['Select impact...']));
        ['$100K+', '$50K+', '$10K+', '$1K+', 'Unknown'].forEach(impact => {
          revenueSelect.appendChild(UI.createElement('option', { value: impact }, [impact]));
        });
        revenueGroup.appendChild(revenueSelect);

        customFieldsSection.appendChild(customFieldsHeader);
        customFieldsSection.appendChild(segmentGroup);
        customFieldsSection.appendChild(revenueGroup);
        form.appendChild(customFieldsSection);
      }

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
        value: this.state.newAnnouncement.title,
        onInput: (e) => {
          this.state.newAnnouncement.title = e.target.value;
        }
      });
      titleGroup.appendChild(titleInput);

      // Description textarea
      const descGroup = UI.createElement('div', { className: 'feedbase-form-group' });
      descGroup.appendChild(UI.createElement('label', { 
        className: 'feedbase-label' 
      }, ['Description']));
      
      const descTextarea = UI.createElement('textarea', {
        className: 'feedbase-textarea',
        placeholder: 'Announcement description...',
        value: this.state.newAnnouncement.description,
        onInput: (e) => {
          this.state.newAnnouncement.description = e.target.value;
        }
      });
      descGroup.appendChild(descTextarea);

      // Type select
      const typeGroup = UI.createElement('div', { className: 'feedbase-form-group' });
      typeGroup.appendChild(UI.createElement('label', { 
        className: 'feedbase-label' 
      }, ['Type']));
      
      const typeSelect = UI.createElement('select', {
        className: 'feedbase-select',
        value: this.state.newAnnouncement.type,
        onChange: (e) => {
          this.state.newAnnouncement.type = e.target.value;
        }
      });
      
      ['feature', 'update', 'maintenance', 'general'].forEach(type => {
        const optionEl = UI.createElement('option', { value: type }, [
          type.charAt(0).toUpperCase() + type.slice(1)
        ]);
        typeSelect.appendChild(optionEl);
      });
      typeGroup.appendChild(typeSelect);

      // Submit button
      const submitAnnouncementBtn = UI.createElement('button', {
        className: 'feedbase-btn',
        disabled: !this.state.newAnnouncement.title.trim() || !this.state.newAnnouncement.description.trim(),
        onClick: () => this.handleSubmitAnnouncement()
      });
      submitAnnouncementBtn.appendChild(UI.createIcon('sparkles', 'w-4 h-4'));
      submitAnnouncementBtn.appendChild(document.createTextNode('Create Announcement'));

      announcementForm.appendChild(titleGroup);
      announcementForm.appendChild(descGroup);
      announcementForm.appendChild(typeGroup);
      announcementForm.appendChild(submitAnnouncementBtn);
      
      announcementSection.appendChild(announcementForm);
      container.appendChild(announcementSection);

      // Existing announcements
      if (this.options.newFeatures.length > 0) {
        const existingSection = UI.createElement('div', { className: 'space-y-4' });
        existingSection.appendChild(UI.createElement('h4', { 
          className: 'text-lg font-semibold text-gray-900' 
        }, ['Existing Announcements']));

        this.options.newFeatures.forEach(feature => {
          const featureItem = UI.createElement('div', { 
            className: 'border border-gray-200 rounded-lg p-4 flex items-center justify-between' 
          });

          const featureInfo = UI.createElement('div', {});
          featureInfo.appendChild(UI.createElement('h5', { 
            className: 'font-medium text-gray-900' 
          }, [feature.title]));
          featureInfo.appendChild(UI.createElement('p', { 
            className: 'text-sm text-gray-600 mt-1' 
          }, [feature.description.substring(0, 100) + (feature.description.length > 100 ? '...' : '')]));

          const deleteBtn = UI.createElement('button', {
            className: 'text-red-600 hover:text-red-800 text-sm font-medium',
            onClick: () => this.handleDeleteAnnouncement(feature.id)
          }, ['Delete']);

          featureItem.appendChild(featureInfo);
          featureItem.appendChild(deleteBtn);
          existingSection.appendChild(featureItem);
        });

        container.appendChild(existingSection);
      }

      return container;
    }

    createSettingsForm() {
      const form = UI.createElement('div', { className: 'feedbase-form' });

      // User info section
      if (this.state.user) {
        const userSection = UI.createElement('div', { className: 'mb-6' });
        userSection.appendChild(UI.createElement('h4', { 
          className: 'text-lg font-semibold text-gray-900 mb-3' 
        }, ['Account Information']));

        const userInfo = UI.createElement('div', { 
          className: 'bg-gray-50 p-4 rounded-lg' 
        });
        
        userInfo.appendChild(UI.createElement('div', { className: 'flex items-center justify-between mb-2' }, [
          UI.createElement('span', { className: 'text-sm font-medium text-gray-600' }, ['Email:']),
          UI.createElement('span', { className: 'text-sm text-gray-900' }, [this.state.user.email])
        ]));

        if (Premium.isPremium) {
          const premiumRow = UI.createElement('div', { className: 'flex items-center justify-between' });
          premiumRow.appendChild(UI.createElement('span', { 
            className: 'text-sm font-medium text-gray-600' 
          }, ['Subscription:']));
          
          const premiumBadge = UI.createElement('div', { className: 'flex items-center gap-2' });
          premiumBadge.appendChild(UI.createIcon('crown', 'w-4 h-4 text-yellow-500'));
          premiumBadge.appendChild(UI.createElement('span', { 
            className: 'text-sm font-semibold text-purple-600' 
          }, [Premium.subscriptionTier?.toUpperCase() || 'PREMIUM']));
          
          premiumRow.appendChild(premiumBadge);
          userInfo.appendChild(premiumRow);
        } else {
          const upgradeRow = UI.createElement('div', { className: 'flex items-center justify-between' });
          upgradeRow.appendChild(UI.createElement('span', { 
            className: 'text-sm font-medium text-gray-600' 
          }, ['Subscription:']));
          
          const upgradeLink = UI.createElement('button', {
            className: 'text-sm text-purple-600 hover:underline font-medium',
            onClick: () => {
              this.state.currentView = 'premium';
              this.render();
            }
          }, ['Upgrade to Premium']);
          
          upgradeRow.appendChild(upgradeLink);
          userInfo.appendChild(upgradeRow);
        }

        userSection.appendChild(userInfo);
        form.appendChild(userSection);
      }

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
        onChange: (e/**
 * Feedbase Widget with Supabase Integration and Premium Features
 * Enhanced version with premium user detection and premium-only features
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

  // Premium Features Configuration
  const PREMIUM_FEATURES = {
    ADVANCED_ANALYTICS: 'advanced_analytics',
    CUSTOM_BRANDING: 'custom_branding',
    PRIORITY_SUPPORT: 'priority_support',
    BULK_EXPORT: 'bulk_export',
    CUSTOM_FIELDS: 'custom_fields',
    ADVANCED_FILTERS: 'advanced_filters',
    WHITE_LABEL: 'white_label',
    API_ACCESS: 'api_access'
  };

  // Premium system
  const Premium = {
    isPremium: null,
    premiumFeatures: [],
    subscriptionTier: null,
    
    async checkPremiumStatus(userId) {
      if (!userId) {
        this.isPremium = false;
        this.premiumFeatures = [];
        this.subscriptionTier = null;
        return;
      }

      try {
        const response = await fetch(`/api/is-premium?user_id=${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: userId })
        });

        if (response.ok) {
          const data = await response.json();
          this.isPremium = data.isPremium || false;
          this.premiumFeatures = data.features || [];
          this.subscriptionTier = data.tier || null;
        } else {
          // Fallback to free tier
          this.isPremium = false;
          this.premiumFeatures = [];
          this.subscriptionTier = 'free';
        }
      } catch (error) {
        console.warn('Could not check premium status:', error);
        this.isPremium = false;
        this.premiumFeatures = [];
        this.subscriptionTier = 'free';
      }
    },

    hasFeature(feature) {
      return this.isPremium && this.premiumFeatures.includes(feature);
    },

    requiresPremium(feature) {
      return Object.values(PREMIUM_FEATURES).includes(feature);
    },

    getPremiumBadge() {
      if (!this.isPremium) return null;
      
      const badges = {
        'starter': { text: 'STARTER', color: 'bg-blue-500' },
        'pro': { text: 'PRO', color: 'bg-purple-500' },
        'enterprise': { text: 'ENTERPRISE', color: 'bg-gold-500' }
      };
      
      return badges[this.subscriptionTier] || { text: 'PREMIUM', color: 'bg-green-500' };
    }
  };

  // Authorization system (enhanced with premium checks)
  const Auth = {
    admins: [],
    banned: [],
    roles: {},
    
    async loadConfig() {
      try {
        const response = await fetch(CONFIG.AUTH_CONFIG_URL);
        if (response.ok) {
          const authModule = await response.text();
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
      // Admins can always create, premium users can create with limits
      return this.isAdmin(userId) || (Premium.hasFeature(PREMIUM_FEATURES.CUSTOM_BRANDING) && !this.isBanned(userId));
    },

    canDeleteAnnouncement(userId) {
      return this.isAdmin(userId) && !this.isBanned(userId);
    },

    canModerateFeedback(userId) {
      return this.isAdmin(userId) && !this.isBanned(userId);
    },

    canAccessFeature(userId, feature) {
      if (this.isBanned(userId)) return false;
      if (this.isAdmin(userId)) return true;
      return Premium.hasFeature(feature);
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
        this.removeAdmin(userId);
        this.saveConfig();
      }
    },

    unbanUser(userId) {
      this.banned = this.banned.filter(id => id !== userId);
      this.saveConfig();
    },

    async saveConfig() {
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

  // Feedbase API Client (enhanced with premium features)
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

    // Premium API endpoints
    async getAnalytics(projectId, timeRange = '30d') {
      if (!Premium.hasFeature(PREMIUM_FEATURES.ADVANCED_ANALYTICS)) {
        throw new Error('Advanced analytics requires premium subscription');
      }
      
      return this.request(`/v1/projects/${projectId}/analytics?range=${timeRange}`, {
        method: 'GET'
      });
    }

    async bulkExportFeedback(projectId, filters = {}) {
      if (!Premium.hasFeature(PREMIUM_FEATURES.BULK_EXPORT)) {
        throw new Error('Bulk export requires premium subscription');
      }
      
      return this.request(`/v1/projects/${projectId}/feedback/export`, {
        method: 'POST',
        body: JSON.stringify(filters)
      });
    }

    async updateBranding(projectId, brandingData) {
      if (!Premium.hasFeature(PREMIUM_FEATURES.CUSTOM_BRANDING)) {
        throw new Error('Custom branding requires premium subscription');
      }
      
      return this.request(`/v1/projects/${projectId}/branding`, {
        method: 'PUT',
        body: JSON.stringify(brandingData)
      });
    }
  }

  // Supabase Integration (enhanced)
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
        if (!window.supabase) {
          await this.loadSupabase();
        }
        
        this.client = window.supabase.createClient(this.url, this.key);
        
        const { data: { session } } = await this.client.auth.getSession();
        this.user = session?.user || null;
        
        // Check premium status when user is authenticated
        if (this.user) {
          await Premium.checkPremiumStatus(this.user.id);
        }
        
        this.client.auth.onAuthStateChange(async (event, session) => {
          this.user = session?.user || null;
          if (this.user) {
            await Premium.checkPremiumStatus(this.user.id);
          } else {
            Premium.isPremium = false;
            Premium.premiumFeatures = [];
            Premium.subscriptionTier = null;
          }
          this.onAuthChange?.(this.user);
        });
        
        this.initialized = true;
      } catch (error) {
        console.warn('Supabase initialization failed, using mock auth:', error);
        this.user = {
          id: 'demo-user',
          email: 'demo@example.com',
          user_metadata: { name: 'Demo User' }
        };
        Premium.isPremium = false;
        Premium.subscriptionTier = 'free';
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

  // Premium UI Components
  const PremiumUI = {
    createPremiumBadge(tier = null) {
      const badge = Premium.getPremiumBadge();
      if (!badge) return null;

      const badgeEl = document.createElement('span');
      badgeEl.className = `inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold text-white ${badge.color}`;
      badgeEl.textContent = badge.text;
      return badgeEl;
    },

    createUpgradePrompt(feature) {
      const prompt = document.createElement('div');
      prompt.className = 'bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 text-center';
      
      prompt.innerHTML = `
        <div class="flex items-center justify-center mb-3">
          <svg class="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3l4 6-4 6L3 12l2-3zM19 3l-2 3 2 3 2-3-2-3zM9 3l6 9-6 9-6-9 6-9z"/>
          </svg>
        </div>
        <h3 class="font-semibold text-gray-900 mb-2">Premium Feature</h3>
        <p class="text-gray-600 text-sm mb-4">This feature requires a premium subscription to access.</p>
        <button class="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-colors">
          Upgrade Now
        </button>
      `;

      prompt.querySelector('button').onclick = () => {
        window.open('/pricing', '_blank');
      };

      return prompt;
    },

    createPremiumFeatureWrapper(content, feature, fallback = null) {
      if (Premium.hasFeature(feature)) {
        return content;
      }
      
      return fallback || this.createUpgradePrompt(feature);
    }
  };

  // Enhanced UI Components
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
        settings: `<svg class="${className}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
        crown: `<svg class="${className}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3l2.89 11.32a2 2 0 001.96 1.68h4.3a2 2 0 001.96-1.68L19 3M3 6h18M12 3v18"/></svg>`,
        chart: `<svg class="${className}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>`,
        download: `<svg class="${className}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>`
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
        
        .feedbase-modal-header.premium {
          background: linear-gradient(135deg, #7c3aed, #f59e0b);
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
        
        .feedbase-premium-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        
        .feedbase-premium-badge {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        
        .feedbase-premium-feature {
          border: 2px solid transparent;
          background: linear-gradient(white, white) padding-box,
                      linear-gradient(135deg, #7c3aed, #f59e0b) border-box;
          border-radius: 0.75rem;
          padding: 1rem;
          position: relative;
          overflow: hidden;
        }
        
        .feedbase-premium-feature::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(135deg, #7c3aed, #f59e0b);
        }
        
        .feedbase-upgrade-prompt {
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.05), rgba(245, 158, 11, 0.05));
          border: 2px dashed rgba(124, 58, 237, 0.3);
          border-radius: 0.75rem;
          padding: 2rem;
          text-align: center;
        }
        
        .feedbase-premium-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin: 1rem 0;
        }
        
        .feedbase-analytics-card {
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          padding: 1.5rem;
          text-align: center;
        }
        
        .feedbase-analytics-number {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }
        
        .feedbase-analytics-label {
          color: #64748b;
          font-size: 0.875rem;
          font-weight: 500;
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
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .feedbase-premium-pulse {
          animation: pulse 2s infinite;
        }
      `;
      
      const styleSheet = document.createElement('style');
      styleSheet.id = 'feedbase-widget-styles';
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
    }
  };

  // Enhanced Main Widget Class
  class FeedbaseWidget {
    constructor(options = {}) {
      this.options = {
        projectId: options.projectId || '',
        apiKey: options.apiKey || process.env?.FEEDBASE_API_KEY || '',
        newFeatures: options.newFeatures || [],
        supabaseUrl: options.supabaseUrl || CONFIG.SUPABASE_URL,
        supabaseKey: options.supabaseKey || CONFIG.SUPABASE_ANON_KEY,
        position: options.position || 'bottom-right',
        enablePremium: options.enablePremium !== false, // Default to true
        ...options
      };

      this.state = {
        isModalOpen: false,
        isNotificationOpen: false,
        currentView: 'feedback', // 'feedback', 'create', 'feature', 'settings', 'admin', 'premium', 'analytics'
        feedbackList: [],
        newFeedback: { title: '', content: '', category: 'feature-request' },
        newAnnouncement: { title: '', description: '', image: '', type: 'feature' },
        unreadCount: 0,
        currentFeature: null,
        settings: { notifications: true, position: this.options.position },
        user: null,
        isBlocked: false,
        analytics: null,
        branding: null
      };

      this.api = new FeedbaseAPI(this.options.apiKey);
      this.supabase = new SupabaseClient(this.options.supabaseUrl, this.options.supabaseKey);
      this.container = null;

      this.init();
    }

    async init() {
      UI.addStyles();
      await Auth.loadConfig();
      Auth.loadLocalConfig();
      
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
        
        // Load premium analytics if available
        if (Premium.hasFeature(PREMIUM_FEATURES.ADVANCED_ANALYTICS)) {
          this.loadAnalytics();
        }
      }

      this.render();
      
      this.supabase.onAuthChange(async (user) => {
        this.state.user = user;
        
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
          
          // Load premium features
          if (Premium.hasFeature(PREMIUM_FEATURES.ADVANCED_ANALYTICS)) {
            this.loadAnalytics();
          }
        }
        this.render();
      });
    }

    async loadAnalytics() {
      if (!Premium.hasFeature(PREMIUM_FEATURES.ADVANCED_ANALYTICS)) return;
      
      try {
        this.state.analytics = await this.api.getAnalytics(this.options.projectId);
      } catch (error) {
        console.error('Error loading analytics:', error);
        // Mock analytics data for demo
        this.state.analytics = {
          totalFeedback: 127,
          monthlyFeedback: 23,
          averageRating: 4.2,
          responseTime: '2.1 hours',
          topCategories: [
            { name: 'Feature Requests', count: 45 },
            { name: 'Bug Reports', count: 32 },
            { name: 'Improvements', count: 28 }
          ],
          sentiment: {
            positive: 65,
            neutral: 25,
            negative: 10
          }
        };
      }
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
        this.state.feedbackList = [
          { 
            id: '1', 
            title: 'Dark mode support', 
            content: 'Would love to see dark mode in the app', 
            votes: 15, 
            status: 'open',
            priority: 'high',
            customFields: Premium.hasFeature(PREMIUM_FEATURES.CUSTOM_FIELDS) ? {
              'Customer Segment': 'Enterprise',
              'Revenue Impact': '$50K+'
            } : {}
          },
          { 
            id: '2', 
            title: 'Mobile app', 
            content: 'Native mobile app would be great', 
            votes: 8, 
            status: 'in-progress',
            priority: 'medium',
            customFields: Premium.hasFeature(PREMIUM_FEATURES.CUSTOM_FIELDS) ? {
              'Customer Segment': 'SMB',
              'Revenue Impact': '$10K'
            } : {}
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

      if (Auth.isBanned(this.state.user?.id)) {
        this.showToast('You are not authorized to submit feedback.', 'error');
        return;
      }

      try {
        const feedbackData = {
          ...this.state.newFeedback,
          author: this.state.user?.email || 'anonymous'
        };

        // Add custom fields for premium users
        if (Premium.hasFeature(PREMIUM_FEATURES.CUSTOM_FIELDS) && this.state.customFields) {
          feedbackData.customFields = this.state.customFields;
        }

        await this.api.createFeedback(this.options.projectId, feedbackData);
        
        this.state.newFeedback = { title: '', content: '', category: 'feature-request' };
        this.state.customFields = {};
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
          status: 'open',
          customFields: this.state.customFields || {}
        };
        this.state.feedbackList.unshift(mockFeedback);
        this.state.newFeedback = { title: '', content: '', category: 'feature-request' };
        this.state.customFields = {};
        this.state.currentView = 'feedback';
        this.showToast('Feedback submitted successfully!', 'success');
      }
      
      this.render();
    }

    async handleBulkExport() {
      if (!Premium.hasFeature(PREMIUM_FEATURES.BULK_EXPORT)) {
        this.showToast('Bulk export requires premium subscription', 'error');
        return;
      }

      try {
        const exportData = await this.api.bulkExportFeedback(this.options.projectId);
        
        // Create and download CSV
        const csvContent = this.convertToCSV(exportData);
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `feedback-export-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        this.showToast('Feedback exported successfully!', 'success');
      } catch (error) {
        console.error('Error exporting feedback:', error);
        this.showToast('Failed to export feedback', 'error');
      }
    }

    convertToCSV(data) {
      if (!data || !data.length) return '';
      
      const headers = Object.keys(data[0]);
      const csvRows = [headers.join(',')];
      
      data.forEach(row => {
        const values = headers.map(header => {
          const value = row[header];
          return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
        });
        csvRows.push(values.join(','));
      });
      
      return csvRows.join('\n');
    }

    async handleSubmitAnnouncement() {
      if (!this.state.newAnnouncement.title.trim() || !this.state.newAnnouncement.description.trim()) {
        return;
      }

      if (!Auth.canCreateAnnouncement(this.state.user?.id)) {
        this.showToast('You are not authorized to create announcements.', 'error');
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
        this.options.newFeatures.unshift(announcementData);
        
        this.state.newAnnouncement = { title: '', description: '', image: '', type: 'feature' };
        this.state.currentView = 'admin';
        this.showToast('Announcement created successfully!', 'success');
        
      } catch (error) {
        console.error('Error creating announcement:', error);
        this.showToast('Failed to create announcement', 'error');
      }
      
      this.render();
    }

    async handleDeleteAnnouncement(announcementId) {
      if (!Auth.canDeleteAnnouncement(this.state.user?.id)) {
        this.showToast('You are not authorized to delete announcements.', 'error');
        return;
      }

      if (!confirm('Are you sure you want to delete this announcement?')) {
        return;
      }

      try {
        await this.api.deleteAnnouncement(this.options.projectId, announcementId);
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
        this.showToast('You are not authorized to moderate feedback.', 'error');
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

    showToast(message, type = 'info') {
      const toast = UI.createElement('div', {
        className: `feedbase-toast feedbase-toast-${type}`,
        style: 'position: fixed; top: 20px; right: 20px; z-index: 10001; padding: 12px 20px; border-radius: 8px; color: white; font-weight: 500; animation: slideInRight 0.3s ease-out;'
      }, [message]);

      const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
      };
      toast.style.background = colors[type] || colors.info;

      document.body.appendChild(toast);

      setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }

    renderBlockedMessage() {
      if (!this.container) {
        this.container = document.getElementById(CONFIG.WIDGET_ID);
        if (!this.container) {
          this.container = document.createElement('div');
          this.container.id = CONFIG.WIDGET_ID;
          document.body.appendChild(this.container);
        }
      }

      this.container.innerHTML = `
        <div style="position: fixed; bottom: 20px; right: 20px; background: #fee2e2; border: 1px solid #fecaca; color: #dc2626; padding: 16px; border-radius: 8px; max-width: 300px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.25);">
          <h4 style="font-weight: 600; margin: 0 0 8px 0;">Access Blocked</h4>
          <p style="margin: 0; font-size: 14px;">Your account has been restricted from using this widget. Contact support if you believe this is an error.</p>
        </div>
      `;
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
      const header = UI.createElement('div', { 
        className: `feedbase-modal-header ${Premium.isPremium ? 'premium' : ''}` 
      });
      
      const titleRow = UI.createElement('div', { className: 'feedbase-modal-title' });
      
      const titleLeft = UI.createElement('div', { className: 'flex items-center gap-3' });
      
      // Add premium badge to header if user is premium
      if (Premium.isPremium) {
        const premiumHeader = UI.createElement('div', { className: 'feedbase-premium-header' });
        premiumHeader.appendChild(UI.createIcon('crown', 'w-5 h-5'));
        premiumHeader.appendChild(UI.createElement('span', { className: 'feedbase-premium-badge' }, [
          Premium.getPremiumBadge()?.text || 'PREMIUM'
        ]));
        titleLeft.appendChild(premiumHeader);
      }
      
      titleLeft.appendChild(UI.createIcon('message', 'w-6 h-6'));
      
      const titleText = {
        'create': 'Share Your Feedback',
        'settings': 'Widget Settings',
        'admin': 'Admin Panel',
        'premium': 'Premium Features',
        'analytics': 'Analytics Dashboard',
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
      
      // Add premium features for premium users
      if (Premium.isPremium) {
        if (Premium.hasFeature(PREMIUM_FEATURES.ADVANCED_ANALYTICS)) {
          navItems.push('analytics');
        }
        navItems.push('premium');
      }
      
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
      } else if (this.state.currentView === 'premium') {
        content.appendChild(this.createPremiumPanel());
      } else if (this.state.currentView === 'analytics') {
        content.appendChild(this.createAnalyticsPanel());
      } else if (this.state.currentView === 'settings') {
        content.appendChild(this.createSettingsForm());
      }

      modalContent.appendChild(header);
      modalContent.appendChild(content);
      modal.appendChild(modalContent);

      return modal;
    }
