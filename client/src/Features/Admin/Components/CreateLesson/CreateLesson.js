import React from 'react';
import { Button, Form, Input, Space, message } from 'antd';
import { useCreateLessonMutation } from 'app/api/lessonService';

const SubmitButton = ({ form }) => {
    const [submittable, setSubmittable] = React.useState(false);
    // Watch all values
    const values = Form.useWatch([], form);
    React.useEffect(() => {
        form.validateFields({
            validateOnly: true,
        }).then(
            () => {
                setSubmittable(true);
            },
            () => {
                setSubmittable(false);
            },
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values]);
    return (
        <Button type="primary" htmlType="submit" disabled={!submittable}>
            Submit
        </Button>
    );
};

const CreateLesson = () => {
    const [createLesson] = useCreateLessonMutation();
    const [form] = Form.useForm();

    const submit = (values) => {
        createLesson({
            data: {
                name: values.name,
            },
            headers: { accessToken: JSON.parse(localStorage.getItem('user')).token },
        })
            .then(function (response) {
                if (response.data.error !== undefined) {
                    message.error(response.data.error.message);
                } else if (response.data.errors !== undefined) {
                    message.error(response.data.errors[0].message);
                } else message.success('Created lesson successfully');
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    return (
        <div className="create-lesson">
            <Form
                form={form}
                name="validateOnly"
                layout="vertical"
                autoComplete="off"
                onFinish={(values) => submit(values)}
                className="create-word"
                size="large"
            >
                <Form.Item
                    name="name"
                    label="Lesson's name"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Space>
                        <SubmitButton form={form} />
                        <Button htmlType="reset">Reset</Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    );
};

export default CreateLesson;
