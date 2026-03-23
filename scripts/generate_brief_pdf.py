from pathlib import Path
import textwrap


ROOT = Path(r"C:\Users\shron\OneDrive\Building online presence\Documents\New project")
SOURCE_PATH = ROOT / "ShrondaJeanineCo-Product-and-Site-Brief.md"
PDF_PATH = ROOT / "ShrondaJeanineCo-Product-and-Site-Brief.pdf"


PAGE_WIDTH = 612
PAGE_HEIGHT = 792
LEFT = 54
TOP = 54
BOTTOM = 54
FONT_SIZE = 11
LEADING = 15
MAX_WIDTH_CHARS = 92


def escape_pdf_text(text: str) -> str:
    return text.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


def markdown_to_lines(text: str):
    lines = []
    for raw in text.splitlines():
        stripped = raw.strip()
        if not stripped:
            lines.append("")
            continue
        if stripped.startswith("# "):
            lines.append(stripped[2:].upper())
            lines.append("")
            continue
        if stripped.startswith("## "):
            lines.append(stripped[3:])
            lines.append("")
            continue
        if stripped.startswith("- "):
            wrapped = textwrap.wrap(f"• {stripped[2:]}", width=MAX_WIDTH_CHARS)
            lines.extend(wrapped or [""])
            continue
        wrapped = textwrap.wrap(stripped.replace("`", ""), width=MAX_WIDTH_CHARS)
        lines.extend(wrapped or [""])
    return lines


def chunk_pages(lines):
    usable_height = PAGE_HEIGHT - TOP - BOTTOM
    lines_per_page = usable_height // LEADING
    for i in range(0, len(lines), lines_per_page):
        yield lines[i:i + lines_per_page]


def build_page_stream(lines):
    parts = ["BT", f"/F1 {FONT_SIZE} Tf", f"1 0 0 1 {LEFT} {PAGE_HEIGHT - TOP} Tm", f"{LEADING} TL"]
    first = True
    for line in lines:
        safe = escape_pdf_text(line)
        if first:
            parts.append(f"({safe}) Tj")
            first = False
        else:
            parts.append("T*")
            parts.append(f"({safe}) Tj")
    parts.append("ET")
    return "\n".join(parts).encode("latin-1", errors="replace")


def write_pdf(page_streams):
    objects = []

    def add_object(data: bytes):
        objects.append(data)
        return len(objects)

    font_id = add_object(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")

    page_ids = []
    content_ids = []
    placeholder_pages_id = len(objects) + 1

    for stream in page_streams:
        content = b"<< /Length " + str(len(stream)).encode() + b" >>\nstream\n" + stream + b"\nendstream"
        content_ids.append(add_object(content))
        page = (
            b"<< /Type /Page /Parent "
            + f"{placeholder_pages_id} 0 R".encode()
            + b" /MediaBox [0 0 "
            + str(PAGE_WIDTH).encode()
            + b" "
            + str(PAGE_HEIGHT).encode()
            + b"] /Resources << /Font << /F1 "
            + f"{font_id} 0 R".encode()
            + b" >> >> /Contents "
            + f"{content_ids[-1]} 0 R".encode()
            + b" >>"
        )
        page_ids.append(add_object(page))

    kids = " ".join(f"{pid} 0 R" for pid in page_ids).encode()
    pages_id = add_object(b"<< /Type /Pages /Kids [" + kids + b"] /Count " + str(len(page_ids)).encode() + b" >>")
    catalog_id = add_object(b"<< /Type /Catalog /Pages " + f"{pages_id} 0 R".encode() + b" >>")

    pdf = bytearray(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
    offsets = [0]

    for index, obj in enumerate(objects, start=1):
        offsets.append(len(pdf))
        pdf.extend(f"{index} 0 obj\n".encode())
        pdf.extend(obj)
        pdf.extend(b"\nendobj\n")

    xref_start = len(pdf)
    pdf.extend(f"xref\n0 {len(objects) + 1}\n".encode())
    pdf.extend(b"0000000000 65535 f \n")
    for offset in offsets[1:]:
        pdf.extend(f"{offset:010d} 00000 n \n".encode())

    pdf.extend(
        b"trailer\n<< /Size "
        + str(len(objects) + 1).encode()
        + b" /Root "
        + f"{catalog_id} 0 R".encode()
        + b" >>\nstartxref\n"
        + str(xref_start).encode()
        + b"\n%%EOF"
    )

    PDF_PATH.write_bytes(pdf)


def main():
    text = SOURCE_PATH.read_text(encoding="utf-8")
    lines = markdown_to_lines(text)
    pages = list(chunk_pages(lines))
    page_streams = [build_page_stream(page) for page in pages]
    write_pdf(page_streams)


if __name__ == "__main__":
    main()
