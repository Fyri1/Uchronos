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
import { handleDateSelect, handleDateDelete, handleCalendarAdd } from '../main-page/Calendar.jsx';

const setError = (errors, key, value) => (errors[key].required = value);

const CreateCalendar = ({
  setPopupActive,
  active,
}) => {
  const [state, setState] = useState({
    values: {
      id: '',
      title: '',
      description: ''
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
    setState((prev) => ({
      ...prev,
      values: {
        id: '',
        title: '',
        description: ''
      },
    }));
  }, [active]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setPopupActive(false);
    handleCalendarAdd(state.values);
  };

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
          onBlur={(e) => {
            state.errors.title.required = true;
          }}
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
      <div>
        <button className="button_create">
          <div className="button_hola" id="button_hola_create">
            <label>Create</label>
          </div>
        </button>
        <label
          className="button_hola"
          id="button_hola_cancel"
          onClick={() => {
            setPopupActive(false);
            setState({
              values: {
                title: '',
                description: ''
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
        >Cancel</label>
      </div>
    </form>
  );
};

export default CreateCalendar;
