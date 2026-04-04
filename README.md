frontend:
```sh
git clone https://github.com/akash3911/scoliosis.git
cd src/frontend
pnpm install
pnpm build
pnpm start
```

backend:
```sh
cd src/backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip uninstall opencv-python -y
pip install opencv-python-headless --force-reinstall
c```
