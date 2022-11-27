import React, { useEffect, useState, useContext } from 'react';
import $api from '../../services/api.js';
import { useNavigate } from 'react-router-dom';
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
import routes from '../../routes.js';

const getSchemeValidationLogin = (t) => {
  return yup.object({
    login: yup
      .string()
      .required(t('body.register.fields.login.error.required'))
      .trim(),
    email: yup
      .string()
      .email(t('body.register.fields.email.error.email'))
      .required(t('body.register.fields.email.error.required'))
      .trim(),
    password: yup
      .string()
      .required(t('body.register.fields.password.error.required'))
      .trim(),
    passwordConfirm: yup
      .string()
      .required(t('body.register.fields.comfirm-password.error.required'))
      .oneOf(
        [yup.ref('password')],
        t('body.register.fields.comfirm-password.error.required')
      ),
    terms: yup.bool().oneOf([true], 'You must accept the terms and conditions'),
  });
};

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorValid, setErrorValid] = useState({
    login: {
      massage: '',
      valid: false,
    },
    email: {
      massage: '',
      valid: false,
    },
  });
  const { t } = useContext(LanguageContext);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      login: '',
      password: '',
      passwordConfirm: '',
      terms: false,
    },
    validationSchema: getSchemeValidationLogin(t),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const data = await $api.post(routes.registerPath(), values);
        console.log(data);
        navigate('/comfirm-email');
      } catch (err) {
        const errors = err.response.data.errors.errors;
        errors.map((item) => {
          setErrorValid({
            ...errorValid,
            [item.param]: {
              valid: true,
              massage: item.msg,
            },
          });
        });
      } finally {
        setLoading(false);
      }
    },
  });
  console.log(errorValid);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <section className=" dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create and account
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={formik.handleSubmit}
            >
              <TextField
                id="email"
                label={t('body.register.fields.email.label')}
                name="email"
                className=" text-gray-900 sm:text-sm block w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                onChange={formik.handleChange}
                value={formik.values.email}
                error={
                  Boolean(formik.errors?.email) ||
                  Boolean(errorValid.email.valid)
                }
                helperText={
                  (formik.errors?.email ? formik.errors.email : null) ||
                  (errorValid.email.valid ? errorValid.email.massage : null)
                }
              />
              <TextField
                id="login"
                name="login"
                label={t('body.register.fields.login.label')}
                className=" text-gray-900 sm:text-sm block w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                onChange={formik.handleChange}
                value={formik.values.login}
                error={
                  Boolean(formik.errors?.login) ||
                  Boolean(errorValid.login.valid)
                }
                helperText={
                  (formik.errors?.login ? formik.errors.login : null) ||
                  (errorValid.login.valid ? errorValid.login.massage : null)
                }
              />
              <FormControl
                variant="outlined"
                className="w-full  border border-gray-300 text-gray-900 sm:text-sm rounded-lg block dark:bg-gray-700 dark:border-gray-600  dark:text-white"
              >
                <InputLabel
                  htmlFor="outlined-adornment-password"
                  error={
                    Boolean(formik.errors?.passwordConfirm) ||
                    Boolean(formik.errors.password)
                  }
                >
                  {t('body.register.fields.password.label')}
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
                  error={
                    Boolean(formik.errors.password) ||
                    Boolean(formik.errors?.passwordConfirm)
                  }
                  label={t('body.register.fields.password.label')}
                />
                <FormHelperText error={Boolean(formik.errors.password)}>
                  {formik.errors?.password ? formik.errors.password : null}
                </FormHelperText>
              </FormControl>
              <TextField
                id="comfirm-password"
                label={t('body.register.fields.comfirm-password.label')}
                name="passwordConfirm"
                type={showPassword ? 'text' : 'password'}
                className="text-gray-900 sm:text-sm block w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                onChange={formik.handleChange}
                value={formik.values.passwordConfirm}
                error={Boolean(formik.errors?.passwordConfirm)}
                helperText={
                  formik.errors?.passwordConfirm
                    ? formik.errors.passwordConfirm
                    : null
                }
              />
              <div className="flex items-start flex-col">
                <div className="flex">
                  <div className="flex items-center h-5">
                    <Checkbox
                      id="terms"
                      name="terms"
                      onChange={formik.handleChange}
                      value={formik.values.terms}
                    />
                  </div>
                  <div className="text-sm">
                    <label
                      htmlFor="terms"
                      className="font-light text-gray-500 dark:text-gray-300"
                    >
                      {t('body.register.conditions.item1')}{' '}
                      <Link
                        className="font-medium text-primary-600 dark:text-primary-500"
                        href="#"
                        underline="hover"
                      >
                        {t('body.register.conditions.item2')}
                      </Link>
                    </label>
                  </div>
                </div>
                <p className="text-xs ml-3 pt-2 text-red-600">
                  {formik.errors?.terms ? formik.errors.terms : null}
                </p>
              </div>
              <LoadingButton
                className="w-full text-white bg-primary-600  font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                variant="contained"
                loading={loading}
                type="submit"
              >
                {t('body.register.btn-register')}
              </LoadingButton>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                {t('body.register.sing-in.item1')}{' '}
                <a
                  href="/login"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  {t('body.register.sing-in.item2')}
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
