"""Safe helper functions for the GUI disk utility.

This module wraps common disk-related commands (lsblk, mkfs, parted, mount,
umount, smartctl) with helpful messages and a dry-run mode. Dangerous actions
require root privileges and will raise PermissionError when attempted without root.
"""
import os
import shutil
import subprocess
import json
from typing import List, Dict, Any


def _run(cmd: List[str], dry_run: bool = False) -> str:
    if dry_run:
        return f"DRY-RUN: {' '.join(cmd)}"
    proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    if proc.returncode != 0:
        raise RuntimeError(proc.stdout.strip() or f"Command failed: {' '.join(cmd)}")
    return proc.stdout.strip()


def is_root() -> bool:
    try:
        return os.geteuid() == 0
    except AttributeError:
        # Windows or platform without geteuid
        return False


def list_drives_data() -> List[Dict[str, Any]]:
    """Return parsed lsblk JSON structure as a list of devices.

    Each device is a dict with keys: name, type, size, mountpoint, children
    where children is a list of partitions with the same keys.
    """
    lsblk = shutil.which("lsblk")
    if not lsblk:
        raise RuntimeError("lsblk not found on PATH")
    out = subprocess.run([lsblk, "-J", "-o", "NAME,TYPE,SIZE,MOUNTPOINT"], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    if out.returncode != 0:
        raise RuntimeError(out.stdout)
    data = json.loads(out.stdout)
    devices = []
    for dev in data.get("blockdevices", []):
        entry = {
            "name": dev.get("name"),
            "type": dev.get("type"),
            "size": dev.get("size"),
            "mountpoint": dev.get("mountpoint"),
            "children": []
        }
        for child in dev.get("children") or []:
            entry["children"].append({
                "name": child.get("name"),
                "type": child.get("type"),
                "size": child.get("size"),
                "mountpoint": child.get("mountpoint"),
            })
        devices.append(entry)
    return devices


def list_drives() -> str:
    devices = list_drives_data()
    lines = []
    for d in devices:
        lines.append(f"/dev/{d['name']}  {d['type']}  {d['size']}  mount:{d.get('mountpoint')}")
        for p in d.get("children", []):
            lines.append(f"  /dev/{p['name']}  {p['type']}  {p['size']}  mount:{p.get('mountpoint')}")
    return "\n".join(lines)


def format_drive(device: str, fstype: str = "ext4", label: str = None, dry_run: bool = False) -> str:
    if not is_root() and not dry_run:
        raise PermissionError("format requires root privileges")
    fstype = fstype.lower()
    if fstype == "ext4":
        cmd = ["mkfs.ext4", "-F"]
        if label:
            cmd += ["-L", label]
        cmd += [device]
    elif fstype in ("fat32", "vfat"):
        cmd = ["mkfs.vfat", "-F", "32", device]
    elif fstype == "ntfs":
        cmd = ["mkfs.ntfs", "-f", device]
    elif fstype == "exfat":
        cmd = ["mkfs.exfat", device]
    else:
        raise ValueError(f"Unsupported filesystem: {fstype}")
    tool = shutil.which(cmd[0])
    if not tool:
        raise RuntimeError(f"Required tool not found: {cmd[0]}")
    return _run(cmd, dry_run=dry_run)


def check_health(device: str) -> str:
    smartctl = shutil.which("smartctl")
    if not smartctl:
        return "smartctl not found; install smartmontools for SMART checks"
    if not is_root():
        return "SMART needs root; re-run as root to get full SMART data"
    cmd = [smartctl, "-a", device]
    return _run(cmd)


def mount(device: str, mountpoint: str, dry_run: bool = False) -> str:
    if not is_root() and not dry_run:
        raise PermissionError("mount requires root privileges")
    os.makedirs(mountpoint, exist_ok=True)
    cmd = ["mount", device, mountpoint]
    return _run(cmd, dry_run=dry_run)


def unmount(target: str, dry_run: bool = False) -> str:
    if not is_root() and not dry_run:
        raise PermissionError("unmount requires root privileges")
    cmd = ["umount", target]
    return _run(cmd, dry_run=dry_run)


def create_partition(disk: str, size: str, fstype: str = "ext4", dry_run: bool = False) -> str:
    """Create a partition on `disk` with the given `size`.

    This implementation uses `parted` to create a partition. It is a thin
    wrapper and may not cover complicated cases — it's provided for convenience
    and should be used with care. Use `dry_run=True` to only print the command.
    """
    if not is_root() and not dry_run:
        raise PermissionError("creating partitions requires root privileges")
    parted = shutil.which("parted")
    if not parted:
        raise RuntimeError("parted not found on PATH")
    # Try to create a partition using parted non-interactively
    # Note: parted expects sizes like 1GiB or 100%.
    cmd = [parted, "-s", disk, "mkpart", "primary", fstype, "0%", size]
    return _run(cmd, dry_run=dry_run)
import subprocess

def list_drives():
    return subprocess.check_output(
        ["lsblk", "-o", "NAME,SIZE,TYPE,MOUNTPOINT"], text=True
    )

def format_drive(drive, fs="ext4"):
    subprocess.run(["mkfs", f"-t{fs}", drive], check=True)
    return f"{drive} formatted as {fs}"

def check_health(drive):
    return subprocess.check_output(["smartctl", "-H", drive], text=True)
