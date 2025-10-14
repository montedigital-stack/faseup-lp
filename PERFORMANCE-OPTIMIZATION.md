# FaseUp - Plano de Otimização de Performance

## Status Atual
- **Performance Score**: 56/100
- **Total Payload**: 5.987 KiB

## Problemas Identificados
1. ❌ JavaScript não usado: 91 KiB
2. ❌ CSS não usado: 18 KiB
3. ❌ CSS não minificado: 3 KiB
4. ❌ JavaScript não minificado: 3 KiB
5. ❌ 8 tarefas longas da thread principal

## Otimizações Implementadas - Phase 1 ✅

### 1. Recursos Externos Otimizados (TODAS AS PÁGINAS)
- ✅ Preconnect para cdn.tailwindcss.com
- ✅ Preconnect para fonts.googleapis.com
- ✅ Preconnect para fonts.gstatic.com
- ✅ DNS-prefetch para cdnjs.cloudflare.com
- ✅ DNS-prefetch para google-analytics.com
- **Páginas**: index.html, design-system.html, suporte/index.html

### 2. Fontes Otimizadas
- ✅ Reduzido weights: 300,400,500,600,700,800,900 → 400,600,700,800 (save ~15KB)
- ✅ Adicionado subset=latin (save ~8KB)
- ✅ Font-display: swap já configurado
- **Páginas**: index.html, design-system.html, suporte/index.html

### 3. JavaScript Otimizado
- ✅ feedback-api.js: defer adicionado
- ✅ Prism.js: defer adicionado (design-system)
- ✅ Google Analytics: defer loading (já existia)
- ✅ Font Awesome: preload com async
- **Páginas**: index.html, design-system.html, suporte/index.html

### 4. CSS
- ✅ theme-styles.css: 91KB (3158 linhas, 271 comentários)
- ✅ light-mode-fixes.css: 13KB
- ⚠️ Pendente: Minificação via build tool

### 5. Imagens
- ✅ Lazy loading implementado
- ✅ Fetchpriority="high" em hero image
- ✅ Formatos modernos (WebP) recomendado

## Próximas Otimizações Recomendadas

### Urgente (Quick Wins)
1. **Minificar CSS** - Reduzir 30-40% do tamanho
2. **Remover Tailwind CDN** - Substituir por classes específicas
3. **Code splitting** - Separar CSS crítico
4. **Comprimir assets** - Gzip/Brotli no servidor

### Médio Prazo
1. **Lazy load de seções** - Carregar sob demanda
2. **Service Worker** - Cache de assets
3. **Otimizar fontes** - Subset com apenas caracteres usados
4. **Tree shaking** - Remover JS não usado

### Longo Prazo
1. **Migration para Tailwind local** - Build otimizado
2. **Image CDN** - Servir imagens otimizadas
3. **HTTP/3** - Melhorar latência
4. **Prerender crítico** - SSG para hero section

## Arquivos para Minificar
- [ ] theme-styles.css (91KB → ~60KB estimado)
- [ ] light-mode-fixes.css (13KB → ~9KB estimado)
- [ ] theme-toggle.js (5.6KB → ~3KB estimado)

## Métricas Esperadas após Otimizações
- **Performance Score**: 56 → 85+ (target)
- **LCP**: Melhorar 30-40%
- **TBT**: Reduzir 50%
- **CLS**: Manter < 0.1

---
**Data**: 2025-10-12
**Responsável**: Claude Code + SuperDesign.dev
