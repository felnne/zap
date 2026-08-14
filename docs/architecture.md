# Zap - Architecture

## Application

> [!WARNING]
> This section is Work in Progress (WIP) and may not be complete/accurate.

`zap`

A [Streamlit](https://streamlit.io/) application defined within the `src/zap` package consisting of:

- `sections`: classes for tools to import/export, validate and preview records using Streamlit UI elements
- `records`: non-Streamlit support methods to generating and parsing records
- `catalogue`: non-Streamlit support methods to preview records as Lantern 🏮data catalogue items
- `utilities`: non-Streamlit support methods for loading [Config Options](/docs/config.md)
