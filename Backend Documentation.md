# Dreem Backend Documentation

### Attention

Most of the endpoints require or send extra information after sending auth token passed as a header:
"Authorization: Bearer XXX"

### Urls

dev

https://dev.privi-metaverse.com/

prod

https://web.privi-metaverse.com (not up yet)

# Response codes

### Success

| Code   | Description                                         |
| :---: | ---------------------------------------------- |
| 200   | Success                                         |

### Error

See alternate flows below every endpoint

## Functions

### Get items - all or owned by user

### items/

###### Permission: everyone

###### if user is not logged in, he can only browse public items. If he's logged in, he can browse private items he owns

| HTTP Method | Content-Type     | Input | Example                             | Action                  |
| ----------- | ---------------- | ------------ | -------------------------------------------- | ----------------------- |
| GET            |       -      |         -                                      |       -          | -
| POST        |     application/json      |   {"portion" : 10, "page" : 4, "filters" : ["NFT_WORLD", "DRAFT_WORLD", "NFT_MEDIA"], "sorting" : "reviews", "ownerId" : "priviUser176"},       |                                         | Get items based on requirements                |
| PUT         |                  |              |                                              | NONE                    |
| DELETE      |                  |              |                                              | NONE                    |

### Sorting types

##### reviews (allowed if NFT_MEDIA not in filters)

Sort the records by the number of reviews descending

##### rating (allowed if NFT_MEDIA not in filters)

Sort the records by the average rating descending, levels without rating would return rating -1 (so they won't be
considered rated). Rating is the float from [1,5] so -1 is out of this range. Could be shown as NaN in the frontend.

##### timestamp (default)

Sort the records from the newest. It uses worldPublishingTimestamp (timestamp when world was published for the first
time). So toggling public/private won't affect sorting.

### Params

##### portion

how many worlds to get, specify -1 to get all of them

##### page (optional if portion == -1)

which page to get, INDEXED FROM 1

##### ownerId (optional)

If you specify ownerId, you'd get only items that the user owns (and they're public if you're not requesting your own
items)

##### filters (optional)

Array of item types, to get all items leave none or specify ["NFT_WORLD", "DRAFT_WORLD", "NFT_MEDIA"]

### Alternate flows

| Code   | Description                                                   |
| :---: | --------------------------------------------------------- |
| 400   | page must be > 0 if portion is not -1  |

### Example success output:

```json
{
  "success": true,
  "data": {
    "page": {
      "min": 1,
      "max": 10,
      "cur": 1,
      "portion": 1
    },
    "items": [
      {
        "id": 16,
        "owner": {
          "character": {
            "name": "Funnyjoe2",
            "gender": "MALE",
            "address": ""
          },
          "user": {
            "id": "priviUser167",
            "role": "Default",
            "avatarUrl": "https://privi.fra1.digitaloceanspaces.com/privi/avatars/ToyFaces_Colored_BG_111.jpg",
            "firstName": "Arkadiusz",
            "lastName": "Mirecki",
            "address": "0xabd43253cd5f567ba2470dd22094eb9c14316b69"
          },
          "isCreator": true,
        },
        "worldTitle": "testx",
        "worldDescription": "xdjjj",
        "worldIsPublic": true,
        "worldAssetUrl": "https://privi.fra1.digitaloceanspaces.com/privi/Location/User/priviUser167/testx/",
        "worldImages": [
          "https://privi.fra1.digitaloceanspaces.com/privi/Location/User/priviUser167/testx/Preview/"
        ],
        "worldUploadTimestamp": 1634471743,
        "worldCreator": {
          "character": {
            "name": "Funnyjoe2",
            "gender": "MALE",
            "address": ""
          },
          "user": {
            "id": "priviUser167",
            "role": "Default",
            "avatarUrl": "https://privi.fra1.digitaloceanspaces.com/privi/avatars/ToyFaces_Colored_BG_111.jpg",
            "firstName": "Arkadiusz",
            "lastName": "Mirecki",
            "address": "0xabd43253cd5f567ba2470dd22094eb9c14316b69"
          },
          "isCreator": true,
        },
        "itemKind": "DRAFT_WORLD",
        "reviewsCount": 2,
        "averageRating": 3.0,
        "creatorId": "priviUser167",
        "tuple": null
      }
    ]
  }
}
```

