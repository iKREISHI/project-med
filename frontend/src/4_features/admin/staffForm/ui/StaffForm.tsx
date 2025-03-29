import {FC, useEffect, useState} from "react";
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
import { getAllDepartaments } from "@5_entities/departament/api/getAllDepartaments.ts";
import {FilialDepartament} from "@5_entities/departament";
import {getAllPositions} from "@5_entities/position";

export const StaffForm: FC = () => {
    // Инициализируем состояние с пустым объектом Employee
    const [employee, setEmployee] = useState<Partial<Employee>>({
        gender: 'U' // Устанавливаем значение по умолчанию
    });

    const [departaments, setDepartaments] = useState<{id: number, name: string}[]>([]);
    const [positions, setPositions] = useState<{id: number, name: string}[]>([]);
    useEffect(() => {
        const fetchDepartaments = async () => {
            try {
                const data = await getAllDepartaments();
                // Преобразуем данные департаментов в формат {id, name}
                const formattedDepartaments = data.map(dept => ({
                    id: dept.id,
                    name: dept.name
                }));
                setDepartaments(formattedDepartaments);
            } catch (error) {
                console.error("Ошибка при загрузке департаментов:", error);
            }
        };

        const fetchPositions = async () => {
            try {
                const data = await getAllPositions();
                console.log('Positions from API:', data); // Добавьте это
                const formattedPositions = data.results.map(pos => ({
                    id: pos.id,
                    name: pos.name
                }));
                setPositions(formattedPositions);
            } catch (error) {
                console.error('Ошибка при загрузке должностей: ', error);
            }
        };
        fetchPositions();
        fetchDepartaments();
    }, []);


    const [snackbarOpen, setSnackbarOpen] = useState(false);


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
                                value={employee.last_name || ''}
                                onChange={(e) => handleChange('last_name')(e.target.value)}
                                required
                                fullWidth
                                label="Фамилия"
                              />
                              <InputForm
                                type="text"
                                label="Имя"
                                value={employee.first_name || ''}
                                onChange={(e) => handleChange('first_name')(e.target.value)}
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
                            value={employee.date_of_birth || ''}
                            onChange={(e) => handleChange('date_of_birth')(e.target.value)}
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
                            value={employee.registration_address || ''}
                            onChange={(e) => handleChange('registration_address')(e.target.value)}
                            fullWidth
                            required
                          />
                      </Box>

                      <Box sx={{ mt: 2 }}>
                          <InputForm
                            type="text"
                            label="Адрес проживания"
                            value={employee.actual_address || ''}
                            onChange={(e) => handleChange('actual_address')(e.target.value)}
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
                            value={employee.appointment_duration || ''}
                            onChange={(e) => handleChange('appointment_duration')(e.target.value)}
                            fullWidth
                          />
                      </Box>
                      <Box sx={{ mt: 2 }}>
                          <CustomAutocomplete
                            value={employee.department ?
                              departaments.find(d => d.id === employee.department)?.name || ''
                              : ''}
                            onChange={(value) => {
                                // Находим id департамента по имени
                                const selectedDept = departaments.find(d => d.name === value);
                                handleChange('department')(selectedDept?.id);
                            }}
                            options={departaments.map(d => d.name)} // Передаем только названия
                            placeholder="Введите подразделение"
                            label="Подразделение"
                            required
                          />
                      </Box>
                      <Box sx={{ mt: 2 }}>
                          <CustomAutocomplete
                            value={employee.position ?
                              positions.find(p => p.id === employee.position)?.name || ''
                          : ''}
                            onChange={(value) => {
                                const selectedPos = positions.find(f => f.name === value);
                                handleChange('position')(selectedPos?.id);
                            }}
                            options={positions.map(f => f.name)}
                            placeholder="Выберите должность"
                            label="Должность"
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
                            value={employee.short_description || ''}
                            onChange={(e) => handleChange('short_description')(e.target.value)}
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