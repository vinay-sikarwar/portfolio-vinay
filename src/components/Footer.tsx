import { useState } from "react";
import {
  ArrowUp,
  Check,
  Copy,
  Crown,
  Github,
  Linkedin,
  Mail,
  MapPin,
} from "lucide-react";
import footerBackground from "../assets/footer-background.png";

export function Footer() {
  const [copied, setCopied] = useState(false);
  const email = "vinaysikarwar199@gmail.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="site-footer" id="contact">
      {/* Background panoramic landscape */}
      <div className="footer-scenic-bg" aria-hidden="true">
        <img
          src={footerBackground}
          alt=""
          className="footer-bg-img"
          loading="lazy"
        />
        <div className="footer-bg-top-fade" />
        <div className="footer-bg-bottom-tint" />
      </div>

      {/* Main unified footer content */}
      <div className="footer-content">
        {/* Compact CTA Section in the sky */}
        <div className="footer-cta-block">
          <div className="footer-cta-badge hand">
            <span>Let&apos;s talk</span> ↘
          </div>

          <h2 className="footer-cta-title">
            Have a project in mind, <span>or just want to say hi?</span>
          </h2>

          <p className="footer-cta-desc">
            I&apos;m always open to discussing modern web development, full-stack
            ideas, or opportunities.
          </p>

          <div className="footer-cta-actions">
            <a
              href={`mailto:${email}?subject=Hello%20Vinay!`}
              className="footer-btn footer-btn-primary"
            >
              <Mail className="btn-icon" aria-hidden="true" />
              <span>Say Hello</span>
            </a>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="footer-btn footer-btn-secondary"
              title="Copy email address to clipboard"
            >
              {copied ? (
                <>
                  <Check className="btn-icon text-success" aria-hidden="true" />
                  <span>Copied to clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="btn-icon" aria-hidden="true" />
                  <span>{email}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Scenic breathing room showing the sun, mountains, and river */}
        <div className="footer-scenic-spacer" aria-hidden="true" />

        {/* Compact bottom bar over dark forest foreground */}
        {/* <div className="footer-bottom-bar-wrap">
          <div className="footer-bottom-grid">
            <div className="footer-brand-col">
              <a
                href="#top"
                className="footer-logo"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTop();
                }}
              >
                <Crown aria-hidden="true" />
                <span>Vinay Sikarwar</span>
              </a>
              <p className="footer-bio">
                Software Developer • MERN Stack & Problem Solver
              </p>
              <div className="footer-location">
                <MapPin className="pin-icon" aria-hidden="true" />
                <span>Indore, Madhya Pradesh, India</span>
              </div>
            </div>

            <div className="footer-links-col">
              <span className="footer-col-title">Navigation</span>
              <div className="footer-nav-list">
                <a href="#top">Home</a>
                <a href="#projects">Selected Work</a>
                <a href="#about">About</a>
                <a href="#contact">Contact</a>
              </div>
            </div>

            <div className="footer-social-col">
              <span className="footer-col-title">Connect</span>
              <div className="footer-social-list">
                <a
                  href="https://github.com/vinay-sikarwar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <Github className="social-icon" aria-hidden="true" />
                  <span>GitHub</span>
                </a>
                <a
                  href="https://linkedin.com/in/vinay-sikarwar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <Linkedin className="social-icon" aria-hidden="true" />
                  <span>LinkedIn</span>
                </a>
                <a href={`mailto:${email}`} className="social-link">
                  <Mail className="social-icon" aria-hidden="true" />
                  <span>Email</span>
                </a>
              </div>
            </div>
          </div>

          <div className="footer-copyright-row">
            <p className="copyright-text">
              © {new Date().getFullYear()} Vinay Sikarwar. Built with care & React.
            </p>
            <button
              type="button"
              onClick={scrollToTop}
              className="back-to-top-btn"
              aria-label="Back to top of page"
            >
              <span>Back to top</span>
              <ArrowUp className="arrow-icon" aria-hidden="true" />
            </button>
          </div>
        </div> */}
      </div>
    </footer>
  );
}
