import { Sparkles } from "lucide-react";

interface SkeletonRowProps {
  index: number;
  isReversed?: boolean;
}

function SkeletonRow({ index, isReversed }: SkeletonRowProps) {
  const displayNum = `0${index + 1}`;

  return (
    <article
      className={`project-row project-skeleton-row ${
        isReversed ? "project-row-reverse" : ""
      }`}
      aria-hidden="true"
    >
      <div className={`project-art project-skeleton-art skeleton-art-bg-${index % 3}`}>
        <div className="art-window skeleton-window">
          <span className="window-dots">
            <i />
            <i />
            <i />
          </span>
          <div className="skeleton-bar skeleton-brand-placeholder" />
          <div className="skeleton-shape-circle" />
          <div className="skeleton-bar skeleton-mock-line-1" />
          <div className="skeleton-bar skeleton-mock-line-2" />
        </div>
      </div>

      <div className="project-copy skeleton-copy">
        <div className="project-meta-row">
          <span className="project-number skeleton-num-text">{displayNum}</span>
          <div className="skeleton-pill skeleton-tag-placeholder" />
        </div>
        <div className="skeleton-bar skeleton-title-placeholder" />
        <div className="skeleton-bar skeleton-desc-line-1" />
        <div className="skeleton-bar skeleton-desc-line-2" />
        <div className="skeleton-pill skeleton-btn-placeholder" />
      </div>
    </article>
  );
}

export function ProjectsLoader() {
  return (
    <div
      className="projects-loader-container"
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio projects"
    >
      <div className="projects-loader-banner">
        <div className="projects-loader-badge">
          <Sparkles className="loader-sparkle-icon" aria-hidden="true" />
          <span className="hand loader-kicker">Waking up CMS & fetching works...</span>
        </div>
        <div className="loader-progress-track" aria-hidden="true">
          <div className="loader-progress-bar" />
        </div>
        <p className="loader-note">
          Render web service is connecting. Your projects will appear right here in a moment!
        </p>
      </div>

      <div className="projects-skeleton-list">
        <SkeletonRow index={0} isReversed={false} />
        <SkeletonRow index={1} isReversed={true} />
        <SkeletonRow index={2} isReversed={false} />
      </div>
    </div>
  );
}
