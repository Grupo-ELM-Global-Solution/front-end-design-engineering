document.addEventListener('DOMContentLoaded', () => {
    // Setup do Menu Hambúrguer
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNavList = document.querySelector('.main-navigation .nav-list');
    const primaryNav = document.getElementById('primary-navigation');

    if (menuToggle && mainNavList && primaryNav) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
            menuToggle.setAttribute('aria-expanded', String(!isExpanded));
            menuToggle.classList.toggle('active');
            mainNavList.classList.toggle('active-mobile-nav');
            primaryNav.setAttribute('aria-hidden', String(isExpanded));
            document.body.classList.toggle('mobile-nav-active');
        });
    }

    // Smooth scroll para links de âncora (global)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.pathname === window.location.pathname && this.hash !== "" && document.querySelector(this.hash)) {
                e.preventDefault();
                document.querySelector(this.hash).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- LÓGICA GLOBAL DE AUTENTICAÇÃO ---
    function protegerPaginasAreaUsuario() {
        const paginasProtegidas = [
            'meu-perfil.html',
            'diario-usuario.html',
            'mapa-usuario.html',
            'tecnicas-autocuidado.html'
        ];
        const paginaAtual = window.location.pathname;
        const ehPaginaProtegida = paginasProtegidas.some(p => paginaAtual.endsWith(p));

        if (ehPaginaProtegida) {
            if (typeof getUsuarioLogadoEmail === 'function') {
                if (!getUsuarioLogadoEmail()) {
                    console.log("Usuário não logado, redirecionando para a página de login desde script.js.");
                    window.location.href = '../cadastro-login.html';
                }
            } else {
                console.error('Função getUsuarioLogadoEmail não definida. Não é possível proteger a página.');
            }
        }
    }

    function configurarBotoesLogoutGlobais() {
        const logoutButtons = document.querySelectorAll('.btn-logout');
        logoutButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                if (typeof fazerLogout === 'function') {
                    fazerLogout();
                } else {
                    console.error('Função fazerLogout não definida. Logout manual.');
                    localStorage.removeItem('recomecoUsuarioLogadoEmail');
                }
            });
        });
    }

    function ajustarLinksLogoutParaAmbiente() {
        const logoutButtons = document.querySelectorAll('.btn-logout');
        let basePath = '/';
        if (window.location.hostname.includes('github.io')) {
            basePath = '/front-end-design-engineering/';
        }
        logoutButtons.forEach(button => {
            button.setAttribute('href', basePath + 'index.html');
        });
    }

    protegerPaginasAreaUsuario();
    configurarBotoesLogoutGlobais();
    ajustarLinksLogoutParaAmbiente();
});
