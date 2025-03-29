import React, { useState, useCallback } from "react";
import {
  Box,
  Modal,
  TextField,
  Typography,
  Stack,
  Divider,
  IconButton,
  Paper
} from "@mui/material";
import { CustomButton } from "@6_shared/Button";
import UploadIcon from '@mui/icons-material/Upload';
import CloseIcon from '@mui/icons-material/Close';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { DocumentEditor } from "@2_widgets/documetEditor";
import { addTemplate } from "@5_entities/reseptionTemplate";

interface AddTemplateModalProps {
  open: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

export const AddTemplateModal: React.FC<AddTemplateModalProps> = ({
                                                                    open,
                                                                    onClose,
                                                                    onUpdate
                                                                  }) => {
  const [template, setTemplate] = useState({
    name: '',
    description: '',
    specialization: 0
  });
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [fields, setFields] = useState<Record<string, any>>({});
  const [dragActive, setDragActive] = useState(false);

  const handleDataExtract = (data: Record<string, any>) => {
    console.log("Собранные данные:", data);
    setFields(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTemplate(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject(new Error("Не удалось прочитать файл"));
        }
      };

      reader.onerror = () => {
        reject(new Error("Ошибка чтения файла"));
      };

      reader.readAsText(file);
    });
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const processFile = async (file: File) => {
    if (file.type === 'text/html' || file.name.endsWith('.html') || file.name.endsWith('.htm')) {
      try {
        const content = await readFileAsText(file);
        setFile(file);
        setHtmlContent(content);
      } catch (error) {
        console.error('Ошибка чтения файла:', error);
        alert('Не удалось прочитать файл');
      }
    } else {
      alert('Пожалуйста, выберите HTML файл (.html или .htm)');
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setHtmlContent('');
    setFields({});
  };

  const handleSave = async () => {
    if (!template.name || !file) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    setLoading(true);
    try {
      const templateData = {
        name: template.name,
        description: template.description,
        html: htmlContent,
        fields: JSON.stringify(fields),
        specialization: template.specialization
      };

      await addTemplate(templateData);
      console.log('Шаблон успешно сохранен:', templateData);

      onUpdate?.();
      onClose();
    } catch (error) {
      console.error('Ошибка при сохранении шаблона:', error);
      alert('Ошибка при сохранении шаблона');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 800,
          bgcolor: "background.paper",
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5">Добавление HTML шаблона</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <SectionBlock title="Основная информация">
          <Stack spacing={3}>
            <TextField
              name="name"
              label="Название шаблона"
              fullWidth
              required
              value={template.name}
              onChange={handleChange}
            />

            <TextField
              name="description"
              label="Описание"
              fullWidth
              multiline
              rows={3}
              value={template.description}
              onChange={handleChange}
            />

            <TextField
              name="specialization"
              label="Специализация"
              type="number"
              fullWidth
              value={template.specialization}
              onChange={handleChange}
            />
          </Stack>
        </SectionBlock>

        <Divider sx={{ my: 3 }} />

        <SectionBlock title="HTML файл">
          <Box
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Paper
              variant="outlined"
              sx={{
                p: 4,
                border: dragActive ? '2px dashed #1976d2' : '2px dashed #ccc',
                backgroundColor: dragActive ? 'rgba(25, 118, 210, 0.04)' : 'transparent',
                textAlign: 'center',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              <input
                accept=".html,.htm"
                style={{ display: 'none' }}
                id="html-template-upload"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="html-template-upload" style={{ width: '100%', height: '100%' }}>
                <Stack alignItems="center" spacing={2}>
                  <UploadIcon fontSize="large" color={dragActive ? "primary" : "action"} />
                  <Typography>
                    {dragActive ? 'Отпустите файл здесь' : 'Перетащите HTML файл сюда или нажмите для выбора'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Поддерживаются только файлы .html или .htm
                  </Typography>
                </Stack>
              </label>
            </Paper>
          </Box>

          {file && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                border: '1px solid #eee',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Box display="flex" alignItems="center">
                <InsertDriveFileIcon sx={{ mr: 1 }} />
                <Typography>{file.name}</Typography>
              </Box>
              <IconButton onClick={handleRemoveFile}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </SectionBlock>

        {htmlContent && (
          <>
            <Divider sx={{ my: 3 }} />
            <SectionBlock title="Предпросмотр шаблона">
              <Box sx={{
                border: '1px solid #eee',
                borderRadius: 1,
                p: 2,
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                <DocumentEditor
                  templateHtml={htmlContent}
                  onDataExtract={handleDataExtract}
                />
              </Box>
            </SectionBlock>
          </>
        )}

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <CustomButton onClick={onClose} variant="outlined" disabled={loading}>
            Отмена
          </CustomButton>
          <CustomButton
            onClick={handleSave}
            variant="contained"
            disabled={loading || !template.name || !file}
          >
            {loading ? "Сохранение..." : "Сохранить шаблон"}
          </CustomButton>
        </Box>
      </Box>
    </Modal>
  );
};

const SectionBlock: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <Box sx={{ mb: 3 }}>
    <Typography variant="h6" gutterBottom sx={{ color: "text.secondary" }}>
      {title}
    </Typography>
    {children}
  </Box>
);