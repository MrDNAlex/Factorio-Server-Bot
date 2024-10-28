FROM ubuntu:20.04



# Install packages and dependencies for steamcmd
RUN apt-get update && apt-get install -y \
    software-properties-common \
    sudo \
    wget \
    nano \
    expect \
    lib32gcc-s1 \
    lib32stdc++6 \
    lib32z1 \
    curl \
    xdg-user-dirs \
    && rm -rf /var/lib/apt/lists/*


# Set Some Variables to Use
ENV USERNAME=factorio


# Set the Node.js version
ENV NODE_VERSION=20.11.1


# Download and install Node.js
RUN cd /tmp \
    && curl -O https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz \
    && tar -xJf node-v$NODE_VERSION-linux-x64.tar.xz -C /usr/local --strip-components=1 \
    && rm node-v$NODE_VERSION-linux-x64.tar.xz

# Add Steam user and group and Sudo it for SteamCMD
RUN adduser --disabled-password --gecos "" factorio \
&& usermod -aG sudo factorio && \
adduser factorio sudo && \
echo 'factorio ALL=(ALL) NOPASSWD: ALL' >> /etc/sudoers

# Give Ownership of the Factorio Account Directory to the Factorio User
RUN chown -R factorio:factorio /home/factorio/

# Make the Factorio Server Bot Directory
RUN sudo mkdir /FactorioBot

# Give Ownership to the Steam User for the Palworld Bot Directory
RUN chown -R factorio:factorio /FactorioBot
RUN chmod -R 755 /FactorioBot

# Copy the Factorio Server Bot Files
COPY ./ /FactorioBot

# Change the Working Directory
WORKDIR /home/factorio

# Install Factorio File
RUN wget https://factorio.com/get-download/2.0.11/headless/linux64 -O factorio_headless_linux_2.0.11.tar.xz

# Extract the Server Files
RUN tar -xvf factorio_headless_linux_2.0.11.tar.xz

# Remove the tar file
RUN rm factorio_headless_linux_2.0.11.tar.xz



# Set the working directory to /FactorioBot
WORKDIR /FactorioBot

# Run the Bot
CMD node index.js
