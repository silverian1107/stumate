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
    const currentQuery = this.getQuery();
    if ('isArchived' in currentQuery) {
      return next();
    }

    this.where({ isArchived: false });
    next();
  };

  schema.pre('count', archiveMiddleware);
  schema.pre('countDocuments', archiveMiddleware);
  schema.pre('find', archiveMiddleware);
  schema.pre('findOne', archiveMiddleware);
  schema.pre('findOneAndUpdate', archiveMiddleware);
  schema.pre('updateOne', archiveMiddleware);
  schema.pre('updateMany', archiveMiddleware);
  schema.pre('aggregate', archiveMiddleware);
};

export default archivePlugin;
