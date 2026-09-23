#!/bin/bash
# This script runs at the end of the Calamares installation

if [ "$1" == "macos" ]; then
    cp /etc/abellha-os-styles/macos.dconf /etc/dconf/db/local.d/01-abellha-gnome
else
    # Default to Windows style if nothing else is selected
    cp /etc/abellha-os-styles/windows.dconf /etc/dconf/db/local.d/01-abellha-gnome
fi

dconf update
