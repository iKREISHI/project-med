// @ts-nocheck
import { FC, useEffect, useState } from "react";
import {
  Box, TextField, Stack, Typography, Button
} from "@mui/material";
import { InputForm } from "@6_shared/Input";
import { CustomAutocomplete } from "@6_shared/Autocomplete";
import { globalsStyleSx } from "@6_shared/styles/globalsStyleSx";
import { GET, POST } from "@6_shared/api";

interface Employee {
  id: number;
  last_name: string;
  first_name: string;
  patronymic?: string;
}

interface Template {
  id: number;
  name: string;
}

export const ShiftCreate: FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [formData, setFormData] = useState({
    doctor: null as Employee | null,
    start_time: '',
    end_time: '',
    document_template: null as Template | null,
    document: '',
    document_fields: ''
  });

  const getFullName = (person: Employee) =>
    `${person.last_name} ${person.first_name} ${person.patronymic || ''}`.trim();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsResp, templatesResp] = await Promise.all([
          GET("/api/v0/employee/", { query: { page: 1, page_size: 100 } }),
          GET("/api/v0/reseption-template/", { query: { page: 1, page_size: 100 } }),
        ]);
        setEmployees(doctorsResp.data?.results || []);
        setTemplates(templatesResp.data?.results || []);
      } catch (err) {
        console.error("Ошибка загрузки данных:", err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (field: keyof typeof formData) => (e: any) => {
    const value = e?.target?.value ?? e;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await POST("/api/v0/shift/", {
        doctor: formData.doctor?.id,
        start_time: formData.start_time,
        end_time: formData.end_time,
        document_template: formData.document_template?.id,
        document: formData.document,
        document_fields: formData.document_fields
      });
      alert("Смена успешно добавлена");
    } catch (error) {
      console.error("Ошибка при добавлении смены:", error);
      alert("Ошибка при добавлении смены");
    }
  };

  return (
    <Box sx={{ ...globalsStyleSx.container, p: 3 }}>
      <Typography variant="h4" mb={2}>Добавление смены</Typography>

      <Stack spacing={2}>
        <CustomAutocomplete
          value={formData.doctor}
          onChange={(val) => handleChange("doctor")(val)}
          options={employees}
          placeholder="Выберите врача"
          label="Врач"
          isOptionEqualToValue={(a, b) => a?.id === b?.id}
          getOptionLabel={getFullName}
          renderInput={(params) => <TextField {...params} label="Врач" required />}
        />

        <TextField
          label="Начало смены"
          type="datetime-local"
          fullWidth
          value={formData.start_time}
          onChange={handleChange("start_time")}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="Окончание смены"
          type="datetime-local"
          fullWidth
          value={formData.end_time}
          onChange={handleChange("end_time")}
          InputLabelProps={{ shrink: true }}
        />

        <CustomAutocomplete
          value={formData.document_template}
          onChange={(val) => handleChange("document_template")(val)}
          options={templates}
          placeholder="Выберите шаблон документа"
          label="Шаблон документа"
          isOptionEqualToValue={(a, b) => a?.id === b?.id}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => <TextField {...params} label="Шаблон документа" required />}
        />

        <InputForm
          label="Название документа"
          value={formData.document}
          onChange={handleChange("document")}
          fullWidth
        />

        <InputForm
          label="Поля документа"
          value={formData.document_fields}
          onChange={handleChange("document_fields")}
          multiline
          rows={4}
          fullWidth
        />

        <Button variant="contained" onClick={handleSubmit}>
          Сохранить смену
        </Button>
      </Stack>
    </Box>
  );
};
