# Henshin DB

> A modern Tokusatsu database built with React

[Henshin DB](https://henshindb.netlify.app/) é um aplicativo web focado em **tokusatsu japonês**, criado para organizar e explorar informações sobre **personagens**, **publicações**, **colecionáveis** e **termos** relacionados a franquias clássicas e modernas.

## ✨ Funcionalidades

* 📚 Catálogo de **Personagens** com ficha técnica detalhada
* 🧸 Banco de **Colecionáveis** (DX, SHF, sofubi, mechas, etc.)
* 📖 **Publicações** (livros, mooks, guias oficiais)
* 📘 **Glossário** JP → PT / EN
* 🧭 Navegação por **franquias**:
  * Kamen Rider
  * Super Sentai
  * Metal Hero
  * Ultraman
  * Cybercops
* 📴 **Modo offline** com cache local
* 📱 Interface moderna com React e Tailwind CSS
* 🎨 Design temático com ícones SVG customizados
* 🌐 Suporte a múltiplos idiomas (PT, EN, JA)

## 🛠️ Stack Tecnológica

* **React 18** - Framework frontend
* **Vite** - Build tool e dev server
* **Tailwind CSS** - Estilização
* **React Router** - Roteamento
* **Supabase** - Backend (PostgreSQL + Storage)
* **Lucide React** - Ícones
* **Capacitor** - Build mobile (Android/iOS)
* **PWA** - Progressive Web App

## 🚀 Como executar

### Pré-requisitos

- Node.js 18+ e npm

### Instalação

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

### Mobile (Capacitor)

```bash
# Sincronizar com Capacitor
npm run sync

# Abrir projeto Android
npm run android

# Abrir projeto iOS
npm run ios
```

## 📁 Estrutura do Projeto

```
henshin-db/
├── src/
│   ├── components/      # Componentes React reutilizáveis
│   │   ├── icons/       # Ícones SVG customizados
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Modal.jsx
│   │   ├── Card.jsx
│   │   └── Button.jsx
│   ├── pages/           # Páginas/Views
│   │   ├── Home.jsx
│   │   ├── CharactersPage.jsx
│   │   ├── GlossaryPage.jsx
│   │   ├── PublicationsPage.jsx
│   │   └── CollectiblesPage.jsx
│   ├── hooks/           # Custom hooks
│   │   ├── useLanguage.js
│   │   └── useCache.js
│   ├── lib/             # Utilitários
│   │   ├── supabase.js
│   │   └── i18n.js
│   ├── App.jsx          # Componente principal
│   ├── main.jsx         # Entry point
│   └── index.css        # Estilos globais
├── www/                 # Build output (para Capacitor)
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## 🎨 Design System

O projeto usa um design system customizado com tema tokusatsu:

- **Cores**: Paleta escura com gradientes temáticos por franquia
- **Tipografia**: System fonts para performance
- **Componentes**: Cards, botões, modais com animações suaves
- **Ícones**: SVG customizados para cada franquia

## 🌐 Internacionalização

O app suporta 3 idiomas:
- Português (PT)
- Inglês (EN)
- Japonês (JA)

O idioma é detectado automaticamente do navegador ou pode ser alterado manualmente.

## 📴 Modo Offline

O app funciona offline usando:
- **LocalStorage** para cache de dados
- **Service Worker** para cache de assets
- Fallback automático quando sem conexão

## 👩‍💻 Autor

**Mayara Gouveia**
Tokusatsu fan · [Developer](https://www.linkedin.com/in/gb8may/) · [Collector](https://www.instagram.com/mj3d_printing.ca/)

---

> *This project is a fan-made, non-commercial database created with respect for the original works and their creators.*
