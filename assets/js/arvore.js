(() => {
    "use strict";

    const SUPABASE_URL = "https://diqkxxcwfsxhrjpgftgw.supabase.co/rest/v1/";
    const SUPABASE_PUBLIC_KEY = "sb_publishable_pqoq-q1aNR0tijhB6r8BVg_AE-dDP3G";
    const TABELA = "mensagens_arvore";
    const LIMITE_EXIBICAO = 60;

    const secao = document.getElementById("arvore-mensagens");

    if (!secao) return;

    const lista = secao.querySelector("#arvoreBilhetes");
    const contador = secao.querySelector("#arvoreContador");
    const formulario = secao.querySelector("#formArvoreMensagem");
    const campoNome = secao.querySelector("#arvoreNome");
    const campoMensagem = secao.querySelector("#arvoreMensagem");
    const contadorCaracteres = secao.querySelector("#arvoreCaracteres");
    const botaoEnviar = secao.querySelector("#arvoreEnviar");
    const status = secao.querySelector("#arvoreStatus");
    const dialogo = secao.querySelector("#arvoreDialog");
    const dialogoNome = secao.querySelector("#arvoreDialogNome");
    const dialogoTexto = secao.querySelector("#arvoreDialogTexto");
    const dialogoData = secao.querySelector("#arvoreDialogData");
    const botaoFecharDialogo = secao.querySelector("#arvoreFecharDialog");

    let cliente = null;
    let totalMensagens = 0;
    const idsExibidos = new Set();

    function atualizarStatus(mensagem, tipo = "sucesso") {
        status.textContent = mensagem;
        status.dataset.tipo = tipo;
    }

    function atualizarContadorCaracteres() {
        contadorCaracteres.textContent = `${campoMensagem.value.length}/280`;
    }

    function formatarData(data) {
        if (!data) return "";

        const valor = new Date(data);

        if (Number.isNaN(valor.getTime())) return "";

        return valor.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }

    function abrirBilhete(registro) {
        dialogoNome.textContent = `Com carinho, ${registro.nome || "Anônimo"}`;
        dialogoTexto.textContent = registro.mensagem || "";
        dialogoData.textContent = formatarData(registro.created_at);

        if (typeof dialogo.showModal === "function") {
            dialogo.showModal();
        }
    }

    function criarBilhete(registro) {
        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "arvore-mensagens__bilhete";
        botao.setAttribute("aria-label", `Abrir mensagem de ${registro.nome || "Anônimo"}`);

        const alfinete = document.createElement("span");
        alfinete.className = "arvore-mensagens__alfinete";
        alfinete.setAttribute("aria-hidden", "true");

        const texto = document.createElement("span");
        texto.className = "arvore-mensagens__bilhete-texto";
        texto.textContent = registro.mensagem || "";

        const autor = document.createElement("span");
        autor.className = "arvore-mensagens__bilhete-autor";
        autor.textContent = `— ${registro.nome || "Anônimo"}`;

        const data = document.createElement("span");
        data.className = "arvore-mensagens__bilhete-data";
        data.textContent = formatarData(registro.created_at);

        botao.append(alfinete, texto, autor, data);
        botao.addEventListener("click", () => abrirBilhete(registro));

        return botao;
    }

    function exibirMensagem(registro, noInicio = false) {
        if (!registro || idsExibidos.has(registro.id)) return;

        const vazio = lista.querySelector(".arvore-mensagens__vazio");
        if (vazio) vazio.remove();

        const bilhete = criarBilhete(registro);

        if (noInicio) {
            lista.prepend(bilhete);
        } else {
            lista.append(bilhete);
        }

        idsExibidos.add(registro.id);
    }

    function atualizarContadorMensagens(total) {
        totalMensagens = total;

        if (total === 0) {
            contador.textContent = "Sua árvore está esperando os primeiros bilhetinhos. 💗";
            return;
        }

        contador.textContent = total === 1
            ? "Esta árvore já recebeu 1 mensagem de carinho. 💗"
            : `Esta árvore já recebeu ${total} mensagens de carinho. 💗`;

        if (total > LIMITE_EXIBICAO) {
            contador.textContent += ` Exibindo as ${LIMITE_EXIBICAO} mais recentes.`;
        }
    }

    async function carregarMensagens() {
        lista.setAttribute("aria-busy", "true");
        lista.replaceChildren();
        idsExibidos.clear();

        try {
            const { data, error, count } = await cliente
                .from(TABELA)
                .select("id, nome, mensagem, created_at", { count: "exact" })
                .order("created_at", { ascending: false })
                .limit(LIMITE_EXIBICAO);

            if (error) throw error;

            (data || []).forEach((registro) => exibirMensagem(registro));
            atualizarContadorMensagens(count ?? (data || []).length);

            if (!data || data.length === 0) {
                const vazio = document.createElement("p");
                vazio.className = "arvore-mensagens__vazio";
                vazio.textContent = "Ainda não há bilhetes por aqui. Seja a primeira pessoa a deixar um carinho! 💌";
                lista.append(vazio);
            }
        } catch (error) {
            console.error("Erro ao carregar mensagens da árvore:", error.message);
            const aviso = document.createElement("p");
            aviso.className = "arvore-mensagens__erro";
            aviso.textContent = "Não foi possível carregar os bilhetinhos agora. Atualize a página ou tente novamente mais tarde.";
            lista.append(aviso);
            contador.textContent = "As mensagens estão temporariamente indisponíveis.";
        } finally {
            lista.setAttribute("aria-busy", "false");
        }
    }

    async function enviarMensagem(evento) {
        evento.preventDefault();

        const nome = campoNome.value.trim().slice(0, 50) || "Anônimo";
        const mensagem = campoMensagem.value.trim();

        if (mensagem.length < 3 || mensagem.length > 280) {
            atualizarStatus("A mensagem precisa ter entre 3 e 280 caracteres.", "erro");
            campoMensagem.focus();
            return;
        }

        botaoEnviar.disabled = true;
        botaoEnviar.textContent = "Enviando…";
        atualizarStatus("Enviando seu carinho…");

        try {
            const { data, error } = await cliente
                .from(TABELA)
                .insert({ nome, mensagem })
                .select("id, nome, mensagem, created_at")
                .single();

            if (error) throw error;

            const jaEstavaExibida = idsExibidos.has(data.id);
            exibirMensagem(data, true);

            if (!jaEstavaExibida) {
                atualizarContadorMensagens(totalMensagens + 1);
            }

            formulario.reset();
            atualizarContadorCaracteres();
            atualizarStatus("Seu bilhete já está na árvore. Obrigado por esse carinho! 💗");
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error.message);
            atualizarStatus("Não foi possível enviar agora. Confira sua conexão e tente novamente.", "erro");
        } finally {
            botaoEnviar.disabled = false;
            botaoEnviar.textContent = "Pendurar meu bilhete ♡";
        }
    }

    function iniciarAtualizacaoAoVivo() {
        cliente
            .channel("arvore-mensagens-publicas")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: TABELA
                },
                (payload) => {
                    if (!payload.new || idsExibidos.has(payload.new.id)) return;

                    exibirMensagem(payload.new, true);
                    atualizarContadorMensagens(totalMensagens + 1);
                }
            )
            .subscribe();
    }

    function iniciar() {
        if (!window.supabase || typeof window.supabase.createClient !== "function") {
            atualizarStatus("A biblioteca do banco de dados não carregou. Recarregue a página.", "erro");
            contador.textContent = "Não foi possível conectar à árvore.";
            return;
        }

        if (
            SUPABASE_URL.includes("COLE_AQUI") ||
            SUPABASE_PUBLIC_KEY.includes("COLE_AQUI")
        ) {
            atualizarStatus("Configure a URL e a chave pública do Supabase no arquivo arvore.js.", "erro");
            contador.textContent = "A árvore ainda precisa ser conectada ao banco de dados.";
            lista.setAttribute("aria-busy", "false");
            return;
        }

        cliente = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);

        formulario.addEventListener("submit", enviarMensagem);
        campoMensagem.addEventListener("input", atualizarContadorCaracteres);
        botaoFecharDialogo.addEventListener("click", () => dialogo.close());
        dialogo.addEventListener("click", (evento) => {
            if (evento.target === dialogo) dialogo.close();
        });

        atualizarContadorCaracteres();
        carregarMensagens();
        iniciarAtualizacaoAoVivo();
    }

    iniciar();
})();
