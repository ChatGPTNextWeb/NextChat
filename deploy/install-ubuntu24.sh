#!/usr/bin/env bash
# Instala a branch experimental Tandi NEO em um Ubuntu 24.04 LTS NOVO.
# Uso: sudo bash deploy/install-ubuntu24.sh
# Para TLS sem interação: sudo EMAIL=voce@exemplo.com bash deploy/install-ubuntu24.sh
set -Eeuo pipefail

DOMAIN="tandi.tech"
REPO="https://github.com/tandicell/NextChatBR.git"
BRANCH="feature/tandi-neo-browser-core"
BASE="/opt/tandi-neo"
APP="$BASE/NextChatBR"
PORT="3210"
SERVICE="tandi-neo"
EMAIL="${EMAIL:-}"

if [[ ${EUID} -ne 0 ]]; then echo "ERRO: execute como root."; exit 1; fi
source /etc/os-release
if [[ "${ID:-}" != "ubuntu" || "${VERSION_ID:-}" != "24.04" ]]; then
  echo "ERRO: script validado para Ubuntu 24.04 LTS; detectado ${PRETTY_NAME:-desconhecido}."
  exit 1
fi
if [[ -e "$APP" || -e "/etc/nginx/sites-available/$DOMAIN" ]]; then
  echo "ERRO: instalação existente detectada. Não sobrescrevo código nem vhost."
  exit 1
fi
if [[ -n "$(getent ahostsv4 "$DOMAIN" 2>/dev/null || true)" ]]; then
  echo "DNS $DOMAIN encontrado; confira se aponta para este servidor."
else
  echo "ERRO: DNS $DOMAIN ainda não resolve. Aponte o registro A antes de instalar."
  exit 1
fi
echo "Instalando dependências do sistema..."
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y ca-certificates curl git gnupg nginx certbot python3-certbot-nginx
if ! command -v node >/dev/null || [[ "$(node -p 'process.versions.node.split(".")[0]')" -lt 22 ]]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x -o /tmp/tandi-nodesource-setup.sh
  # Revise o instalador NodeSource se sua política de segurança exigir.
  bash /tmp/tandi-nodesource-setup.sh
  apt-get install -y nodejs
fi
if ! command -v yarn >/dev/null; then npm install -g yarn@1.22.19; fi
echo "Node: $(node --version) | Yarn: $(yarn --version)"

if ! id tandi-neo >/dev/null 2>&1; then
  useradd --system --user-group --home-dir "$BASE" --shell /usr/sbin/nologin tandi-neo
fi
mkdir -p "$BASE"
git clone --depth 1 --branch "$BRANCH" "$REPO" "$APP"
chown -R tandi-neo:tandi-neo "$BASE"
echo "Instalando dependências NextChatBR..."
runuser -u tandi-neo -- bash -c "cd '$APP' && yarn install --frozen-lockfile --non-interactive"
echo "Compilando Next.js... VPS 2 vCPU pode levar alguns minutos."
runuser -u tandi-neo -- env NODE_OPTIONS=--max-old-space-size=4096 bash -c "cd '$APP' && yarn build"
test -f "$APP/.next/standalone/server.js" || { echo "ERRO: build não gerou standalone/server.js"; exit 1; }
mkdir -p "$APP/.next/standalone/.next"
cp -a "$APP/.next/static" "$APP/.next/standalone/.next/static"
cp -a "$APP/public" "$APP/.next/standalone/public"
chown -R tandi-neo:tandi-neo "$APP/.next"

cat > "/etc/systemd/system/$SERVICE.service" <<UNIT
[Unit]
Description=Tandi NEO - NextChatBR experimental
After=network.target
[Service]
User=tandi-neo
Group=tandi-neo
WorkingDirectory=$APP/.next/standalone
Environment=NODE_ENV=production
Environment=PORT=$PORT
Environment=HOSTNAME=127.0.0.1
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=5
NoNewPrivileges=true
PrivateTmp=true
ProtectHome=true
[Install]
WantedBy=multi-user.target
UNIT

systemctl daemon-reload
systemctl enable --now "$SERVICE"
sleep 3
if ! curl -fsS --max-time 15 "http://127.0.0.1:$PORT/" >/dev/null; then
  journalctl -u "$SERVICE" -n 60 --no-pager
  echo "ERRO: Next.js não respondeu localmente. DNS/Nginx não foram alterados."
  exit 1
fi

cat > "/etc/nginx/sites-available/$DOMAIN" <<NGINX
server {
  listen 80;
  listen [::]:80;
  server_name $DOMAIN;
  client_max_body_size 20m;
  location / {
    proxy_pass http://127.0.0.1:$PORT;
    proxy_http_version 1.1;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_read_timeout 180s;
  }
}
NGINX
ln -s "/etc/nginx/sites-available/$DOMAIN" "/etc/nginx/sites-enabled/$DOMAIN"
nginx -t
systemctl enable --now nginx
systemctl reload nginx

echo "Solicitando HTTPS Let's Encrypt."
if [[ -n "$EMAIL" ]]; then
  certbot --nginx --non-interactive --agree-tos --email "$EMAIL" --redirect -d "$DOMAIN"
else
  echo "Sem variável EMAIL: o Certbot solicitará seus dados."
  certbot --nginx --redirect -d "$DOMAIN"
fi
systemctl enable --now certbot.timer >/dev/null 2>&1 || true
echo "PRONTO: https://$DOMAIN"
echo "A IA local só funcionará em navegadores compatíveis com WebGPU e RAM suficiente."
echo "A integração é experimental; teste tudo antes de abrir ao público."
