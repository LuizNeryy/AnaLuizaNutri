// Aguarda o carregamento completo da página para executar os scripts
document.addEventListener('DOMContentLoaded', () => {

    // Injeta os ícones do Lucide no HTML
    lucide.createIcons();

    // Lógica para o funcionamento do menu mobile
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Fecha o menu mobile ao clicar em um dos links de navegação
    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu) {
                mobileMenu.classList.add('hidden');
            }
        });
    });

    // Atualiza dinamicamente o ano no rodapé
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Adiciona um efeito de sombra no cabeçalho ao rolar a página
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('shadow-lg');
            } else {
                header.classList.remove('shadow-lg');
            }
        });
    }

    // Lógica para animação de fade-in ao rolar a página
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.1 // A animação começa quando 10% do elemento está visível
    });

    const elementsToAnimate = document.querySelectorAll('.fade-in-element');
    elementsToAnimate.forEach((el) => observer.observe(el));
});
