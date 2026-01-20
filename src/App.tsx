import { useRef } from "react";
import Editor from "./components/Editor";
import type { EditorHandle } from "./components/Editor";
import "./App.css";

export default function App() {
  const editorRef = useRef<EditorHandle | null>(null);

  function scrollToEditor() {
    document.getElementById("editor")?.scrollIntoView({ behavior: "smooth" });
  }

  function handleStart() {
    scrollToEditor();
    editorRef.current?.openFileDialog();
  }

  return (
    <div className="app">
      <header className="site-header">
        <div className="container header-inner">
          <div className="brand">
            <span className="logo-mark" aria-hidden="true">
              ◼
            </span>
            <span className="brand-name">Roundify Image</span>
          </div>
          <nav className="nav-links" aria-label="Navegação principal">
            <a href="#editor">Editor</a>
            <a href="#como-funciona">Como funciona</a>
          </nav>
          <button className="btn primary" type="button" onClick={handleStart}>
            Começar grátis
          </button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-content">
              <p className="eyebrow">Processamento 100% local</p>
              <h1 className="hero-title">Bordas suaves, exportação rápida.</h1>
              <p className="hero-subtitle">
                Arredonde imagens com preview real em Canvas e baixe em PNG, JPG ou
                WebP sem sair do navegador.
              </p>
              <div className="hero-actions">
                <button className="btn primary" type="button" onClick={handleStart}>
                  Enviar imagem
                </button>
                <a className="btn ghost" href="#editor">
                  Abrir editor
                </a>
              </div>
              <p className="hero-note">PNG recomendado para transparência.</p>
            </div>
            <div className="hero-card">
              <div className="hero-card-item">
                <strong>Upload instantâneo</strong>
                <span>Arraste, solte ou selecione.</span>
              </div>
              <div className="hero-card-item">
                <strong>Controle preciso</strong>
                <span>Raio, escala e qualidade em tempo real.</span>
              </div>
              <div className="hero-card-item">
                <strong>Exportação segura</strong>
                <span>Nenhum arquivo sai do seu dispositivo.</span>
              </div>
            </div>
          </div>
        </section>

        <section id="editor" className="section editor-section">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">Editor</p>
              <h2 className="section-title">Ajuste o raio e exporte em um clique</h2>
              <p className="section-subtitle">
                Preview real no Canvas 2D. JPG recebe fundo branco automaticamente.
              </p>
            </div>
            <Editor ref={editorRef} />
          </div>
        </section>

        <section id="como-funciona" className="section how-section">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">Como funciona</p>
              <h2 className="section-title">Três passos simples</h2>
            </div>
            <div className="how-grid">
              <div className="how-card">
                <h3>1. Envie</h3>
                <p>Upload local com drag & drop, sem servidor.</p>
              </div>
              <div className="how-card">
                <h3>2. Ajuste</h3>
                <p>Controle raio, escala e formato em tempo real.</p>
              </div>
              <div className="how-card">
                <h3>3. Exporte</h3>
                <p>Baixe PNG, JPG ou WebP com um clique.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section trust-section">
          <div className="container trust-card">
            <div>
              <p className="eyebrow">Privacidade</p>
              <h2 className="section-title">Processamento local de ponta a ponta</h2>
              <p className="section-subtitle">
                Suas imagens ficam no seu navegador. Sem upload, sem rastreamento,
                sem armazenar arquivos.
              </p>
            </div>
            <div className="trust-list">
              <div>
                <strong>Zero backend</strong>
                <span>Canvas 2D direto no browser.</span>
              </div>
              <div>
                <strong>Transparência preservada</strong>
                <span>PNG mantém alpha intacto.</span>
              </div>
              <div>
                <strong>Exportação rápida</strong>
                <span>toBlob + download imediato.</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <span>Roundify Image</span>
          <span>Feito para designers, devs e criadores.</span>
        </div>
      </footer>
    </div>
  );
}
