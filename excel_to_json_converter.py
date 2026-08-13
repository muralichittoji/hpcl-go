import json
import re
import os
import pandas as pd
import tkinter as tk
from tkinter import filedialog, messagebox, ttk

# -----------------------------
# CONFIG
# -----------------------------
START_ID = 0


# -----------------------------
# SPEC PARSER
# -----------------------------
def parse_specs(spec_text):
    specs = []

    if not isinstance(spec_text, str):
        return specs

    lines = spec_text.split("\n")

    for line in lines:
        line = line.strip()

        if not line:
            continue

        line = re.sub(r"^[•\-]", "", line).strip()

        if ":" in line:
            prop, val = line.split(":", 1)
        elif "\t" in line:
            prop, val = line.split("\t", 1)
        else:
            continue

        specs.append({
            "property": prop.strip(),
            "value": val.strip()
        })

    return specs


# -----------------------------
# FIND COLUMN
# -----------------------------
def find_column(df, keywords):
    for col in df.columns:
        col_lower = str(col).lower()
        if all(k in col_lower for k in keywords):
            return col
    return None


# -----------------------------
# CATEGORY TREE
# -----------------------------
def build_category_tree(df, col_map):

    root = {}
    current_id = START_ID

    for _, row in df.iterrows():

        title = row.get(col_map["title"])

        if pd.isna(title) or not str(title).strip():
            continue

        title = str(title).strip()

        pid = f"HPCL-LBS-{current_id:04d}"

        sbu = str(row.get(col_map["sbu"], "")).strip()

        levels = [
            row.get(col_map["major"]),
            row.get(col_map["sub1"]),
            row.get(col_map["sub2"]),
            row.get(col_map["sub3"]),
        ]

        # Remove empty / NaN levels
        levels = [
            str(x).strip()
            for x in levels
            if pd.notna(x)
            and str(x).strip()
            and str(x).strip().lower() != "nan"
        ]

        root.setdefault(sbu, {})

        node = root[sbu]

        for level in levels:
            node.setdefault(level, {})
            node = node[level]

        node.setdefault("__products__", []).append({
            "name": title,
            "data": pid
        })

        current_id += 1

    def convert(node):

        result = []

        for key, value in node.items():

            if key == "__products__":
                result.extend(value)
                continue

            children = convert(value)

            if children:
                result.append({
                    "name": key,
                    "data": children
                })

        return result

    output = []

    sbu_id = 1

    for sbu, value in root.items():

        output.append({
            "id": sbu_id,
            "name": sbu,
            "data": convert(value)
        })

        sbu_id += 1

    return output