### Example error output:

```json
{
  "success": false,
  "message": "page must be >= 0"
}
```

### Get item with id {id}

### items/{uint:id}/

###### Permission: everyone

###### if user is not logged in, he can only access public items. If he's  logged in, he can get private items he owns

| HTTP Method | Content-Type     | Input | Example                             | Action                  |
| ----------- | ---------------- | ------------ | -------------------------------------------- | ----------------------- |
| GET            |       -      |         -                                      |       -          | Get item with id
| POST        |                  |              |                                              | NONE                    |
| PUT         |                  |              |                                              | NONE                    |
| DELETE      |                  |              |                                              | Delete an item                    |

### Alternate flows

| Code   | Description                                                   |
| :---: | --------------------------------------------------------- |
| 404   | item not found or not enough permissions |

### Example success output:

##### GET
```json
{
  "success": true,
  "data": {
    "id": 16,
    "owner": {
      "character": {
        "name": "Funnyjoe2",
        "gender": "MALE",
        "address": ""
      },
      "user": {
        "id": "priviUser167",
        "role": "Default",
        "avatarUrl": "https://privi.fra1.digitaloceanspaces.com/privi/avatars/ToyFaces_Colored_BG_111.jpg",
        "firstName": "Arkadiusz",
        "lastName": "Mirecki",
        "address": "0xabd43253cd5f567ba2470dd22094eb9c14316b69"
      },
      "isCreator": true,
    },
    "worldTitle": "testx",
    "worldDescription": "xdjjj",
    "worldIsPublic": true,
    "worldAssetUrl": "https://privi.fra1.digitaloceanspaces.com/privi/Location/User/priviUser167/testx/",
    "worldImages": [
      "https://privi.fra1.digitaloceanspaces.com/privi/Location/User/priviUser167/testx/Preview/"
    ],
    "worldUploadTimestamp": 1634471743,
    "worldCreator": {
      "character": {
        "name": "Funnyjoe2",
        "gender": "MALE",
        "address": ""
      },
      "user": {
        "id": "priviUser167",
        "role": "Default",
        "avatarUrl": "https://privi.fra1.digitaloceanspaces.com/privi/avatars/ToyFaces_Colored_BG_111.jpg",
        "firstName": "Arkadiusz",
        "lastName": "Mirecki",
        "address": "0xabd43253cd5f567ba2470dd22094eb9c14316b69"
      },
      "isCreator": true,
    },
    "itemKind": "DRAFT_WORLD",
    "reviewsCount": 2,
    "averageRating": 3.0,
    "creatorId": "priviUser167",
    "tuple": null
  }
}
```

##### DELETE
```json
{ "success" : true, "message" : "item deleted successfully" }
```
### Example error output:

```json
{
  "success": false,
  "message": "item not found or you don't have enough permissions"
}
```

### Get item metadata for minting / convert draft to nft {id}

### items/{uint:id}/nft/

###### Permission: logged user that owns a draft

| HTTP Method | Content-Type     | Input | Example                             | Action                  |
| ----------- | ---------------- | ------------ | -------------------------------------------- | ----------------------- |
| GET            |       -      |         -                                      |       -          | Get world metadata with id
| POST        |     application/json    |     {     "contractAddress" : "0xAbd43253Cd5f567BA2470Dd22094Eb9c14316B69",     "chain" : "RINKEBY",     "nftId" : 1,     "metadataCID" : "Qmd4C9vaAVuxuFwrqbyDeCgHAWYfc3nBmDkpbD2fPeaHn2" }         |                                              | Convert DRAFT to NFTWorld                    |
| PUT         |                  |              |                                              | NONE                    |
| DELETE      |                  |              |                                              | NONE                    |

### Validation

##### Chain

Must be one of ["RINKEBY", "POLYGON", "BINANCE"]

### Alternate flows

| Code   | Description                                                   |
| :---: | --------------------------------------------------------- |
| 404   | level not found or not enough permissions |
| 405   | item should be a draft to be converted to an NFT |
| 400   | no {field} specified |

### Example success output:

###### GET

