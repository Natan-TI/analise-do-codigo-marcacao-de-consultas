/**
 * styles/theme.ts
 * Responsabilidade: Centralizar cores, tipografia e espaçamentos usados no app.
 * Fluxo:
 *  - Define a paleta de cores principal
 *  - Define tamanhos de fonte para diferentes níveis de texto
 *  - Define espaçamentos padronizados
 * Por quê: Garante consistência visual em todas as telas e facilita manutenção.
 */

export default {
    // ====== CORES ======
    colors: {
        primary: '#2A86FF',   // Azul → cor principal do app (botões, cabeçalhos, destaques)
        secondary: '#00C48C', // Verde → cor secundária (detalhes, elementos de apoio)
        background: '#F5F5F5',// Cinza claro → cor de fundo das telas
        text: '#333333',      // Cinza escuro → cor padrão dos textos
        error: '#FF647C',     // Vermelho → usado em mensagens de erro
        success: '#00C48C',   // Verde → usado em mensagens de sucesso
        white: '#FFFFFF',     // Branco → fundos, botões e contraste
    },

    // ====== TIPOGRAFIA ======
    typography: {
        title: {
            fontSize: 24,      // Fonte para títulos principais
            fontWeight: 'bold' // Peso forte (destaque)
        },
        subtitle: {
            fontSize: 18,      // Fonte para subtítulos
            fontWeight: '500'  // Peso intermediário
        },
        body: {
            fontSize: 16,      // Fonte para textos comuns
        },
    },

    // ====== ESPAÇAMENTO ======
    spacing: {
        small: 8,   // Espaçamento pequeno (margens/paddings reduzidos)
        medium: 16, // Espaçamento médio (mais usado no app)
        large: 24,  // Espaçamento grande (seções maiores)
    },
};