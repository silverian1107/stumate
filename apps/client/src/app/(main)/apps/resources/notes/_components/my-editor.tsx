'use client';

import React, { useEffect } from 'react';

import InputWithMultipleSelect from '@/components/ui/input-with-multi-select';
import { ResourceTypeEnum } from '@/endpoints/tag-api';
import { useNoteById } from '@/hooks/use-note';
import { useAssignTag, useCreateTag, useTags } from '@/hooks/use-tag';

import MyTextEditor from './my-text-editor';
import NoteTitle from './note-title';
import type { Option } from './tag-options';
import { searchTag, transformTagsToOptions } from './tag-options';

const MyEditor = () => {
  const { data, isLoading } = useNoteById();
  const { data: tags, isLoading: tagsLoading } = useTags();

  const createTag = useCreateTag();
  const assignTag = useAssignTag();
  const unassignTag = useAssignTag();

  const [selectedTags, setSelectedTags] = React.useState<Option[]>([]);

  const tagOptions: Option[] = React.useMemo(() => {
    if (!tags || !tags.userTags) return [];
    return transformTagsToOptions(tags.userTags);
  }, [tags]);

  useEffect(() => {
    if (data && data.tags) {
      const transformedTags = data.tags.map(
        (tag: { name: string; _id: string }) => ({
          label: tag.name,
          value: tag._id
        })
      );
      setSelectedTags(transformedTags);
    }
  }, [data]);

  const handleTagChange = async (newTags: Option[]) => {
    const tagsToCreate = newTags.filter((tag) => tag.label === tag.value);

    const createdTags = await Promise.all(
      tagsToCreate.map((tag) => createTag.mutateAsync({ name: tag.label }))
    );

    const updatedTags = newTags.map((tag) => {
      if (tag.label === tag.value) {
        const createdTag = createdTags.find(
          (newTag) => newTag.name === tag.label
        );
        return {
          label: createdTag?.name || tag.label,
          value: createdTag?._id || tag.value
        };
      }
      return tag;
    });

    const addedTags = updatedTags.filter(
      (tag) =>
        !selectedTags.some((existingTag) => existingTag.value === tag.value)
    );
    if (newTags.length > selectedTags.length) {
      addedTags.forEach((tag) => {
        if (data) {
          assignTag.mutate(
            {
              resourceType: ResourceTypeEnum.Note,
              resourceId: data._id,
              tagId: tag.value
            },
            {
              onError: () => {
                return;
              }
            }
          );
        }
      });
    } else if (newTags.length < selectedTags.length) {
      const deletedTags = selectedTags.filter(
        (existingTag) => !newTags.some((tag) => tag.value === existingTag.value)
      );

      deletedTags.forEach((tag) => {
        if (data) {
          unassignTag.mutate({
            resourceType: ResourceTypeEnum.Note,
            resourceId: data._id,
            tagId: tag.value
          });
        }
      });
    }

    setSelectedTags(updatedTags);
  };

  if (isLoading || tagsLoading || !data) return null;

  return (
    <div className="size-full p-5 rounded-sm box-border flex-1 mx-auto overflow-auto pt-10">
      <InputWithMultipleSelect
        className="w-full lg:max-w-[720px] text-center mx-auto"
        options={tagOptions}
        value={selectedTags}
        defaultOptions={tagOptions}
        onSearch={(query) => searchTag(query, tagOptions)}
        onChange={handleTagChange}
      />
      <NoteTitle />
      <div className="mb-5" />
      <MyTextEditor data={data} />
    </div>
  );
};

export default MyEditor;
