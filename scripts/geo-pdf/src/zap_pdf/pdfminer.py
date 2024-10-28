import re
from typing import Optional, TextIO, Union

from pdfminer.pdfdocument import PDFDocument, PDFXRefFallback
from pdfminer.pdfexceptions import (
    PDFObjectNotFound,
    PDFTypeError,
)
from pdfminer.pdftypes import PDFObjRef, PDFStream
from pdfminer.pdfparser import PDFParser
from pdfminer.psparser import PSKeyword, PSLiteral
from pdfminer.utils import isnumber

ESC_PAT = re.compile(r'[\000-\037&<>()"\042\047\134\177-\377]')


def escape(s: Union[str, bytes]) -> str:
    if isinstance(s, bytes):
        us = str(s, "latin-1")
    else:
        us = s
    return ESC_PAT.sub(lambda m: "&#%d;" % ord(m.group(0)), us)


def dumpxml(out: TextIO, obj: object, codec: Optional[str] = None) -> None:
    if obj is None:
        out.write("<null />")
        return

    if isinstance(obj, dict):
        out.write('<dict size="%d">\n' % len(obj))
        for k, v in obj.items():
            out.write("<key>%s</key>\n" % k)
            out.write("<value>")
            dumpxml(out, v)
            out.write("</value>\n")
        out.write("</dict>")
        return

    if isinstance(obj, list):
        out.write('<list size="%d">\n' % len(obj))
        for v in obj:
            dumpxml(out, v)
            out.write("\n")
        out.write("</list>")
        return

    if isinstance(obj, (str, bytes)):
        out.write('<string size="%d">%s</string>' % (len(obj), escape(obj)))
        return

    if isinstance(obj, PDFStream):
        if codec == "raw":
            # Bug: writing bytes to text I/O. This will raise TypeError.
            out.write(obj.get_rawdata())  # type: ignore [arg-type]
        elif codec == "binary":
            # Bug: writing bytes to text I/O. This will raise TypeError.
            out.write(obj.get_data())  # type: ignore [arg-type]
        else:
            out.write("<stream>\n<props>\n")
            dumpxml(out, obj.attrs)
            out.write("\n</props>\n")
            if codec == "text":
                data = obj.get_data()
                out.write('<data size="%d">%s</data>\n' % (len(data), escape(data)))
            out.write("</stream>")
        return

    if isinstance(obj, PDFObjRef):
        out.write('<ref id="%d" />' % obj.objid)
        return

    if isinstance(obj, PSKeyword):
        # Likely bug: obj.name is bytes, not str
        out.write("<keyword>%s</keyword>" % obj.name)  # type: ignore [str-bytes-safe]
        return

    if isinstance(obj, PSLiteral):
        # Likely bug: obj.name may be bytes, not str
        out.write("<literal>%s</literal>" % obj.name)  # type: ignore [str-bytes-safe]
        return

    if isnumber(obj):
        out.write("<number>%s</number>" % obj)
        return

    raise PDFTypeError(obj)


def dumptrailers(
    out: TextIO,
    doc: PDFDocument,
    show_fallback_xref: bool = False,
) -> None:
    for xref in doc.xrefs:
        if not isinstance(xref, PDFXRefFallback) or show_fallback_xref:
            out.write("<trailer>\n")
            dumpxml(out, xref.get_trailer())
            out.write("\n</trailer>\n\n")


def dumpallobjs(
    out: TextIO,
    doc: PDFDocument,
    codec: Optional[str] = None,
    show_fallback_xref: bool = False,
) -> None:
    visited = set()
    out.write("<pdf>")
    for xref in doc.xrefs:
        for objid in xref.get_objids():
            if objid in visited:
                continue
            visited.add(objid)
            try:
                obj = doc.getobj(objid)
                if obj is None:
                    continue
                out.write('<object id="%d">\n' % objid)
                dumpxml(out, obj, codec=codec)
                out.write("\n</object>\n\n")
            except PDFObjectNotFound as e:
                print("not found: %r" % e)
    dumptrailers(out, doc, show_fallback_xref)
    out.write("</pdf>")
