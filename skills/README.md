# Penlit skills

Skills that teach AI agents how to work with [Penlit](https://mypenlit.com). Each folder holds one `SKILL.md`.

| Skill | What it does |
|---|---|
| [penlit-notes](penlit-notes/SKILL.md) | Find, read, and edit notes through the Penlit MCP tools |
| [penlit-tasks](penlit-tasks/SKILL.md) | Claim one task from a Penlit task document, finish it, and report back |

## Requirements

Penlit for macOS with its MCP server connected. In Penlit, open **Settings → AI Integration**, select your tools, and run the one-click setup. Then restart the tool.

## Install

Copy a skill into the folder your agent reads:

```bash
git clone https://github.com/aborn/penlit.git
cp -R penlit/skills/penlit-notes ~/.claude/skills/    # Claude Code and Cursor
cp -R penlit/skills/penlit-notes ~/.agents/skills/    # Codex and Cursor
```

If you use the Penlit skills library, put the folder in your AI skills notebook instead. `penlit skills sync` links it for each tool.

## License

The skills in this folder are under the [MIT License](LICENSE).
