// hooks/useForm.ts
import { useFormik, FormikValues } from 'formik';
import * as Yup from 'yup';

interface UseFormProps<T extends FormikValues> {
    initialValues: T;
    validationSchema: Yup.Schema<T>;  
    onSubmit: (values: T) => void;
}
// region useForm hook

const useForm = <T extends FormikValues>({ initialValues, validationSchema, onSubmit }: UseFormProps<T>) => {
    const formik = useFormik<T>({
        initialValues,
        validationSchema,
        onSubmit,
        validateOnBlur: true,
    });

    return formik;
};

export default useForm;
