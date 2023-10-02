# Dockerfile used to run cypress tests in jenkins
# Not specifying browsers due to issues installing them on linux/arm64

ARG NODE_VERSION="18.17.1"
ARG CYPRESS_VERSION="13.2.0"

FROM cypress/factory:3.1.0

# install curl to make API calls
USER root
RUN apt-get -y update
RUN apt-get -y install curl

# set up pnpm
RUN corepack enable
RUN corepack prepare pnpm@latest-8 --activate

# install and verify cypress
RUN cypress --version
RUN cypress install
RUN cypress verify