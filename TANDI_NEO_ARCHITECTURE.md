# Tandi NEO — arquitetura v0.1 (experimental)

Base visual: `tandicell/NextChatBR` (MIT; manter o arquivo LICENSE e avisos legais).
Deploy planejado: `https://tandi.tech` em Ubuntu 24.04 LTS, Node.js 22, Nginx e Let's Encrypt.

## Arquitetura

```text
Tandi.tech (NextChatBR modificado)
  |  interface, chat, histórico local, PWA
  +-- Tandi NEO Local (cliente/browser)
  |     +-- WebGPU + WebLLM + modelo compacto (texto)
  |     +-- futuro: WASM/CPU fallback
  |     +-- futuro: VLM para análise de imagens
  |     +-- futuro: geração de imagens on-device
  |     +-- futuro: renderização de vídeo e modelos temporais
  +-- VPS Ubuntu (sem GPU)
        +-- Next.js/Node 22 (serve interface)
        +-- Nginx + TLS
        +-- futuro: usuários, sincronização e biblioteca de arquivos
```

## O que funciona nesta branch

- Adiciona um provedor de chat **Tandi NEO Local**, selecionado por padrão em instalações novas.
- Detecta WebGPU e solicita autorização antes de baixar um modelo.
- Baixa modelo pequeno e faz **geração de texto local** com streaming via WebLLM.
- Mantém o visual NextChat existente e adapta metadados da marca.
- Não é necessário configurar uma chave de IA paga para o provedor Tandi NEO Local.

## Limitações importantes

- **Não houve teste end-to-end em navegador real ou build em VPS.**
- A execução local exige WebGPU, RAM livre e compatibilidade com o modelo escolhido.
- O modelo `Qwen2.5-0.5B-Instruct-q4f16_1-MLC` e a versão WebLLM estão provisoriamente fixados; compatibilidade e licença dos pesos devem ser verificadas antes de produção.
- Dependência externa em `https://esm.sh` e hosts usados para downloads de pesos. Revisar e, idealmente, hospedar o runtime localmente após auditoria.
- Gerar ou compreender imagens e gerar vídeos **ainda não está implementado**.
- Fallback CPU, autenticação própria e sincronização **ainda não estão implementados**.
- A interface NextChat ainda contém opções de outros provedores. O provedor padrão é local, mas remover completamente integrações antigas é trabalho posterior.
- Histórico e preferências são gerenciados pela interface NextChat no armazenamento do navegador.
- Não ativar funções de compartilhamento ou endpoints de proxies existentes sem auditoria; a casca original contém funções relacionadas a serviços externos.

## Segurança e implantação

Recomendamos uma VPS **nova**, não uma máquina que também hospede outros domínios.
Executar `deploy/install-ubuntu24.sh` no servidor após apontar DNS de `tandi.tech`.
A instalação deve ser testada em staging antes de anunciar serviço público.
Verificar `npm/yarn audit`, licença de pesos, política de privacidade, suporte WebGPU e teste de carga do Next.js.

## Etapas seguintes

1. Teste em Android/Chrome, Android/Edge e iOS/Safari, com medições de memória e tokens/s.
2. Empacotar o runtime WebLLM na própria aplicação para reduzir dependências externas.
3. Gerenciador adaptativo de modelos e fallback via WASM.
4. Módulos reais de geração e interpretação de imagens.
5. Módulos reais de geração de vídeos, sujeitos às limitações de hardware.
6. Identidade visual e navegação em modo estúdio.
