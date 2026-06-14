import sys
from pathlib import Path
from urllib.parse import quote

from PIL import Image, ImageDraw, ImageFont
from pypdf import PdfReader
import qrcode


ROOT = Path(__file__).resolve().parent
PDF_PATH = Path(r"C:\Users\RODO\Downloads\Menu_OH_Habana_Completo_Imprenta.pdf")
PAGES_DIR = ROOT / "assets" / "pages"
THUMBS_DIR = ROOT / "assets" / "thumbs"
QR_DIR = ROOT / "assets" / "qr"


def safe_font(size: int, bold: bool = False):
    names = [
        "arialbd.ttf" if bold else "arial.ttf",
        "segoeuib.ttf" if bold else "segoeui.ttf",
    ]
    for name in names:
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            pass
    return ImageFont.load_default()


def file_url(path: Path) -> str:
    return "file:///" + quote(str(path.resolve()).replace("\\", "/"), safe="/:")


def extract_pages():
    PAGES_DIR.mkdir(parents=True, exist_ok=True)
    THUMBS_DIR.mkdir(parents=True, exist_ok=True)

    reader = PdfReader(str(PDF_PATH))
    page_files = []
    for index, page in enumerate(reader.pages, start=1):
        images = list(page.images)
        if not images:
            raise RuntimeError(f"Page {index} has no embedded image")

        image = images[0].image.convert("RGB")
        page_file = PAGES_DIR / f"page-{index:02d}.jpg"
        thumb_file = THUMBS_DIR / f"page-{index:02d}.jpg"

        image.save(page_file, "JPEG", quality=92, optimize=True, progressive=True)
        thumb = image.copy()
        thumb.thumbnail((180, 260), Image.Resampling.LANCZOS)
        thumb.save(thumb_file, "JPEG", quality=82, optimize=True)
        page_files.append(page_file)

    return page_files


def build_qr(target_url: str, public_ready: bool):
    QR_DIR.mkdir(parents=True, exist_ok=True)
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=16,
        border=3,
    )
    qr.add_data(target_url)
    qr.make(fit=True)
    qr_img = qr.make_image(fill_color="#141414", back_color="#ffffff").convert("RGB")

    qr_img.save(QR_DIR / "oh-habana-menu-qr.png")

    card_w, card_h = 1600, 2200
    card = Image.new("RGB", (card_w, card_h), "#f7f1e8")
    draw = ImageDraw.Draw(card)
    title = safe_font(118, bold=True)
    subtitle = safe_font(54)
    small = safe_font(38)

    draw.rounded_rectangle((90, 90, card_w - 90, card_h - 90), radius=40, fill="#fffdf8", outline="#1d1a16", width=5)
    draw.text((card_w / 2, 250), "OH Habana", anchor="mm", font=title, fill="#1d1a16")
    draw.text((card_w / 2, 360), "Menú digital", anchor="mm", font=subtitle, fill="#7a4f2a")

    qr_size = 1040
    qr_resized = qr_img.resize((qr_size, qr_size), Image.Resampling.NEAREST)
    qr_x = (card_w - qr_size) // 2
    qr_y = 540
    card.paste(qr_resized, (qr_x, qr_y))

    draw.text((card_w / 2, 1710), "Escanea para ver la carta", anchor="mm", font=subtitle, fill="#1d1a16")
    note = "Listo para imprimir" if public_ready else "Actualiza el enlace público antes de imprimir"
    draw.text((card_w / 2, 1810), note, anchor="mm", font=small, fill="#766d62")
    draw.text((card_w / 2, 1915), target_url[:72], anchor="mm", font=safe_font(28), fill="#9b9083")

    card.save(QR_DIR / "oh-habana-qr-imprimir.png", quality=96)


def main():
    page_files = extract_pages()
    target = sys.argv[1] if len(sys.argv) > 1 else file_url(ROOT / "menu.html")
    build_qr(target, len(sys.argv) > 1)
    print(f"Extracted {len(page_files)} pages")
    print(f"QR target: {target}")


if __name__ == "__main__":
    main()
