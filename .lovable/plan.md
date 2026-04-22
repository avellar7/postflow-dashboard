

## Plan: Add Anti-Detection, Metadata Profile, and Video Variations to Loop and Postar Pages

### What will be added

Based on the reference screenshot, three new feature sections will be added to both the **Loop** and **Postar** pages:

1. **Updated Effects section** (Loop page)
   - Replace "Ajustes leves" with "Desfoque leve" (Filtro de privacidade)
   - Add an active effects counter badge in the section header (e.g., "1" when one effect is on)

2. **Anti-detecção IA** toggle
   - A highlighted card (with a subtle primary border when active) containing a toggle for "Anti-detecção IA" with subtitle "Variação automática"
   - When enabled, applies automatic visual variations to evade duplicate content detection

3. **Perfil de metadata** selector
   - Label: "Perfil de metadata" with subtitle "Como o vídeo se identifica para o Instagram"
   - Four pill-style buttons: Auto (default selected), iPhone, Android, Desligado
   - Only one can be selected at a time

4. **Variações por vídeo** slider
   - Label: "Variações por vídeo (alterna a cada ciclo)" with current value shown (e.g., "3x")
   - Range slider from 1 to 5
   - Helper text below: "Cada vídeo da pasta gera X versões diferentes; o sistema alterna entre elas a cada ciclo."

### Where each feature goes

- **Loop page**: All four features added to the right column, inside or below the existing Effects card. The "Criar Loop" button text replaces "Iniciar Loop".
- **Postar page**: Anti-detecção IA, Metadata Profile, and Variations slider added as a new "Configurações avançadas" card in the right column, between the Agendamento and Fila sections.

### Files changed

| File | Change |
|------|--------|
| `src/pages/LoopPage.tsx` | Add `blur` to effects state, replace "Ajustes leves" with "Desfoque leve", add active-count badge to Effects header, add Anti-detecção IA toggle, Metadata profile selector, Variations slider, rename button to "Criar Loop" |
| `src/pages/PostarPage.tsx` | Add new state for `antiDetection`, `metadataProfile`, `variations`. Add a new glass-card section with Anti-detecção IA, Metadata profile, and Variations slider |

### Technical details

- New state variables: `antiDetection: boolean`, `metadataProfile: 'auto' | 'iphone' | 'android' | 'off'`, `variations: number`
- Effects counter computed via `Object.values(effects).filter(Boolean).length`
- Metadata selector uses pill-button pattern already present in the codebase (similar to post mode selector)
- Slider reuses the native range input with `accent-primary` styling already used for the interval slider
- Anti-detecção card gets a `border-primary/50 bg-primary/5` highlight when active, matching the reference

