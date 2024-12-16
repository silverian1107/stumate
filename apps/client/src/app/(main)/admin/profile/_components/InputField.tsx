const InputField = ({
  label,
  type = 'text',
  value,
  id
}: {
  label: string;
  type: string;
  value: string;
  id: string;
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        value={value}
        disabled
        className=" border shadow rounded-md px-2 py-1.5 bg-slate-100 text-primary-950"
      />
    </div>
  );
};

export default InputField;
