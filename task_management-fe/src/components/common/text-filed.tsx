import { Input } from "../ui/input";

interface TextFieldProps extends React.ComponentProps<"input"> {
  errors?: string;
  label?: string;
}

export const TextField = ({ errors, label, ...props }: TextFieldProps) => {
  return (
    <div>
      {label && <span className="font-medium">{label}</span>}
      <Input {...props} />
      {errors && <p className="text-xs text-red-500 mt-2">{errors}</p>}
    </div>
  );
};
