import json
import sys
from pathlib import Path

import streamlit as st

if __name__ == "__main__":
    port = int(sys.argv[1])
    secrets = json.loads(sys.argv[2])

    app_path = Path(__file__).parent.parent.parent / "src" / "zap" / "app.py"
    app = st.App(script_path=app_path, secrets=secrets)

    app.run(config={"server.port": port, "server.address": "127.0.0.1"})
