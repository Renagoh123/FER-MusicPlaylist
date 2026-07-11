import {
  Activity,
  BarChart3,
  BrainCircuit,
  Camera,
  Code2,
  ExternalLink,
  Flame,
  Gauge,
  Github,
  Layers3,
  ListMusic,
  Music,
  Smile,
} from "lucide-react";
import { CameraCapture } from "@/components/CameraCapture";

const githubUrl = "https://github.com/Renagoh123/FER-MusicPlaylist";

const navLinks = [
  { href: "#hero", label: "Demo" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#results", label: "Results & Performance" },
  { href: "#about", label: "About" }
];

const workflowSteps = [
  {
    icon: Camera,
    title: "Capture",
    description: "Webcam captures your facial expressions in real-time."
  },
  {
    icon: BrainCircuit,
    title: "Analyze",
    description: "ResNet18 + CBAM model analyzes facial features to predict emotion."
  },
  {
    icon: Smile,
    title: "Predict",
    description: "The model outputs the most likely emotion with confidence score."
  },
  {
    icon: ListMusic,
    title: "Recommend",
    description: "We map the emotion to a Spotify playlist that fits your mood."
  },
  {
    icon: Music,
    title: "Enjoy",
    description: "Open the playlist in Spotify and enjoy your personalized vibe."
  }
];

const metrics = [
  { icon: BarChart3, label: "Precision", value: "0.79", tone: "purple" },
  { icon: Activity, label: "Recall", value: "0.78", tone: "cyan" },
  { icon: Gauge, label: "F1-score", value: "0.78", tone: "pink" }
];

const emotionMappings = [
  { emoji: "😊", emotion: "Happy", playlist: "Uplifting / Pop" },
  { emoji: "😢", emotion: "Sad", playlist: "Mellow / Acoustic" },
  { emoji: "😠", emotion: "Angry", playlist: "Intense / Rock" },
  { emoji: "😐", emotion: "Neutral", playlist: "Chill / Lo-fi" }
];

export default function Home() {
  return (
    <>
      <nav className="site-nav" aria-label="Primary navigation">
        <a className="brand" href="#hero" aria-label="FER Playlist home">
          <span className="brand-mark" aria-hidden="true">:)</span>
          <span>FER Playlist</span>
        </a>
        <div className="nav-links">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>
      </nav>

      <main>
        <section id="hero" className="hero-section" aria-labelledby="hero-title">
          <CameraCapture />
        </section>

        <section id="how-it-works" className="how-section" aria-labelledby="how-title">
          <header className="section-heading">
            <p className="eyebrow">Pipeline</p>
            <h2 id="how-title">How It Works</h2>
          </header>
          <div className="workflow-timeline" aria-label="Emotion detection to playlist pipeline">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <article className="workflow-step" key={step.title}>
                  <div className="step-icon" aria-hidden="true">
                    <Icon size={34} />
                  </div>
                  <div className="step-copy">
                    <p className="step-number">{index + 1}</p>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section id="results" className="results-section" aria-labelledby="results-title">
          <header className="section-heading">
            <p className="eyebrow">Evaluation</p>
            <h2 id="results-title">Results &amp; Performance</h2>
          </header>
          <div className="results-grid">
            <article className="results-panel performance-panel">
              <p className="panel-kicker">Performance</p>
              <div className="donut-chart" aria-label="78 percent test accuracy">
                <span>78%</span>
              </div>
              <h3>Test Accuracy</h3>
              <p>Achieved on the FER-2013 test set using the CBAM-enhanced ResNet18 model.</p>
            </article>

            <article className="results-panel metrics-panel">
              <p className="panel-kicker">Model Metrics</p>
              <div className="metric-grid">
                {metrics.map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <div className={`metric-card metric-${metric.tone}`} key={metric.label}>
                      <Icon size={22} aria-hidden="true" />
                      <p>{metric.label}</p>
                      <strong>{metric.value}</strong>
                    </div>
                  );
                })}
              </div>
            </article>

            <article className="results-panel mapping-panel">
              <p className="panel-kicker subtle-kicker">Emotion Mapping</p>
              <table>
                <thead>
                  <tr>
                    <th>Emotion</th>
                    <th>Playlist Type</th>
                  </tr>
                </thead>
                <tbody>
                  {emotionMappings.map((mapping) => (
                    <tr key={mapping.emotion}>
                      <td>
                        <span aria-hidden="true">{mapping.emoji}</span>
                        {mapping.emotion}
                      </td>
                      <td>{mapping.playlist}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
          </div>
        </section>

        <section id="about" className="about-section" aria-labelledby="about-title">
          <header className="section-heading">
            <p className="eyebrow">Project Notes</p>
            <h2 id="about-title">About This Project</h2>
          </header>
          <div className="about-grid refined-about-grid">
            <article className="about-card architecture-card">
              <h3>Model Architecture</h3>
              <div className="architecture-flow corrected-architecture explicit-architecture" aria-label="Model architecture: 1-channel input to ResNet18 backbone to CBAM attention, then down to average pooling and flattening, dropout and fully connected classifier, and emotion output">
                <span className="architecture-node input-node">1-Ch Input</span>
                <span className="architecture-arrow arrow-right" aria-hidden="true">→</span>
                <span className="architecture-node backbone-node">ResNet18 Backbone</span>
                <span className="architecture-arrow arrow-right" aria-hidden="true">→</span>
                <span className="architecture-node attention-node">CBAM Attention</span>
                <span className="architecture-turn" aria-hidden="true">↓</span>
                <span className="architecture-node output-node">Emotion Output</span>
                <span className="architecture-arrow arrow-left" aria-hidden="true">←</span>
                <span className="architecture-node fc-node">Dropout + FC</span>
                <span className="architecture-arrow arrow-left" aria-hidden="true">←</span>
                <span className="architecture-node pool-node">AvgPool + Flatten</span>
              </div>
              <p>Grayscale facial input passes through ResNet18 features, CBAM attention, average pooling and flattening, then a dropout classifier.</p>
            </article>

            <article className="about-card dataset-card">
              <h3>Dataset</h3>
              <div className="dataset-feature dataset-feature-no-icon">
                <strong>FER-2013</strong>
                <p>35,887 grayscale facial images across 7 emotion classes.</p>

              </div>
            </article>

            <article className="about-card tech-card">
              <h3>Tech Stack</h3>
              <div className="tech-list" aria-label="Technology stack">
                <span className="tech-pill torch"><Flame size={28} aria-hidden="true" /> PyTorch</span>
                <span className="tech-pill cv"><Camera size={28} aria-hidden="true" /> OpenCV</span>
                <span className="tech-pill python"><Code2 size={28} aria-hidden="true" /> Python</span>
                <span className="tech-pill spotify"><Music size={28} aria-hidden="true" /> Spotify API</span>
                <span className="tech-pill next"><Layers3 size={28} aria-hidden="true" /> Next.js</span>
                <span className="tech-pill api"><BrainCircuit size={28} aria-hidden="true" /> FastAPI</span>
              </div>
            </article>

            <article className="about-card github-card">
              <h3>GitHub Repository</h3>
              <div className="github-feature">
                <span className="github-mark" aria-hidden="true">
                  <Github size={46} />
                </span>
                <p>Check out the source code, documentation, and project structure on GitHub.</p>
              </div>
              <a className="github-button" href={githubUrl} target="_blank" rel="noreferrer">
                View on GitHub <ExternalLink size={18} aria-hidden="true" />
              </a>
            </article>
          </div>
        </section>
      </main>

      <footer id="footer" className="site-footer">
        <div className="footer-inner">
          <p className="copyright">© 2025 FER Playlist. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}