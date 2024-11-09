// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';

import { AutosizeTextarea } from '@/components/ui/auto-size-textarea';
// Form1 Component
const Form1 = ({ register, errors, handleForm1Submit }) => {
  return (
    <form onSubmit={handleForm1Submit} className="flex flex-col gap-2 w-full">
      <div className="flex gap-2">
        <label>Name</label>
        <input
          type="text"
          placeholder="Name"
          {...register('name', { required: 'Name is required' })}
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>
      <div className="flex gap-2">
        <label>Description</label>
        <AutosizeTextarea
          type="text"
          placeholder="Description"
          {...register('description')}
        />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}
      </div>
      <button type="submit" className="mt-4 p-2 bg-blue-500 text-white">
        Submit Form 1
      </button>
    </form>
  );
};

export default Form1;