```json
{
  "success": true,
  "data": {
    "metadata": {
      "name": "123x",
      "description": "123x",
      "world": "https://elb.ipfsprivi.com:8080/ipfs/QmUTbKbs99xFxqhQKvbaJMtNUTWCR3NauakRKfb6pGoSr6",
      "image": "https://elb.ipfsprivi.com:8080/ipfs/QmUTbKbs99xFxqhQKvbaJMtNUTWCR3NauakRKfb6pGoSr6",
      "creator_address": "",
      "animation_url": null,
      "external_url": "https://privibeta.web.app/#/zoo",
      "itemKind": "DRAFT_WORLD",
      "hash": "54d0574ad2d142d5b5c8fa39cbfe03d51b5726fc6a3385a5c38803244f0f6540",
      "tag": null
    },
    "worldData": {
      "id": 62,
      "owner": {
        "character": {
          "name": "Funnyjoe2",
          "gender": "MALE",
          "address": ""
        },
        "user": {
          "id": "priviUser167",
          "role": "Default",
          "avatarUrl": "",
          "firstName": "",
          "lastName": "",
          "address": ""
        },
        "isCreator": false,
      },
      "worldTitle": "123x",
      "worldDescription": "123x",
      "worldIsPublic": false,
      "worldAssetUrl": "https://privi.fra1.digitaloceanspaces.com/privi/Location/User/priviUser167/123x/ret_BAZ8cC5.jpg",
      "worldImages": [
        "https://privi.fra1.digitaloceanspaces.com/privi/Location/User/priviUser167/123x/Preview/ret_Z4osZwd.jpg"
      ],
      "worldUploadTimestamp": 1634603474,
      "worldCreator": {
        "character": {
          "name": "Funnyjoe2",
          "gender": "MALE",
          "address": ""
        },
        "user": {
          "id": "priviUser167",
          "role": "Default",
          "avatarUrl": "",
          "firstName": "",
          "lastName": "",
          "address": ""
        },
        "isCreator": false,
      },
      "itemKind": "DRAFT_WORLD",
      "reviewsCount": 0,
      "averageRating": -1,
      "creatorId": "priviUser167"
    }
  }
}
```

###### POST

```json
{
  "success": true,
  "data": {
    "name": "ipfstestenc32",
    "description": "xdjjjx",
    "world": "https://elb.ipfsprivi.com:8080/ipfs/Qmd4C9vaAVuxuFwrqbyDeCgHAWYfc3nBmDkpbD2fPeaHn2",
    "image": "https://elb.ipfsprivi.com:8080/ipfs/QmUTbKbs99xFxqhQKvbaJMtNUTWCR3NauakRKfb6pGoSr6",
    "creator_address": "",
    "animation_url": "https://elb.ipfsprivi.com:8080/ipfs/QmYescVvFyqw6djMBTp1MbGeFehYHVcHmvBnnqivQX3WDi",
    "external_url": "https://privibeta.web.app/#/zoo",
    "itemKind": "NFT_WORLD",
    "hash": "2b21a7afe4013ada4dd5830cb73339c5dbaa82dcd590ac7391dfe40e4cc7e2d0",
    "tag": null
  }
}
```

### Example error output:

```json
{
  "success": false,
  "message": "item not found or you don't have enough permissions"
}
```

### Edit world with id {id}

### worlds/{uint:id}/edit/

###### Permission: logged user that owns a world

| HTTP Method | Content-Type     | Input | Example                             | Action                  |
| ----------- | ---------------- | ------------ | -------------------------------------------- | ----------------------- |
| GET            |       -      |         -                                      |       -          | NONE
| POST        |         multipart/form-data        |  {"worldTitle" : "", "worldDescription" : "", "isPublic" : bool, "worldImage" : [file], "worldLevel" : [file], "worldVideo" : [file]}    |                          | Edit a world                   |
| PUT         |                  |              |                                              | NONE                    |
| DELETE      |                  |              |                                              | NONE                    |

### Validation

You must specify at least one of the fields below

###### worldTitle

Must be alphanumeric and contain from 3 to 160 characters

###### worldDescription

Must be alphanumeric and contain from 3 to 5000 characters

###### worldImage

Must be one of the common image formats, size cannot exceed 2 MB

###### worldLevel

Size cannot exceed 15 MB

