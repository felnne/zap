from io import StringIO
from pathlib import Path

from bs4 import BeautifulSoup
from pdfminer.pdfdocument import PDFDocument
from pdfminer.pdfparser import PDFParser

from zap_pdf.pdfminer import dumpallobjs


def pdf_xml(path: Path) -> BeautifulSoup:
    out = StringIO()
    with path.open(mode="rb") as f:
        parser = PDFParser(f)
        doc = PDFDocument(parser)
        dumpallobjs(out, doc)

    return BeautifulSoup(out.getvalue())
