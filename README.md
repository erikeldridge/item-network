todo
- filter activity client-side on the home page
- define an "owner id hash" field on editable models that can be checked w/o reading the db
- redirect to show item page after item creation
- show count of replies to comment
- hightlight usernames in comments
- show reply prompt if no replies
- refresh activity after comment from home page
- update activitiy only when loading an activity stream
- add owner to list of items on item search result page
- define group
- add "deleted" attribute to models
- on delete, clear details from record and set "deleted" attribute to true
- support saved search
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

rules
- send mentions to anyone named in a comment if they follow the author
- on delete, clear details from record and set "deleted" attribute to true (to avoid 404)
