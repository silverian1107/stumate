// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
const Form2 = ({ register, errors }) => (
  <form className="flex flex-col gap-2 w-full">
    <div className="flex gap-2">
      <label>Value 1</label>
      <input
        type="text"
        {...register('value1', { required: 'Value 1 is required' })}
      />
      {errors.value1 && <p className="text-red-500">{errors.value1.message}</p>}
    </div>
    <div className="flex gap-2">
      <label>Value 2</label>
      <input
        type="text"
        {...register('value2', { required: 'Value 2 is required' })}
      />
      {errors.value2 && <p className="text-red-500">{errors.value2.message}</p>}
    </div>
  </form>
);

export default Form2;
