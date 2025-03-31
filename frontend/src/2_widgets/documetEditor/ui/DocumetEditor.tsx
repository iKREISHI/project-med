// DocumentEditor.tsx
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import DOMPurify from "dompurify";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

interface DocumentEditorProps {
  templateHtml: string;
  onDataExtract: (data: Record<string, any>) => void;
}

export const DocumentEditor = forwardRef(({ templateHtml, onDataExtract }: DocumentEditorProps, ref) => {
  const [content, setContent] = useState("");
  const formRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    extractFormData: () => {
      if (!formRef.current) return;

      const inputs = formRef.current.querySelectorAll("input, textarea, select");
      const formData: Record<string, any> = {};

      inputs.forEach((input) => {
        const fieldName = input.getAttribute("name") || "";
        if (fieldName) {
          formData[fieldName] = (input as HTMLInputElement).value;
        }
      });

      onDataExtract(formData);
    },
    exportToPdf: async () => {
      if (!formRef.current) return;
      const canvas = await html2canvas(formRef.current, { scale: 2 });
      const pdf = new jsPDF({ orientation: "portrait", unit: "px" });
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save("document.pdf");
    },
    exportToDoc: () => {
      if (!formRef.current) return;
      const blob = new Blob([formRef.current.innerHTML], { type: "application/msword" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "document.doc";
      link.click();
    }
  }));

  useEffect(() => {
    setContent(templateHtml);
  }, [templateHtml]);

  return (
    <div ref={formRef} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
  );
});