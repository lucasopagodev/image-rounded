import { useEffect, useRef, useState } from "react";
import Editor from "./components/Editor";
import type { EditorHandle } from "./components/Editor";
import { COPY, LOCALES, type Locale } from "./utils/i18n";
import "./App.css";

export default function App() {
  const editorRef = useRef<EditorHandle | null>(null);
  const [locale, setLocale] = useState<Locale>("en");
  const copy = COPY[locale];

  function scrollToEditor() {
    document.getElementById("editor")?.scrollIntoView({ behavior: "smooth" });
  }

  function handleStart() {
    scrollToEditor();
    editorRef.current?.openFileDialog();
  }

  useEffect(() => {
    document.documentElement.lang = locale === "pt-BR" ? "pt-BR" : "en";
  }, [locale]);

  return (
    <div className="app">
      <header className="site-header">
        <div className="container header-inner">
          <div className="brand">
            <span className="logo-mark" aria-hidden="true">
              ◼
            </span>
            <span className="brand-name">{copy.brand}</span>
          </div>
          <nav className="nav-links" aria-label={copy.header.navigationLabel}>
            <a href="#editor">{copy.header.editor}</a>
            <a href="#como-funciona">{copy.header.how}</a>
          </nav>
          <div className="header-actions">
            <label className="sr-only" htmlFor="language-select">
              {copy.header.languageLabel}
            </label>
            <select
              id="language-select"
              className="lang-select"
              value={locale}
              onChange={(event) => setLocale(event.target.value as Locale)}
            >
              {LOCALES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button className="btn primary" type="button" onClick={handleStart}>
              {copy.header.cta}
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-content">
              <p className="eyebrow">{copy.hero.eyebrow}</p>
              <h1 className="hero-title">{copy.hero.title}</h1>
              <p className="hero-subtitle">{copy.hero.subtitle}</p>
              <div className="hero-actions">
                <button className="btn primary" type="button" onClick={handleStart}>
                  {copy.hero.primaryCta}
                </button>
                <a className="btn ghost" href="#editor">
                  {copy.hero.secondaryCta}
                </a>
              </div>
              <p className="hero-note">{copy.hero.note}</p>
            </div>
            <div className="hero-card">
              {copy.hero.cards.map((card) => (
                <div className="hero-card-item" key={card.title}>
                  <strong>{card.title}</strong>
                  <span>{card.description}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="editor" className="section editor-section">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">{copy.editorSection.eyebrow}</p>
              <h2 className="section-title">{copy.editorSection.title}</h2>
              <p className="section-subtitle">{copy.editorSection.subtitle}</p>
            </div>
            <Editor ref={editorRef} copy={copy.editor} />
          </div>
        </section>

        <section id="como-funciona" className="section how-section">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">{copy.howSection.eyebrow}</p>
              <h2 className="section-title">{copy.howSection.title}</h2>
            </div>
            <div className="how-grid">
              {copy.howSection.cards.map((card) => (
                <div className="how-card" key={card.title}>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section trust-section">
          <div className="container trust-card">
            <div>
              <p className="eyebrow">{copy.trustSection.eyebrow}</p>
              <h2 className="section-title">{copy.trustSection.title}</h2>
              <p className="section-subtitle">{copy.trustSection.subtitle}</p>
            </div>
            <div className="trust-list">
              {copy.trustSection.points.map((point) => (
                <div key={point.title}>
                  <strong>{point.title}</strong>
                  <span>{point.description}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <span>{copy.brand}</span>
          <span>{copy.footer.tagline}</span>
        </div>
      </footer>
    </div>
  );
}
