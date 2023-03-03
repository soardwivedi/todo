import yup from 'yup';

const userAddSchema = yup.object().shape({
  body: yup.object().shape({
    name: yup
      .string()
      .required('Name is required.')
      .min(2, 'Name should have atleast 2 letter.'),
    email: yup.string().required('Email is required field.'),
    password: yup.string().required('Password is required.').min(3)
  })
});

const userLoginSchema = yup.object().shape({
  body: yup.object().shape({
    email: yup.string().required('Email is required field.'),
    password: yup.string().required('Password is required.').min(3)
  })
});
const userRfreshShema = yup.object().shape({
  body: yup.object().shape({
    refresh_token: yup.string().required('Refresh token required.')
  })
});
const userPasswordUpdateSchema = yup.object().shape({
  body: yup.object().shape({
    email: yup.string().required('Email is required field.'),
    oldPassword: yup.string().required('Old Password is require.'),
    newPassword: yup.string().required('You have to enter new Password.'),
    confirmNewPassword: yup
      .string()
      .required('You have to enter confirm password.')
  })
});
export {
  userAddSchema,
  userLoginSchema,
  userRfreshShema,
  userPasswordUpdateSchema
};
