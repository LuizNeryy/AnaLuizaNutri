# Guia de Customização - Site Ana Luiza Nutricionista

## 📋 Visão Geral

Este guia explica como personalizar as cores e estilos do site de forma fácil e organizada. Todo o CSS foi separado em variáveis para facilitar mudanças.

## 🎨 Alterando Cores Principais

### Localização das Variáveis
Todas as cores estão definidas no arquivo `css/style.css` na seção `:root`:

```css
:root {
    /* Cores principais */
    --emerald-50: #ecfdf5;
    --emerald-100: #d1fae5;
    --emerald-500: #10b981;
    --emerald-600: #059669;
    --emerald-700: #047857;
    --emerald-800: #065f46;
    
    /* Cores neutras */
    --stone-50: #fafaf9;
    --gray-300: #d1d5db;
    --gray-400: #9ca3af;
    /* ... */
}
```

### Como Alterar o Esquema de Cores

**1. Para mudar a cor principal (verde esmeralda):**
- Altere as variáveis `--emerald-*` com seus novos valores
- Exemplo para azul: `--emerald-600: #2563eb;`

**2. Para mudar cores de fundo:**
- `--stone-50`: Cor de fundo geral do site
- `--gray-800`: Cor do rodapé

**3. Para mudar cores de texto:**
- `--gray-600`: Textos secundários
- `--gray-800`: Textos principais

## 🔧 Classes Principais para Customização

### Botões
- `.btn-primary`: Botão principal (verde)
- `.btn-secondary`: Botão secundário (cinza escuro)
- `.btn-hero`: Botão especial da seção principal
- `.btn-disabled`: Botão desabilitado

### Cores de Texto e Fundo
- `.primary-bg`: Fundo com cor principal
- `.primary-text`: Texto com cor principal
- `.accent-bg`: Fundo com cor de destaque
- `.accent-text`: Texto com cor de destaque

### Elementos Especiais
- `.emerald-divider`: Linha divisória verde
- `.emerald-icon-bg`: Fundo dos ícones
- `.emerald-icon`: Cor dos ícones
- `.section-contact`: Seção de contato

### Badges e Etiquetas
- `.badge-free`: Etiqueta "GRATUITO"
- `.badge-price`: Etiqueta de preço
- `.badge-coming-soon`: Etiqueta "EM BREVE"

## 🌈 Exemplos de Personalização

### Mudança para Tema Azul
```css
:root {
    --emerald-50: #eff6ff;
    --emerald-100: #dbeafe;
    --emerald-500: #3b82f6;
    --emerald-600: #2563eb;
    --emerald-700: #1d4ed8;
    --emerald-800: #1e40af;
}
```

### Mudança para Tema Rosa
```css
:root {
    --emerald-50: #fdf2f8;
    --emerald-100: #fce7f3;
    --emerald-500: #ec4899;
    --emerald-600: #db2777;
    --emerald-700: #be185d;
    --emerald-800: #9d174d;
}
```

### Mudança para Tema Roxo
```css
:root {
    --emerald-50: #faf5ff;
    --emerald-100: #f3e8ff;
    --emerald-500: #a855f7;
    --emerald-600: #9333ea;
    --emerald-700: #7c3aed;
    --emerald-800: #6b21a8;
}
```

## 🎯 Dicas Importantes

1. **Sempre faça backup** do arquivo `style.css` antes de fazer alterações
2. **Teste as cores** em diferentes seções do site
3. **Mantenha contraste adequado** para acessibilidade
4. **Use ferramentas online** como [Coolors.co](https://coolors.co) para gerar paletas

## 📱 Responsividade

Todas as alterações de cores são automaticamente responsivas. Não é necessário alterar nada específico para mobile.

## 🛠️ Estrutura de Arquivos

```
AnaLuizaNutri/
├── css/
│   └── style.css (todas as customizações aqui)
├── index.html (sem estilos inline)
├── ebooks.html (sem estilos inline)
└── CUSTOMIZACAO.md (este arquivo)
```

## 🆘 Resolução de Problemas

Se alguma cor não mudar:
1. Verifique se a variável CSS está correta
2. Limpe o cache do navegador (Ctrl+F5)
3. Confirme que não há estilos inline sobrescrevendo

---

**Desenvolvido para facilitar a manutenção e personalização do site!** 🚀