###### worldVideo

It's optional, if provided must be one of the common video formats, size cannot exceed 30 MB

### Alternate flows

| Code   | Description                                                   |
| :---: | --------------------------------------------------------- |
| 400   | you must specify one of the following: worldTitle, worldDescription, worldImage, worldLevel |
| 405   | world not found, wrong type or you don't have enough permissions |
| 400   | level title is incorrect |
| 400   | level description is incorrect |
| 409   | level with this title exists |

### Example success output:

```json
{
  "success": true,
  "data": {
    "metadata": {
      "name": "123x",
      "description": "123x",
      "world": "https://elb.ipfsprivi.com:8080/ipfs/QmUTbKbs99xFxqhQKvbaJMtNUTWCR3NauakRKfb6pGoSr6",
      "image": "https://elb.ipfsprivi.com:8080/ipfs/QmUTbKbs99xFxqhQKvbaJMtNUTWCR3NauakRKfb6pGoSr6",
      "creator_address": "",
      "animation_url": null,
      "external_url": "https://privibeta.web.app/#/zoo",
      "itemKind": "DRAFT_WORLD",
      "hash": "54d0574ad2d142d5b5c8fa39cbfe03d51b5726fc6a3385a5c38803244f0f6540",
      "tag": null
    },
    "worldData": {
      "id": 62,
      "owner": {
        "character": {
          "name": "Funnyjoe2",
          "gender": "MALE",
          "address": ""
        },
        "user": {
          "id": "priviUser167",
          "role": "Default",
          "avatarUrl": "",
          "firstName": "",
          "lastName": "",
          "address": ""
        },
        "isCreator": false,
      },
      "worldTitle": "123x",
      "worldDescription": "123x",
      "worldIsPublic": false,
      "worldAssetUrl": "https://privi.fra1.digitaloceanspaces.com/privi/Location/User/priviUser167/123x/ret_BAZ8cC5.jpg",
      "worldImages": [
        "https://privi.fra1.digitaloceanspaces.com/privi/Location/User/priviUser167/123x/Preview/ret_Z4osZwd.jpg"
      ],
      "worldUploadTimestamp": 1634603474,
      "worldCreator": {
        "character": {
          "name": "Funnyjoe2",
          "gender": "MALE",
          "address": ""
        },
        "user": {
          "id": "priviUser167",
          "role": "Default",
          "avatarUrl": "",
          "firstName": "",
          "lastName": "",
          "address": ""
        },
        "isCreator": false,
      },
      "itemKind": "DRAFT_WORLD",
      "reviewsCount": 0,
      "averageRating": -1,
      "creatorId": "priviUser167"
    }
  }
}
```

### Example error output:

```json
{
  "success": false,
  "message": "item not found or you don't have enough permissions"
}
```

### Upload a world

### worlds/upload/

###### Permission: logged user

| HTTP Method | Content-Type     | Input | Example                             | Action                  |
| ----------- | ---------------- | ------------ | -------------------------------------------- | ----------------------- |
| GET            |       -      |         -                                      |       -          | NONE
| POST        |         multipart/form-data        |  {"worldTitle" : "", "worldDescription" : "", "isPublic" : bool, "worldImage" : [file], "worldLevel" : [file], "worldVideo" : [file]}    |                          | Upload a world                   |
| PUT         |                  |              |                                              | NONE                    |
| DELETE      |                  |              |                                              | NONE                    |

### Validation

###### worldTitle

Must be alphanumeric and contain from 3 to 160 characters

###### worldDescription

Must be alphanumeric and contain from 3 to 5000 characters

###### worldImage

Must be one of the common image formats, size cannot exceed 2 MB

###### worldLevel

Size cannot exceed 15 MB

###### worldVideo

It's optional, if provided must be one of the common video formats, size cannot exceed 30 MB

### Alternate flows

| Code   | Description                                                   |
| :---: | --------------------------------------------------------- |
| 400   | level title is incorrect |
| 400   | level description is incorrect |
| 409   | level with this title exists |

### Example success output:

