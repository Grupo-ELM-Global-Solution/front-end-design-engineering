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

    protegerPaginasAreaUsuario();
    configurarBotoesLogoutGlobais();

    function ajustarLinksParaAmbiente() {
        const linksParaIndex = [
            ...document.querySelectorAll('.logo-link'),      // Logo no header
            ...document.querySelectorAll('.logo-link-footer'), // Logo no footer
            ...document.querySelectorAll('.btn-logout')     // Botões de Sair
            // Adicione outros seletores se necessário
        ];

        if (window.location.hostname.includes('github.io')) {
            // Assume que o nome do repositório é o primeiro segmento do pathname
            // Ex: /repo-name/assets/page.html -> /repo-name/
            const repoName = window.location.pathname.split('/')[1];
            const basePath = '/' + repoName + '/';

            linksParaIndex.forEach(link => {
                // Para botões de logout, queremos que eles façam logout E redirecionem
                // A função configurarBotoesLogoutGlobais já cuida do logout.
                // Aqui, estamos apenas garantindo que o HREF seja correto se não houver JS de logout.
                // Se o clique no logout já é prevenido e tratado, o href aqui serve como fallback ou se o JS de logout falhar.
                if (link.classList.contains('btn-logout')) {
                    // A lógica de logout em configurarBotoesLogoutGlobais previne o default e redireciona após o logout.
                    // No entanto, o href original precisa ser corrigido para o caso de o JS de logout ser desabilitado
                    // ou se o usuário abrir o link em nova aba.
                    // A função fazerLogout() é que deve cuidar do redirecionamento final após o logout.
                    // Mas, para consistência e fallback, ajustamos o href.
                    link.href = basePath + 'index.html';
                } else {
                    link.href = basePath + 'index.html';
                }
            });
        } else {
            // Localmente, os caminhos relativos como ../../../index.html devem funcionar
            // ou podemos padronizar para /index.html se servido da raiz.
            // Por enquanto, não faremos alterações nos links se estiver local,
            // assumindo que os caminhos relativos nos HTMLs estão corretos para o ambiente local.
            // Se quiséssemos forçar /index.html localmente:
            // linksParaIndex.forEach(link => {
            //     if (!link.classList.contains('btn-logout')) { // Não mexer no href do logout se ele é só '#'
            //         link.href = '/index.html';
            //     }
            // });
        }
    }

    ajustarLinksParaAmbiente();
});
