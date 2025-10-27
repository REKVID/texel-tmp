import React, { useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Zap } from 'lucide-react';
import { ParticlesBackground } from './ParticlesBackground';

declare global {
  interface Window {
    onTelegramAuth?: (user: any) => void;
  }
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Define the Telegram auth callback globally
    window.onTelegramAuth = async (user: any) => {
      try {
        console.log('Telegram auth user:', user);
        
        // Send to backend
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/telegram-login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ telegram_data: user }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Login successful:', data);
          
          // Store token
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('user_id', data.user.id.toString());
          
          if (onLoginSuccess) {
            onLoginSuccess();
          }
          onClose();
        } else {
          const errorData = await response.json();
          alert('Ошибка при входе: ' + errorData.detail);
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('Ошибка соединения с сервером');
      }
    };

    // Load Telegram widget script
    if (!window.TelegramLoginWidget) {
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?22';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      (window as any).TelegramLoginWidget = true;
    }

    return () => {
      // Cleanup
    };
  }, [isOpen, onClose, onLoginSuccess]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
        }}
        className="sm:max-w-md border-2 border-blue-600 bg-gradient-to-br from-slate-950 via-blue-900/30 to-slate-950 overflow-hidden shadow-2xl shadow-blue-500/40 relative"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 z-0 opacity-20">
          <ParticlesBackground />
        </div>

        {/* Glow Effects */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl z-0" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl z-0" />

        {/* Content */}
        <div className="relative z-10">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-blue-300 via-blue-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
              <Zap className="w-7 h-7 text-blue-400" />
              Добро пожаловать! 👋
            </DialogTitle>
            <DialogDescription className="text-slate-200 text-base mt-3">
              Войдите через Telegram
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-6 flex flex-col items-center">
            {/* Telegram Login Widget */}
            <div
              ref={containerRef}
              className="flex justify-center"
            >
              <script 
                async 
                src="https://telegram.org/js/telegram-widget.js?22" 
                data-telegram-login={import.meta.env.VITE_TELEGRAM_BOT_USERNAME || "YOUR_BOT_USERNAME"}
                data-size="large"
                data-onauth="window.onTelegramAuth(user)"
                data-request-access="write"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
