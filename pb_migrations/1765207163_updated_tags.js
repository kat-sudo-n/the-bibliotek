/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1219621782")

  // add field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3885777100",
    "hidden": false,
    "id": "relation1328307651",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "tag_group",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1219621782")

  // remove field
  collection.fields.removeById("relation1328307651")

  return app.save(collection)
})
