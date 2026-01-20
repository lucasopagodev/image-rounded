# Roundify (Image Corner Editor)

Um editor web **clean, responsivo e intuitivo** para **arredondar bordas de imagens** e **exportar** em **PNG / JPG / WebP** — tudo **localmente no navegador**, sem backend.

> Ideal para criar imagens com cantos arredondados para avatares, cards, thumbnails e UI assets.

---

## Preview

- Upload por **drag & drop** ou clique
- **Preview em tempo real**
- Controle de **raio (px)**
- Export em **1 clique**
- **PNG com transparência**
- Ajustes de **escala** e **qualidade** (JPG/WebP)

---

## Principais recursos

- **Arredondamento real via Canvas** (não é só CSS)
- **Processamento local**: as imagens não são enviadas para servidor
- Export para:
  - **PNG** (recomendado: mantém transparência)
  - **JPG** (sem transparência, com fundo branco)
  - **WebP**
- UI **responsiva** (mobile e desktop)

---

## Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Canvas 2D API

---

## Como rodar localmente

### Pré-requisitos
- Node.js 18+ (recomendado)

### Passos
```bash
# 1) Instalar dependências
npm install

# 2) Rodar em modo dev
npm run dev
