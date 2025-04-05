# Based on https://github.com/withastro/astro/blob/main/.devcontainer/Dockerfile
FROM mcr.microsoft.com/devcontainers/javascript-node:0-18

# We uninstall pnpm here, since we enable the corepack version in the postCreateCommand
# This ensures we respect the "packageManager" version in package.json
RUN npm uninstall -g pnpm

COPY welcome-message.txt /usr/local/etc/vscode-dev-containers/first-run-notice.txt