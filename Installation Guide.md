# Abéllha OS Installation Guide
-------------------------------
*Please, download this file!
-------------------------------
*The cause is that it will be confuse if not downloaded!*
**Hey, man, wanna take a look of how will be the system? Take a look on Screenshots folders!**

Firstly, install Debian or Ubuntu on your PC that will use Abéllha OS, recommended on **GNOME Session**. After the installation open the terminal and type or paste: sudo nano /etc/os-release type your password and when nano appears change everything from the original to this 

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
Now run sudo apt update
sudo apt install gnome-shell-extension-manager dconf-editor git flatpak -y

And this sudo apt install gnome-shell-extensions gnome-shell-extension-dash-to-panel gnome-shell-extension-arc-menu -y
Now, you are changing the Debian logo on fastfetch to the Abéllha OS logo. So lets go!
First mkdir -p ~/.config/fastfetch and fastfetch --gen-config ~/.config/fastfetch/config.jsonc .
Add the file in Fastfetch folder (fastfetcher.txt) to your ~/ (user) folder; and do this command nano ~/.config/fastfetch/config.jsonc and in nano add this:

{
  "$schema": "https://github.com/fastfetch-cli/fastfetch/raw/dev/doc/json_schema.json",
  "logo": {
    "source": "/home/yourusername/fastfetcher.txt",
    "type": "auto",
    "padding": {
      "top": 1,
      "right": 2
    },
    "color": {
      "1": "red"
    }
  },
  "modules": [
    "title",
    "separator",
    "os",
    "host",
    "kernel",
    "uptime",
    "packages",
    "shell",
    "display",
    "de",
    "wm",
    "wmtheme",
    "theme",
    "icons",
    "font",
    "cursor",
    "terminal",
    "terminalfont",
    "cpu",
    "gpu",
    "memory",
    "swap",
    "disk",
    "localip",
    "battery",
    "poweradapter",
    "locale",
    "break",
    "colors"
  ]
}

Attention! in the line of source change "yourusername" to your user name!!!

After this, try fastfetch and see if takes a red X as logo, if yes, well, well done!
So next part, is customizing the terminal(Yeah its possible, but limitated). Do sudo nano ~/.bashrc and paste on the final of the block:

echo -e "\e[1;34mWelcome to the\e[0m \e[1;31mTerminal\e[0m"

export PS1="\[\e[1;93m\]\u@\h\[\e[0m\]:\[\e[1;34m\]\w\[\e[0m\]\$ "

***PLEASE DO NOT EDIT ANYTHING ELSE ON sudo nano ~/.bashrc***
Now grub, ahh grub. So download my grub custom image, on grub folder (note, if you think the images strange, that's because they were made on GIMP, and the cursor too). After downloaded, obviously, another nano **sudo nano /etc/default/grub**, and add *GRUB_BACKGROUND="/boot/grub/abellha_grub.png"*. If it has an GRUB_BACKGROUND="" replace to GRUB_BACKGROUND="/boot/grub/abellha_grub.png". Don't change nothing else on the file. And to finalize sudo update-grub. Now turn off your PC and restart again. It will appear Debian GNU/Linux Trixie, or anything else, click E key and it will appear in such text editor. and you try find of the Debian GNU/Linux Trixie or if it is Bookworm, or if is Ubuntu, look to Ubuntu, and change to Abéllha OS 1 Xenon GNU/Linux. (Xenon is the version codename, such version is 1). Do not remove any "" or anything else of the file. at the bottom, click the key that means to run with the changes or anything that is a synonymous of it.

Now the wallpaper. You will use the same wallpaper as grub, but to take it tidy, its to download on Wallpapers folder(it have an another blue version of it).
Set as wallpaper, right clicking the file and set as wallpaper.
But… This looks Debian yet, its better to use Debian than this all process!. WAIT! Now is the part that the system will look as the Screenshots! Open the extension manager and if not installed install:
- ArcMenu
- Burn My Windows
- Compiz alike magic lamp effect
- Compiz windows effect
- Dash to Panel
- Desktop Icons NG (DING)
- Desktop Logo
So lets customizate to Abéllha look. Click in the gear next to the Dash to Panel, and it will open a new window. Click to hide activities button, and apps button(the first and second one)
Now go to Style and change App Icon Padding to 8 px, and if you want, active Animate Hovering Apps Icons, and if not actived, active Highlight Hovering Apps.
In execution indicatior (in use apps)(or a synonymous) change it to lines, and to non in use to dots. Now click on override panel theme background color, click in custom and change the color to: #1E2529 (put in a little label at the right top).
Now close Dash to Panel window, and now enter in the ArcMenu gear. And inside go to, menu now menu layout and modern menu layouts and 11, now, go back and click in Menu theme, click in substitute theme or a synonymous. Click in current theme or a synonymous, and change it to Dark Blue. now go to Menu button and click display style, and icon. and now in choose a new icon select the icon on Icons and Logos folder and enter Icons. Put the White X and done, and to finalize ArcMenu, set icon size to 36.
Now close ArcMenu Window, and enter on the Desktop Logo gear.And set Filename, and filename dark to logo-text-256.png in Icons And Logos/Icons, and close the window. Now it haves Abéllha OS look. And the ***almost* last thing** is: ……… the system logo.
First open terminal and type to cd to the Icons and Logos folder and then Logos, and run this: sudo cp * /usr/share/icons/desktop-base/scalable/emblems. Open settings and see if it worked on about system. Now the second-logo part. Now clear the terminal and type to cd the folder of Icons and Logos, and cd System.
Now run this cp * /usr/share/images/vendor-logos/ .
And the penultimate thing? GDM! So now run this:

sudo apt install flatpak
flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
flatpak install flathub io.github.realmazharhussain.GdmSettings

And flatpak run io.github.realmazharhussain.GdmSettings
It will open an app. in it choose the blue wallpaper version on Wallpapers, click on apply and reboot.
And the **LAST** thing. Open GNOME Tweaks,go to Windows and active, Maximize and minimize. Now pick the Abéllha Cursor on Cursor folder and put
