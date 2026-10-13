import { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  Clock,
  Crown,
  ExternalLink,
  Sparkles,
  User,
} from "lucide-react";
import { marked } from "marked";
import { usePortfolioProjects, type PortfolioProject } from "../hooks/usePortfolioProjects";
import { Footer } from "../components/Footer";

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { projects, loading } = usePortfolioProjects();

  // Scroll to top when page mounts or slug changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Find project matching the route slug
  const project = useMemo(() => {
    if (!slug) return null;
    const target = slug.toLowerCase().trim();

    return (
      projects.find((p: PortfolioProject) => {
        const pSlug = (p.slug || "").toLowerCase().trim();
        const pId = (p.id || "").toLowerCase().trim();
        const pTitle = p.title.toLowerCase().replace(/[^a-z0-9]/g, "");

        return (
          pSlug === target ||
          pId === target ||
          pTitle === target.replace(/[^a-z0-9]/g, "") ||
          // Support both 'portfoliocm' and 'portfoliocms'
          (target === "portfoliocms" && pSlug === "portfoliocm") ||
          (target === "portfoliocm" && pSlug === "portfoliocms")
        );
      }) || null
    );
  }, [slug, projects]);

  // Compute read time
  const readTimeMinutes = useMemo(() => {
    if (!project) return 1;
    const text = project.body || project.content || project.summary || "";
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(wordCount / 180));
  }, [project]);

  // Parse markdown into HTML safely
  const parsedHtml = useMemo(() => {
    if (!project) return "";
    const rawMarkdown = project.body || project.content || "";
    if (!rawMarkdown) return "";

    const renderer = new marked.Renderer();
    renderer.link = ({ href, title, text }) => {
      const titleAttr = title ? ` title="${title}"` : "";
      return `<a href="${href}" target="_blank" rel="noopener noreferrer"${titleAttr}>${text}</a>`;
    };

    return marked.parse(rawMarkdown, { renderer, gfm: true, breaks: true }) as string;
  }, [project]);

  const projectImage = project?.coverImage || project?.image || project?.photo;

  if (loading && !project) {
    return (
      <main className="page-shell project-detail-shell">
        <nav className="site-nav" aria-label="Detail navigation">
          <Link className="brand" to="/">
            <Crown aria-hidden="true" /> Vinay Sikarwar
          </Link>
          <div className="nav-links">
            <Link to="/" className="detail-nav-back">
              <ArrowLeft size={16} aria-hidden="true" />
              <span>Back to home</span>
            </Link>
          </div>
        </nav>
        <div className="detail-loading-state">
          <div className="detail-spinner" />
          <p>Loading project details...</p>
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="page-shell project-detail-shell">
        <nav className="site-nav" aria-label="Detail navigation">
          <Link className="brand" to="/">
            <Crown aria-hidden="true" /> Vinay Sikarwar
          </Link>
          <div className="nav-links">
            <Link to="/" className="detail-nav-back">
              <ArrowLeft size={16} aria-hidden="true" />
              <span>Back to home</span>
            </Link>
          </div>
        </nav>
        <div className="detail-not-found">
          <h2>Project Not Found</h2>
          <p>
            The project &ldquo;{slug}&rdquo; could not be found or may have been updated.
          </p>
          <Link to="/" className="detail-cta-btn">
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Return to Portfolio</span>
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <>
      <main className="page-shell project-detail-shell">
        {/* Navigation Bar */}
        <nav className="site-nav" aria-label="Detail navigation">
          <Link className="brand" to="/">
            <Crown aria-hidden="true" /> Vinay Sikarwar
          </Link>
          <div className="nav-links">
            <Link to="/" className="detail-nav-back">
              <ArrowLeft size={16} aria-hidden="true" />
              <span>Back to all projects</span>
            </Link>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="detail-header-live-btn"
              >
                <span>Live Site</span>
                <ExternalLink size={14} aria-hidden="true" />
              </a>
            )}
          </div>
        </nav>

        {/* Article Layout */}
        <article className="project-detail-article">
          {/* Header & Meta */}
          <header className="project-detail-header">
            <div className="detail-meta-pill-row">
              {project.category && (
                <span className="project-category-tag">{project.category}</span>
              )}
              {project.status && (
                <span className="project-status-tag">
                  <span className="status-dot" aria-hidden="true" />
                  {project.status}
                </span>
              )}
              <span className="detail-reading-time">
                <Clock size={13} aria-hidden="true" />
                {readTimeMinutes} min read
              </span>
            </div>

            <h1 className="project-detail-title">{project.title}</h1>

            {project.summary && (
              <p className="project-detail-lead">{project.summary}</p>
            )}

            <div className="project-detail-author-row">
              <div className="author-info">
                <div className="author-avatar" aria-hidden="true">
                  <User className="avatar-icon" />
                </div>
                <div>
                  <span className="author-name">
                    {project.author || "Vinay Sikarwar"}
                  </span>
                  <span className="author-role">Software Developer</span>
                </div>
              </div>

              {project.updatedAt && (
                <span className="detail-updated-badge">
                  Updated {project.updatedAt}
                </span>
              )}
            </div>
          </header>

          {/* Featured Cover / Image */}
          {projectImage && (
            <div className="project-detail-media-wrap">
              <img
                src={projectImage}
                alt={`${project.title} illustration preview`}
                className="project-detail-media"
              />
            </div>
          )}

          {/* Rendered Markdown Content */}
          <div
            className="project-detail-prose"
            dangerouslySetInnerHTML={{ __html: parsedHtml }}
          />

          {/* Next Steps / CTA Box */}
          <div className="project-detail-cta-box">
            <div className="detail-cta-copy">
              <div className="footer-badge hand">
                <Sparkles className="badge-icon" aria-hidden="true" />
                <span>Project Case Study</span>
              </div>
              <h3>Explore {project.title} in action</h3>
              <p>
                Visit the live application or head back to explore more projects.
              </p>
            </div>

            <div className="detail-cta-actions">
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-cta-primary"
                >
                  <span>Launch Live Project</span>
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              )}
              <Link to="/" className="modal-cta-secondary">
                <ArrowLeft size={16} aria-hidden="true" />
                <span>Back to Portfolio</span>
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
