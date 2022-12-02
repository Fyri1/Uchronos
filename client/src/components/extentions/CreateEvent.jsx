import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import $api, { apiSetHeader } from '../../services/api.js';
import routes from '../../routes.js';
import { useFormik } from 'formik';
import LoadingButton from '@mui/lab/LoadingButton';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import DataPicker from './DataPicker.jsx';
import * as yup from 'yup';

const schemeEvent = yup.object({
  title: yup.string().required().trim(),
  description: yup.string().required().trim(),
});

const CreateEvent = ({
  newEventInfo,
  eventsElements,
  setPopupActive,
  active,
}) => {
  const [state, setState] = useState({
    values: {
      title: '',
      description: '',
      color: 'blue',
      range: {
        start: '',
        end: '',
      },
    },
    errors: {
      title: {
        required: false,
        text: 'Title is required',
      },
      description: {
        required: false,
        text: 'Description is required',
      },
    },
  });
  useEffect(() => {
    const values = !newEventInfo
      ? ''
      : Object.keys(newEventInfo).length === 4 &&
        eventsElements.find((item) => item.id === newEventInfo.event.id)
      ? eventsElements.find((item) => item.id === newEventInfo.event.id)
      : '';
    console.log(values);
    setState((prev) => ({
      ...prev,
      values: {
        title: values.title || '',
        description: values.description,
        color: values.color || 'blue',
        range: {
          start: values.start,
          end: values.end,
        },
      },
    }));
    console.log(state);
  }, [active]);

  const handleSubmit = () => {};

  return (
    <form onSubmit={handleSubmit}>
      <div className="Greetings">
        <p>HI MAXIM PIDOR!</p>
      </div>

      <div className="my-2 w-11/12">
        <TextField
          id="title"
          label="Titile"
          name="title"
          className="rounded-lg w-full"
          onChange={(e) => {
            setState((prev) => ({
              values: { ...prev.values, title: e.target.value },
              errors: { ...prev.errors },
            }));
          }}
          value={state.values.title}
          error={state.errors.title.required}
          helperText={
            state.errors.title.required ? state.errors.title.text : null
          }
        />
      </div>
      <div className="my-2 w-11/12">
        <TextField
          id="description"
          label="Description"
          name="description"
          className="rounded-lg w-full"
          onChange={(e) => {
            setState((prev) => ({
              values: { ...prev.values, description: e.target.value },
              errors: { ...prev.errors },
            }));
          }}
          value={state.values.description}
          error={state.errors.description.required}
          helperText={
            state.errors.description.required
              ? state.errors.description.text
              : null
          }
        />
      </div>
      <div className="my-2 w-11/12 flex items-center">
        <FormControl sx={{ mr: 5, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-label">Color</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={state.values.color}
            label="Age"
            onChange={(e) => {
              setState((prev) => ({
                values: { ...prev.values, color: e.target.value },
                errors: { ...prev.errors },
              }));
            }}
          >
            <MenuItem value="blue">
              <p className="decoration-red-50">blue</p>
            </MenuItem>
            <MenuItem value="red">red</MenuItem>
            <MenuItem value="orange">orange</MenuItem>
          </Select>
        </FormControl>
        <div
          className="rounded-sm"
          style={{
            background: state.values.color,
            height: '30px',
            width: '30px',
          }}
        ></div>
      </div>
      <div className="my-2 w-11/12">
        <DataPicker setTime={setState} time={state.values.range} />
      </div>

      <div>
        <button
          className="button_create"
          onClick={() =>
            handleDateSelect(
              newEventInfo,
              displayedCalendarData,
              setPopupActive
            )
          }
        >
          {newEventInfo?.event?.id ? (
            <div className="button_hola" id="button_hola_create">
              <label>Update</label>
            </div>
          ) : (
            <div className="button_hola" id="button_hola_create">
              <label>Create</label>
            </div>
          )}
        </button>
        <a
          className="button_hola"
          id="button_hola_cancel"
          onClick={() => {
            setPopupActive(false);
            setState({
              values: {
                title: '',
                description: '',
                color: '',
                range: '',
              },
              errors: {
                title: {
                  required: false,
                  text: 'Title is required',
                },
                description: {
                  required: false,
                  text: 'Description is required',
                },
              },
            });
          }}
        >
          Cancel
        </a>
        {newEventInfo && Object.keys(newEventInfo).length === 4 ? (
          <button
            className="button_hola"
            id="button_hola_delete"
            onClick={() => handleDateDelete(newEventInfo, setPopupActive)}
          >
            Delete
          </button>
        ) : null}
      </div>
    </form>
  );
};

export default CreateEvent;
