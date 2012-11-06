todo
- add like to item page
- add "created by" attribute to show item page
- add "leave a comment" placeholder text to comment box
- show a user's activity on the show user page
- show a item's activity on the show item page
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

rules
- send mentions to anyone named in a comment if they follow the author
- on delete, clear details from record and set "deleted" attribute to true (to avoid 404)
