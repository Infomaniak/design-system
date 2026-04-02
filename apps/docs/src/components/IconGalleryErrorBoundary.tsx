import { Component, type ErrorInfo, type ReactNode } from 'react';
import type { IconGalleryError } from '../hooks/useIconGallery.ts';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: IconGalleryError | null;
}

const ERROR_FALLBACK: IconGalleryError = {
  message: 'An unexpected error occurred in the icon gallery',
  code: 'BOUNDARY_ERROR',
};

export class IconGalleryErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error: {
        message: error.message || ERROR_FALLBACK.message,
        code: error.name === 'AbortError' ? 'ABORTED' : ERROR_FALLBACK.code,
      },
    };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('IconGalleryErrorBoundary caught an error:', error, errorInfo);
  }

  public override render(): ReactNode {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Otherwise, render a simple error UI inline
      return (
        <>
          <style>{`
            .icon-gallery-error-boundary {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 3rem 1rem;
              text-align: center;
            }
            .icon-gallery-error-boundary__icon {
              margin-bottom: 1rem;
              color: #ef4444;
            }
            .icon-gallery-error-boundary__title {
              font-size: 18px;
              font-weight: 600;
              color: #374151;
              margin-bottom: 0.5rem;
            }
            .icon-gallery-error-boundary__message {
              font-size: 14px;
              color: #6b7280;
              margin-bottom: 1.5rem;
              max-width: 400px;
            }
            .icon-gallery-error-boundary__button {
              padding: 8px 16px;
              font-size: 14px;
              font-weight: 500;
              color: #ffffff;
              background-color: #3b82f6;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              transition: background-color 0.2s ease;
            }
            .icon-gallery-error-boundary__button:hover {
              background-color: #2563eb;
            }
          `}</style>
          <div className="icon-gallery-error-boundary">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="icon-gallery-error-boundary__icon"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
              />
              <line
                x1="12"
                y1="8"
                x2="12"
                y2="12"
              />
              <line
                x1="12"
                y1="16"
                x2="12.01"
                y2="16"
              />
            </svg>

            <h3 className="icon-gallery-error-boundary__title">Something went wrong</h3>

            <p className="icon-gallery-error-boundary__message">
              {this.state.error?.message || ERROR_FALLBACK.message}
            </p>

            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="icon-gallery-error-boundary__button"
            >
              Try Again
            </button>
          </div>
        </>
      );
    }

    return this.props.children;
  }
}
