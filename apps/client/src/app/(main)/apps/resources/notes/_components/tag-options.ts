export type Option = { label: string; value: string };

export const transformTagsToOptions = (userTags: any[]): Option[] => {
  return userTags.map((tag) => ({
    label: tag.name,
    value: tag._id
  }));
};

export const searchTag = async (value: string, options: Option[]) => {
  return options.filter((option) =>
    option.label.toLowerCase().includes(value.toLowerCase())
  );
};