# -----------------------------
# PROCESS SHEET
# -----------------------------
def process_file(path, sheet_name):

    df = pd.read_excel(path, sheet_name=sheet_name, header=None)

    df.columns = df.iloc[0]
    df = df[1:].reset_index(drop=True)

    df.columns = df.columns.astype(str).str.strip()

    print("Processing:", sheet_name)

    col_map = {
        "title": find_column(df, ["name", "product"]),
        "sbu": find_column(df, ["sbu"]),
        "major": find_column(df, ["major"]),
        "sub1": find_column(df, ["sub", "1"]),
        "sub2": find_column(df, ["sub", "2"]),
        "sub3": find_column(df, ["sub", "3"]),
        "desc": find_column(df, ["description"]),
        "spec": find_column(df, ["spec"]),
        "app": find_column(df, ["application"]),
        "pack": find_column(df, ["pack"]),
        "doc": find_column(df, ["doc"]),
        "related": find_column(df, ["related"]),
    }

    results = {}
    current_id = START_ID

    for _, row in df.iterrows():

        title = row.get(col_map["title"])

        if pd.isna(title) or not str(title).strip():
            continue

        title = str(title).strip()

        key = f"HPCL-LBS-{current_id:04d}"

        spec_raw = str(row.get(col_map["spec"], "")).strip()
        spec_lower = spec_raw.lower()

        if not spec_raw or "not available" in spec_lower:
            specs = []
        elif "available" in spec_lower:
            specs = [{
                "property": "Comparision",
                "value": f"key of the row: {key}"
            }]
        else:
            specs = parse_specs(spec_raw)

        packaging_val = row.get(col_map["pack"], "")

        related = []

        if col_map["related"]:
            value = row.get(col_map["related"])
            if pd.notna(value):
                related = [x.strip() for x in str(value).split(",")]

        results[key] = {
            "id": current_id,
            "MSDS": "",
            "title": title,
            "subTitle": str(row.get(col_map["sub1"], "")),
            "description": str(row.get(col_map["desc"], "")),
            "specifications": specs,
            "appData": str(row.get(col_map["app"], "")),
            "packaging": [packaging_val] if pd.notna(packaging_val) else [],
            "SBU": str(row.get(col_map["sbu"], "")),
            "industrial": str(row.get(col_map["major"], "")),
            "documentation": str(row.get(col_map["doc"], "")),
            "alternatives": [],
            "related": related
        }

        current_id += 1

    base_dir = os.path.dirname(path)

    safe_name = sheet_name.replace("/", "_").replace("\\", "_")

    products_path = os.path.join(base_dir, f"{safe_name}_products.json")
    tree_path = os.path.join(base_dir, f"{safe_name}_tree.json")

    with open(products_path, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    with open(tree_path, "w", encoding="utf-8") as f:
        json.dump(build_category_tree(df, col_map), f, indent=2, ensure_ascii=False)

    messagebox.showinfo(
        "Done",
        f"Processed {sheet_name}\n\nProducts: {len(results)}"
    )


# -----------------------------
# SHEET PICKER
# -----------------------------
def select_sheet(path):

    excel = pd.ExcelFile(path)
    sheets = excel.sheet_names

    print("Sheets:", sheets)

    win = tk.Toplevel(root)
    win.title("Select Worksheet")
    win.geometry("500x500")
    win.resizable(False, False)

    tk.Label(
        win,
        text="Double-click a worksheet or select one and press Load",
        font=("Arial", 11, "bold")
    ).pack(pady=10)

    frame = tk.Frame(win)
    frame.pack(fill="both", expand=True, padx=20, pady=10)

    listbox = tk.Listbox(frame, height=15, font=("Arial", 10))
    scrollbar = tk.Scrollbar(frame, orient="vertical", command=listbox.yview)
    listbox.configure(yscrollcommand=scrollbar.set)

    listbox.pack(side="left", fill="both", expand=True)
    scrollbar.pack(side="right", fill="y")

    for sheet in sheets:
        listbox.insert("end", sheet)

    def load_sheet():

        selected = listbox.curselection()

        if not selected:
            messagebox.showwarning("Select", "Please select a worksheet.")
            return

        sheet = listbox.get(selected[0])

        win.destroy()

        process_file(path, sheet)

    listbox.bind("<Double-1>", lambda e: load_sheet())

    tk.Button(
        win,
        text="Load Selected Sheet",
        command=load_sheet,
        font=("Arial", 11),
        padx=20,
        pady=8,
    ).pack(pady=15)


# -----------------------------
# OPEN FILE
# -----------------------------
def open_file():

    path = filedialog.askopenfilename(
        title="Select Excel Workbook",
        filetypes=[("Excel Files", "*.xlsx *.xls")]
    )

    if path:
        select_sheet(path)


# -----------------------------
# MAIN WINDOW
# -----------------------------
root = tk.Tk()
root.title("HPCL Excel → JSON Converter")
root.geometry("420x220")
root.resizable(False, False)

# Use tk.Label instead of ttk.Label for better macOS compatibility
tk.Label(
    root,
    text="HPCL Excel → JSON Converter",
    font=("Arial", 15, "bold"),
).pack(pady=30)

# Use tk.Button instead of ttk.Button for better macOS compatibility
tk.Button(
    root,
    text="Open Excel Workbook",
    command=open_file,
    font=("Arial", 11),
    padx=20,
    pady=8,
).pack()

root.mainloop()
