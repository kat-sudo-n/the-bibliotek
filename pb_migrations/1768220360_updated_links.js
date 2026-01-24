/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_449060851")

  // add field
  collection.fields.addAt(5, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text842279489",
    "max": 0,
    "min": 0,
    "name": "og_title",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text821996201",
    "max": 0,
    "min": 0,
    "name": "og_description",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

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
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_449060851")

  // remove field
  collection.fields.removeById("text842279489")

  // remove field
  collection.fields.removeById("text821996201")

  // remove field
  collection.fields.removeById("file3695138421")

  return app.save(collection)
})
