Firstly, install Debian or Ubuntu on your PC that will use Abéllha OS, recommended on **GNOME Session**. After the installation open the terminal and type or paste: "**sudo nano /etc/os-release**" type your password and when nano appears change everything from the original to this 

PRETTY_NAME="Abéllha OS"
NAME="Abéllha OS"
VERSION_ID="1"
VERSION="1 (Xenon)"
VERSION_CODENAME=xenon
DEBIAN_VERSION_FULL=1.0
ID=abéllha
HOME_URL="https://www.debian.org/"
SUPPORT_URL="https://www.debian.org/support"
BUG_REPORT_URL="https://bugs.debian.org/"

Press Control (CTRL) + O, Enter and Control + X.
Now run **sudo apt update
sudo apt install gnome-shell-extension-manager dconf-editor git flatpak -y**

And this **sudo apt install gnome-shell-extensions gnome-shell-extension-dash-to-panel gnome-shell-extension-arc-menu -y**
Now, you are changing the Debian logo on fastfetch to the Abéllha OS logo. So lets go!
First **mkdir -p ~/.config/fastfetch** and **fastfetch --gen-config ~/.config/fastfetch/config.jsonc** and so **nano ~/.config/fastfetch/config.jsonc**
