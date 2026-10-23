# Based on https://github.com/devcontainers/images/tree/main/src/javascript-node#using-this-image
FROM mcr.microsoft.com/devcontainers/javascript-node:5-24

# Install the latest pnpm that will use the version specified by `devEngines.packageManager` in
# `package.json`.
RUN npm install -g pnpm

COPY welcome-message.txt /usr/local/etc/vscode-dev-containers/first-run-notice.txt