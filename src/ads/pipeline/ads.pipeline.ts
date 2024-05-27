import { PipelineStage } from 'mongoose';

export const viewCountsPipelineStage: PipelineStage.Lookup = {
  $lookup: {
    from: 'views',
    as: 'views',
    let: { account: '$account', item: '$_id' },
    pipeline: [
      {
        $match: { $expr: { $eq: [{ $toObjectId: '$item' }, '$$item'] } },
      },
      { $count: 'viewsCount' },
    ],
  },
};

export const fillViewsAndCounts = {
  $fill: {
    output: {
      viewsCount: { value: 0 },
      contactsCount: { value: 0 },
    },
  },
};

export const addViewsAndContactFields = {
  $addFields: {
    viewsCount: {
      $arrayElemAt: ['$views', 0],
    },
    contactsCount: {
      $arrayElemAt: ['$contacts', 0],
    },
  },
};

export const contactCountPipelineStage: PipelineStage.Lookup = {
  $lookup: {
    from: 'reveallogs',
    as: 'contacts',
    let: { account: '$account', item: '$_id' },
    pipeline: [
      {
        $match: { $expr: { $eq: [{ $toObjectId: '$item' }, '$$item'] } },
      },
      { $count: 'contactsCount' },
    ],
  },
};
export const adsPipeline = (match: PipelineStage) => [
  match,
  viewCountsPipelineStage,
  contactCountPipelineStage,
  addViewsAndContactFields,
  {
    $project: {
      viewsCount: '$viewsCount.viewsCount',
      contactsCount: '$contactsCount.contactsCount',
      account: 1,
      title: 1,
      status: 1,
      price: 1,
      condition: 1,
      publishedDate: 1,
      createdAt: 1,
    },
  },
  fillViewsAndCounts,
];
