import { Fragment, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowUpRight,
  BriefcaseBusiness,
  CodeXml,
  Crown,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";
import portrait from "./assets/vinay-cartoonish.png";

interface ZigzagHighlighterProps {
  children: ReactNode;
  color?: string;
  strokeWidth?: number;
  duration?: number;
}

function ZigzagHighlighter({
  children,
  color = "#f0c84b",
  strokeWidth = 30,
  duration = 1.15,
}: ZigzagHighlighterProps) {
  return (
    <span className="highlight zigzag-highlighter">
      <motion.svg
        className="zigzag-highlighter-art"
        viewBox="0 0 160 50"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <motion.path
          d="M 6,38 Q 22,22 34,14 Q 44,28 32,40 Q 58,24 74,13 Q 82,28 72,40 Q 96,25 112,14 Q 122,28 110,40 Q 134,26 154,15"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.9 }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{
            pathLength: { duration, ease: [0.25, 1, 0.5, 1] },
            opacity: { duration: 0.15 },
          }}
        />
      </motion.svg>
      <span className="zigzag-highlighter-text">{children}</span>
    </span>
  );
}

const skills = [
  ["♦", "MongoDB", "mongodb"],
  ["⚛", "React", "react"],
  ["JS", "Node.js", "node"],
  ["ex", "Express", "express"],
  ["JS", "JavaScript", "javascript"],
  ["TS", "TypeScript", "typescript"],
  ["♨", "Java", "java"],
  ["◉", "Git & GitHub", "github"],
] as const;

const projects = [
  {
    title: "A calmer way to manage work",
    meta: "2025 | SaaS, Product Design",
    kind: "pulse",
    label: "Pulse",
  },
  {
    title: "Making healthy habits feel possible",
    meta: "2024 | Mobile Design, React",
    kind: "bloom",
    label: "Bloom",
  },
  {
    title: "A better home for local businesses",
    meta: "2024 | Marketplace, Full Stack",
    kind: "atlas",
    label: "Atlas",
  },
  {
    title: "Turning messy data into clear decisions",
    meta: "2023 | Dashboard, Data Viz",
    kind: "signal",
    label: "Signal",
  },
] as const;

function App() {
  return (
    <main className="page-shell">
      <nav className="site-nav" aria-label="Main navigation">
        <a className="brand" href="#top">
          <Crown aria-hidden="true" /> Vinay Sikarwar
        </a>
        <div className="nav-links">
          <a className="active" href="#top">
            Home
          </a>
          <a href="#projects">Projects</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <span className="role-label">
            Software Developer <span aria-hidden="true">↗</span>
          </span>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <h1>
            I build web applications that are{" "}
            <ZigzagHighlighter color="#f0c84b">useful</ZigzagHighlighter>, clean and a little bit
            fun.
          </h1>
          <p className="hand subtitle">
            MERN stack&nbsp; × &nbsp;Java DSA&nbsp; × &nbsp;Problem Solver
          </p>
          <div className="scribble-line" />
        </div>
        <div className="portrait-wrap">
          <span className="hand greeting">
            Hi, I&apos;m Vinay
            <br />
            <strong>↘</strong>
          </span>
          <img src={portrait} alt="Hand-drawn portrait of Vinay" />
          <p className="hand portrait-note">
            Turning ideas
            <br />
            into real products,
            <br />
            (hopefully) :))
          </p>
        </div>
      </section>

      <section
        className="projects-section"
        id="projects"
        aria-labelledby="projects-title"
      >
        <div className="projects-heading">
          <span className="hand project-kicker">Selected work ↘</span>
          <h2 id="projects-title">
            Things I&apos;ve
            <br />
            <span>built with care.</span>
          </h2>
          <p>
            A few projects from the intersection of thoughtful design and useful
            technology.
          </p>
        </div>
        <div className="project-list">
          {projects.map((project, index) => (
            <article
              className={`project-row ${
                index % 2 ? "project-row-reverse" : ""
              }`}
              key={project.title}
            >
              <div
                className={`project-art project-art-${project.kind}`}
                aria-label={`${project.label} project preview`}
                role="img"
              >
                <div className="art-window">
                  <span className="window-dots">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="art-brand">{project.label}</span>
                  <span className="art-shape" />
                  <span className="art-line line-one" />
                  <span className="art-line line-two" />
                </div>
              </div>
              <div className="project-copy">
                <span className="project-number">0{index + 1}</span>
                <h3>{project.title}</h3>
                <p>{project.meta}</p>
                <a className="project-link" href="#contact">
                  View project <ArrowUpRight aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="about-grid" id="about">
        <div className="about-copy">
          <div className="section-heading">
            <span className="heading-rays" aria-hidden="true">
              ╲<br />━<br />╱
            </span>
            <h2>Here&apos;s how</h2>
            <span className="heading-underline" aria-hidden="true" />
          </div>
          <p>
            I&apos;m a Software Developer at Hotbit, where I work on modern web
            applications using the MERN stack. I love building things, solving
            tricky problems, and constantly learning new technologies.
          </p>
          <div className="details hand" id="contact">
            <span>
              <MapPin aria-hidden="true" /> Indore, India
            </span>
            <span>
              <BriefcaseBusiness aria-hidden="true" /> Hotbit Infosoft LLP
            </span>
            <span>
              <CodeXml aria-hidden="true" /> MERN | Java DSA
            </span>
          </div>
          <div className="scroll-note">
            <ArrowDown aria-hidden="true" />
            <span className="hand">
              Scroll to see
              <br />
              my projects
            </span>
          </div>
        </div>
        <div className="stack-area" id="work">
          <div className="stack-annotation hand">
            Tech stack <ArrowDownRight aria-hidden="true" />
          </div>
          <div className="stack-card">
            <div className="skills-grid">
              {skills.map(([mark, label, tone], index) => (
                <Fragment key={label}>
                  {index === 4 && <div className="skill-divider" />}
                  <div className="skill">
                    <span className={`skill-mark ${tone}`}>{mark}</span>
                    <span>{label}</span>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
          <div className="dream-note">
            <ArrowUpRight aria-hidden="true" />
            <span className="hand">
              Better
              <br />
              Code
              <br />
              Bigger
              <br />
              Dreams
            </span>
            <span className="dream-line">〰</span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
