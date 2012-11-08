todo
- show reply prompt if no replies
- refresh activity after comment from home page
- update activity only when loading an activity stream
- add owner to list of items on item search result page
- define group
- add "deleted" attribute to models
- on delete, clear details from record and set "deleted" attribute to true
- create separate notifications stream (once we have private messages)
- allow user to sign in w/ twitter
- update comment search to use "by" for owner_id, and "mentioning" for search by mention
- format text input to look like textarea
- enable private comments
- define comment view that renders comment templates
- define pipe syntax, eg [item-123|My item]
- define user sm widget, e.g., <div class="user-sm" data-user-id="1">. Render it in a host view's (show item) render fn
- add "leave a comment" placeholder text to comment box
- show likes for a given item in the item activity stream
- show mentions for a given item in the item activity stream
- filter activity client-side on the home page
- define an "owner id hash" field on editable models that can be checked w/o reading the db
- hide stream headers if stream is empty
- add like button to comment page
- show count of replies to comment
- add layout to create item page
- replace "bookmarks" with recent searches
- add "pin/like/save" btn to recent searches page
- generate name for search on server, eg comments?owner_id=1 --> {name:'comments by [user-1]', results:[...]}

dev env
- install postgres (Postgres.app makes this easy)
- run `bundle` to install ruby dependencies
- run `rake` to prep db
- run `shotgun` to start app

rules
- send mentions to anyone named in a comment if they follow the author
- on delete, clear details from record and set "deleted" attribute to true (to avoid 404)

