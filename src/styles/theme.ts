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
        primary: '#4A90E2',   // Azul → cor principal do app (botões, cabeçalhos, destaques)
        secondary: '#6C757D', // Verde → cor secundária (detalhes, elementos de apoio)
        background: '#F8F9FA',// Cinza claro → cor de fundo das telas
        text: '#212529',      // Cinza escuro → cor padrão dos textos
        error: '#DC3545',     // Vermelho → usado em mensagens de erro
        success: '#28A745',   // Verde → usado em mensagens de sucesso
        warning: '#FFC107',   // Laranja → usado em mensagens de aviso
        white: '#FFFFFF',     // Branco → fundos, botões e contraste
        border: '#DEE2E6',    // Branco → borda
    },

    // ====== TIPOGRAFIA ======
    typography: {
        title: {
            fontSize: 24,      // Fonte para títulos principais
            fontWeight: 'bold' // Peso forte (destaque)
        },
        subtitle: {
            fontSize: 18,      // Fonte para subtítulos
            fontWeight: '600'  // Peso intermediário
        },
        body: {
            fontSize: 16,      // Fonte para textos comuns
            fontWeight: 'normal', // Peso normal
        },
        caption: {
            fontSize: 14,      // Fonte para textos legendas
            fontWeight: 'normal',   // Peso normal
        },
    },

    // ====== ESPAÇAMENTO ======
    spacing: {
        small: 8,   // Espaçamento pequeno (margens/paddings reduzidos)
        medium: 16, // Espaçamento médio (mais usado no app)
        large: 24,  // Espaçamento grande (seções maiores)
        xlarge: 32, // Espaçamento extra grande (seções muito grandes)
    },
};