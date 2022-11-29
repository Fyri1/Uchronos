import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import $api, { apiSetHeader } from '../../services/api.js';
import routes from '../../routes.js';
import { useFormik } from 'formik';
import * as yup from 'yup';
import LoadingButton from '@mui/lab/LoadingButton';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LanguageContext from '../../contex/languageContext.js';
import { StyledEngineProvider } from '@mui/material/styles';

const getSchemeValidationLogin = (t) => {
  return yup.object({
    login: yup
      .string()
      .required(t('body.login.fields.login.error.required'))
      .min(3, 'short login')
      .max(30, 'long login')
      .trim(),
    password: yup
      .string()
      .required(t('body.login.fields.password.error.required'))
      .min(6, 'short login')
      .max(30, 'long login')
      .trim(),
  });
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorCringe, setCringe] = useState();
  const { t } = useContext(LanguageContext);
  const navigate = useNavigate();

  const formik = useFormik({
    //  обработчик формы
    initialValues: {
      login: '',
      password: '',
      remember: false,
    },
    validationSchema: getSchemeValidationLogin(t),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      //сробатываине после нажатия кнопки
      setLoading(true);
      try {
        const data = await $api.post(routes.loginPath(), values);
        console.log(data);
        localStorage.setItem('jwt', data.data.accessToken);
        apiSetHeader('Authorization', `Bearer ${data.data.accessToken}`);
        setLoading(false);
        window.location.href = '/';
      } catch (err) {
        setCringe(err.response.data.message);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  return (
    <form
      onSubmit={formik.handleSubmit}
      className="bg-gray-50 dark:bg-gray-900"
    >
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              {t('body.login.title')}
            </h1>
            <TextField
              id="login"
              label={t('body.login.fields.login.label')}
              name="login"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              onChange={formik.handleChange}
              value={formik.values.login}
              error={
                Boolean(formik.errors?.login) ||
                Boolean(errorCringe ? errorCringe : null)
              }
              helperText={
                (formik.errors?.login ? formik.errors.login : null) ||
                (errorCringe ? errorCringe : null)
              }
            />
            <FormControl
              variant="outlined"
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block dark:bg-gray-700 dark:border-gray-600  dark:text-white"
            >
              <InputLabel
                htmlFor="outlined-adornment-password"
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
              >
                {t('body.login.fields.password.label')}
              </InputLabel>
              <OutlinedInput
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formik.values.password}
                onChange={formik.handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                error={Boolean(formik.errors.password)}
                label={t('body.login.fields.password.label')}
              />
              <FormHelperText error={Boolean(formik.errors.password)}>
                {formik.errors?.password ? formik.errors.password : null}
              </FormHelperText>
            </FormControl>
            <div className="flex items-center justify-between">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <Checkbox
                    id="remember"
                    name="remember"
                    onChange={formik.handleChange}
                    value={formik.values.remember}
                  />
                </div>
                <div className="text-sm">
                  <label
                    htmlFor="remember"
                    className="text-gray-500 dark:text-gray-300"
                  >
                    {t('body.login.remember')}
                  </label>
                </div>
              </div>
              <Link
                href="#"
                underline="hover"
                className="text-sm font-medium text-primary-600 dark:text-primary-500"
              >
                {t('body.login.forgot-pass')}
              </Link>
            </div>
            <LoadingButton
              className="w-full text-white bg-primary-600  font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              variant="contained"
              loading={loading}
              type="submit"
            >
              {t('body.login.btn-login')}
            </LoadingButton>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              {t('body.login.no-account')}{' '}
              <Link
                href="/register"
                underline="hover"
                className="font-medium text-primary-600 dark:text-primary-500"
              >
                {t('body.login.register')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Login;
