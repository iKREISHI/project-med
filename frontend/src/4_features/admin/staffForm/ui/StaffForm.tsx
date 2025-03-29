import { FC, useState } from "react";
import { Box, Typography, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { InputForm } from "@6_shared/Input";
import { CustomButton } from "@6_shared/Button";
import { CustomSnackbar } from "@6_shared/Snackbar";
import Grid from '@mui/material/Grid2';
import { globalsStyleSx } from "@6_shared/styles/globalsStyleSx";
import { CustomAutocomplete } from "@6_shared/Autocomplete";
import { staffFormSx } from "./staffFormSx";
import { CustomSelect } from "@6_shared/Select";
import { addNewEmployee } from "@5_entities/emloyee/api/addNewEmployee.ts";
import { Employee } from "@5_entities/emloyee/model/model.ts";

export const StaffForm: FC = () => {
    // Инициализируем состояние с пустым объектом Employee
    const [employee, setEmployee] = useState<Partial<Employee>>({
        gender: 'U' // Устанавливаем значение по умолчанию
    });

    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const divisions_list = [
        { id: 1, name: "division 1" },
        { id: 2, name: "division 2" },
    ];

    const positions_list = [
        { id: 1, name: "Врач-терапевт" },
        { id: 2, name: "Хирург" },
    ];

    const specializations_list = [
        { id: 1, name: "Терапия" },
        { id: 2, name: "Хирургия" },
    ];

    const handleChange = (field: keyof Employee) => (value: any) => {
        setEmployee(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await addNewEmployee(employee as Employee);
            setSnackbarOpen(true);
            // Очистка формы после успешной отправки
            setEmployee({ gender: 'U' });
        } catch (error) {
            console.error("Ошибка при создании сотрудника:", error);
            // Можно добавить обработку ошибки (например, показать другой snackbar)
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
      <Box>
          <form onSubmit={handleSubmit}>
              <Grid container spacing={4}>
                  {/* Левая колонка */}
                  <Grid size={{ xs: 12, lg: 8 }}>
                      <Box>
                          <Box sx={{ ...globalsStyleSx.inputContainer, m: 0, gridTemplateColumns: { sm: '1fr 1fr 1fr' } }}>
                              <InputForm
                                type="text"
                                value={employee.lastName || ''}
                                onChange={(e) => handleChange('lastName')(e.target.value)}
                                required
                                fullWidth
                                label="Фамилия"
                              />
                              <InputForm
                                type="text"
                                label="Имя"
                                value={employee.firstName || ''}
                                onChange={(e) => handleChange('firstName')(e.target.value)}
                                required
                                fullWidth
                              />
                              <InputForm
                                type="text"
                                label="Отчество"
                                value={employee.patronymic || ''}
                                onChange={(e) => handleChange('patronymic')(e.target.value)}
                                fullWidth
                              />
                          </Box>
                      </Box>
                      <Box sx={{ mt: 2 }}>
                          <InputForm
                            type="date"
                            label="Дата рождения"
                            value={employee.birthDate || ''}
                            onChange={(e) => handleChange('birthDate')(e.target.value)}
                            required
                            fullWidth
                          />
                      </Box>
                      <Box sx={{ mt: 2 }}>
                          <Typography component="p" sx={{ fontSize: '0.9rem' }}>Пол</Typography>
                          <RadioGroup
                            row
                            name="gender"
                            value={employee.gender || 'U'}
                            onChange={(e) => handleChange('gender')(e.target.value)}
                            sx={{ ...staffFormSx.inputContainer, m: 0 }}
                          >
                              <Box sx={{ ...globalsStyleSx.inputContainer, m: 0, gridTemplateColumns: { sm: '1fr 1fr 1fr' } }}>
                                  <FormControlLabel value="M" control={<Radio disableRipple />} sx={staffFormSx.radioCheck} label="Мужской" />
                                  <FormControlLabel value="F" control={<Radio disableRipple />} sx={staffFormSx.radioCheck} label="Женский" />
                                  <FormControlLabel value="U" control={<Radio disableRipple />} sx={staffFormSx.radioCheck} label="Не указан" />
                              </Box>
                          </RadioGroup>
                      </Box>
                  </Grid>
                  <Grid size={{ xs: 12, lg: 6 }}>
                      <Box sx={{ mt: 2 }}>
                          <InputForm
                            type="email"
                            label="Почта"
                            value={employee.email || ''}
                            onChange={(e) => handleChange('email')(e.target.value)}
                            fullWidth
                            required
                          />
                      </Box>
                      <Box sx={{ mt: 2 }}>
                          <InputForm
                            type="tel"
                            label="Номер телефона"
                            value={employee.phone || ''}
                            onChange={(e) => handleChange('phone')(e.target.value)}
                            fullWidth
                            required
                          />
                      </Box>
                      <Box sx={{ mt: 2 }}>
                          <InputForm
                            type="text"
                            label="ИНН"
                            placeholder=""
                            value={employee.inn || ''}
                            onChange={(e) => handleChange('inn')(e.target.value)}
                            fullWidth
                            required
                          />
                      </Box>
                      <Box sx={{ mt: 2 }}>
                          <InputForm
                            label="СНИЛС"
                            type="text"
                            value={employee.snils || ''}
                            onChange={(e) => handleChange('snils')(e.target.value)}
                            fullWidth
                            required
                          />
                      </Box>
                      <Box sx={{ mt: 2 }}>
                          <InputForm
                            type="text"
                            label="Адрес регистрации"
                            value={employee.registrationAddress || ''}
                            onChange={(e) => handleChange('registrationAddress')(e.target.value)}
                            fullWidth
                            required
                          />
                      </Box>

                      <Box sx={{ mt: 2 }}>
                          <InputForm
                            type="text"
                            label="Адрес проживания"
                            value={employee.actualAddress || ''}
                            onChange={(e) => handleChange('actualAddress')(e.target.value)}
                            fullWidth
                          />
                      </Box>
                  </Grid>

                  {/* Правая колонка */}
                  <Grid size={{ xs: 12, lg: 6 }}>
                      <Box sx={{ mt: 2 }}>
                          <InputForm
                            label="Длительность приема (мин)"
                            type="number"
                            value={employee.appointmentDuration || ''}
                            onChange={(e) => handleChange('appointmentDuration')(e.target.value)}
                            fullWidth
                          />
                      </Box>
                      <Box sx={{ mt: 2 }}>
                          <CustomAutocomplete
                            value={employee.division || ''}
                            onChange={(value) => handleChange('division')(value)}
                            options={divisions_list}
                            placeholder="Введите подразделение"
                            label="Подразделение"
                            required
                          />
                      </Box>
                      <Box sx={{ mt: 2 }}>
                          <CustomAutocomplete
                            value={employee.position || ''}
                            onChange={(value) => handleChange('position')(value)}
                            options={positions_list}
                            placeholder="Выберите должность"
                            label="Должность"
                            required
                          />
                      </Box>
                      <Box sx={{ mt: 2 }}>
                          <CustomSelect
                            value={employee.specialization || ''}
                            onChange={(value) => handleChange('specialization')(value)}
                            options={specializations_list}
                            placeholder="Выберите специализацию"
                            label="Специализация"
                            fullWidth
                            disabled={!employee.position}
                            required
                          />
                      </Box>
                      <Box sx={{ mt: 2 }}>
                          <InputForm
                            fullWidth
                            multiline
                            type="text"
                            rows={5}
                            label="Краткое описание"
                            value={employee.shortDescription || ''}
                            onChange={(e) => handleChange('shortDescription')(e.target.value)}
                            placeholder="Введите краткое описание"
                          />
                      </Box>
                  </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                  <CustomButton
                    type="submit"
                    variant="contained"
                  >
                      Зарегистрировать
                  </CustomButton>
              </Box>
          </form>

          <CustomSnackbar
            open={snackbarOpen}
            onClose={handleCloseSnackbar}
            message="Сотрудник создан!"
          />
      </Box>
    );
};