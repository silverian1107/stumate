import { Schema } from 'mongoose';

type PreMiddlewareFunction = (this: any, next: (err?: Error) => void) => void;

const archivePlugin = (schema: Schema) => {
  schema.add({
    isArchived: {
      type: Boolean,
      default: false,
    },
    archivedAt: {
      type: Date,
      default: null,
    },
  });

  const archiveMiddleware: PreMiddlewareFunction = function (next) {
    if (this.getQuery) {
      const query = this.getQuery();
      if (!query.isArchived) {
        this.where({ isArchived: false });
      }
    } else {
      const pipeline = this.pipeline();
      const hasArchiveMatch = pipeline.some(
        (stage) => stage.$match && 'isArchived' in stage.$match,
      );
      if (!hasArchiveMatch) {
        pipeline.unshift({ $match: { isArchived: false } });
      }
    }

    next();
  };

  schema.pre('countDocuments', archiveMiddleware);
  schema.pre('find', archiveMiddleware);
  schema.pre('findOne', archiveMiddleware);
  schema.pre('findOneAndUpdate', archiveMiddleware);
  schema.pre('updateOne', archiveMiddleware);
  schema.pre('updateMany', archiveMiddleware);
  schema.pre('aggregate', archiveMiddleware);
};

export default archivePlugin;
