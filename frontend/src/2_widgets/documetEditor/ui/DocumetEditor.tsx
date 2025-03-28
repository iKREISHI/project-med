import React, { useState, useEffect, useRef } from "react";
import DOMPurify from "dompurify";

interface DocumentEditorProps {
  templateHtml: string;
  onDataExtract: (data: Record<string, any>) => void;
}

export const DocumentEditor: React.FC<DocumentEditorProps> = ({ templateHtml, onDataExtract }) => {
  const [content, setContent] = useState("");
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setContent(templateHtml);
  }, [templateHtml]);

  // Функция для сбора данных из формы
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

    onDataExtract(formData);
  };

  return (
    <div>
      <div ref={formRef} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />

      <button onClick={extractFormData} style={{ marginTop: "10px" }}>Сохранить</button>
    </div>
  );
};