```json
{
  "success": true,
  "data": {
    "metadata": {
      "name": "123x",
      "description": "123x",
      "world": "https://elb.ipfsprivi.com:8080/ipfs/QmUTbKbs99xFxqhQKvbaJMtNUTWCR3NauakRKfb6pGoSr6",
      "image": "https://elb.ipfsprivi.com:8080/ipfs/QmUTbKbs99xFxqhQKvbaJMtNUTWCR3NauakRKfb6pGoSr6",
      "creator_address": "",
      "animation_url": null,
      "external_url": "https://privibeta.web.app/#/zoo",
      "itemKind": "DRAFT_WORLD",
      "hash": "54d0574ad2d142d5b5c8fa39cbfe03d51b5726fc6a3385a5c38803244f0f6540",
      "tag": null
    },
    "worldData": {
      "id": 62,
      "owner": {
        "character": {
          "name": "Funnyjoe2",
          "gender": "MALE",
          "address": ""
        },
        "user": {
          "id": "priviUser167",
          "role": "Default",
          "avatarUrl": "",
          "firstName": "",
          "lastName": "",
          "address": ""
        },
        "isCreator": false,
      },
      "worldTitle": "123x",
      "worldDescription": "123x",
      "worldIsPublic": false,
      "worldAssetUrl": "https://privi.fra1.digitaloceanspaces.com/privi/Location/User/priviUser167/123x/ret_BAZ8cC5.jpg",
      "worldImages": [
        "https://privi.fra1.digitaloceanspaces.com/privi/Location/User/priviUser167/123x/Preview/ret_Z4osZwd.jpg"
      ],
      "worldUploadTimestamp": 1634603474,
      "worldCreator": {
        "character": {
          "name": "Funnyjoe2",
          "gender": "MALE",
          "address": ""
        },
        "user": {
          "id": "priviUser167",
          "role": "Default",
          "avatarUrl": "",
          "firstName": "",
          "lastName": "",
          "address": ""
        },
        "isCreator": false,
      },
      "itemKind": "DRAFT_WORLD",
      "reviewsCount": 0,
      "averageRating": -1,
      "creatorId": "priviUser167"
    }
  }
}
```

### Example error output:

```json
{
  "success": false,
  "message": "level title is incorrect, should be between 3 and 160 alphanumeric characters"
}
```

### Get All creators

### creators/

###### Permission: everyone

| HTTP Method | Content-Type     | Input | Example                             | Action                  |
| ----------- | ---------------- | ------------ | -------------------------------------------- | ----------------------- |
| GET            |       -      |         -                                      |       -          | NONE
| POST        |     application/json      |   {"portion" : 10, "page" : 4},       |                                         | Get creators                |
| PUT         |                  |              |                                              | NONE                    |
| DELETE      |                  |              |                                              | NONE                    |

### Params

##### portion

how many worlds to get, specify -1 to get all of them

##### page (optional if portion == -1)

which page to get, INDEXED FROM 1

### Alternate flows

| Code   | Description                                                   |
| :---: | --------------------------------------------------------- |
| 400   | page must be > 0 if portion is not -1  |

### Example success output:

```json

{
  "success": true,
  "data": {
    "page": {
      "min": 1,
      "max": 1,
      "cur": 1,
      "portion": 1
    },
    "items": [
      {
        "privian": {
          "character": {
            "name": "Funnyjoe2",
            "gender": "MALE",
            "address": ""
          },
          "user": {
            "id": "priviUser167",
            "role": "Default",
            "avatarUrl": "https://privi.fra1.digitaloceanspaces.com/privi/avatars/ToyFaces_Colored_BG_111.jpg",
            "firstName": "Arkadiusz",
            "lastName": "Mirecki",
            "address": "0xabd43253cd5f567ba2470dd22094eb9c14316b69"
          },
          "isCreator": true,
        },
        "address": "0xabd43253cd5f567ba2470dd22094eb9c14316b69"
      }
    ]
  }
}
```

### Example error output:

```json
{
  "success": false,
  "message": "page must be >= 0"
}
```

### Get creator with address {address}

### creators/{slug:address}/

###### Permission: everyone

| HTTP Method | Content-Type     | Input | Example                             | Action                  |
| ----------- | ---------------- | ------------ | -------------------------------------------- | ----------------------- |
| GET            |       -      |         -                                      |       -          | Get creator with id
| POST        |                  |              |                                              | NONE                    |
| PUT         |                  |              |                                              | NONE                    |
| DELETE      |                  |              |                                              | NONE                    |

