# Roundify

Editor web para arredondar bordas de imagens e exportar em PNG, JPG ou WebP, tudo 100% local no navegador.

## Principais recursos

- Upload por drag & drop ou clique
- Preview real via Canvas 2D (não é CSS)
- Controle de raio, escala e qualidade
- Exportação instantânea com `toBlob()`
- PNG mantém transparência, JPG recebe fundo branco
- Interface responsiva em uma única página

## Stack

- React + TypeScript
- Vite
- Canvas 2D API
- CSS tradicional (Tailwind é opcional)

## Como rodar localmente

```bash
npm install
npm run dev
```

## Como buildar

```bash
npm run build
npm run preview
```

## Como funciona (Canvas)

1. A imagem é carregada localmente via `File` e `URL.createObjectURL`.
2. O preview é renderizado no Canvas 2D com recorte arredondado.
3. O export utiliza `canvas.toBlob()` em PNG, JPG ou WebP.
4. JPG recebe fundo branco para evitar transparência.

## Roadmap curto

- Presets de raio
- Exportação em lote
- Histórico de ajustes recentes
