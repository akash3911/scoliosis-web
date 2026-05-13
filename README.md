frontend:
```sh
cd src/frontend
pnpm install
pnpm dev
```

backend:
```sh
cd src/backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip uninstall opencv-python -y
pip install opencv-python-headless --force-reinstall
```
