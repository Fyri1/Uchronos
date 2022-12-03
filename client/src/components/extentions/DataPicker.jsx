import * as React from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box } from '@mui/material';
import dayjs from 'dayjs';

export default ({ setTime, time }) => {
  return (
    <div className="flex items-center">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Start day"
          value={time.start}
          onChange={(newValue) => {
            // console.log(
            //   `${dateStart.getFullYear()}-${dateStart.getMonth()}-${
            //     dateStart.getDate() < 10
            //       ? `0${dateStart.getDate()}`
            //       : dateStart.getDate()
            //   }`
            // );
            setTime((prev) => ({
              values: {
                ...prev.values,
                range: {
                  start: newValue,
                  end: prev.values.range.end,
                },
              },
              errors: { ...prev.errors },
            }));
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
      <Box sx={{ mx: 2 }}> to </Box>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="End day"
          value={time.end}
          onChange={(newValue) => {
            setTime((prev) => ({
              values: {
                ...prev.values,
                range: {
                  start: prev.values.range.start,
                  end: newValue,
                },
              },
              errors: { ...prev.errors },
            }));
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    </div>
  );
};
