# pu2ukv.com

Site da estação PU2UKV — MkDocs Material, publicado no GitHub Pages.

## Estrutura

```
docs/                 páginas em Markdown
  radioamador/        Código Q, fonético, repetidoras, HT
  overland/           rádio em trilha, checklist 4x4
  assets/img/         quadros em imagem para download
  CNAME               domínio (pu2ukv.com)
data/repetidoras.csv  dados da tabela de repetidoras
hooks/repetidoras.py  gera a tabela a partir do CSV
mkdocs.yml            menu, tema, configurações
```

## Rodar no computador

```bash
pip install -r requirements.txt
mkdocs serve
```

Abra http://127.0.0.1:8000 — atualiza sozinho ao salvar.

## Publicar

Todo `git push` na branch `main` publica o site (GitHub Actions).

## Tarefas comuns

- **Nova página:** crie o `.md` em `docs/` e adicione no `nav:` do `mkdocs.yml`.
- **Atualizar repetidoras:** edite só `data/repetidoras.csv`.
- **Mudar cores:** `theme.palette` no `mkdocs.yml`.

> As versões estão travadas em MkDocs 1.x (`requirements.txt`): o MkDocs 2.0 quebra temas e plugins.
