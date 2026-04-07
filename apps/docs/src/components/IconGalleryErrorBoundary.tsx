import { Component, type ErrorInfo, type ReactNode } from 'react';
import type { IconGalleryErrorType } from '../hooks/useIconGallery.ts';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: IconGalleryErrorType | null;
}

const ERROR_FALLBACK: IconGalleryErrorType = {
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
              fill="none"
              viewBox="0 0 24 24"
              className="icon-gallery-error-boundary__icon"
            >
              <path
                fill="currentColor"
                d="M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18m0-16.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15"
              />
              <path
                fill="currentColor"
                d="M12 13a.76.76 0 0 1-.75-.75v-3.5a.75.75 0 1 1 1.5 0v3.5A.76.76 0 0 1 12 13M12 16a.76.76 0 0 1-.75-.75v-.5a.75.75 0 1 1 1.5 0v.5A.76.76 0 0 1 12 16"
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
