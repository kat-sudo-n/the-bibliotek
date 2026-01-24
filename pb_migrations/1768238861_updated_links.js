/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_449060851")

  // remove field
  collection.fields.removeById("file3695138421")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_449060851")

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "file3695138421",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": [],
    "name": "og_image",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  return app.save(collection)
})
