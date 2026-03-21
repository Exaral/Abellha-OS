First, if it is not installed, install the xfce4 and the xfce4-goodies with (and remember to have Debian/Xubuntu installed with xfce4-session):
sudo apt update && sudo apt install xfce4 xfce4-goodies -y
Now you will be changing the background image: click on the menu on top, settings, Desktop and change it to the Abéllha OS' file on Wallpapers folder.
Tip: It can be either light or dark.
Make sure you downloaded the wallpapers. Now go to settings again, panel and move it down by unchecking the lock panel and moving
it to the bottom and locking it again. Now in the items tab, select the menu app with a mouse and edit it with the edit button on the bottom. Go to Itens and select windows buttons or a synonmous. click on the settings button, and so click, show plain buttons and disable show button captions or a synonmous. Now close it and click to select Panel 2 and click on the minus button at the top right corner, and confirm. Now, without closing the window, open settings, and click on appearence, and on stlye select Adawita Dark, and close. Now remove the defalut menu and add Whisker Menu. and click to configure it. Click to disable "show apps description" or a synonmous. Now go to appearence and select the icon on Icons and Logos folder and Icons. Now active, position the profile at the bottom or a synonmous, and position the search bar on the bottom. Now in behavior, turn on All Apps(or applications or programs), and now close this.
Now for this to be really Abéllha OS and not a modded Debian/Ubuntu Xfce session, run this command:
sudo nano /etc/os-release
As nano appears change everything on the file to:
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

Press CTRL + O, Enter and CTRL + X
**Tip: I recommend you to copy the text above and paste on the nano. To paste on nano, press CTRL  + Shift + V.**
Run mkdir -p ~/.config/fastfetch and fastfetch --gen-config ~/.config/fastfetch/config.jsonc
and on the Fastfetch folder, take the fastfetcher.txt and add the file in Fastfetch folder (fastfetcher.txt) to your ~/ (user) folder; and do this command nano ~/.config/fastfetch/config.jsonc and in nano add this:
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
***ATTENTION***, in the line 4, change yourusernane to your username.
Now, you must run nano ~/.bashrc, and on the final of the already written code, paste this (CTRL + Shift + V):
echo -e "\e[1;34mWelcome to the\e[0m \e[1;31mTerminal\e[0m"

export PS1="\[\e[1;93m\]\u@\h\[\e[0m\]:\[\e[1;34m\]\w\[\e[0m\]\$ "
****DO NOT CHANGE ANYTHING ELSE****.
Download my grub custom image, on grub folder (note, if you think the images strange, that's because they were made on GIMP, and the cursor too). After downloaded, obviously, another nano **sudo nano /etc/default/grub**, and add *GRUB_BACKGROUND="/boot/grub/abellha_grub.png"*. If it has an GRUB_BACKGROUND="" replace to GRUB_BACKGROUND="/boot/grub/abellha_grub.png". Don't change nothing else on the file. And to finalize sudo update-grub. Now turn off your PC and restart again. It will appear Debian GNU/Linux Trixie, or anything else, click E key and it will appear in such text editor. and you try find of the Debian GNU/Linux Trixie or if it is Bookworm, or if is Ubuntu, look to Ubuntu, and change to Abéllha OS 1 Xenon GNU/Linux. (Xenon is the version codename, such version is 1). Do not remove any "" or anything else of the file. at the bottom, click the key that means to run with the changes or anything that is a synonymous of it.
And the ***almost* last thing** is: ……… the system logo.
First open terminal and type to cd to the Icons and Logos folder and then Logos, and run this: sudo cp * /usr/share/icons/desktop-base/scalable/emblems. Open settings and see if it worked on about system. Now the second-logo part. Now clear the terminal and type to cd the folder of Icons and Logos, and cd System.
Now run this cp * /usr/share/images/vendor-logos/ .
After that, open settings manager, go to mouse and touchpad, theme and select your cursor. The cursor folder, called "Abéllha OS Cursor" on Cursor folder (here on Github) must be in ~/.icons. Change the size as your preference.
For the icon theme, you can set as the default as the debian, but Abéllha OS uses Yaru. Make sure you have Yaru icon theme. For this, go in settings manager again, Appearance, and navigate to the icons tab and select the icon theme.
Tip: **You can put your own custom icon theme.**
It is complete! You are free to use!
