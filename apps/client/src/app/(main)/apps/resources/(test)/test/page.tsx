// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';

import { useForm } from 'react-hook-form';
import Form1 from './form1';
import Form2 from './form2';
import { useMutation } from '@tanstack/react-query';

const Test = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  // Mutation for Form 1 submission
  const mutationForm1 = useMutation({
    mutationFn: (data) => {
      // Simulate an API request for Form1
      return fetch('http://localhost:3000/api/form1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    },
  });

  // Mutation for Form 2 submission
  const mutationForm2 = useMutation({
    mutationFn: (data) => {
      // Simulate an API request for Form2
      return fetch('http://localhost:3000/api/form2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    },
  });

  // Handle submission of Form1 and Form2
  const handleForm1Submit = handleSubmit((data) => {
    console.log('Submitting');

    // Trigger Form1 request
    mutationForm1.mutate(data, {
      onSuccess: () => {
        const form2Data = {
          value1: getValues('value1'),
          value2: getValues('value2'),
        };
        mutationForm2.mutate(form2Data);
      },
      onError: (error) => {
        console.error('Error:', error);
      },
    });
    console.log('Hello');
  });

  return (
    <div className="flex flex-col w-full h-full">
      <Form1
        register={register}
        errors={errors}
        handleForm1Submit={handleForm1Submit}
      />
      <Form2 register={register} errors={errors} />
    </div>
  );
};

export default Test;