### Alternate flows

| Code   | Description                                                   |
| :---: | --------------------------------------------------------- |
| 404   | creator not found |

### Example success output:

As above but data is an object, not an array

### Example error output:

```json
{
  "success": false,
  "message": "this creator was not found"
}
```

### Set Name

### setName/

###### Permission: logged users

| HTTP Method | Content-Type     | Input | Example                             | Action                  |
| ----------- | ---------------- | ------------ | -------------------------------------------- | ----------------------- |
| GET            |            |                                               |                 | NONE
| POST        |   application/json       | {"name" : "Johnny"}   |                                              | NONE                    |
| PUT         |                  |              |                                              | NONE                    |
| DELETE      |                  |              |                                              | NONE                   |

### Validation

###### name

Must be alphanumeric and contain from 2 to 120 characters

### Example success output:

```json
{
  "success": true,
  "data": {
    "character": {
      "name": "Arek",
      "gender": "MALE",
      "address": "0xabd43253cd5f567ba2470dd22094eb9c14316b69"
    },
    "user": {
      "id": "priviUser167",
      "role": "Developer",
      "avatarUrl": "https://privi.fra1.digitaloceanspaces.com/privi/avatars/ToyFaces_Colored_BG_111.jpg",
      "firstName": "Arkadiusz",
      "lastName": "Mirecki",
      "address": "0xabd43253cd5f567ba2470dd22094eb9c14316b69"
    }
  }
}
```

### Example error output:

```json
{
  "success": false,
  "message": "name must be longer than 2 characters, shorter than 120 and be alphanumeric"
}
```

### Alternate flows

| Code   | Description                                                   |
| :---: | --------------------------------------------------------- |
| 400   | no name specified |
| 400   | name must be longer than 2 characters, shorter than 120 and be alphanumeric |
| 409   | character with this name already exists |

### Manage item reviews

### items/{int:id}/review/

###### Permission: logged users

| HTTP Method | Content-Type     | Input | Example                             | Action                  |
| ----------- | ---------------- | ------------ | -------------------------------------------- | ----------------------- |
| GET            |            |                                               |                 | Get a review (or null if there is none)
| POST        |   application/json       | {"rating" : 5, "comment" : "great level"}   |                                              | Create a review                   |
| PUT         |                  |              |                                              | NONE                    |
| DELETE      |                  |              |                                              | Delete a review                   |

### Validation

###### comment

Is optional, must be a string

### Example success output:

##### POST

```json
{
  "success": true,
  "data": {
    "id": 5,
    "privian": {
      "character": {
        "name": "Funnyjoe2",
        "gender": "MALE",
        "address": ""
      },
      "user": {
        "id": "priviUser167",
        "role": "Default",
        "avatarUrl": "",
        "firstName": "",
        "lastName": "",
        "address": ""
      }
    },
    "rating": 5.0,
    "comment": "",
    "reviewPostedTimestamp": 1634487851,
    "reviewUpdatedTimestamp": 1634487880,
  }
}
```

##### GET

```json
{
  "success": true,
  "data": {
    "id": 5,
    "privian": {
      "character": {
        "name": "Funnyjoe2",
        "gender": "MALE",
        "address": ""
      },
      "user": {
        "id": "priviUser167",
        "role": "Default",
        "avatarUrl": "",
        "firstName": "",
        "lastName": "",
        "address": ""
      }
    },
    "rating": 5.0,
    "comment": "",
    "reviewPostedTimestamp": 1634487851,
    "reviewUpdatedTimestamp": 1634487880,
  }
}
```

or

```json
{
  "success": true,
  "data": null
}
```

##### DELETE

```json
{
  "success": true,
  "message": "review deleted successfully"
}
```

### Example error output:

```json
{
  "success": false,
  "message": "you don't have enough permissions to rate this level"
}
```

### Alternate flows

| Code   | Description                                                   |
| :---: | --------------------------------------------------------- |
| 404  | item not found |
| 400   | rating not specified or is not a number |
| 400   | rating must be in range [1,5] |
| 405   | you can't rate this item type |
| 405   | you don't have enough permissions to rate this item |


