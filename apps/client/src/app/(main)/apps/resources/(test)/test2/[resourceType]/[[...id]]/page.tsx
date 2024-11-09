// app/(resources)/[resourceType]/[[...id]]/page.tsx
'use client';

import { ResourceElements } from './creator';
import { ResourceHeader } from './header';
import { Resource } from './type';
import { useResourceManager } from './useResourceQuery';

export default function ResourcePage() {
  const {
    resource,
    isLoading,
    isEditing,
    saveResource,
    isSubmitting,
    resourceType,
  } = useResourceManager();

  console.log({
    resource,
    isLoading,
    isEditing,
    saveResource,
    isSubmitting,
    resourceType,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (formData: Resource) => {
    const { name, description, elements } = formData;
    await saveResource({ name, description, elements });

    // console.log('Form submitted successfully!', formData);
  };

  return (
    <div className="space-y-6">
      <ResourceHeader
        initialData={resource!}
        isEditing={isEditing}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        resourceType={resourceType}
      />
      <ResourceElements
        initialElements={resource!.elements}
        onElementsChange={(elements) => {
          saveResource({
            ...resource,
            elements,
            name: resource?.name || '',
            description: resource?.description || '',
          });
        }}
        resourceType={resourceType}
      />
    </div>
  );
}
