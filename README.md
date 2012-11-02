todo
- show comments mentioning an item on the show item page
- only show activities applying to the user in the activity stream, eg http://www.rdio.com/notifications/
- create separate notifications stream (once we have private messages)
- denote user/item/comment by symbol on search page, rather than separate list
- allow user to sign in w/ twitter
- update comment search to use "by" for owner_id, and "mentioning" for search by mention
- define different layout for nav
- add like to item page
- add "created by" attribute to show item page
- add "leave a comment" placeholder text to comment box
- show a user's activity on the show user page
- define an "owner id hash" field on editable models that can be checked w/o reading the db
- redirect to show item page after item creation
- show count of replies to comment
- hightlight usernames in comments
- show reply prompt if no replies
- refresh activity after item create
- reinstate foreign keys
- update activitiy only when loading an activity stream
- add owner to list of items on item search result page
- define group
- add "deleted" attribute to models
- support saved search

rules
- send mentions to anyone named in a comment if they follow the author
- on delete, clear details from record and set "deleted" attribute to true (to avoid 404)
