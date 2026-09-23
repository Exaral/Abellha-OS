import os
import tkinter as tk
from tkinter import ttk, messagebox, simpledialog, filedialog
import disk_utils


def run_gui():
    root = tk.Tk()
    root.title("Abéllha OS Disk Utility")
    root.geometry("900x600")

    # Top toolbar
    toolbar = tk.Frame(root)
    toolbar.pack(fill=tk.X, padx=8, pady=6)

    btn_refresh = tk.Button(toolbar, text="Refresh", command=lambda: refresh_drives())
    btn_refresh.pack(side=tk.LEFT, padx=4)

    btn_format = tk.Button(toolbar, text="Format...", command=lambda: on_format())
    btn_format.pack(side=tk.LEFT, padx=4)

    btn_create = tk.Button(toolbar, text="Create Partition...", command=lambda: on_create())
    btn_create.pack(side=tk.LEFT, padx=4)

    btn_mount = tk.Button(toolbar, text="Mount...", command=lambda: on_mount())
    btn_mount.pack(side=tk.LEFT, padx=4)

    btn_unmount = tk.Button(toolbar, text="Unmount", command=lambda: on_unmount())
    btn_unmount.pack(side=tk.LEFT, padx=4)

    btn_smart = tk.Button(toolbar, text="Check Health", command=lambda: on_health())
    btn_smart.pack(side=tk.LEFT, padx=4)

    # Drive/partition tree
    tree = ttk.Treeview(root, columns=("type", "size", "mountpoint"), show="headings")
    tree.heading("type", text="Type")
    tree.heading("size", text="Size")
    tree.heading("mountpoint", text="Mountpoint")
    tree.pack(fill=tk.BOTH, expand=True, padx=8, pady=6)

    # Output log
    log = tk.Text(root, height=10)
    log.pack(fill=tk.X, padx=8, pady=6)

    def log_msg(s):
        log.insert(tk.END, s + "\n")
        log.see(tk.END)

    def refresh_drives():
        tree.delete(*tree.get_children())
        try:
            data = disk_utils.list_drives_data()
        except Exception as e:
            messagebox.showerror("Error", f"Failed to list drives: {e}")
            return

        for dev in data:
            dev_name = dev.get("name")
            dev_type = dev.get("type")
            size = dev.get("size")
            mount = dev.get("mountpoint") or ""
            tree.insert("", tk.END, iid=dev_name, values=(dev_type, size, mount))
            # show partitions
            for part in dev.get("children", []):
                pid = f"{dev_name}/{part.get('name') }"
                tree.insert(dev_name, tk.END, iid=pid, values=(part.get("type"), part.get("size"), part.get("mountpoint") or ""))

    def get_selected():
        sel = tree.selection()
        if not sel:
            messagebox.showinfo("Select", "Please select a drive or partition first")
            return None
        return sel[0]

    def on_format():
        sel = get_selected()
        if not sel:
            return
        device = sel if "/" not in sel else sel.split("/")[-1]
        if "/" not in device and not device.startswith("/dev/"):
            device = "/dev/" + device
        fstype = simpledialog.askstring("Filesystem", "Filesystem (ext4, fat32, ntfs)", initialvalue="ext4")
        if not fstype:
            return
        confirm = messagebox.askyesno("Confirm Format", f"Format {device} as {fstype}? This will destroy data.")
        if not confirm:
            return
        dry = messagebox.askyesno("Dry run?", "Perform a dry-run (no changes)?")
        try:
            out = disk_utils.format_drive(device, fstype, dry_run=dry)
            log_msg(out)
        except PermissionError:
            messagebox.showerror("Permission", "You must run this program as root to format drives.")
        except Exception as e:
            messagebox.showerror("Error", str(e))

    def on_create():
        sel = get_selected()
        if not sel:
            return
        disk = sel.split("/")[0] if "/" in sel else sel
        if not disk.startswith("/dev/"):
            disk = "/dev/" + disk
        size = simpledialog.askstring("Partition Size", "Size (e.g. 1G, 100% for rest)", initialvalue="1G")
        if not size:
            return
        fstype = simpledialog.askstring("Filesystem", "Filesystem for new partition (ext4, fat32, ntfs)", initialvalue="ext4")
        dry = messagebox.askyesno("Dry run?", "Perform a dry-run (no changes)?")
        try:
            out = disk_utils.create_partition(disk, size, fstype=fstype, dry_run=dry)
            log_msg(out)
            refresh_drives()
        except PermissionError:
            messagebox.showerror("Permission", "You must run this program as root to create partitions.")
        except Exception as e:
            messagebox.showerror("Error", str(e))

    def on_mount():
        sel = get_selected()
        if not sel:
            return
        device = sel if "/" not in sel else sel.split("/")[-1]
        if not device.startswith("/dev/"):
            device = "/dev/" + device
        mountpoint = filedialog.askdirectory(title="Select mountpoint (directory will be created)")
        if not mountpoint:
            return
        try:
            out = disk_utils.mount(device, mountpoint)
            log_msg(out)
            refresh_drives()
        except PermissionError:
            messagebox.showerror("Permission", "You must run this program as root to mount devices.")
        except Exception as e:
            messagebox.showerror("Error", str(e))

    def on_unmount():
        sel = get_selected()
        if not sel:
            return
        # allow selecting either partition entry or mountpoint
        mount = tree.set(sel, "mountpoint")
        if mount:
            target = mount
        else:
            # assume device
            device = sel if "/" not in sel else sel.split("/")[-1]
            if not device.startswith("/dev/"):
                device = "/dev/" + device
            target = device
        try:
            out = disk_utils.unmount(target)
            log_msg(out)
            refresh_drives()
        except PermissionError:
            messagebox.showerror("Permission", "You must run this program as root to unmount devices.")
        except Exception as e:
            messagebox.showerror("Error", str(e))

    def on_health():
        sel = get_selected()
        if not sel:
            return
        # prefer whole device
        dev = sel.split("/")[0] if "/" in sel else sel
        if not dev.startswith("/dev/"):
            dev = "/dev/" + dev
        try:
            out = disk_utils.check_health(dev)
            log_msg(out)
        except Exception as e:
            messagebox.showerror("Error", str(e))

    # initial load
    refresh_drives()

    root.mainloop()


if __name__ == "__main__":
    run_gui()
