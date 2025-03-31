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
}

export const DocumentEditor = forwardRef<DocumentEditorRef, DocumentEditorProps>(
  ({ templateHtml, initialData, onDataExtract }, ref) => {
    const formRef = useRef<HTMLDivElement>(null);
    const [processedHtml, setProcessedHtml] = React.useState('');

    // Process template with initial data
    const processTemplate = (data: Record<string, any>) => {
      let result = templateHtml;
      result = result.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] ?? "");
      return DOMPurify.sanitize(result);
    };

    // Initialize with initial data
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
        const canvas = await html2canvas(formRef.current, { scale: 2 });
        const pdf = new jsPDF({ orientation: "portrait", unit: "px" });
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, canvas.width, canvas.height);
        pdf.save("document.pdf");
      }
    }));

    return (
      <div ref={formRef} dangerouslySetInnerHTML={{ __html: processedHtml }} />
    );
  }
);