/**
 * MigraGuardian Widget - React Integration
 * 
 * Embeddable AI support widget that communicates directly with mPanel control panel
 * 
 * Features:
 * ✅ Floating chat bubble (bottom-right)
 * ✅ Direct mPanel API integration
 * ✅ Customizable branding (colors, title, avatar)
 * ✅ Voice input (Pro/Enterprise)
 * ✅ Zero external dependencies (native widget.js)
 * ✅ Works on ANY website
 * ✅ Real-time communication with Guardian Gateway
 * 
 * @see /home/bonex/MigraWeb/MigraHosting/dev/migra-panel/public/guardian/widget.js
 * @see /home/bonex/MigraWeb/MigraHosting/dev/migra-panel/GUARDIAN_WIDGET_EXAMPLE.html
 */

import { useEffect, useState } from 'react';
import FallbackChat from './FallbackChat';

interface MigraGuardianConfig {
  token: string;
  gatewayUrl: string;
  title?: string;
  subtitle?: string;
  primaryColor?: string;
  assistantName?: string;
  avatarUrl?: string;
  enableVoice?: boolean;
  position?: 'bottom-right' | 'bottom-left';
  greeting?: string;
}

// Environment configuration
const DEFAULT_CONFIG: MigraGuardianConfig = {
  token: import.meta.env.VITE_GUARDIAN_TOKEN || 'guardian_demo_token',
  gatewayUrl: import.meta.env.VITE_GUARDIAN_GATEWAY_URL || 'http://localhost:8080/guardian',
  title: 'Need Help?',
  subtitle: 'Ask our AI assistant anything!',
  primaryColor: '#6A5CFF', // Match MigraHosting brand
  assistantName: 'Abigail',
  enableVoice: false,
  position: 'bottom-right',
  greeting: "Hi! I'm Abigail, your AI technical support assistant. How can I help you today?",
};

interface MigraGuardianWidgetProps {
  config?: Partial<MigraGuardianConfig>;
}

/**
 * MigraGuardian Widget Component
 * 
 * This component loads the native Guardian widget.js script and configures it
 * to communicate directly with the mPanel control panel.
 * 
 * Usage:
 * ```tsx
 * <MigraGuardianWidget 
 *   config={{
 *     token: 'guardian_your_token_here',
 *     primaryColor: '#6A5CFF'
 *   }} 
 * />
 * ```
 */
export const MigraGuardianWidget: React.FC<MigraGuardianWidgetProps> = ({ config = {} }) => {
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    // Merge default config with provided config
    const finalConfig: MigraGuardianConfig = {
      ...DEFAULT_CONFIG,
      ...config,
    };

    // Set global configuration for the widget
    (window as any).MigraGuardianConfig = finalConfig;

    // Check if widget is already loaded
    if ((window as any).MigraGuardian) {
      console.log('[MigraGuardian] Widget already initialized');
      setUseFallback(false);
      return;
    }

    // Determine script URL based on environment
    const isDevelopment = import.meta.env.DEV;
    const scriptUrl = isDevelopment
      ? 'http://localhost:2271/guardian/widget.js' // Local development
      : 'https://migrapanel.com/guardian/widget.js'; // Production

    // Create script element
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.async = true;
    script.defer = true;

    // Handle script load success
    script.onload = () => {
      console.log('[MigraGuardian] Widget loaded successfully');
      console.log('[MigraGuardian] Configuration:', {
        gatewayUrl: finalConfig.gatewayUrl,
        assistantName: finalConfig.assistantName,
        hasToken: !!finalConfig.token,
      });
      setUseFallback(false);
    };

    // Handle script load error - Use fallback
    script.onerror = (error) => {
      console.error('[MigraGuardian] Failed to load widget:', error);
      console.error('[MigraGuardian] Attempted URL:', scriptUrl);
      console.warn('[MigraGuardian] Activating fallback chat mode');
      setUseFallback(true);
    };

    // Append script to document
    document.body.appendChild(script);

    // Set timeout to activate fallback if widget doesn't load in 5 seconds
    const fallbackTimeout = setTimeout(() => {
      if (!(window as any).MigraGuardian) {
        console.warn('[MigraGuardian] Widget loading timeout - activating fallback');
        setUseFallback(true);
      }
    }, 5000);

    // Cleanup function
    return () => {
      clearTimeout(fallbackTimeout);
      
      // Remove script on component unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }

      // Remove widget DOM elements
      const widgetElement = document.getElementById('migra-guardian-widget');
      if (widgetElement && widgetElement.parentNode) {
        widgetElement.parentNode.removeChild(widgetElement);
      }

      // Clear global config
      delete (window as any).MigraGuardianConfig;
      delete (window as any).MigraGuardian;

      console.log('[MigraGuardian] Widget cleaned up');
    };
  }, [config]);

  // Render fallback chat if external widget failed to load
  if (useFallback) {
    return <FallbackChat />;
  }

  // The widget is rendered by the external script, not by React
  return null;
};

/**
 * Helper function to programmatically open the Guardian chat
 * Can be called from anywhere in the application
 */
export const openGuardianChat = () => {
  if ((window as any).MigraGuardian) {
    (window as any).MigraGuardian.open();
  } else {
    console.warn('[MigraGuardian] Widget not initialized yet');
  }
};

/**
 * Helper function to programmatically close the Guardian chat
 */
export const closeGuardianChat = () => {
  if ((window as any).MigraGuardian) {
    (window as any).MigraGuardian.close();
  }
};

/**
 * Helper function to send a message programmatically
 * @param message - The message to send
 */
export const sendGuardianMessage = (message: string) => {
  if ((window as any).MigraGuardian) {
    (window as any).MigraGuardian.sendMessage(message);
  } else {
    console.warn('[MigraGuardian] Widget not initialized yet');
  }
};

/**
 * Hook to access Guardian widget API
 * 
 * Usage:
 * ```tsx
 * const guardian = useGuardianWidget();
 * 
 * const handleSupportClick = () => {
 *   guardian.open();
 *   guardian.sendMessage('I need help with DNS');
 * };
 * ```
 */
export const useGuardianWidget = () => {
  const isAvailable = typeof window !== 'undefined' && !!(window as any).MigraGuardian;

  return {
    isAvailable,
    open: openGuardianChat,
    close: closeGuardianChat,
    sendMessage: sendGuardianMessage,
  };
};

// Global event trigger for compatibility with existing code
if (typeof window !== 'undefined') {
  window.addEventListener('openAfmChat', () => {
    openGuardianChat();
  });
}

export default MigraGuardianWidget;
