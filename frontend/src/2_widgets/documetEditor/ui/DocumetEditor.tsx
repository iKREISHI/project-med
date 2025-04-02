// @ts-nocheck
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import DOMPurify from "dompurify";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

interface DocumentEditorProps {
  templateHtml: string;
  initialData: Record<string, any>;
  onDataExtract: (data: Record<string, any>) => void;
}

interface DocumentEditorRef {
  exportToPdf: () => Promise<void>;
  extractFormData: () => void;
  getProcessedHtml: () => string;
}

export const DocumentEditor = forwardRef<DocumentEditorRef, DocumentEditorProps>(
  ({ templateHtml, initialData, onDataExtract }, ref) => {
    const formRef = useRef<HTMLDivElement>(null);
    const [processedHtml, setProcessedHtml] = React.useState('');

    // Шаблон с заменой {{field}} значений
    const processTemplate = (data: Record<string, any>) => {
      let result = templateHtml;
      result = result.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] ?? "");
      return DOMPurify.sanitize(result);
    };

    useEffect(() => {
      setProcessedHtml(processTemplate(initialData));
    }, [templateHtml, initialData]);

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
      
        const canvas = await html2canvas(formRef.current, {
          scale: 2,
          useCORS: true,
        });
      
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });
      
        const pageWidth = pdf.internal.pageSize.getWidth();   // 210mm
        const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm
      
        const imgProps = {
          width: canvas.width,
          height: canvas.height,
        };
      
        const pxPerMm = imgProps.width / pageWidth;
      
        const targetHeightMm = imgProps.height / pxPerMm;
      
        // Ограничим высоту до 295 мм (чуть меньше A4)
        const finalHeightMm = targetHeightMm > 295 ? 295 : targetHeightMm;
      
        const finalWidthMm = pageWidth;
      
        const marginY = (pageHeight - finalHeightMm) / 2;
      
        pdf.addImage(imgData, "PNG", 0, marginY, finalWidthMm, finalHeightMm);
        pdf.save("document.pdf");
      }
      ,

      getProcessedHtml: () => formRef.current?.innerHTML || ""
    }));

    return (
      <div ref={formRef} dangerouslySetInnerHTML={{ __html: processedHtml }} />
    );
  }
);
