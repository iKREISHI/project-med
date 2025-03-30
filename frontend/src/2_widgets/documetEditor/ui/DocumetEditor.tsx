import React, { useState, useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
// Импортируем хранилище для работы с полями формы
import { useAppointmentsFormStore } from "@4_features/admission/model/store.ts";

interface DocumentEditorProps {
  templateHtml: string;
  onDataExtract: (data: Record<string, any>) => void;
}

export const DocumentEditor: React.FC<DocumentEditorProps> = ({ templateHtml, onDataExtract }) => {
  const [content, setContent] = useState("");
  const formRef = useRef<HTMLDivElement>(null);
  // Получаем метод для обновления поля в хранилище
  const { setField } = useAppointmentsFormStore();

  useEffect(() => {
    setContent(templateHtml);
  }, [templateHtml]);

  // Функция для сбора данных из формы, сохранения JSON-полей и HTML документа в хранилище
  const extractFormData = () => {
    if (!formRef.current) return;

    const inputs = formRef.current.querySelectorAll("input, textarea, select");
    const formData: Record<string, any> = {};

    inputs.forEach((input) => {
      const fieldName = input.getAttribute("name") || "";
      if (fieldName) {
        formData[fieldName] = (input as HTMLInputElement).value;
      }
    });

    // Передаём извлечённые данные через callback
    onDataExtract(formData);
    // Сохраняем в хранилище JSON поля (например, как строку) и HTML-содержимое документа
    setField("reception_document_fields", JSON.stringify(formData));
    setField("reception_document", formRef.current.innerHTML);
  };

  // Экспорт в PDF с использованием jsPDF и html2canvas
  const exportToPdf = async () => {
    if (!formRef.current) return;

    const canvas = await html2canvas(formRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height]
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("document.pdf");
  };

  // Экспорт в DOC: создаём Blob с HTML-содержимым и инициируем скачивание
  const exportToDoc = () => {
    if (!formRef.current) return;

    const htmlContent = `
      <html>
        <head>
          <meta charset="utf-8">
          <title>Document</title>
        </head>
        <body>${formRef.current.innerHTML}</body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: "application/msword" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "document.doc";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div ref={formRef} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />

      <div style={{ marginTop: "10px" }}>
        <button onClick={extractFormData}>Сохранить данные</button>
        <button onClick={exportToPdf} style={{ marginLeft: "10px" }}>Сохранить в PDF</button>
        <button onClick={exportToDoc} style={{ marginLeft: "10px" }}>Сохранить в DOC</button>
      </div>
    </div>
  );
};
