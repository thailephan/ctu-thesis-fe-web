import { formatISO, format } from 'date-fns';
import { FormField, Text, DateInput as GrommetDateInput, DateInputExtendedProps } from 'grommet';
import React, {useState} from 'react';

interface IProps {
    title?: string;
    name?: string;
    value?: number;
    max?: Date;
    min?: Date;
    dateInputProps?: Omit<Omit<Omit<DateInputExtendedProps, "value">, "name">, "onChange">;
}

function DateInput(props: IProps) {
    const { dateInputProps = {} } = props;
    const [value, setValue] = useState<any>(props.value ? formatISO(props.value * 1000) : undefined);

    return (
        <FormField name={props.name} htmlFor={props.name} validate={[
            (fieldValue) => {
                return props.max && new Date(fieldValue) > props.max && ({
                    message: "Ngày được chọn phải nhỏ hơn " + format(props.max, "dd/MM/yyyy"),
                    status: "error",
                })
            },
            (fieldValue) => {
                return props.min && new Date(fieldValue) < props.min && ({
                    message: "Ngày được chọn phải lớn hơn " + format(props.min, "dd/MM/yyyy"),
                    status: "error",
                })
            },
        ]}>
            <Text className="px-2">{props.title}</Text>
            <GrommetDateInput
                reverse
                format="dd/mm/yyyy"
                name={props.name}
                id={props.name}
                onChange={(e) => setValue(e.value)}
                dropProps={{align: {bottom: "top", left: "right"}}}
                value={value}
                {...dateInputProps}
            />
        </FormField>
    );
}

export default DateInput;