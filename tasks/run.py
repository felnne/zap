from pathlib import Path

import streamlit as st

from zap.utils import load_secrets

app = st.App(script_path=Path(__file__).parent.joinpath("../src/zap/app.py"), secrets=load_secrets())

if __name__ == "__main__":
    app.run()
