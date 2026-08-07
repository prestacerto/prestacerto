export const CIDADES: Record<string, { name: string; state: string }> = {
  "sao-paulo": { name: "São Paulo", state: "SP" },
  "rio-de-janeiro": { name: "Rio de Janeiro", state: "RJ" },
  "belo-horizonte": { name: "Belo Horizonte", state: "MG" },
  "curitiba": { name: "Curitiba", state: "PR" },
  "porto-alegre": { name: "Porto Alegre", state: "RS" },
  "recife": { name: "Recife", state: "PE" },
  "fortaleza": { name: "Fortaleza", state: "CE" },
  "salvador": { name: "Salvador", state: "BA" },
  "brasilia": { name: "Brasília", state: "DF" },
  "campinas": { name: "Campinas", state: "SP" },
  "manaus": { name: "Manaus", state: "AM" },
  "florianopolis": { name: "Florianópolis", state: "SC" },
  "goiania": { name: "Goiânia", state: "GO" },
  "natal": { name: "Natal", state: "RN" },
  "maceio": { name: "Maceió", state: "AL" },
};

export const CATEGORIAS: Record<string, { label: string; labelPlural: string; descricao: string }> = {
  "desenvolvimento-web": {
    label: "Desenvolvedor Web",
    labelPlural: "Desenvolvedores Web",
    descricao: "sites, sistemas, e-commerce e aplicações web",
  },
  "mobile": {
    label: "Desenvolvedor Mobile",
    labelPlural: "Desenvolvedores Mobile",
    descricao: "apps para iOS e Android",
  },
  "design-grafico": {
    label: "Designer Gráfico",
    labelPlural: "Designers Gráficos",
    descricao: "identidade visual, logos, materiais e UI/UX",
  },
  "redacao-conteudo": {
    label: "Redator de Conteúdo",
    labelPlural: "Redatores de Conteúdo",
    descricao: "textos, blog, copywriting e conteúdo para redes sociais",
  },
  "traducao": {
    label: "Tradutor",
    labelPlural: "Tradutores",
    descricao: "tradução técnica, jurídica e literária",
  },
  "marketing-digital": {
    label: "Especialista em Marketing Digital",
    labelPlural: "Especialistas em Marketing Digital",
    descricao: "tráfego pago, SEO, redes sociais e growth",
  },
  "agentes-ia": {
    label: "Especialista em IA & Automação",
    labelPlural: "Especialistas em IA & Automação",
    descricao: "agentes de IA, automação de processos e integrações",
  },
};

export function getAllLandingCombinations() {
  return Object.keys(CATEGORIAS).flatMap((categoria) =>
    Object.keys(CIDADES).map((cidade) => ({ categoria, cidade }))
  );
}
