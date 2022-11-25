import React, {useState} from 'react';
import { FormField, FormFieldExtendedProps, TextInput as GrommetTextInput, TextInputProps } from "grommet";
import Helpers from "../common/helpers";

interface IProps {
   textInputProps?: Omit<Omit<Omit<TextInputProps, "placeholder">, "id">, "name">;
   formFieldProps?: Omit<Omit<Omit<Omit<FormFieldExtendedProps, "label">, "required">, "name">, "htmlFor">;
   name: string;
   label: string;
   placeholder?: string;
   required?: boolean;
}

function TextInput(props: IProps) {
    const { name, label, required, placeholder, textInputProps, formFieldProps = {} } = props;
    const { defaultValue, value: textValue, ...restTextInputProps } = textInputProps || {};
    const { validate = [], ...restFormField } = formFieldProps;

    const [value, setValue] = useState<any>(textValue || defaultValue || "");

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    }

    const _label = required ? label + ` *` : label;
    let _formFieldValidate: any = required ? [(fieldValue: string) => Helpers.isNullOrEmpty(fieldValue) && ({
            message: "Trường dữ liệu bắt buộc",
            status: "error"
        })] : [];
    if (Array.isArray(validate)) {
        _formFieldValidate = [..._formFieldValidate, ...validate];
    } else {
        _formFieldValidate = [..._formFieldValidate, validate];
    }

    return (
        <FormField name={name} htmlFor={name} label={_label} validate={_formFieldValidate} {...restFormField}>
            <GrommetTextInput
                placeholder={placeholder}
                id={name} name={name}
                {...restTextInputProps}
                value={value}
                onChange={onChange}
            />
        </FormField>
    );
}

export default TextInput;